'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import "../booking.css"

interface PaymentSuccessData {
  booking: {
    id: string
    customer_name: string
    customer_email: string
    number_of_guests: number
    package_type: string
    total_amount: number
    bbq_event_id: string
  }
  payment: {
    id: string
    status: string
    amount: number
  }
  timestamp: number
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null)

  useEffect(() => {
    const storedPayment = localStorage.getItem('paymentSuccess')
    if (storedPayment) {
      try {
        const data = JSON.parse(storedPayment)
        setPaymentData(data)
        // Clear the stored data after retrieving it
        localStorage.removeItem('paymentSuccess')
      } catch (error) {
        console.error('Failed to parse payment data:', error)
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [router])

  if (!paymentData) {
    return (
      <div className="booking-loading">
        <div className="loading-spinner"></div>
        <p>Loading payment confirmation...</p>
      </div>
    )
  }

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`
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
          <h1>Payment Successful!</h1>
          <p>Your BBQ experience is confirmed, {paymentData.booking.customer_name}!</p>
        </div>

        <div className="confirmation-details">
          <h2>Booking & Payment Details</h2>
          
          <div className="detail-section">
            <div className="detail-row">
              <span className="label">Booking ID:</span>
              <span className="value">{paymentData.booking.id}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Payment ID:</span>
              <span className="value">{paymentData.payment.id}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{paymentData.booking.customer_email}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Number of Guests:</span>
              <span className="value">{paymentData.booking.number_of_guests}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Package:</span>
              <span className="value">{getPackageName(paymentData.booking.package_type)}</span>
            </div>
            
            <div className="detail-row total">
              <span className="label">Amount Paid:</span>
              <span className="value">{formatPrice(paymentData.payment.amount)}</span>
            </div>

            <div className="payment-status">
              <i className="fas fa-check-circle"></i>
              <span>Payment Status: Completed</span>
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
                <h3>Confirmation Email Sent</h3>
                <p>We've sent your booking confirmation and receipt to {paymentData.booking.customer_email} with your QR code for check-in.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="step-content">
                <h3>Event Reminder</h3>
                <p>You'll receive event details and reminders closer to the date. Make sure to save the date in your calendar!</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <div className="step-content">
                <h3>Get Ready for Amazing BBQ</h3>
                <p>Bring your appetite and get ready to experience authentic regional BBQ like you've never had before!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button 
            onClick={() => router.push('/')}
            className="home-button"
          >
            <i className="fas fa-home"></i>
            Back to Events
          </button>
        </div>

        <div className="support-info">
          <p>
            <strong>Need to make changes?</strong> You can manage your booking using the link in your confirmation email, 
            or contact us if you have any questions.
          </p>
          <p>
            <strong>Questions?</strong> Email us at hello@yankdownunder.com
          </p>
        </div>
      </div>
    </div>
  )
}