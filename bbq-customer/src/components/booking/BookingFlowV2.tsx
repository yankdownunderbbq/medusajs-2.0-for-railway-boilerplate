'use client'

import { useState, useEffect } from 'react'
import { createEventCart, redirectToCheckout, getDefaultRegion } from '@/utils/cart'
import '@/styles/booking-flow.css'


interface BookingFlowV2Props {
  bookingId?: string
  eventId: string
  event: {
    id: string
    title: string
    base_price: number  // In cents (2500 = $25)
    max_capacity: number
    current_bookings: number
    description?: string
    packages?: Array<{
      id: string
      name: string
      description: string
      price: number
      includes?: string[]
    }>
    takeHomeProducts?: Array<{
      id: string
      name: string
      description: string
      price: number
    }>
  }
  products?: Array<{
    id: string
    title: string
    description: string
    thumbnail: string
    variants: Array<{
      id: string
      title: string
      prices?: Array<{
        amount: number
        currency_code: string
      }>
    }>
  }>
}

export default function BookingFlowV2({ eventId, event, products = [] }: BookingFlowV2Props) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPackages, setSelectedPackages] = useState<Record<string, number>>({})
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [isCreatingCart, setIsCreatingCart] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [eventData, setEventData] = useState<any>(null)
  const [isLoadingEvent, setIsLoadingEvent] = useState(false)
  const [eventError, setEventError] = useState<string | null>(null)
  const fetchEventData = async () => {
    setIsLoadingEvent(true)
    setEventError(null)
    try {
      const response = await fetch(`/api/events/${eventId}`)
      const data = await response.json()
      setEventData(data.event)
    } catch (error) {
      setEventError('Failed to load event data')
    } finally {
      setIsLoadingEvent(false)
    }
  }

  useEffect(() => {
    updateStepDisplay()
  }, [currentStep])

  useEffect(() => {
    if (eventId) {
      fetchEventData()
    }
  }, [eventId])

  // Initialize selectedVariants when products load
  useEffect(() => {
    if (products && products.length > 0) {
      const initialVariants: Record<string, string> = {}
      products.forEach(product => {
        if (product.variants && product.variants.length > 0) {
          initialVariants[product.id] = product.variants[0].id
          console.log(`Initialized variant for ${product.title}:`, {
            productId: product.id,
            variantId: product.variants[0].id,
            variantTitle: product.variants[0].title
          })
        }
      })
      setSelectedVariants(initialVariants)
      console.log('Initialized selectedVariants:', initialVariants)
    }
  }, [products])

  const changeQuantity = (delta: number) => {
    const newQuantity = ticketQuantity + delta
    const availableSpots = event.max_capacity - event.current_bookings
    if (newQuantity >= 1 && newQuantity <= Math.min(10, availableSpots)) {
      setTicketQuantity(newQuantity)
    }
  }

  const selectPackage = () => {
    // Visual feedback for selection
    document.querySelectorAll('.package-card').forEach(card => {
      card.classList.remove('selected')
    })
  }

  const changePackageQuantity = (packageType: string, delta: number) => {
    console.log('changePackageQuantity called:', {
      packageType,
      delta,
      currentQuantity: selectedPackages[packageType] || 0,
      selectedPackages: selectedPackages,
      selectedVariants: selectedVariants
    })
    
    const newQuantity = (selectedPackages[packageType] || 0) + delta
    if (newQuantity >= 0 && newQuantity <= 5) {
      console.log('Setting new quantity:', newQuantity, 'for packageType:', packageType)
      setSelectedPackages(prev => ({
        ...prev,
        [packageType]: newQuantity
      }))

      // Update card selection state
      const card = document.querySelector(`[data-package="${packageType}"]`)
      if (newQuantity > 0) {
        card?.classList.add('selected')
      } else {
        card?.classList.remove('selected')
      }
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
      setTimeout(() => {
        const element = document.getElementById('booking-top')
        if (element) {
          const yOffset = -80
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 100)
      if (currentStep + 1 === 3) {
        updateOrderSummary()
      }
    } else {
      proceedToCheckout()
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setTimeout(() => {
        const element = document.getElementById('booking-top')
        if (element) {
          const yOffset = -80
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 100)
    }
  };

  const updateStepDisplay = () => {
    // Update progress bar
    const progressFill = document.getElementById('progressFill')
    if (progressFill) {
      progressFill.style.width = `${(currentStep / 3) * 100}%`
    }

    // Update progress steps
    document.querySelectorAll('.booking-progress-step').forEach((step, index) => {
      const stepNumber = index + 1
      step.classList.remove('active', 'completed')

      if (stepNumber < currentStep) {
        step.classList.add('completed')
        const circle = step.querySelector('.booking-step-circle')
        if (circle) {
          circle.innerHTML = '<i class="fas fa-check"></i>'
        }
      } else if (stepNumber === currentStep) {
        step.classList.add('active')
        const circle = step.querySelector('.booking-step-circle')
        if (circle) {
          circle.textContent = stepNumber.toString()
        }
      } else {
        const circle = step.querySelector('.booking-step-circle')
        if (circle) {
          circle.textContent = stepNumber.toString()
        }
      }
    })
  };

  const updateOrderSummary = () => {
    const orderSummary = document.getElementById('orderSummary')
    let total = 0
    let html = ''

    // Add tickets
    const ticketPrice = event.base_price / 100 // ✅ FIXED: Backend returns cents, convert to dollars
    const ticketTotal = ticketQuantity * ticketPrice
    total += ticketTotal
    html += `
      <div class="order-item">
        <div class="item-quantity">×${ticketQuantity}</div>
        <div class="item-details">
          <div class="item-name">${event.title}</div>
        </div>
        <div class="item-price">$${ticketPrice.toFixed(2)}</div>
      </div>
    `

    // Add products to summary
    products.forEach(product => {
      const selectedVariantId = selectedVariants[product.id] || product.variants?.[0]?.id
      const selectedVariant = product.variants?.find(v => v.id === selectedVariantId)
      const quantity = selectedPackages[selectedVariantId]
      
      if (quantity > 0 && selectedVariant) {
        const price = selectedVariant?.prices?.[0]
        const priceAmount = price?.amount || 0
        const productTotal = quantity * priceAmount // ✅ FIXED: Product API returns dollars, no conversion needed
        total += productTotal
        
        html += `
          <div class="order-item">
            <div class="item-quantity">×${quantity}</div>
            <div class="item-details">
              <div class="item-name">${product.title} - ${selectedVariant.title}</div>
            </div>
            <div class="item-price">$${priceAmount.toFixed(2)}</div>
          </div>
        `
      }
    })

    if (orderSummary) {
      orderSummary.innerHTML = html
    }

    // Update total - remove confusing subtotal/savings
    const grandTotalEl = document.getElementById('grandTotal')
    if (grandTotalEl) grandTotalEl.textContent = `$${total.toFixed(2)}`
  };

  const handleSecureCheckout = async () => {
    setIsCreatingCart(true)
    setCheckoutError(null)

    try {
      // Validate ticket variant ID exists
      if (!eventData?.ticket_variant_id) {
        setCheckoutError('Event ticket variant not available')
        return
      }

      // Get default region
      const regionId = await getDefaultRegion()
      
      // Create cart data with dynamic variant ID
      const cartData = {
        eventTicketVariantId: eventData.ticket_variant_id,
        ticketQuantity,
        selectedPackages,
        regionId
      }

      // Create cart
      console.log('Creating cart with data:', cartData)
      console.log('selectedPackages details:', Object.entries(selectedPackages).map(([variantId, quantity]) => ({
        variantId,
        quantity,
        productInfo: products.find(p => p.variants?.some(v => v.id === variantId))?.title
      })))
      
      const cartId = await createEventCart(cartData)
      console.log('Cart created successfully with ID:', cartId)
      
      // Redirect to checkout
      redirectToCheckout(cartId)
    } catch (error) {
      setCheckoutError('Failed to create checkout. Please try again.')
      console.error('Checkout error:', error)
    } finally {
      setIsCreatingCart(false)
    }
  };

  const proceedToCheckout = () => {
    handleSecureCheckout()
  };

  return (
    <>
      <div className="booking-container">
        {/* Header */}
        <header className="booking-header">
          <div className="header-badge">
            <i className="fas fa-fire"></i>
            Book Your Experience
          </div>
          <h1 className="header-title">Complete Your Booking</h1>
          <p className="header-subtitle">
            Secure your spot and optional take-home BBQ packages in just 3 simple steps.
          </p>
        </header>

        {/* Event Loading State */}
        {isLoadingEvent && (
          <div className="event-loading-state">
            <div className="loading-content">
              <i className="fas fa-spinner fa-spin loading-spinner"></i>
              <h3>Loading Event Details...</h3>
              <p>Please wait while we fetch the latest event information.</p>
            </div>
          </div>
        )}

        {/* Event Error State */}
        {eventError && !isLoadingEvent && (
          <div className="event-error-state">
            <div className="error-content">
              <i className="fas fa-exclamation-triangle error-icon"></i>
              <h3>Unable to Load Event</h3>
              <p>{eventError}</p>
              <button onClick={fetchEventData} className="retry-btn">
                <i className="fas fa-redo"></i>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Event Validation Error */}
        {eventData && !eventData.ticket_variant_id && !isLoadingEvent && !eventError && (
          <div className="event-validation-error">
            <div className="validation-content">
              <i className="fas fa-info-circle validation-icon"></i>
              <h3>Event Configuration Issue</h3>
              <p>This event doesn't have a ticket variant configured. Please contact support or try a different event.</p>
            </div>
          </div>
        )}

        {/* Main Booking Content - Only show when event data is ready */}
        {!isLoadingEvent && !eventError && eventData && eventData.ticket_variant_id && (
          <>
        {/* Progress Bar */}
        <div className="booking-progress-container" id="booking-top">
  <div className="booking-progress-bar">
    <div className="booking-progress-fill" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
    
    <div className={`booking-progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
      <div className="booking-step-circle">
        {currentStep > 1 ? '✓' : '1'}
      </div>
      <span className="booking-step-label">Select Tickets</span>
    </div>
    
    <div className={`booking-progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
      <div className="booking-step-circle">
        {currentStep > 2 ? '✓' : '2'}
      </div>
      <span className="booking-step-label">Take-Home BBQ</span>
    </div>
    
    <div className={`booking-progress-step ${currentStep >= 3 ? 'active' : ''}`}>
      <div className="booking-step-circle">3</div>
      <span className="booking-step-label">Review & Book</span>
    </div>
  </div>
</div>

        {/* Step 1: Select Tickets */}
        <div className={`step-content ${currentStep === 1 ? 'active' : ''}`} id="step1">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Choose Number of Attendees
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              How many people will attend the {event.title}?
            </p>
          </div>

          {/* Ticket Selection */}
          <div className="ticket-card">
            <div className="ticket-header">
              <div className="ticket-badge">Event Entry</div>
              <div className="ticket-price">
                <div className="price-amount">${(event.base_price / 100).toFixed(2)}</div>
                <div className="price-per">per person</div>
              </div>
            </div>

            <h3 className="ticket-title">{event.title}</h3>
            <p className="ticket-description">
              Full Kansas City BBQ experience including burnt ends tasting, regional BBQ education,
              exclusive store benefits, and priority access to take-home packages.
            </p>

            <div className="ticket-quantity">
              <span className="quantity-label">Number of Attendees</span>
              <div className="quantity-control">
                <button
                  className="quantity-btn"
                  onClick={() => changeQuantity(-1)}
                  id="decreaseBtn"
                  disabled={ticketQuantity <= 1}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <span className="quantity-display" id="ticketQuantity">{ticketQuantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => changeQuantity(1)}
                  id="increaseBtn"
                  disabled={ticketQuantity >= Math.min(10, event.max_capacity - event.current_bookings)}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>

            <div className="ticket-total">
              <span className="total-label">Ticket Total</span>
              <span className="total-amount" id="ticketTotal">${(ticketQuantity * (event.base_price / 100)).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Take-Home BBQ */}
        <div className={`step-content ${currentStep === 2 ? 'active' : ''}`} id="step2">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Take-Home BBQ Packages
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Exclusive Kansas City BBQ packages available only to event attendees.
              Vacuum-sealed and ready for your freezer.
            </p>
          </div>

          {products && products.length > 0 ? (
            <div className="packages-grid">
              {products.map((product) => {
                const selectedVariantId = selectedVariants[product.id] || product.variants?.[0]?.id
                const selectedVariant = product.variants?.find(v => v.id === selectedVariantId) || product.variants?.[0]
                const price = selectedVariant?.prices?.[0]
                const priceAmount = price?.amount || 0
                
                
                return (
                  <div key={product.id} className="package-card" onClick={() => selectPackage()} data-package={selectedVariantId} style={{ overflow: 'hidden' }}>
                    {/* Hero Image Section */}
                    <div style={{
                      position: 'relative',
                      height: '200px',
                      backgroundImage: `url(${product.thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      marginBottom: 'var(--space-6)',
                      margin: 'calc(var(--space-6) * -1) calc(var(--space-6) * -1) var(--space-6) calc(var(--space-6) * -1)'
                    }}>
                      {/* Price Badge */}
                      <div style={{
                        position: 'absolute',
                        top: 'var(--space-4)',
                        right: 'var(--space-4)',
                        backgroundColor: 'var(--charcoal)',
                        color: 'var(--warm-white)',
                        padding: 'var(--space-2) var(--space-4)',
                        borderRadius: '50px',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}>
                        ${priceAmount.toFixed(2)}
                      </div>
                    </div>

                    <h3 className="package-title">{product.title}</h3>
                    <p className="package-description">
                      {product.description || 'Premium BBQ product for take-home.'}
                    </p>

                    {product.variants && product.variants.length > 1 && (
                      <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={{ 
                          fontFamily: 'var(--font-display)', 
                          fontWeight: 600, 
                          color: 'var(--text-primary)', 
                          marginBottom: 'var(--space-2)', 
                          display: 'block' 
                        }}>
                          Size:
                        </label>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                          {product.variants.map((variant) => (
                            <button
                              key={variant.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedVariants(prev => ({
                                  ...prev,
                                  [product.id]: variant.id
                                }))
                              }}
                              style={{
                                padding: 'var(--space-2) var(--space-4)',
                                border: `2px solid ${selectedVariantId === variant.id ? 'var(--warm-copper)' : '#e5e5e5'}`,
                                backgroundColor: selectedVariantId === variant.id ? 'var(--warm-copper)' : 'transparent',
                                color: selectedVariantId === variant.id ? 'var(--warm-white)' : 'var(--text-primary)',
                                borderRadius: 'var(--space-2)',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                transition: 'all var(--transition-medium)'
                              }}
                            >
                              {variant.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="package-features">
                      <span className="feature-tag">Premium quality</span>
                      <span className="feature-tag">Take-home</span>
                      {selectedVariant && <span className="feature-tag">{selectedVariant.title}</span>}
                    </div>

                    <div className="package-quantity">
                      <span className="quantity-label">Quantity</span>
                      <div className="quantity-control">
                        <button 
                          className="quantity-btn" 
                          onClick={() => changePackageQuantity(selectedVariantId, -1)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="quantity-display">
                          {selectedPackages[selectedVariantId] || 0}
                        </span>
                        <button 
                          className="quantity-btn" 
                          onClick={() => changePackageQuantity(selectedVariantId, 1)}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-secondary)', borderRadius: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
              <i className="fas fa-box" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}></i>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                No Products Available
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                No take-home products are available for this event.
              </p>
            </div>
          )}
        </div>

        {/* Step 3: Review & Book */}
        <div className={`step-content ${currentStep === 3 ? 'active' : ''}`} id="step3">
          <div className="summary-container">
            <div className="summary-header">
              <h2 className="summary-title">Review Your Order</h2>
              <p className="summary-subtitle">Confirm your selection and secure your {event.title} experience</p>
            </div>

            <div className="order-items" id="orderSummary">
              {/* Order items will be populated by JavaScript */}
            </div>

            <div className="order-total">
              <div className="total-row final">
                <span className="total-label final">Total</span>
                <span className="total-value final" id="grandTotal">${(ticketQuantity * (event.base_price / 100)).toFixed(2)}</span>
              </div>
            </div>

            {checkoutError && (
              <div style={{ background: 'rgba(158, 33, 70, 0.1)', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
                <span style={{ color: '#9e2146', fontSize: '0.875rem' }}>{checkoutError}</span>
              </div>
            )}

            <div style={{ background: 'rgba(184, 92, 56, 0.1)', borderRadius: '12px', padding: '16px', marginBottom: '32px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <i className="fas fa-shield-alt" style={{ color: 'var(--warm-copper)' }}></i>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Free Cancellation
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Cancel up to 24 hours before the event for a full refund
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="step-navigation">
          <button
            className="nav-btn secondary"
            id="backBtn"
            onClick={previousStep}
            style={{ display: currentStep > 1 ? 'flex' : 'none' }}
          >
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <button className="nav-btn primary" id="nextBtn" onClick={nextStep} disabled={isCreatingCart || (currentStep === 3 && !eventData?.ticket_variant_id)}>
            {currentStep === 3 ? (
              isCreatingCart ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating Cart...
                </>
              ) : (
                <>
                  <i className="fas fa-lock"></i> Secure Checkout
                </>
              )
            ) : (
              <>
                Continue
                <i className="fas fa-arrow-right"></i>
              </>
            )}
          </button>
        </div>
        </>
        )}
      </div>
    </>
  )
}