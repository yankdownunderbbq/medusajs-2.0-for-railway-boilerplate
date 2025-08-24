import Medusa from "@medusajs/js-sdk"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://admin.yankdownunderbbq.com"
const PUBLISHABLE_KEY = 'pk_ef488d016ea7a5acab1118f665d7e7d30830edcc160046ae93ff31291066376e'

// Configure the Medusa client
export const medusa = new Medusa({
  baseUrl: BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
})

// Comprehensive MedusaClient class
class MedusaClient {
  private getHeaders() {
    return {
      'x-publishable-api-key': PUBLISHABLE_KEY,
      'Content-Type': 'application/json',
    }
  }

  async get(path: string) {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error(`Failed to fetch ${path}: ${response.statusText}`)
    return response.json()
  }

  async post(path: string, body?: any) {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!response.ok) throw new Error(`Failed to post to ${path}: ${response.statusText}`)
    return response.json()
  }

  async delete(path: string) {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error(`Failed to delete ${path}: ${response.statusText}`)
    return response.json()
  }

  async put(path: string, body?: any) {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!response.ok) throw new Error(`Failed to put to ${path}: ${response.statusText}`)
    return response.json()
  }
}

export const medusaClient = new MedusaClient()

// Utility function for direct API calls with publishable key (backward compatibility)
export const medusaFetch = async (path: string, options?: RequestInit) => {
  return fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      'x-publishable-api-key': PUBLISHABLE_KEY,
      ...options?.headers,
    }
  })
}

export default medusa