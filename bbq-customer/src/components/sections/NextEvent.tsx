import Link from 'next/link'
import { EventData, getEventStatus, formatEventDate } from '@/lib/events'

interface NextEventProps {
  events?: EventData[]
}

export function NextEvent({ events = [] }: NextEventProps) {
  // If no events, don't render the section
  if (!events || events.length === 0) {
    return null
  }

  const nextEvent = events[0]
  const hasMultipleEvents = events.length > 1

  const eventStatus = getEventStatus(nextEvent)

  return (
    <section className="next-event" id="events">
      <div className="next-event-container">
        <div className="section-header">
          <span className="section-badge">
            {hasMultipleEvents ? 'Upcoming Events' : 'Next Popup Event'}
          </span>
          <h2 className="section-title">
            {hasMultipleEvents ? 'Regional BBQ Experiences' : nextEvent.title}
          </h2>
          <p className="section-subtitle">
            {hasMultipleEvents 
              ? `${events.length} upcoming regional BBQ experiences. Each event focuses on a specific American BBQ style with authentic flavors and educational content.`
              : `Partner event at ${nextEvent.venue.name}. Featured dish + exclusive pre-order packages + store discounts.`
            }
          </p>
        </div>

        {hasMultipleEvents ? (
          // Multiple events grid layout
          <div className="events-grid-home">
            {events.slice(0, 3).map((event) => {
              const status = getEventStatus(event)
              return (
                <div key={event.id} className="event-card-home">
                  <div className="event-header-home">
                    <div className="event-region">{event.region}</div>
                    <div className={`event-status-home ${status.statusClass}`}>
                      {status.status}
                    </div>
                  </div>
                  
                  <h3 className="event-title-home">{event.title}</h3>
                  
                  <div className="event-date-time">
                    <div className="event-date-home">
                      {formatEventDate(event.date)}
                    </div>
                    <div className="event-time-home">
                      {event.time} • {event.duration}
                    </div>
                  </div>
                  
                  <p className="event-description-home">
                    {event.description.substring(0, 120)}...
                  </p>

                  <div className="event-highlights-home">
                    {event.highlights.slice(0, 3).map((highlight, index) => (
                      <span key={index} className="highlight-tag">
                        {highlight}
                      </span>
                    ))}
                  </div>
                  
                  <div className="event-footer-home">
                    <div className="event-price-home">
                      <span className="price-label">From</span>
                      <span className="price-amount">${event.price}</span>
                    </div>
                    <Link href={`/event/${event.id}`} className="event-cta-home">
                      <i className="fas fa-calendar-check"></i>
                      Reserve Spot
                    </Link>
                  </div>
                </div>
              )
            })}
            
            {events.length > 3 && (
              <div className="view-all-card">
                <div className="view-all-content">
                  <h3 className="view-all-title">
                    View All Events
                  </h3>
                  <p className="view-all-description">
                    Discover all {events.length} upcoming BBQ experiences and find your perfect regional style.
                  </p>
                  <Link href="/events" className="view-all-cta">
                    <i className="fas fa-arrow-right"></i>
                    See All Events
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Single event layout (original)
          <div className="event-card">
            <div className="event-header">
              <div>
                <div className="event-date">{formatEventDate(nextEvent.date)}</div>
                <div className="event-time">{nextEvent.time} • {nextEvent.duration}</div>
              </div>
              <div className={`event-status ${eventStatus.statusClass}`}>
                {eventStatus.message}
              </div>
            </div>
            
            <h3 className="event-title">{nextEvent.title}</h3>
            
            <p className="event-description">
              {nextEvent.description}
            </p>
            
            <Link href={`/event/${nextEvent.id}`} className="event-cta">
              Reserve Your Spot - ${nextEvent.price}
            </Link>
          </div>
        )}

        {hasMultipleEvents && events.length <= 3 && (
          <div className="events-footer">
            <Link href="/events" className="events-footer-cta">
              <i className="fas fa-calendar-alt"></i>
              View Full Event Calendar
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}