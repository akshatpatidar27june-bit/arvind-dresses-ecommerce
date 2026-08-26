export async function compressProductImage(file: File): Promise<{ file: File; originalBytes: number; optimizedBytes: number }> {
  if (!file.type.startsWith('image/')) throw new Error('Please select an image.');
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1400;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to process this image.');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blobFor = (quality: number) => new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', quality));
  let blob = await blobFor(0.78);
  if (!blob) throw new Error('Unable to compress this image.');

  // Try hard to stay at or below ~60 KB without making unusually detailed images unusable.
  for (const quality of [0.7, 0.62, 0.55, 0.48, 0.42, 0.36]) {
    if (blob.size <= 60 * 1024) break;
    const next = await blobFor(quality);
    if (next) blob = next;
  }
  for (const dimension of [1200, 1000, 900, 800]) {
    if (blob.size <= 60 * 1024 || Math.max(width, height) <= dimension) break;
    const factor = dimension / Math.max(width, height);
    canvas.width = Math.max(1, Math.round(width * factor));
    canvas.height = Math.max(1, Math.round(height * factor));
    const resized = document.createElement('canvas');
    resized.width = canvas.width;
    resized.height = canvas.height;
    const rctx = resized.getContext('2d');
    if (!rctx) continue;
    rctx.imageSmoothingEnabled = true;
    rctx.imageSmoothingQuality = 'high';
    rctx.drawImage(bitmap as unknown as CanvasImageSource, 0, 0, canvas.width, canvas.height);
    const next = await new Promise<Blob | null>(resolve => resized.toBlob(resolve, 'image/webp', 0.5));
    if (next) blob = next;
  }
  const optimized = new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp', lastModified: Date.now() });
  return { file: optimized, originalBytes: file.size, optimizedBytes: optimized.size };
}

export function formatBytes(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
