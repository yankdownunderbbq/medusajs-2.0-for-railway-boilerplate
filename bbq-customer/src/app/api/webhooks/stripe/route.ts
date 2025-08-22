import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  console.log('🔔 Stripe webhook received')
  
  try {
    // Get the raw body for signature verification
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('❌ No Stripe signature found')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('✅ Webhook signature verified')
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('📧 Event type:', event.type)
    console.log('📧 Event ID:', event.id)

    // Handle the checkout session completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('💳 Payment successful for session:', session.id)
      console.log('💰 Amount paid:', session.amount_total)
      console.log('👤 Customer email:', session.customer_email)
      console.log('📦 Metadata:', session.metadata)

      // Extract cart and customer info from metadata
      const { cartId, customerEmail, customerFirstName, customerLastName, customerPhone } = session.metadata || {}
      
      console.log('🛒 Cart ID from metadata:', cartId)
      console.log('👤 Customer info:', { customerEmail, customerFirstName, customerLastName, customerPhone })

      // TODO: Step 2 will add order creation here
      // TODO: Step 3 will add email confirmation here

      console.log('✅ Webhook processed successfully')
    } else {
      console.log('ℹ️ Unhandled event type:', event.type)
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}