'use client'

import Link from 'next/link'
import { useBBQEvents } from '@/lib/hooks/useBBQEvents'

export function BBQEventsSection() {
  const { events, loading, error } = useBBQEvents()
  if (loading) {
    return (
      <section className="next-event" id="events">
        <div className="next-event-container">
          <div className="section-header">
            <span className="section-badge">Loading Events...</span>
            <h2 className="section-title">Regional BBQ Experiences</h2>
          </div>
          <div className="events-loading">
            <div className="loading-spinner"></div>
            <p>Loading upcoming BBQ events...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="next-event" id="events">
        <div className="next-event-container">
          <div className="section-header">
            <span className="section-badge">Error</span>
            <h2 className="section-title">Unable to Load Events</h2>
            <p className="section-subtitle">
              {error}. Please try again later.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (!events || events.length === 0) {
    return (
      <section className="next-event" id="events">
        <div className="next-event-container">
          <div className="section-header">
            <span className="section-badge">No Events</span>
            <h2 className="section-title">No Upcoming Events</h2>
            <p className="section-subtitle">
              Check back soon for upcoming BBQ experiences.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(0)
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatEventTime = (dateString: string, duration: number) => {
    const date = new Date(dateString)
    const time = date.toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit'
    })
    return `${time} • ${duration} hours`
  }

  return (
    <section className="next-event" id="events">
      <div className="next-event-container">
        <div className="section-header">
          <span className="section-badge">Upcoming Events</span>
          <h2 className="section-title">Regional BBQ Experiences</h2>
          <p className="section-subtitle">
            {events.length} upcoming regional BBQ experiences. Each event focuses on a specific American BBQ style with authentic flavors and educational content.
          </p>
        </div>

        <div className="events-grid-home">
          {events.map((event) => {
            const isUpcoming = new Date(event.event_date) > new Date()
            const spotsRemaining = event.max_capacity - event.current_bookings
            
            return (
              <div key={event.id} className="event-card-home">
                <div className="event-header-home">
                  <div className="event-region">{event.bbq_region}</div>
                  <div className={`event-status-home ${isUpcoming ? 'upcoming' : 'past'}`}>
                    {isUpcoming ? `${spotsRemaining} spots left` : 'Past Event'}
                  </div>
                </div>
                
                <h3 className="event-title-home">{event.title}</h3>
                
                <div className="event-date-time">
                  <div className="event-date-home">
                    {formatEventDate(event.event_date)}
                  </div>
                  <div className="event-time-home">
                    {formatEventTime(event.event_date, event.duration_hours)}
                  </div>
                </div>
                
                <p className="event-description-home">
                  {event.description.substring(0, 120)}...
                </p>

                <div className="event-highlights-home">
                  <span className="highlight-tag">{event.bbq_region} Style</span>
                  <span className="highlight-tag">{event.duration_hours}hr Experience</span>
                  <span className="highlight-tag">All Inclusive</span>
                </div>
                
                <div className="event-footer-home">
                  <div className="event-price-home">
                    <span className="price-label">From</span>
                    <span className="price-amount">${formatPrice(event.base_price)}</span>
                  </div>
                  {isUpcoming ? (
                    <Link href={`/event/${event.id}`} className="event-cta-home">
                      <i className="fas fa-calendar-check"></i>
                      View Details
                    </Link>
                  ) : (
                    <div className="event-cta-home disabled">
                      <i className="fas fa-clock"></i>
                      Past Event
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="events-footer">
          <p className="events-footer-text">
            Each event includes all food, drinks, educational content, and take-home items. 
            Package upgrades available during booking.
          </p>
        </div>
      </div>
    </section>
  )
}