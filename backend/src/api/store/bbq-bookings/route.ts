import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ulid } from "ulid"
import type { BBQBookingRequestBody } from "../../../modules/event/types"

export const AUTHENTICATE = false // Skip auth for development

function generateUniqueId(prefix?: string): string {
  const id = ulid()
  return prefix ? `${prefix}_${id}` : id
}

// POST /store/bbq-bookings - Create a new booking
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const {
    bbq_event_id,
    customer_name,
    customer_email,
    customer_phone,
    number_of_guests,
    package_type,
    dietary_requirements,
    special_requests
  } = req.body as BBQBookingRequestBody

  // Validation
  if (!bbq_event_id || !customer_name || !customer_email || !number_of_guests) {
    return res.status(400).json({
      message: "Missing required fields: bbq_event_id, customer_name, customer_email, number_of_guests"
    })
  }

  // Generate unique booking ID and management token
  const bookingId = generateUniqueId("bbq_booking")
  const managementToken = generateUniqueId("token")

  // Calculate total amount based on package type and number of guests
  const packagePrices = {
    standard: 8900,
    premium: 12900,
    family: 32000 // flat rate for up to 4 people
  }

  let totalAmount: number
  if (package_type === "family") {
    totalAmount = packagePrices.family
  } else {
    totalAmount = packagePrices[package_type as keyof typeof packagePrices] * number_of_guests
  }

  // Mock booking creation (in real implementation, this would save to database)
  const booking = {
    id: bookingId,
    bbq_event_id,
    customer_name,
    customer_email,
    customer_phone: customer_phone || null,
    number_of_guests,
    package_type: package_type || "standard",
    total_amount: totalAmount,
    dietary_requirements: dietary_requirements || null,
    special_requests: special_requests || null,
    status: "pending",
    order_id: null,
    management_token: managementToken,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  // TODO: Save booking to database
  // TODO: Send confirmation email with management link
  // TODO: Create payment intent with Stripe

  res.status(201).json({
    booking,
    management_url: `${process.env.FRONTEND_URL}/booking/manage/${managementToken}`,
    message: "Booking created successfully. Please check your email for confirmation and payment instructions."
  })
}

// GET /store/bbq-bookings - Get bookings (requires auth or management token)
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { management_token } = req.query

  if (!management_token) {
    return res.status(401).json({
      message: "Management token required"
    })
  }

  // TODO: Look up booking by management token
  // For now, return mock data
  res.json({
    message: "Booking management functionality coming soon"
  })
}