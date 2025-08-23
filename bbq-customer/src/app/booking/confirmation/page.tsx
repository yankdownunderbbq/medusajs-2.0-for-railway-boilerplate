'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookingData {
  booking: {
    id: string
    customer_name: string
    customer_email: string
    number_of_guests: number
    package_type: string
    total_amount: number
    status: string
    bbq_event_id: string
  }
  managementUrl: string
}

export default function BookingConfirmationPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)

  useEffect(() => {
    const storedBooking = localStorage.getItem('pendingBooking')
    if (storedBooking) {
      try {
        const data = JSON.parse(storedBooking)
        setBookingData(data)
        // Clear the stored data after retrieving it
        localStorage.removeItem('pendingBooking')
      } catch (error) {
        console.error('Failed to parse booking data:', error)
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [router])

  if (!bookingData) {
    return (
      <div className="booking-loading">
        <div className="loading-spinner"></div>
        <p>Loading booking confirmation...</p>
      </div>
    )
  }

  const formatPrice = (priceInCents: number) => {
    return `$${priceInCents.toFixed(2)}`
  }

  const getPackageName = (packageType: string) => {
    const packageNames = {
      standard: 'Standard Experience',
      premium: 'Premium Experience',
      family: 'Family Package'
    }
    return packageNames[packageType as keyof typeof packageNames] || 'Standard Experience'
  }

  return (
    <div className="booking-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Thank you for your reservation, {bookingData.booking.customer_name}!</p>
        </div>

        <div className="confirmation-details">
          <h2>Booking Details</h2>
          
          <div className="detail-section">
            <div className="detail-row">
              <span className="label">Booking ID:</span>
              <span className="value">{bookingData.booking.id}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{bookingData.booking.customer_email}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Number of Guests:</span>
              <span className="value">{bookingData.booking.number_of_guests}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Package:</span>
              <span className="value">{getPackageName(bookingData.booking.package_type)}</span>
            </div>
            
            <div className="detail-row total">
              <span className="label">Total Amount:</span>
              <span className="value">{formatPrice(bookingData.booking.total_amount)}</span>
            </div>
          </div>
        </div>

        <div className="next-steps">
          <h2>What's Next?</h2>
          
          <div className="steps-list">
            <div className="step">
              <div className="step-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="step-content">
                <h3>Check Your Email</h3>
                <p>We've sent a confirmation email to {bookingData.booking.customer_email} with your booking details and payment instructions.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <div className="step-content">
                <h3>Complete Payment</h3>
                <p>Follow the payment link in your email to secure your spot. Your booking will be confirmed once payment is received.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <div className="step-content">
                <h3>Enjoy the Experience</h3>
                <p>We'll send you event details and location information closer to the date. Get ready for an amazing BBQ experience!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button 
            onClick={() => window.open(bookingData.managementUrl, '_blank')}
            className="manage-button"
          >
            Manage Your Booking
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="home-button"
          >
            Back to Events
          </button>
        </div>

        <div className="support-info">
          <p>
            <strong>Need help?</strong> You can manage your booking using the link we've emailed you, 
            or contact us if you have any questions.
          </p>
        </div>
      </div>
    </div>
  )
}