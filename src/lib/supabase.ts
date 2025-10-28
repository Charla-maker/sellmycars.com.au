import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client for browser/client components
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role (for server-side operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  bucket: string = 'media',
  folder?: string
) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = folder ? `${folder}/${fileName}` : fileName

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw error
  }

  // Get public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return {
    path: data.path,
    url: publicUrl,
    fileName,
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(filePath: string, bucket: string = 'media') {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([filePath])

  if (error) {
    throw error
  }

  return true
}

/**
 * Get file URL from Supabase Storage
 */
export function getFileUrl(filePath: string, bucket: string = 'media') {
  const { data } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}
