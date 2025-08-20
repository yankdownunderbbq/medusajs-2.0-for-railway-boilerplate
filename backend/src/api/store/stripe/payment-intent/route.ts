import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2023-10-16'
})

export const AUTHENTICATE = false

export async function POST(req: NextRequest) {
  try {
    const { amount, booking_id, customer_email } = await req.json()

    if (!amount || !booking_id) {
      return NextResponse.json(
        { error: 'Missing required fields: amount and booking_id' },
        { status: 400 }
      )
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

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    })

  } catch (error) {
    console.error('Payment intent creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}