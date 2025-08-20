'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  type: 'ticket' | 'package'
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Parse cart data from URL params
    const tickets = parseInt(searchParams.get('tickets') || '2')
    const ticketPrice = parseInt(searchParams.get('ticketPrice') || '25')
    const starter = parseInt(searchParams.get('starter') || '0')
    const master = parseInt(searchParams.get('master') || '0')
    const combo = parseInt(searchParams.get('combo') || '0')

    const items: CartItem[] = []

    // Add tickets
    if (tickets > 0) {
      items.push({
        id: 'tickets',
        name: 'Event Tickets',
        price: ticketPrice,
        quantity: tickets,
        type: 'ticket'
      })
    }

    // Add packages
    if (starter > 0) {
      items.push({
        id: 'starter',
        name: 'Burnt Ends Starter Pack',
        price: 34,
        quantity: starter,
        type: 'package'
      })
    }
    if (master > 0) {
      items.push({
        id: 'master',
        name: 'Burnt Ends Master Pack',
        price: 64,
        quantity: master,
        type: 'package'
      })
    }
    if (combo > 0) {
      items.push({
        id: 'combo',
        name: 'Regional Sampler Combo',
        price: 104,
        quantity: combo,
        type: 'package'
      })
    }

    setCartItems(items)
    setIsLoading(false)
  }, [searchParams])

  const grandTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const ticketTotal = cartItems.filter(item => item.type === 'ticket').reduce((total, item) => total + (item.price * item.quantity), 0)
  const packageTotal = cartItems.filter(item => item.type === 'package').reduce((total, item) => total + (item.price * item.quantity), 0)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirect to confirmation
    const confirmationData = new URLSearchParams({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      total: grandTotal.toString(),
      tickets: cartItems.find(item => item.id === 'tickets')?.quantity.toString() || '0'
    })
    
    window.location.href = `/confirmation?${confirmationData.toString()}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-copper mx-auto mb-4"></div>
          <p>Loading your order...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="hero-title mb-6">No Items in Cart</h1>
          <p className="hero-subtitle mb-8">
            Looks like your cart is empty. Head back to the event page to make your selections.
          </p>
          <Link href="/event" className="hero-cta">
            <i className="fas fa-arrow-left"></i>
            Back to Event
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 px-4 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <nav className="breadcrumb justify-center mb-6">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <Link href="/event">Event</Link>
            <span className="separator">/</span>
            <span>Checkout</span>
          </nav>
          <h1 className="section-title text-text-primary mb-4">Complete Your Booking</h1>
          <p className="section-subtitle text-text-secondary">
            You're just one step away from securing your Kansas City BBQ experience!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="section-card">
              <h2 className="section-card-title">
                <i className="fas fa-shopping-cart"></i>
                Order Summary
              </h2>
              
              <div className="order-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="order-item-info">
                      <h3 className="order-item-name">{item.name}</h3>
                      <span className="order-item-type">
                        {item.type === 'ticket' ? 'Event Admission' : 'Take-Home Package'}
                      </span>
                    </div>
                    <div className="order-item-pricing">
                      <span className="order-item-quantity">×{item.quantity}</span>
                      <span className="order-item-price">${item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="order-total-line">
                  <span>Event Tickets</span>
                  <span>${ticketTotal}</span>
                </div>
                {packageTotal > 0 && (
                  <div className="order-total-line">
                    <span>BBQ Packages</span>
                    <span>${packageTotal}</span>
                  </div>
                )}
                <div className="order-total-line final">
                  <span>Total</span>
                  <span>${grandTotal}</span>
                </div>
              </div>

              <div className="order-benefits">
                <h3 className="benefits-title">What's Included</h3>
                <ul className="benefits-list">
                  <li><i className="fas fa-utensils"></i>Kansas City burnt ends tasting</li>
                  <li><i className="fas fa-graduation-cap"></i>BBQ education session</li>
                  <li><i className="fas fa-percentage"></i>15% store discount</li>
                  <li><i className="fas fa-crown"></i>Exclusive pre-order access</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="section-card">
              <h2 className="section-card-title">
                <i className="fas fa-user"></i>
                Your Details
              </h2>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your@email.com"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
                <span className="form-help">We'll send your confirmation and QR code here</span>
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="0412 345 678"
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
                <span className="form-help">For event day contact if needed</span>
              </div>

              <div className="form-group">
                <label htmlFor="specialRequests" className="form-label">
                  Special Requests or Dietary Requirements
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows={3}
                  placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                />
              </div>

              <div className="form-checkboxes">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">
                    I agree to the <Link href="#" className="link">terms and conditions</Link> and 
                    understand the <Link href="#" className="link">cancellation policy</Link> *
                  </span>
                </label>
                {errors.agreeToTerms && <span className="form-error">{errors.agreeToTerms}</span>}

                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">
                    Send me updates about future BBQ events and regional experiences
                  </span>
                </label>
              </div>

              <div className="form-actions">
                <Link href="/event" className="btn-secondary">
                  <i className="fas fa-arrow-left"></i>
                  Back to Event
                </Link>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-credit-card"></i>
                      Complete Booking - ${grandTotal}
                    </>
                  )}
                </button>
              </div>

              <div className="security-notice">
                <i className="fas fa-shield-alt"></i>
                <p>
                  <strong>Secure Booking:</strong> Your information is encrypted and secure. 
                  You'll receive instant confirmation and can cancel up to 24 hours before the event.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}