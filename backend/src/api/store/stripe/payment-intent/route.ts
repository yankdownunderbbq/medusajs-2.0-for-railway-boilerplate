import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import Stripe from 'stripe'
import type { CreatePaymentIntentRequestBody } from "../../../../modules/event/types"

// Initialize Stripe with latest API version
const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2025-07-30.basil'
})

export const AUTHENTICATE = false

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { amount, booking_id, customer_email } = req.body as CreatePaymentIntentRequestBody

    if (!amount || !booking_id) {
      res.status(400).json({
        error: 'Missing required fields: amount and booking_id'
      })
      return
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'aud',
      metadata: {
        booking_id: booking_id,
        customer_email: customer_email || ''
      },
      automatic_payment_methods: {
        enabled: true
      }
    })

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    })

  } catch (error) {
    console.error('Payment intent creation failed:', error)
    res.status(500).json({
      error: 'Failed to create payment intent'
    })
  }
}