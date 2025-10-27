import { NextResponse } from "next/server"
import { ZodError } from "zod"

// ============================================
// API RESPONSE HELPERS
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
  message?: string
}

/**
 * Create a successful API response
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  )
}

/**
 * Create an error API response
 */
export function apiError(
  message: string,
  status = 400,
  errors?: Record<string, string[]>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      errors,
    },
    { status }
  )
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: ZodError): NextResponse<ApiResponse> {
  const errors: Record<string, string[]> = {}

  error.errors.forEach((err) => {
    const path = err.path.join(".")
    if (!errors[path]) {
      errors[path] = []
    }
    errors[path].push(err.message)
  })

  return apiError("Validation failed", 422, errors)
}

/**
 * Handle database errors
 */
export function handleDatabaseError(error: any): NextResponse<ApiResponse> {
  console.error("Database error:", error)

  // Prisma unique constraint violation
  if (error.code === "P2002") {
    const field = error.meta?.target?.[0] || "field"
    return apiError(`A record with this ${field} already exists`, 409)
  }

  // Prisma record not found
  if (error.code === "P2025") {
    return apiError("Record not found", 404)
  }

  // Prisma foreign key constraint violation
  if (error.code === "P2003") {
    return apiError("Related record not found", 400)
  }

  // Generic database error
  return apiError("Database operation failed", 500)
}

/**
 * Generic error handler for API routes
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error("API error:", error)

  if (error instanceof ZodError) {
    return handleZodError(error)
  }

  if (error instanceof Error) {
    // Check if it's a Prisma error
    if ("code" in error) {
      return handleDatabaseError(error)
    }

    return apiError(error.message, 500)
  }

  return apiError("An unexpected error occurred", 500)
}

// ============================================
// REQUEST HELPERS
// ============================================

/**
 * Parse JSON body with error handling
 */
export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    const body = await request.json()
    return body as T
  } catch (error) {
    throw new Error("Invalid JSON body")
  }
}

/**
 * Get query parameters from URL
 */
export function getQueryParams(request: Request): URLSearchParams {
  const { searchParams } = new URL(request.url)
  return searchParams
}

/**
 * Pagination helper
 */
export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)))
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

/**
 * Create paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

// ============================================
// AUTHORIZATION HELPERS
// ============================================

/**
 * Check if user has required role
 */
export function checkRole(userRole: string, requiredRoles: string[]): boolean {
  const roleHierarchy: Record<string, number> = {
    ADMIN: 3,
    EDITOR: 2,
    VIEWER: 1,
  }

  const userLevel = roleHierarchy[userRole] || 0
  const minRequiredLevel = Math.min(...requiredRoles.map((r) => roleHierarchy[r] || 0))

  return userLevel >= minRequiredLevel
}

/**
 * Require authentication middleware
 */
export function requireAuth(session: any) {
  if (!session?.user) {
    throw new Error("Authentication required")
  }
  return session.user
}

/**
 * Require specific role middleware
 */
export function requireRole(session: any, roles: string[]) {
  const user = requireAuth(session)

  if (!checkRole(user.role, roles)) {
    throw new Error("Insufficient permissions")
  }

  return user
}
