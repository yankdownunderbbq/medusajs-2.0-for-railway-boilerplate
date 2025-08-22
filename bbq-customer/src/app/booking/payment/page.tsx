'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PaymentForm } from '@/components/booking/PaymentForm'
import "../booking.css"

interface BookingData {
  id: string
  customer_name: string
  customer_email: string
  number_of_guests: number
  package_type: string
  total_amount: number
  bbq_event_id: string
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  useEffect(() => {
    // Get booking data from URL params or localStorage
    const bookingId = searchParams.get('booking_id')
    const storedBooking = localStorage.getItem('pendingBooking')
    
    if (bookingId && storedBooking) {
      try {
        const data = JSON.parse(storedBooking)
        if (data.booking && data.booking.id === bookingId) {
          setBookingData(data.booking)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Failed to parse booking data:', error)
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [searchParams, router])

  const handlePaymentSuccess = async (paymentIntent: any) => {
    // Store payment success info
    localStorage.setItem('paymentSuccess', JSON.stringify({
      booking: bookingData,
      payment: paymentIntent,
      timestamp: Date.now()
    }))

    // Clear pending booking
    localStorage.removeItem('pendingBooking')

    // Redirect to success page
    router.push('/booking/success')
  }

  const handlePaymentError = (error: string) => {
    setPaymentError(error)
  }

  if (!bookingData) {
    return (
      <div className="booking-loading">
        <div className="loading-spinner"></div>
        <p>Loading payment details...</p>
      </div>
    )
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
      <div className="payment-container">
        <div className="payment-page-header">
          <button onClick={() => router.back()} className="back-link">
            ← Back to Booking
          </button>
        </div>

        <div className="payment-layout">
          {/* Booking Summary */}
          <div className="booking-summary-card">
            <h2>Booking Summary</h2>
            
            <div className="summary-section">
              <h3>Event Details</h3>
              <div className="summary-item">
                <span>Event ID:</span>
                <span>{bookingData.bbq_event_id}</span>
              </div>
              <div className="summary-item">
                <span>Guests:</span>
                <span>{bookingData.number_of_guests}</span>
              </div>
              <div className="summary-item">
                <span>Package:</span>
                <span>{getPackageName(bookingData.package_type)}</span>
              </div>
            </div>

            <div className="summary-section">
              <h3>Customer Information</h3>
              <div className="summary-item">
                <span>Name:</span>
                <span>{bookingData.customer_name}</span>
              </div>
              <div className="summary-item">
                <span>Email:</span>
                <span>{bookingData.customer_email}</span>
              </div>
            </div>

            <div className="summary-total">
              <div className="total-row">
                <span>Total Amount:</span>
                <span>${bookingData.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="security-notice">
              <i className="fas fa-shield-alt"></i>
              <div>
                <h4>Secure Payment</h4>
                <p>Your payment is protected by 256-bit SSL encryption and processed securely through Stripe.</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-form-card">
            {paymentError && (
              <div className="payment-error-message">
                <i className="fas fa-exclamation-triangle"></i>
                <span>{paymentError}</span>
              </div>
            )}

            <PaymentForm
              bookingId={bookingData.id}
              amount={bookingData.total_amount}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        </div>
      </div>
    </div>
  )
}