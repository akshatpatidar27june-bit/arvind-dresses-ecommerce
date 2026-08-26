export async function compressProductImage(file: File): Promise<{ file: File; originalBytes: number; optimizedBytes: number }> {
  if (!file.type.startsWith('image/')) throw new Error('Please select an image.');
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1400;
  let width = Math.max(1, Math.round(bitmap.width * Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))));
  let height = Math.max(1, Math.round(bitmap.height * Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))));
  const canvas = document.createElement('canvas');
  const draw = (w: number, h: number) => {
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to process this image.');
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, w, h);
  };
  const blobFor = (quality: number) => new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', quality));
  draw(width, height);
  let blob = await blobFor(0.78);
  if (!blob) { bitmap.close(); throw new Error('Unable to compress this image.'); }
  for (const quality of [0.7, 0.62, 0.55, 0.48, 0.42, 0.36]) {
    if (blob.size <= 60 * 1024) break;
    const next = await blobFor(quality);
    if (next) blob = next;
  }
  for (const dimension of [1200, 1000, 900, 800]) {
    if (blob.size <= 60 * 1024 || Math.max(width, height) <= dimension) break;
    const factor = dimension / Math.max(width, height);
    width = Math.max(1, Math.round(width * factor)); height = Math.max(1, Math.round(height * factor));
    draw(width, height);
    const next = await blobFor(0.5);
    if (next) blob = next;
  }
  bitmap.close();
  const optimized = new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp', lastModified: Date.now() });
  return { file: optimized, originalBytes: file.size, optimizedBytes: optimized.size };
}

export function formatBytes(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
