'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBBQEvent } from '@/lib/hooks/useBBQEvents'
import { BookingForm, BookingFormData } from '@/components/booking/BookingForm'
import "../../booking.css"

interface BookingPageProps {
  params: {
    eventId: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  const { eventId } = params
  const router = useRouter()
  const { event, loading, error } = useBBQEvent(eventId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    setIsSubmitting(true)
    setBookingError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/bbq-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
        },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create booking')
      }

      const result = await response.json()
      
      // Store booking info in localStorage for the confirmation page
      localStorage.setItem('pendingBooking', JSON.stringify({
        booking: result.booking,
        managementUrl: result.management_url
      }))

      // Redirect to payment page
      router.push(`/booking/payment?booking_id=${result.booking.id}`)

    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="booking-loading">
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="booking-error">
        <h1>Event Not Found</h1>
        <p>{error || 'The requested event could not be found.'}</p>
        <button onClick={() => router.push('/')} className="back-button">
          Return to Events
        </button>
      </div>
    )
  }

  // Check if event is available for booking
  const isEventFull = event.current_bookings >= event.max_capacity
  const isEventInPast = new Date(event.event_date) < new Date()

  if (isEventFull || isEventInPast) {
    return (
      <div className="booking-unavailable">
        <h1>Booking Unavailable</h1>
        <p>
          {isEventFull 
            ? 'This event is fully booked.' 
            : 'This event has already passed.'
          }
        </p>
        <button onClick={() => router.push('/')} className="back-button">
          View Other Events
        </button>
      </div>
    )
  }

  return (
    <div className="booking-page">
      <div className="booking-page-header">
        <button onClick={() => router.back()} className="back-link">
          ← Back to Event Details
        </button>
      </div>

      <div className="event-summary">
        <h1>{event.title}</h1>
        <div className="event-details">
          <div className="detail-item">
            <i className="fas fa-calendar"></i>
            <span>{new Date(event.event_date).toLocaleDateString('en-AU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-clock"></i>
            <span>{new Date(event.event_date).toLocaleTimeString('en-AU', {
              hour: '2-digit',
              minute: '2-digit'
            })} ({event.duration_hours} hours)</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{event.location}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-users"></i>
            <span>{event.max_capacity - event.current_bookings} spots remaining</span>
          </div>
        </div>
      </div>

      {bookingError && (
        <div className="booking-error-message">
          <p>{bookingError}</p>
        </div>
      )}

      <BookingForm 
        event={event}
        onSubmit={handleBookingSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}