'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EventData } from '@/lib/events'

interface BookingFlowProps {
  event: EventData
}

export function BookingFlow({ event }: BookingFlowProps) {
  const [ticketCount, setTicketCount] = useState(2)
  const [packageQuantities, setPackageQuantities] = useState<Record<string, number>>(
    event.packages.reduce((acc, pkg) => ({ ...acc, [pkg.id]: 0 }), {})
  )

  const updateTicketCount = (change: number) => {
    const newCount = Math.max(1, Math.min(8, ticketCount + change))
    setTicketCount(newCount)
  }

  const updatePackageQuantity = (packageId: string, change: number) => {
    setPackageQuantities(prev => ({
      ...prev,
      [packageId]: Math.max(0, Math.min(5, prev[packageId] + change))
    }))
  }

  const ticketTotal = ticketCount * event.price
  const packageTotal = event.packages.reduce((total, pkg) => 
    total + (pkg.price * packageQuantities[pkg.id]), 0
  )
  const grandTotal = ticketTotal + packageTotal

  const hasPackages = Object.values(packageQuantities).some(qty => qty > 0)

  return (
    <div className="mt-16">
      <div className="section-header text-center mb-12">
        <span className="section-badge exclusive">Event Attendee Exclusive</span>
        <h2 className="section-title text-text-primary">Reserve Your Spots & Add BBQ Packages</h2>
        <p className="section-subtitle text-text-secondary">
          First book your event tickets, then add any BBQ packages you'd like to take home.
        </p>
      </div>

      {/* Step 1: Ticket Selection */}
      <div className="booking-step">
        <div className="step-header">
          <div className="step-number">1</div>
          <h3 className="step-title">How many tickets?</h3>
        </div>
        <div className="ticket-selection-prominent">
          <div className="ticket-counter-large">
            <button 
              className="counter-btn-large minus"
              onClick={() => updateTicketCount(-1)}
              disabled={ticketCount <= 1}
            >
              <i className="fas fa-minus"></i>
            </button>
            <div className="counter-display-large">
              <span className="counter-number-large">{ticketCount}</span>
              <span className="counter-label-large">tickets</span>
            </div>
            <button 
              className="counter-btn-large plus"
              onClick={() => updateTicketCount(1)}
              disabled={ticketCount >= 8}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="ticket-info">
            <div className="ticket-price">
              <span className="price-per">${event.price} per person</span>
              <span className="price-total">Total: ${ticketTotal}</span>
            </div>
            <p className="ticket-includes">
              Each ticket includes: {event.highlights.join(' • ')}
            </p>
          </div>
        </div>
      </div>

      {/* Step 2: Pre-Order Packages */}
      <div className="booking-step">
        <div className="step-header">
          <div className="step-number">2</div>
          <h3 className="step-title">Add BBQ packages (optional)</h3>
          <p className="step-subtitle">Take home authentic regional BBQ - only available to event attendees</p>
        </div>
        
        <div className="package-shop">
          {event.packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="shop-item"
            >
              <div className="item-info">
                <div className="item-header">
                  <h4 className="item-name">{pkg.name}</h4>
                  <div className="item-price">
                    <span>${pkg.price}</span>
                  </div>
                </div>
                <p className="item-description">{pkg.description}</p>
                <div className="item-features">
                  {pkg.includes.map((feature, idx) => (
                    <span key={idx} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </div>
              <div className="item-controls">
                <div className="quantity-controls">
                  <button 
                    className="qty-btn minus"
                    onClick={() => updatePackageQuantity(pkg.id, -1)}
                    disabled={packageQuantities[pkg.id] <= 0}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="qty-display">{packageQuantities[pkg.id]}</span>
                  <button 
                    className="qty-btn plus"
                    onClick={() => updatePackageQuantity(pkg.id, 1)}
                    disabled={packageQuantities[pkg.id] >= 5}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Cart & Checkout */}
      <div className="booking-step">
        <div className="step-header">
          <div className="step-number">3</div>
          <h3 className="step-title">Your order</h3>
        </div>
        
        <div className="cart-summary">
          <div className="cart-items">
            <div className="cart-item">
              <span className="cart-item-name">Event tickets × {ticketCount}</span>
              <span className="cart-item-price">${ticketTotal}</span>
            </div>
            
            {hasPackages ? (
              event.packages.map((pkg) => 
                packageQuantities[pkg.id] > 0 && (
                  <div key={pkg.id} className="cart-item">
                    <span className="cart-item-name">{pkg.name} × {packageQuantities[pkg.id]}</span>
                    <span className="cart-item-price">${pkg.price * packageQuantities[pkg.id]}</span>
                  </div>
                )
              )
            ) : (
              <div className="cart-item empty-state">
                <span className="empty-message">No BBQ packages selected</span>
              </div>
            )}
          </div>
          
          <div className="cart-total">
            <div className="total-line">
              <span className="total-label">Event tickets</span>
              <span className="total-amount">${ticketTotal}</span>
            </div>
            {packageTotal > 0 && (
              <div className="total-line">
                <span className="total-label">BBQ packages</span>
                <span className="total-amount">${packageTotal}</span>
              </div>
            )}
            <div className="total-line final">
              <span className="total-label">Total</span>
              <span className="total-amount">${grandTotal}</span>
            </div>
          </div>

          <Link 
            href={`/checkout?eventId=${event.id}&tickets=${ticketCount}&ticketPrice=${event.price}&${Object.entries(packageQuantities).map(([id, qty]) => `${id}=${qty}`).join('&')}`}
            className="checkout-btn"
          >
            <i className="fas fa-credit-card"></i>
            Checkout - ${grandTotal}
          </Link>
          
          <p className="checkout-note">
            <i className="fas fa-shield-alt"></i>
            Secure payment • Instant confirmation • Refundable until 24h before event
          </p>
        </div>
      </div>
    </div>
  )
}