'use client'

import React, { useState, useEffect, memo, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartItem {
  id: string
  title: string
  variant: {
    title: string
  }
  quantity: number
  unit_price: number
  total: number
}

interface Cart {
  id: string
  email?: string
  items: CartItem[]
  total: number
  subtotal: number
  tax_total: number
}

function CheckoutPage() {
  const params = useParams()
  const cartId = params.cart_id as string
  
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Contact form state
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  
  // Payment form state
  const [cardholderName, setCardholderName] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    console.log('🔵 CheckoutPage mounted')
    return () => console.log('🔴 CheckoutPage unmounted')
  }, [])

  useEffect(() => {
    console.log('🟡 CheckoutPage re-rendered with state:', {
      loading,
      processingPayment,
      error: error ? 'present' : 'none',
      clientSecret: clientSecret ? 'present' : 'none',
      cartId,
      cardholderName: cardholderName.length > 0 ? `${cardholderName.length} chars` : 'empty'
    })
  })

  // Define functions with useCallback before useEffects that use them
  const fetchCart = useCallback(async () => {
    console.log('🚨 fetchCart CALLED')
    console.log('🚨 SETTING loading = true')
    setLoading(true)
    try {
      // For now, return mock cart data
      // TODO: Replace with actual cart API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('🚨 SETTING cart with new data')
      setCart({
        id: cartId,
        email: '',
        items: [
          {
            id: '1',
            title: 'Kansas City BBQ Experience',
            variant: { title: 'Event Ticket' },
            quantity: 2,
            unit_price: 2500,
            total: 5000
          },
          {
            id: '2',
            title: 'Kansas City Burnt Ends',
            variant: { title: '250g' },
            quantity: 1,
            unit_price: 3000,
            total: 3000
          }
        ],
        subtotal: 8000,
        tax_total: 800,
        total: 8800
      })
    } finally {
      console.log('🚨 SETTING loading = false')
      setLoading(false)
    }
  }, [cartId])


  useEffect(() => {
    console.log('🚨 CART FETCH EFFECT: cartId changed', { cartId })
    if (cartId) {
      console.log('🚨 CALLING fetchCart()')
      fetchCart()
    }
  }, [cartId, fetchCart])

  // Memoize Elements options to prevent re-renders
  const elementsOptions = useMemo(() => ({
    clientSecret: clientSecret || undefined
  }), [clientSecret])

  // Create payment intent once per cart
  useEffect(() => {
    
    if (cartId && !clientSecret && cart && cart.total > 0) {
      
      // Inline payment intent creation to avoid dependency issues
      const createIntent = async () => {
        try {
          const response = await fetch('/api/payments/create-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cart_id: cartId,
              amount: cart.total,
              customer_email: email || ''
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            setError(`Payment initialization failed: ${errorData.error || 'Unknown error'}`)
            return
          }

          const data = await response.json()
          if (data.client_secret) {
            setClientSecret(data.client_secret)
          } else {
            setError('Failed to initialize payment')
          }
        } catch (error) {
          setError('Failed to initialize payment')
        }
      }
      
      createIntent()
    }
  }, [cartId, clientSecret, cart])

// Utility functions - moved outside component to prevent recreation on every render
const formatPrice = (amount: number) => `$${(amount / 100).toFixed(2)}`

// Card element options - moved outside component to prevent recreation on every render
const cardElementOptions = {
  hidePostalCode: true, // Hide postal code to avoid US zip code format issues for Australian customers
  style: {
    base: {
      fontSize: '16px',
      color: '#374151',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '::placeholder': {
        color: '#9CA3AF',
      },
    },
    invalid: {
      color: '#EF4444',
    },
  },
}

// Isolated CardInput component to prevent re-rendering when other form fields change
const CardInput = memo(function CardInput() {
  useEffect(() => {
  }, [])

  useEffect(() => {
  })

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Card Information</label>
      <div className="border border-gray-300 rounded-md p-3 bg-white">
        <CardElement 
          options={cardElementOptions}
          onReady={() => {}}
          onChange={() => {}}
        />
      </div>
    </div>
  )
})

// Stripe Payment Form Component - Memoized to prevent unnecessary re-renders
const StripePaymentForm = memo(function StripePaymentForm({ 
  clientSecret, 
  cart, 
  cartId,
  email,
  firstName,
  lastName,
  phone,
  cardholderName,
  setCardholderName,
  acceptTerms,
  setAcceptTerms,
  processingPayment,
  setProcessingPayment,
  error,
  setError
}: {
  clientSecret: string | null
  cart: Cart | null
  cartId: string
  email: string
  firstName: string
  lastName: string
  phone: string
  cardholderName: string
  setCardholderName: (value: string) => void
  acceptTerms: boolean
  setAcceptTerms: (value: boolean) => void
  processingPayment: boolean
  setProcessingPayment: (value: boolean) => void
  error: string | null
  setError: (value: string | null) => void
}) {
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
  }, [])

  useEffect(() => {
  })

  // Show loading state if clientSecret or cart is not ready
  if (!clientSecret || !cart) {
    return (
      <div className="mb-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptTerms) {
      setError('Please accept the terms and conditions')
      return
    }

    if (!stripe || !elements) {
      setError('Payment system not loaded. Please refresh and try again.')
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Payment form not loaded properly')
      return
    }

    setProcessingPayment(true)
    setError(null)

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
            email: email,
          },
        },
      })

      if (error) {
        setError(error.message || 'Payment failed')
      } else if (paymentIntent?.status === 'succeeded') {
        // Complete the Medusa order
        await completeOrder(paymentIntent.id)
      }
    } catch (error) {
      setError('Payment failed. Please try again.')
    } finally {
      setProcessingPayment(false)
    }
  }

  const completeOrder = async (paymentIntentId: string) => {
    try {
      const response = await fetch('/api/orders/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_id: cartId,
          payment_intent_id: paymentIntentId,
          customer_details: {
            email,
            first_name: firstName,
            last_name: lastName,
            phone
          }
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Redirect to success page
        window.location.href = `/checkout/success?order_id=${data.order_id}`
      } else {
        setError('Order completion failed. Please contact support.')
      }
    } catch (error) {
      setError('Order completion failed. Please contact support.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Payment Information */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
        <div className="space-y-4">
          <CardInput />
          <div>
            <label className="block text-sm font-medium mb-1">Cardholder Name</label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Full name as it appears on card"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              required
            />
            <label className="text-sm text-gray-600">
              I accept the <a href="/terms" className="text-orange-600 hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</a>
            </label>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Security Badge */}
      <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-6">
        <div className="flex items-center space-x-2 mb-1">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Secure Payment</span>
        </div>
        <p className="text-xs text-gray-600">Your payment information is encrypted and secure.</p>
      </div>

      <button
        type="submit"
        disabled={processingPayment || !stripe}
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {processingPayment ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          `Complete Payment ${formatPrice(cart.total)}`
        )}
      </button>
    </form>
  )
})

  if (loading) {
    return (
      <Elements stripe={stripePromise} options={elementsOptions}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </Elements>
    )
  }

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Contact & Payment */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold mb-6">Checkout</h1>
              
              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Stripe Payment Form - Always rendered to prevent unmounting/remounting */}
              <StripePaymentForm
                clientSecret={clientSecret}
                cart={cart}
                cartId={cartId}
                email={email}
                firstName={firstName}
                lastName={lastName}
                phone={phone}
                cardholderName={cardholderName}
                setCardholderName={setCardholderName}
                acceptTerms={acceptTerms}
                setAcceptTerms={setAcceptTerms}
                processingPayment={processingPayment}
                setProcessingPayment={setProcessingPayment}
                error={error}
                setError={setError}
              />
            </div>

            {/* Right Column - Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              {/* Event Details */}
              <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Event Details</h3>
                <p className="text-sm text-orange-700">BBQ Event Experience</p>
                <p className="text-sm text-orange-600">Check your confirmation email for details</p>
              </div>

              {/* Cart Items */}
              {cart && (
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => {
                    const variantTitle = item.variant?.title
                    const showVariant = variantTitle && 
                      variantTitle !== 'Default Variant' && 
                      variantTitle !== 'Default Title'
                    
                    return (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title || 'Product'}</h4>
                          {showVariant && (
                            <p className="text-sm text-gray-600">{variantTitle}</p>
                          )}
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.unit_price * item.quantity)}</p>
                          <p className="text-sm text-gray-500">{formatPrice(item.unit_price)} each</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Order Totals */}
              {cart && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  {cart.tax_total > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>{formatPrice(cart.tax_total)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Elements>
  )
}

export default React.memo(CheckoutPage)