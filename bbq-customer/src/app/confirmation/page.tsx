'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const [bookingDetails, setBookingDetails] = useState<{
    firstName: string
    lastName: string
    email: string
    total: string
    tickets: string
    bookingId: string
  } | null>(null)

  useEffect(() => {
    const firstName = searchParams.get('firstName') || ''
    const lastName = searchParams.get('lastName') || ''
    const email = searchParams.get('email') || ''
    const total = searchParams.get('total') || '0'
    const tickets = searchParams.get('tickets') || '0'
    
    // Generate a mock booking ID
    const bookingId = 'BBQ' + Date.now().toString().slice(-6)

    setBookingDetails({
      firstName,
      lastName,
      email,
      total,
      tickets,
      bookingId
    })
  }, [searchParams])

  if (!bookingDetails) {
    return (
      <div className="min-h-screen pt-32 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-copper mx-auto mb-4"></div>
          <p>Loading your confirmation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 px-4 bg-bg-secondary">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="confirmation-header text-center mb-12">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1 className="confirmation-title">Booking Confirmed!</h1>
          <p className="confirmation-subtitle">
            You're all set for the Kansas City BBQ experience, {bookingDetails.firstName}!
          </p>
        </div>

        {/* Confirmation Details */}
        <div className="confirmation-content">
          <div className="section-card">
            <div className="confirmation-summary">
              <h2 className="section-card-title">
                <i className="fas fa-calendar-check"></i>
                Your Booking Details
              </h2>
              
              <div className="booking-info-grid">
                <div className="booking-info-item">
                  <span className="info-label">Booking ID</span>
                  <span className="info-value">{bookingDetails.bookingId}</span>
                </div>
                <div className="booking-info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{bookingDetails.firstName} {bookingDetails.lastName}</span>
                </div>
                <div className="booking-info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{bookingDetails.email}</span>
                </div>
                <div className="booking-info-item">
                  <span className="info-label">Tickets</span>
                  <span className="info-value">{bookingDetails.tickets} attendees</span>
                </div>
                <div className="booking-info-item">
                  <span className="info-label">Total Paid</span>
                  <span className="info-value total">${bookingDetails.total}</span>
                </div>
              </div>
            </div>

            {/* Event Details Reminder */}
            <div className="event-reminder">
              <h3 className="reminder-title">
                <i className="fas fa-fire"></i>
                Kansas City Burnt Ends Experience
              </h3>
              <div className="reminder-details">
                <div className="reminder-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span>December 14, 2024 • 11:00 AM - 3:00 PM</span>
                </div>
                <div className="reminder-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>BBQ Galore Brisbane, 123 Queen Street, Brisbane CBD</span>
                </div>
                <div className="reminder-item">
                  <i className="fas fa-ticket-alt"></i>
                  <span>Check-in starts at 10:45 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            <div className="section-card">
              <h2 className="section-card-title">
                <i className="fas fa-list-check"></i>
                What Happens Next?
              </h2>
              
              <div className="steps-list">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3 className="step-title">Check Your Email</h3>
                    <p className="step-description">
                      Your confirmation email with QR code is on its way to {bookingDetails.email}. 
                      Check spam if you don't see it within 5 minutes.
                    </p>
                  </div>
                </div>
                
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3 className="step-title">Save the Date</h3>
                    <p className="step-description">
                      December 14th at 11:00 AM. Arrive 15 minutes early for smooth check-in. 
                      Bring your QR code and valid ID.
                    </p>
                  </div>
                </div>
                
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3 className="step-title">Get Ready to Learn & Taste</h3>
                    <p className="step-description">
                      Come hungry and curious! You'll discover why Kansas City burnt ends are 
                      called "BBQ candy" and get exclusive pre-order access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="confirmation-actions">
            <Link href="/" className="btn-secondary">
              <i className="fas fa-home"></i>
              Back to Home
            </Link>
            <button 
              onClick={() => window.print()} 
              className="btn-secondary"
            >
              <i className="fas fa-print"></i>
              Print Confirmation
            </button>
            <Link href="/event" className="btn-primary">
              <i className="fas fa-utensils"></i>
              View Event Details
            </Link>
          </div>

          {/* Contact Information */}
          <div className="confirmation-contact">
            <div className="contact-info">
              <h3>Need Help?</h3>
              <p>
                Questions about your booking or the event? Contact us at{' '}
                <a href="mailto:bookings@yankdownunder.com.au" className="link">
                  bookings@yankdownunder.com.au
                </a>{' '}
                or call <a href="tel:+61412345679" className="link">(04) 1234 5679</a>
              </p>
            </div>
            
            <div className="social-reminder">
              <h3>Follow Our Journey</h3>
              <div className="social-links">
                <a href="#" className="social-link">
                  <i className="fab fa-instagram"></i>
                  @yankdownunderbbq
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-facebook"></i>
                  Yank Downunder BBQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfirmationPageFallback() {
  return (
    <div className="min-h-screen pt-32 px-4 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-copper mx-auto mb-4"></div>
        <p>Loading confirmation page...</p>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationPageFallback />}>
      <ConfirmationContent />
    </Suspense>
  )
}