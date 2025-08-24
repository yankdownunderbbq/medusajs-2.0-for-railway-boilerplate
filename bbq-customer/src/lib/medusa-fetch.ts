const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://admin.yankdownunderbbq.com'
const PUBLISHABLE_KEY = 'pk_ef488d016ea7a5acab1118f665d7e7d30830edcc160046ae93ff31291066376e'

export const medusaFetch = async (path: string, options?: RequestInit) => {
  const url = path.startsWith('http') ? path : `${MEDUSA_BACKEND_URL}${path}`
  return fetch(url, {
    ...options,
    headers: {
      'x-publishable-api-key': PUBLISHABLE_KEY,
      'Content-Type': 'application/json',
      ...options?.headers,
    }
  })
}