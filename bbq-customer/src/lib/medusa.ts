import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://admin.yankdownunderbbq.com",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_ef488d016ea7a5acab1118f665d7e7d30830edcc160046ae93ff31291066376e',
  debug: process.env.NODE_ENV === 'development',
})