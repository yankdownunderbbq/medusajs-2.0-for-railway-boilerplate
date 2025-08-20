import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2023-10-16'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const AUTHENTICATE = false

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        
        // Here you would typically:
        // 1. Find the booking by the payment intent ID
        // 2. Update the booking status to confirmed
        // 3. Send confirmation email
        // 4. Update capacity/availability
        
        // For now, just log the success
        console.log(`Payment ${paymentIntent.id} succeeded for amount ${paymentIntent.amount}`)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', failedPayment.id)
        
        // Here you would typically:
        // 1. Find the booking by the payment intent ID
        // 2. Update the booking status to failed
        // 3. Send failure notification email
        // 4. Release any held capacity
        
        console.log(`Payment ${failedPayment.id} failed`)
        break

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout session completed:', session.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}