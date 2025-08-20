import Medusa from "@medusajs/js-sdk"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

// Configure the Medusa client
export const medusa = new Medusa({
  baseUrl: BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
})

export default medusa