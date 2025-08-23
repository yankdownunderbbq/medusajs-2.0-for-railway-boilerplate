import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { PaymentRequestBody } from "../../../../modules/event/types"

export const AUTHENTICATE = false // Skip auth for development

// POST /store/bbq-bookings/payment - Create payment intent for booking
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { booking_id, return_url } = req.body as PaymentRequestBody

  if (!booking_id) {
    return res.status(400).json({
      message: "Booking ID is required"
    })
  }

  try {
    // In a real implementation, you would:
    // 1. Look up the booking from database
    // 2. Create a Medusa order for the booking
    // 3. Create payment session with Stripe
    // 4. Return the payment client secret

    // For now, return a mock payment intent
    const paymentIntent = {
      id: `pi_mock_${booking_id}`,
      client_secret: `pi_mock_${booking_id}_secret_${Date.now()}`,
      amount: 8900, // This would come from the booking
      currency: 'aud',
      status: 'requires_payment_method'
    }

    res.json({
      payment_intent: paymentIntent,
      publishable_key: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_key',
      return_url: return_url || `${process.env.FRONTEND_URL}/booking/success`
    })

  } catch (error) {
    console.error('Payment intent creation failed:', error)
    res.status(500).json({
      message: 'Failed to create payment intent'
    })
  }
}