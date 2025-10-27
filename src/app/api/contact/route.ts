import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { contactFormSchema } from "@/lib/validations"
import {
  apiSuccess,
  apiError,
  parseRequestBody,
  handleApiError,
} from "@/lib/api-helpers"

/**
 * POST /api/contact
 * Submit a contact form
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await parseRequestBody(request)

    // Validate input
    const validatedData = contactFormSchema.parse(body)

    // Get metadata
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const referer = request.headers.get("referer") || "unknown"

    // Save to database
    const submission = await prisma.formSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        make: validatedData.make || null,
        model: validatedData.model || null,
        year: validatedData.year || null,
        condition: validatedData.condition || null,
        message: validatedData.message || null,
        ipAddress,
        userAgent,
        source: referer,
        status: "NEW",
      },
    })

    // TODO: Send email notification to admin
    // This can be implemented with nodemailer or a service like SendGrid

    // TODO: Send confirmation email to user
    // Optional: Send a thank you email to the user

    return apiSuccess(
      {
        id: submission.id,
        message: "Thank you for your submission. We'll get back to you soon!",
      },
      201
    )
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * GET /api/contact
 * Get all form submissions (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session?.user || !checkRole(session.user.role, ["ADMIN", "EDITOR"])) {
    //   return apiError("Unauthorized", 401)
    // }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const status = searchParams.get("status")
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Get submissions with pagination
    const [submissions, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        orderBy: { submittedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.formSubmission.count({ where }),
    ])

    return apiSuccess({
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
