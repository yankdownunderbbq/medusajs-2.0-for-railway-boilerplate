'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Mail, Phone, MapPin, User, AlertCircle, Lock } from 'lucide-react'
import { sdk } from '@/lib/medusa'
import { formatSimplePrice, formatLineTotal, formatCartTotal } from '@/utils/price'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Configuration constants for Medusa v2.0 API
const MEDUSA_API_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
const PICKUP_SHIPPING_OPTION_ID = "so_01K37V2NKQE09P3T3MPM7T55BP" // Verified "Pickup Only" option

// Extracted InputField component to prevent cursor jumping
const InputField = React.memo(({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  icon: Icon, 
  error, 
  required = false,
  value,
  onChange,
  ...props 
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  icon?: any
  error?: string
  required?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  [key: string]: any
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 border rounded-lg text-sm
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
          }
          focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors
          placeholder-gray-400`}
        {...props}
      />
    </div>
    {error && (
      <div className="flex items-center space-x-1 text-red-600 text-xs">
        <AlertCircle className="h-3 w-3" />
        <span>{error}</span>
      </div>
    )}
  </div>
))

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const cartId = params.cart_id as string
  
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modern form state - single object
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Australia'
  })
  
  const [errors, setErrors] = useState<any>({})
  const [isFormComplete, setIsFormComplete] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    if (!cartId) return
    
    let isCancelled = false
    
    const initializePayment = async () => {
      try {
        // 1. Get cart first
        const { cart: cartData } = await sdk.store.cart.retrieve(cartId)
        
        if (isCancelled) return // Exit if component unmounted
        
        
        setCart(cartData)
        
        // 2. Handle payment sessions directly (no shipping logic needed)
        if (!cartData.payment_collection) {
          try {
            await sdk.store.payment.initiatePaymentSession(cartData, {
              provider_id: "pp_stripe_stripe"
            })
            
            if (isCancelled) return // Exit if component unmounted during API call
            
            const { cart: updatedCart } = await sdk.store.cart.retrieve(cartId)
            setCart(updatedCart)
          } catch (sessionError) {
            console.warn('Payment session creation failed:', sessionError)
          }
        } else {
        }
        
      } catch (err) {
        if (!isCancelled) {
          setError('Failed to initialize checkout')
          console.error('Checkout initialization error:', err)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }
    
    const runInitialization = async () => {
      if (!isCancelled) {
        await initializePayment()
      }
    }
    
    runInitialization()
    
    return () => {
      isCancelled = true
    }
  }, [cartId]) // Only run when cartId changes

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Check if form is complete
    checkFormCompletion({...formData, [name]: value})
  }, [errors, formData])

  const checkFormCompletion = (data: any) => {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode']
    const complete = required.every(field => data[field]?.trim())
    setIsFormComplete(complete)
  }

  // Update cart with customer info
  const updateCartWithCustomerInfo = async () => {
    if (!cart?.id) return

    try {
      await sdk.store.cart.update(cart.id, {
        email: formData.email,
        billing_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          province: formData.state,
          postal_code: formData.zipCode,
          country_code: formData.country === 'Australia' ? 'AU' : 'US'
        }
      })

      // Refresh cart
      const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id)
      setCart(updatedCart)
    } catch (error) {
      console.error('Failed to update cart:', error)
      setError('Failed to update customer information')
    }
  }

  // ✅ FINAL SOLUTION: Direct pickup shipping method creation
  // Bypasses buggy Medusa v2.0 shipping options API entirely
  const autoSelectShippingMethod = async (cartId: string) => {
    try {
      
      // Direct API call to add pickup shipping method to cart
      const response = await fetch(`${MEDUSA_API_URL}/store/carts/${cartId}/shipping-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
        body: JSON.stringify({
          option_id: PICKUP_SHIPPING_OPTION_ID,
          data: {}
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        console.error('❌ Failed to add pickup shipping method:', error)
        console.error('Response status:', response.status)
        console.error('Response headers:', Object.fromEntries(response.headers.entries()))
        
        // Provide specific troubleshooting based on error
        if (response.status === 401) {
          console.error('💡 Authentication error - check publishable API key')
        } else if (response.status === 404) {
          console.error('💡 Shipping option not found - check shipping option ID in admin')
        } else if (error.message?.includes('option')) {
          console.error('💡 Invalid shipping option ID - verify in Medusa Admin')
        }
        
        return false
      }
      
      const result = await response.json()
      
      // Verify the shipping method was actually added
      if (result.cart?.shipping_methods?.length > 0) {
        const addedMethod = result.cart.shipping_methods[0]
        return true
      } else {
        console.warn('⚠️  Shipping method API returned success but no methods found on cart')
        return false
      }
      
    } catch (error) {
      console.error('❌ Error adding pickup shipping method:', error)
      return false
    }
  }

  const completeCart = async () => {
    try {
      
      // Check if cart has items that require shipping
      const hasShippingItems = cart.items?.some((item: any) => item.requires_shipping)
      
      if (hasShippingItems) {
        // Auto-select shipping method if only one exists
        const shippingSelected = await autoSelectShippingMethod(cartId)
        
        if (!shippingSelected) {
          throw new Error('Unable to select shipping method. Please check shipping configuration in Medusa Admin.')
        }
        
        // Refresh cart to get updated shipping methods
        const { cart: updatedCart } = await sdk.store.cart.retrieve(cartId)
        
        // Verify shipping method was added
        if (!updatedCart.shipping_methods || updatedCart.shipping_methods.length === 0) {
          console.warn('⚠️  No shipping methods found on cart after auto-selection attempt')
          
          // For pickup-only business, try to proceed anyway
          if (!hasShippingItems) {
          } else {
            throw new Error('Shipping method required but none was added to cart')
          }
        }
      } else {
      }
      
      // Now complete the cart
      const result = await sdk.store.cart.complete(cartId)
      
      if (result.type === 'order') {
        router.push(`/checkout/success?order_id=${result.order.id}`)
      } else {
        throw new Error('Cart completion failed - no order created')
      }
    } catch (err) {
      const errorMessage = (err as Error).message
      console.error('❌ Cart completion error:', err)
      
      // Provide more specific error messages with helpful guidance
      if (errorMessage.includes('shipping method') || errorMessage.includes('shipping')) {
        setError(`Failed to complete order: ${errorMessage}

📋 Troubleshooting steps:
1. Check Medusa Admin → Settings → Regions → Shipping Options
2. Ensure shipping options are configured for your region
3. Verify shipping options are enabled and have correct pricing
4. For pickup-only businesses, set products to not require shipping`)
      } else if (errorMessage.includes('payment')) {
        setError('Failed to complete order: Payment processing error. Please try again.')
      } else if (errorMessage.includes('inventory') || errorMessage.includes('stock')) {
        setError('Failed to complete order: Insufficient inventory. Please check product availability.')
      } else {
        setError(`Failed to complete order: ${errorMessage}`)
      }
    }
  }

  const handleContinueToPayment = async () => {
    // Update cart with customer info
    await updateCartWithCustomerInfo()
    setShowPayment(true)
  }


  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading checkout...</p>
      </div>
    </div>
  )
  
  if (error && !cart) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600">Error: {error}</p>
      </div>
    </div>
  )
  
  if (!cart) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-600">Cart not found</p>
    </div>
  )

  // Get Stripe payment session
  const stripeSession = cart.payment_collection?.payment_sessions?.find(
    (session: any) => session.provider_id.includes('stripe')
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
          <p className="text-gray-600">Enter your details to proceed with payment</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            {cart.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-700">{item.title} × {item.quantity}</span>
                <span className="font-medium">{formatLineTotal(item.unit_price, item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-orange-600">{formatCartTotal(cart.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Contact Information Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  icon={Mail}
                  error={errors.email}
                  required
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    name="firstName"
                    placeholder="John"
                    error={errors.firstName}
                    required
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    placeholder="Doe"
                    error={errors.lastName}
                    required
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+61 400 000 000"
                  icon={Phone}
                  error={errors.phone}
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Billing Address Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">Billing Address</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="Street Address"
                  name="address"
                  placeholder="123 Main Street"
                  error={errors.address}
                  required
                  value={formData.address || ''}
                  onChange={handleInputChange}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="City"
                    name="city"
                    placeholder="Brisbane"
                    error={errors.city}
                    required
                    value={formData.city || ''}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="State/Province"
                    name="state"
                    placeholder="QLD"
                    error={errors.state}
                    required
                    value={formData.state || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Postal Code"
                    name="zipCode"
                    placeholder="4000"
                    error={errors.zipCode}
                    required
                    value={formData.zipCode || ''}
                    onChange={handleInputChange}
                  />
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm
                        focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-2 focus:ring-opacity-20"
                    >
                      <option value="Australia">Australia</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            {!showPayment && (
              <button
                onClick={handleContinueToPayment}
                disabled={!isFormComplete}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                  text-white font-semibold py-3 px-6 rounded-lg text-lg
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20
                  transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Continue to Payment</span>
              </button>
            )}

            {/* Payment Section */}
            {showPayment && stripeSession && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="h-5 w-5 text-orange-500" />
                  <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
                </div>
                
                {/* Security Notice */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Your payment information is encrypted and secure</span>
                  </div>
                </div>

                {/* Stripe Elements */}
                <Elements 
                  stripe={stripePromise} 
                  options={{ 
                    clientSecret: stripeSession.data.client_secret,
                    appearance: { 
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#f97316', // orange-500
                      }
                    }
                  }}
                >
                  <StripePaymentForm onPaymentSuccess={completeCart} />
                </Elements>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => setError('')}
                    className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By completing your purchase, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  )
}

// Stripe Payment Form Component
function StripePaymentForm({ onPaymentSuccess }: { onPaymentSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) return
    
    setProcessing(true)
    
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      })

      if (error) {
        console.error('Payment failed:', error)
      } else {
        await onPaymentSuccess()
      }
    } catch (err) {
      console.error('Payment error:', err)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed
          text-white font-semibold py-3 px-6 rounded-lg text-lg
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20
          transition-colors duration-200"
      >
        {processing ? 'Processing...' : 'Complete Payment'}
      </button>
    </form>
  )
}