import { z } from "zod"

// ============================================
// USER VALIDATIONS
// ============================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]).default("VIEWER"),
})

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
})

// ============================================
// PAGE VALIDATIONS
// ============================================

export const createPageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  content: z.string().default(""),
  excerpt: z.string().optional(),
  metaTitle: z.string().max(60, "Meta title should be max 60 characters").optional(),
  metaDescription: z.string().max(160, "Meta description should be max 160 characters").optional(),
  metaKeywords: z.string().optional(),
  ogImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().datetime().optional().or(z.literal("")),
  scheduledFor: z.string().datetime().optional().or(z.literal("")),
  template: z.string().default("default"),
  featuredImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  parentId: z.string().optional().or(z.literal("")),
})

export const updatePageSchema = createPageSchema.partial()

// ============================================
// POST VALIDATIONS
// ============================================

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  content: z.string().default(""),
  excerpt: z.string().optional(),
  metaTitle: z.string().max(60, "Meta title should be max 60 characters").optional(),
  metaDescription: z.string().max(160, "Meta description should be max 160 characters").optional(),
  metaKeywords: z.string().optional(),
  ogImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().datetime().optional().or(z.literal("")),
  scheduledFor: z.string().datetime().optional().or(z.literal("")),
  featuredImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  readTime: z.number().int().positive().optional(),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
})

export const updatePostSchema = createPostSchema.partial()

// ============================================
// CATEGORY & TAG VALIDATIONS
// ============================================

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().optional(),
})

export const createTagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
})

// ============================================
// MEDIA VALIDATIONS
// ============================================

export const uploadMediaSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  originalName: z.string().min(1, "Original name is required"),
  mimeType: z.string().min(1, "MIME type is required"),
  size: z.number().int().positive("Size must be positive"),
  type: z.enum(["IMAGE", "VIDEO", "DOCUMENT", "AUDIO", "OTHER"]),
  url: z.string().url("Invalid URL"),
  thumbnailUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  folder: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
})

export const updateMediaSchema = z.object({
  alt: z.string().optional(),
  caption: z.string().optional(),
  folder: z.string().optional(),
})

// ============================================
// FORM SUBMISSION VALIDATIONS
// ============================================

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
  make: z.string().optional().or(z.literal("")),
  model: z.string().optional().or(z.literal("")),
  year: z.string().optional().or(z.literal("")),
  condition: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
})

export const updateSubmissionSchema = z.object({
  status: z.enum(["NEW", "READ", "REPLIED", "SPAM", "ARCHIVED"]),
  notes: z.string().optional(),
})

// ============================================
// SETTINGS VALIDATIONS
// ============================================

export const createSettingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  type: z.enum(["string", "number", "boolean", "json"]),
  group: z.string().min(1, "Group is required"),
})

export const updateSettingSchema = createSettingSchema.partial().required({ key: true })

// ============================================
// TYPE EXPORTS
// ============================================

export type LoginInput = z.infer<typeof loginSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreatePageInput = z.infer<typeof createPageSchema>
export type UpdatePageInput = z.infer<typeof updatePageSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type CreateTagInput = z.infer<typeof createTagSchema>
export type UploadMediaInput = z.infer<typeof uploadMediaSchema>
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>
export type CreateSettingInput = z.infer<typeof createSettingSchema>
export type UpdateSettingInput = z.infer<typeof updateSettingSchema>
