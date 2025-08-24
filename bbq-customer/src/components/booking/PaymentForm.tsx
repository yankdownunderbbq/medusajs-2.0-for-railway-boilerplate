'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { medusaFetch } from '@/lib/medusa-client'

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  bookingId: string
  amount: number
  onPaymentSuccess: (paymentIntent: any) => void
  onPaymentError: (error: string) => void
}

function StripePaymentForm({ bookingId, amount, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [name, setName] = useState('')

  const formatPrice = (priceInCents: number) => {
    return `$${priceInCents.toFixed(2)}`
  }

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await medusaFetch('/store/stripe/payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            booking_id: bookingId
          })
        })

        if (!response.ok) {
          throw new Error('Failed to create payment intent')
        }

        const data = await response.json()
        setClientSecret(data.client_secret)
      } catch (error) {
        onPaymentError('Failed to initialize payment')
      }
    }

    createPaymentIntent()
  }, [amount, bookingId, onPaymentError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!stripe || !elements || !clientSecret) {
      onPaymentError('Payment system not ready')
      setIsLoading(false)
      return
    }

    try {
      // Validate form
      if (!name.trim()) {
        throw new Error('Please enter cardholder name')
      }

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
        return
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name
          }
        }
      })

      if (error) {
        throw new Error(error.message || 'Payment failed')
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent)
      } else {
        throw new Error('Payment was not completed')
      }

    } catch (error) {
      onPaymentError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-header">
        <h3>Payment Details</h3>
        <div className="payment-amount">
          <span>Total: {formatPrice(amount)}</span>
        </div>
      </div>

      <div className="card-info">
        <div className="form-group">
          <label htmlFor="card-element">Card Details</label>
          <div className="stripe-card-element">
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">Cardholder Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="payment-security">
        <div className="security-badge">
          <i className="fas fa-lock"></i>
          <span>Secured by Stripe</span>
        </div>
        <p className="security-text">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>

      <button 
        type="submit" 
        className="payment-button"
        disabled={isLoading || !stripe || !clientSecret}
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Processing Payment...
          </>
        ) : !clientSecret ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Initializing...
          </>
        ) : (
          <>
            <i className="fas fa-credit-card"></i>
            Pay {formatPrice(amount)}
          </>
        )}
      </button>

      <div className="payment-methods">
        <span>We accept:</span>
        <div className="payment-icons">
          <i className="fab fa-cc-visa"></i>
          <i className="fab fa-cc-mastercard"></i>
          <i className="fab fa-cc-amex"></i>
        </div>
      </div>
    </form>
  )
}

export function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm {...props} />
    </Elements>
  )
}