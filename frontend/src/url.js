export const URL = import.meta.env.VITE_URL
export const IF = import.meta.env.VITE_IF

export const resolveImageUrl = (photo) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'

  if (!photo) return fallbackImage
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo

  const base = (IF || URL || '').replace(/\/+$/, '')
  if (base) {
    return `${base}/${photo.replace(/^\/+/, '')}`
  }

  return photo.startsWith('/') ? photo : `/${photo}`
}
