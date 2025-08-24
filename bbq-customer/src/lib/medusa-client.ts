import Medusa from "@medusajs/js-sdk"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://admin.yankdownunderbbq.com'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_ef488d016ea7a5acab1118f665d7e7d30830edcc160046ae93ff31291066376e'

// Configure the Medusa client
export const medusa = new Medusa({
  baseUrl: BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
})

// Utility function for direct API calls with publishable key
export const medusaFetch = async (path: string, options?: RequestInit) => {
  return fetch(`${MEDUSA_BACKEND_URL}${path}`, {
    ...options,
    headers: {
      'x-publishable-api-key': PUBLISHABLE_KEY,
      ...options?.headers,
    }
  })
}

export default medusa