import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { createPageSchema } from "@/lib/validations"
import {
  apiSuccess,
  apiError,
  parseRequestBody,
  handleApiError,
  getPaginationParams,
  createPaginatedResponse,
  requireAuth,
  checkRole,
} from "@/lib/api-helpers"

/**
 * GET /api/pages
 * Get all pages with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    requireAuth(session)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = getPaginationParams(searchParams)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get pages with pagination
    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.page.count({ where }),
    ])

    return apiSuccess(createPaginatedResponse(pages, total, page, limit))
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/pages
 * Create a new page
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = requireAuth(session)

    // Check if user has permission to create pages
    if (!checkRole(user.role, ["ADMIN", "EDITOR"])) {
      return apiError("You don't have permission to create pages", 403)
    }

    // Parse and validate request body
    const body = await parseRequestBody(request)
    const validatedData = createPageSchema.parse(body)

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingPage) {
      return apiError("A page with this slug already exists", 409)
    }

    // Create page
    const page = await prisma.page.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content || "",
        excerpt: validatedData.excerpt,
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        metaKeywords: validatedData.metaKeywords,
        ogImage: validatedData.ogImage,
        status: validatedData.status,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : null,
        scheduledFor: validatedData.scheduledFor ? new Date(validatedData.scheduledFor) : null,
        template: validatedData.template || "default",
        featuredImage: validatedData.featuredImage,
        parentId: validatedData.parentId || null,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return apiSuccess(page, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
