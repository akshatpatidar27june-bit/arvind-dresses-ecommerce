import { createClient } from '@supabase/supabase-js'
import { compressProductImage } from './image-compression'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
}

const client = createClient(supabaseUrl, supabasePublishableKey)
const originalFrom = client.storage.from.bind(client.storage)

client.storage.from = ((bucket: string) => {
  const bucketApi = originalFrom(bucket)
  if (bucket !== 'product-images') return bucketApi
  const originalUpload = bucketApi.upload.bind(bucketApi)
  bucketApi.upload = async (path: string, fileBody: any, options?: any) => {
    if (typeof File !== 'undefined' && fileBody instanceof File && fileBody.type.startsWith('image/')) {
      try {
        const optimized = await compressProductImage(fileBody)
        return originalUpload(path.replace(/\.[^.]+$/, '') + '.webp', optimized.file, {
          ...(options ?? {}),
          contentType: 'image/webp',
        })
      } catch {
        // Preserve the existing upload behavior if optimization is unavailable.
      }
    }
    return originalUpload(path, fileBody, options)
  }
  return bucketApi
}) as typeof client.storage.from

export const supabase = client
