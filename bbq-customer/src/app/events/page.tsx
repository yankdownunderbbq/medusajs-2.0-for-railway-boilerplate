import Link from 'next/link'
import { getActiveEvents, getEventStatus, formatEventDate } from '@/lib/events'

export default function EventsPage() {
  // Get all active events
  const allEvents = getActiveEvents()
  const hasEvents = allEvents.length > 0

  return (
    <div className="min-h-screen pt-32 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <nav className="breadcrumb justify-center mb-6">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span>Events</span>
          </nav>
          <h1 className="section-title text-text-primary mb-4">BBQ Events & Experiences</h1>
          <p className="section-subtitle text-text-secondary max-w-3xl mx-auto">
            Discover authentic American BBQ through our educational popup events. 
            Each experience focuses on a specific regional style, teaching you the history, 
            techniques, and flavors that make American BBQ culture so diverse.
          </p>
        </div>

        {hasEvents ? (
          <>
            {/* Current/Upcoming Events */}
            <section className="mb-16">
              <h2 className="section-card-title mb-8">
                <i className="fas fa-fire"></i>
                Upcoming Events
              </h2>
              
              <div className="events-grid">
                {allEvents.map((event) => {
                  const status = getEventStatus(event)
                  return (
                    <div key={event.id} className="event-card">
                      <div className="event-card-header">
                        <div className={`event-badge ${status.statusClass}`}>
                          <i className="fas fa-fire"></i>
                          {status.status}
                        </div>
                        <div className="event-date">
                          {formatEventDate(event.date)}
                        </div>
                      </div>
                      
                      <div className="event-card-content">
                        <div className="event-region-tag">
                          <i className="fas fa-map-pin"></i>
                          {event.region} Style
                        </div>
                        <h3 className="event-card-title">
                          {event.title}
                        </h3>
                        <p className="event-card-description">
                          {event.description}
                        </p>
                        
                        <div className="event-details">
                          <div className="event-detail">
                            <i className="fas fa-clock"></i>
                            <span>{event.time} • {event.duration}</span>
                          </div>
                          <div className="event-detail">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{event.venue.name}, {event.venue.location}</span>
                          </div>
                          <div className="event-detail">
                            <i className="fas fa-users"></i>
                            <span>Limited to {event.totalSpots} attendees</span>
                          </div>
                        </div>
                        
                        <div className="event-highlights">
                          {event.highlights.map((highlight, index) => (
                            <span key={index} className="highlight">{highlight}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="event-card-footer">
                        <div className="event-price">
                          <span className="price-label">From</span>
                          <span className="price-amount">${event.price}</span>
                        </div>
                        <Link href={`/event/${event.id}`} className="event-cta">
                          <i className="fas fa-calendar-check"></i>
                          Reserve Spot
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Future Events Preview */}
            <section className="mb-16">
              <h2 className="section-card-title mb-8">
                <i className="fas fa-calendar-alt"></i>
                Coming Soon
              </h2>
              
              <div className="future-events">
                <div className="future-event-card">
                  <div className="future-event-icon">
                    <i className="fas fa-pig"></i>
                  </div>
                  <div className="future-event-content">
                    <h3 className="future-event-title">Carolina Whole-Hog Experience</h3>
                    <p className="future-event-description">
                      Explore the vinegar-based sauces and whole-hog traditions of the Carolina BBQ style.
                    </p>
                    <span className="future-event-date">Early 2025</span>
                  </div>
                </div>
                
                <div className="future-event-card">
                  <div className="future-event-icon">
                    <i className="fas fa-drumstick-bite"></i>
                  </div>
                  <div className="future-event-content">
                    <h3 className="future-event-title">Memphis Dry Rub Ribs</h3>
                    <p className="future-event-description">
                      Master the art of Memphis-style dry rubs and learn why sauce is optional in Memphis BBQ.
                    </p>
                    <span className="future-event-date">Spring 2025</span>
                  </div>
                </div>
                
                <div className="future-event-card">
                  <div className="future-event-icon">
                    <i className="fas fa-fire-flame-curved"></i>
                  </div>
                  <div className="future-event-content">
                    <h3 className="future-event-title">Texas Brisket Masterclass</h3>
                    <p className="future-event-description">
                      The holy grail of BBQ - learn the techniques behind perfect Texas-style brisket.
                    </p>
                    <span className="future-event-date">Summer 2025</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="no-events">
            <div className="no-events-icon">
              <i className="fas fa-calendar-times"></i>
            </div>
            <h2 className="no-events-title">No Events Currently Scheduled</h2>
            <p className="no-events-description">
              We're planning our next regional BBQ experiences. Sign up for notifications 
              to be the first to know when tickets go live.
            </p>
            <div className="no-events-actions">
              <Link href="/#contact" className="btn-primary">
                <i className="fas fa-envelope"></i>
                Get Notified
              </Link>
              <Link href="/#story" className="btn-secondary">
                <i className="fas fa-book"></i>
                Learn About BBQ Regions
              </Link>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <section className="events-newsletter">
          <div className="newsletter-card">
            <div className="newsletter-content">
              <h3 className="newsletter-title">
                <i className="fas fa-bell"></i>
                Never Miss a BBQ Event
              </h3>
              <p className="newsletter-description">
                Be the first to know about new regional BBQ experiences, early bird tickets, 
                and exclusive BBQ education content.
              </p>
            </div>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                <i className="fas fa-paper-plane"></i>
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}