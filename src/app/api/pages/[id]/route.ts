import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { updatePageSchema } from "@/lib/validations"
import {
  apiSuccess,
  apiError,
  parseRequestBody,
  handleApiError,
  requireAuth,
  checkRole,
} from "@/lib/api-helpers"

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/pages/[id]
 * Get a single page by ID
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)
    requireAuth(session)

    const { id } = await context.params

    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        parent: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    if (!page) {
      return apiError("Page not found", 404)
    }

    return apiSuccess(page)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/pages/[id]
 * Update a page
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)
    const user = requireAuth(session)

    // Check if user has permission to edit pages
    if (!checkRole(user.role, ["ADMIN", "EDITOR"])) {
      return apiError("You don't have permission to edit pages", 403)
    }

    const { id } = await context.params

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id },
    })

    if (!existingPage) {
      return apiError("Page not found", 404)
    }

    // Parse and validate request body
    const body = await parseRequestBody(request)
    const validatedData = updatePageSchema.parse(body)

    // If slug is being updated, check if it's already taken by another page
    if (validatedData.slug && validatedData.slug !== existingPage.slug) {
      const slugExists = await prisma.page.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: id },
        },
      })

      if (slugExists) {
        return apiError("A page with this slug already exists", 409)
      }
    }

    // Update page
    const page = await prisma.page.update({
      where: { id },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.slug && { slug: validatedData.slug }),
        ...(validatedData.content !== undefined && { content: validatedData.content }),
        ...(validatedData.excerpt !== undefined && { excerpt: validatedData.excerpt }),
        ...(validatedData.metaTitle !== undefined && { metaTitle: validatedData.metaTitle }),
        ...(validatedData.metaDescription !== undefined && {
          metaDescription: validatedData.metaDescription,
        }),
        ...(validatedData.metaKeywords !== undefined && {
          metaKeywords: validatedData.metaKeywords,
        }),
        ...(validatedData.ogImage !== undefined && { ogImage: validatedData.ogImage }),
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.publishedAt !== undefined && {
          publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : null,
        }),
        ...(validatedData.scheduledFor !== undefined && {
          scheduledFor: validatedData.scheduledFor
            ? new Date(validatedData.scheduledFor)
            : null,
        }),
        ...(validatedData.template && { template: validatedData.template }),
        ...(validatedData.featuredImage !== undefined && {
          featuredImage: validatedData.featuredImage,
        }),
        ...(validatedData.parentId !== undefined && {
          parentId: validatedData.parentId || null,
        }),
        version: { increment: 1 },
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

    return apiSuccess(page)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/pages/[id]
 * Delete a page
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)
    const user = requireAuth(session)

    // Only admins can delete pages
    if (!checkRole(user.role, ["ADMIN"])) {
      return apiError("Only administrators can delete pages", 403)
    }

    const { id } = await context.params

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id },
    })

    if (!existingPage) {
      return apiError("Page not found", 404)
    }

    // Delete page
    await prisma.page.delete({
      where: { id },
    })

    return apiSuccess({ message: "Page deleted successfully" })
  } catch (error) {
    return handleApiError(error)
  }
}
