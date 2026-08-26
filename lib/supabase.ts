import { createClient } from '@supabase/supabase-js'
import { compressProductImage } from './image-compression'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
}

const client = createClient(supabaseUrl, supabasePublishableKey)
const originalFrom = client.storage.from.bind(client.storage)

// Keep the caller's storage path unchanged. The previous implementation uploaded
// the optimized WebP under a different `.webp` path while callers saved the
// original path in the database, producing URLs that pointed at missing files.
client.storage.from = ((bucket: string) => {
  const bucketApi = originalFrom(bucket)
  if (bucket !== 'product-images') return bucketApi
  const originalUpload = bucketApi.upload.bind(bucketApi)
  bucketApi.upload = async (path: string, fileBody: any, options?: any) => {
    if (typeof File !== 'undefined' && fileBody instanceof File && fileBody.type.startsWith('image/')) {
      try {
        const optimized = await compressProductImage(fileBody)
        return originalUpload(path, optimized.file, {
          ...(options ?? {}),
          contentType: 'image/webp',
          upsert: options?.upsert ?? false,
        })
      } catch {
        // If browser-side optimization is unavailable, still upload the original.
      }
    }
    return originalUpload(path, fileBody, options)
  }
  return bucketApi
}) as typeof client.storage.from

export const supabase = client
