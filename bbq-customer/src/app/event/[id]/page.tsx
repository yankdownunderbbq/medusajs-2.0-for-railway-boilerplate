import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEventById, getEventStatus, formatEventDate } from '@/lib/events'
import { BookingFlow } from '@/components/booking/BookingFlow'

interface EventPageProps {
  params: {
    id: string
  }
}

export default function EventPage({ params }: EventPageProps) {
  const event = getEventById(params.id)
  
  if (!event) {
    notFound()
  }

  const eventStatus = getEventStatus(event)
  const eventDate = new Date(event.date)
  const isEventFull = event.spotsLeft === 0 || event.status === 'sold-out'

  return (
    <div className="min-h-screen">
      {/* Event Hero Section */}
      <section className="event-hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <nav className="breadcrumb">
                <Link href="/">Home</Link>
                <span className="separator">/</span>
                <Link href="/events">Events</Link>
                <span className="separator">/</span>
                <span>{event.title}</span>
              </nav>

              <div className="event-status-bar">
                <div className="status-left">
                  <div className="event-region-badge">
                    <i className="fas fa-map-pin"></i>
                    {event.region} BBQ Style
                  </div>
                  <div className={`event-status-badge ${eventStatus.statusClass}`}>
                    <i className="fas fa-info-circle"></i>
                    {eventStatus.message}
                  </div>
                </div>
              </div>

              <h1 className="event-title">{event.title}</h1>
              
              <div className="event-meta">
                <div className="meta-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span>{formatEventDate(event.date)}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-clock"></i>
                  <span>{event.time} • {event.duration}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{event.venue.name}, {event.venue.location}</span>
                </div>
              </div>

              <div className="event-stats">
                <div className="stat">
                  <span className="stat-number">${event.price}</span>
                  <span className="stat-label">Starting Price</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{event.spotsLeft}</span>
                  <span className="stat-label">Spots Left</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{event.duration}</span>
                  <span className="stat-label">Duration</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{event.packages.length}</span>
                  <span className="stat-label">Add-on Packs</span>
                </div>
              </div>

              <div className="hero-cta-section">
                <p className="cta-price">
                  Experience authentic {event.region} BBQ from ${event.price}
                </p>
                {!isEventFull && (
                  <Link href="#booking" className="hero-cta">
                    <i className="fas fa-calendar-check"></i>
                    Reserve Your Spot
                  </Link>
                )}
                {isEventFull && (
                  <div className="sold-out-notice">
                    <i className="fas fa-exclamation-triangle"></i>
                    This event is sold out
                  </div>
                )}
                <p className="cta-subtext">
                  Free cancellation up to 24 hours before the event
                </p>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-content">
                <div className="visual-icon">
                  <i className="fas fa-fire"></i>
                </div>
                <h3 className="visual-title">Authentic {event.region} BBQ</h3>
                <p className="visual-subtitle">
                  Learn the traditional techniques and taste the distinctive flavors that make {event.region} BBQ legendary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Description */}
      <section className="section-padding bg-warm-white">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">What You'll Experience</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              {event.description}
            </p>
          </div>

          <div className="experience-highlights">
            <div className="highlights-grid">
              {event.highlights.map((highlight, index) => (
                <div key={index} className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <span className="highlight-text">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Event Timeline</h2>
            <p className="section-subtitle">
              Your {event.duration} {event.region} BBQ journey
            </p>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker">
                <i className="fas fa-door-open"></i>
              </div>
              <div className="timeline-content">
                <div className="timeline-time">{event.time}</div>
                <h4 className="timeline-event">Welcome & Introduction</h4>
                <p className="timeline-description">
                  Arrival, check-in, and introduction to {event.region} BBQ history and traditions.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <i className="fas fa-utensils"></i>
              </div>
              <div className="timeline-content">
                <div className="timeline-time">30 mins later</div>
                <h4 className="timeline-event">Tasting Experience</h4>
                <p className="timeline-description">
                  Guided tasting of authentic {event.region} BBQ with explanations of techniques and flavors.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="timeline-content">
                <div className="timeline-time">1 hour later</div>
                <h4 className="timeline-event">Educational Session</h4>
                <p className="timeline-description">
                  Learn about regional techniques, ingredients, and what makes {event.region} BBQ unique.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <div className="timeline-content">
                <div className="timeline-time">Final 30 mins</div>
                <h4 className="timeline-event">Take-Home & Shopping</h4>
                <p className="timeline-description">
                  Browse add-on packages, enjoy store discounts, and take home {event.region} BBQ essentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="whats-included">
        <div className="included-container">
          <div className="section-header">
            <span className="section-badge">Your ${event.price} Gets You</span>
            <h2 className="section-title">What's Included In Your {event.region} Experience</h2>
            <p className="section-subtitle">
              More than just a tasting - it's your gateway to authentic {event.region} BBQ culture
            </p>
          </div>

          <div className="included-grid">
            {/* Main Experience */}
            <div className="included-card featured">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-utensils"></i>
                </div>
                <div className="card-badge">Main Event</div>
              </div>
              <h3 className="card-title">{event.title}</h3>
              <ul className="card-features">
                {event.highlights.slice(0, 4).map((highlight, index) => (
                  <li key={index}><i className="fas fa-check"></i>{highlight}</li>
                ))}
              </ul>
              <div className="card-value">
                <span className="value-label">Standalone Value:</span>
                <span className="value-amount">${event.price + 10}</span>
              </div>
            </div>

            {/* Store Benefits */}
            <div className="included-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-store"></i>
                </div>
                <div className="card-badge">{event.venue.name}</div>
              </div>
              <h3 className="card-title">Exclusive Store Benefits</h3>
              <ul className="card-features">
                <li><i className="fas fa-percentage"></i>15% off all purchases today</li>
                <li><i className="fas fa-tools"></i>Hands-on equipment demos</li>
                <li><i className="fas fa-user-tie"></i>Expert BBQ advice session</li>
                <li><i className="fas fa-gift"></i>Free {event.region} spice blend sample</li>
              </ul>
              <div className="card-value">
                <span className="value-label">Potential Savings:</span>
                <span className="value-amount">$50+</span>
              </div>
            </div>

            {/* Pre-Order Access */}
            <div className="included-card priority">
              <div className="card-header">
                <div className="card-icon priority">
                  <i className="fas fa-crown"></i>
                </div>
                <div className="card-badge priority">Exclusive Access</div>
              </div>
              <h3 className="card-title">Premium Pre-Order Packages</h3>
              <ul className="card-features">
                <li><i className="fas fa-star"></i>First access to take-home {event.region} BBQ</li>
                <li><i className="fas fa-truck"></i>Reserved pickup/delivery slots</li>
                <li><i className="fas fa-tags"></i>Event attendee pricing</li>
                <li><i className="fas fa-clock"></i>Future event priority booking</li>
              </ul>
              <div className="card-value">
                <span className="value-label">Member Benefits:</span>
                <span className="value-amount">Priceless</span>
              </div>
            </div>
          </div>

          {/* Value Summary */}
          <div className="value-summary">
            <div className="summary-content">
              <div className="summary-text">
                <h3 className="summary-title">Total Experience Value</h3>
                <p className="summary-description">
                  You're getting authentic {event.region} BBQ education, exclusive store access, 
                  and premium pre-order privileges - all for less than a typical restaurant meal.
                </p>
              </div>
              <div className="summary-math">
                <div className="math-line">
                  <span className="math-item">{event.region} BBQ Tasting</span>
                  <span className="math-value">${event.price + 10}</span>
                </div>
                <div className="math-line">
                  <span className="math-item">Store Benefits</span>
                  <span className="math-value">$50+</span>
                </div>
                <div className="math-line">
                  <span className="math-item">Exclusive Access</span>
                  <span className="math-value">Priceless</span>
                </div>
                <div className="math-divider"></div>
                <div className="math-line total">
                  <span className="math-item">Your Price</span>
                  <span className="math-value">${event.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="social-proof-mini">
            <div className="proof-stats">
              <div className="proof-stat">
                <span className="proof-number">{47 + event.totalSpots - event.spotsLeft}</span>
                <span className="proof-label">Previous Attendees</span>
              </div>
              <div className="proof-stat">
                <span className="proof-number">4.9★</span>
                <span className="proof-label">Average Rating</span>
              </div>
              <div className="proof-stat">
                <span className="proof-number">89%</span>
                <span className="proof-label">Pre-Order Rate</span>
              </div>
            </div>
            <blockquote className="quick-testimonial">
              "Finally got to taste real {event.region} BBQ! Worth every dollar - 
              and saved $40 on my new smoker with the store discount."
            </blockquote>
            <cite className="testimonial-author">— Sarah M., Previous Attendee</cite>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      {!isEventFull && (
        <section id="booking" className="section-padding bg-bg-secondary">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Reserve Your Spot</h2>
              <p className="section-subtitle">
                Choose your tickets and add-on packages for the ultimate {event.region} BBQ experience
              </p>
            </div>

            <BookingFlow event={event} />
          </div>
        </section>
      )}

      {/* Logistics Section */}
      <section className="section-padding bg-bg-primary">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Event Logistics</span>
            <h2 className="section-title">Logistics</h2>
            <p className="section-subtitle">
              Everything you need to know to attend the event - location, what to bring, and accessibility information.
            </p>
          </div>

          {/* Logistics Grid */}
          <div className="logistics-grid">
            {/* Location Card */}
            <div className="logistics-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3 className="card-title">Location & Parking</h3>
              </div>
              <div className="card-content">
                <div className="location-info">
                  <h4 className="venue-name">{event.venue.name}</h4>
                  <p className="venue-address">
                    {event.venue.address}
                  </p>
                </div>
                <div className="logistics-details">
                  <div className="detail-item">
                    <i className="fas fa-car"></i>
                    <span>Free 2-hour street parking available</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-train"></i>
                    <span>Central Station - 8 min walk</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-bus"></i>
                    <span>Queen St bus stops - 2 min walk</span>
                  </div>
                </div>
                <button className="directions-btn">
                  <i className="fas fa-directions"></i>
                  Get Directions
                </button>
              </div>
            </div>

            {/* What to Bring Card */}
            <div className="logistics-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-backpack"></i>
                </div>
                <h3 className="card-title">What to Bring</h3>
              </div>
              <div className="card-content">
                <div className="bring-list">
                  <div className="bring-item essential">
                    <i className="fas fa-ticket-alt"></i>
                    <div className="bring-text">
                      <span className="bring-title">Your confirmation email</span>
                      <span className="bring-subtitle">Required for check-in</span>
                    </div>
                  </div>
                  <div className="bring-item essential">
                    <i className="fas fa-id-card"></i>
                    <div className="bring-text">
                      <span className="bring-title">Valid ID</span>
                      <span className="bring-subtitle">For age verification</span>
                    </div>
                  </div>
                  <div className="bring-item recommended">
                    <i className="fas fa-wallet"></i>
                    <div className="bring-text">
                      <span className="bring-title">Payment method</span>
                      <span className="bring-subtitle">For pre-orders & store purchases</span>
                    </div>
                  </div>
                  <div className="bring-item recommended">
                    <i className="fas fa-camera"></i>
                    <div className="bring-text">
                      <span className="bring-title">Appetite for learning</span>
                      <span className="bring-subtitle">And some great {event.region} BBQ stories!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dietary & Accessibility Card */}
            <div className="logistics-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="card-title">Dietary & Accessibility</h3>
              </div>
              <div className="card-content">
                <div className="dietary-info">
                  <div className="dietary-item">
                    <div className="dietary-badge available">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="dietary-text">
                      <span className="dietary-title">Gluten-Free Options</span>
                      <span className="dietary-subtitle">{event.region} BBQ without bread available</span>
                    </div>
                  </div>
                  <div className="dietary-item">
                    <div className="dietary-badge limited">
                      <i className="fas fa-exclamation"></i>
                    </div>
                    <div className="dietary-text">
                      <span className="dietary-title">Vegetarian/Vegan</span>
                      <span className="dietary-subtitle">Limited options - contact us first</span>
                    </div>
                  </div>
                  <div className="dietary-item">
                    <div className="dietary-badge available">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="dietary-text">
                      <span className="dietary-title">Wheelchair Accessible</span>
                      <span className="dietary-subtitle">Full accessibility at venue</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-bg-secondary">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about our {event.region} BBQ experience
            </p>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">What's included in the ${event.price} entry fee?</h3>
              <p className="faq-answer">
                Your ticket includes a generous portion of authentic {event.region} BBQ, traditional sides, 
                regional sauces, BBQ education session, 15% store discount, and exclusive access to pre-order packages.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Can I attend if I have dietary restrictions?</h3>
              <p className="faq-answer">
                Yes! We offer gluten-free options ({event.region} BBQ without bread) and the venue is fully wheelchair accessible. 
                For vegetarian/vegan needs, please contact us in advance as options are limited.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Do I need to pre-order BBQ packages?</h3>
              <p className="faq-answer">
                Not at all! Pre-order packages are completely optional. You can simply attend the event for the tasting 
                and education. However, packages are exclusive to event attendees and offer great value.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">What if I need to cancel or reschedule?</h3>
              <p className="faq-answer">
                Event tickets are fully refundable until 24 hours before the event. After that, tickets can be 
                transferred to another person but are non-refundable. Pre-order packages follow the same policy.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Is parking available at the venue?</h3>
              <p className="faq-answer">
                Yes! There's free 2-hour street parking available around {event.venue.name}. The venue is also 
                an 8-minute walk from Central Station and 2 minutes from Queen St bus stops.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Can I bring children to the event?</h3>
              <p className="faq-answer">
                Children are welcome! Kids under 12 get 50% off entry. We recommend the event for ages 8+ as it's 
                educational and runs for {event.duration}. Children must be supervised at all times.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">What makes this different from other BBQ events?</h3>
              <p className="faq-answer">
                This is focused specifically on {event.region}'s unique BBQ style and techniques. 
                You'll learn the history, taste authentic preparations, and get exclusive access to take-home packages.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">How do I know if my booking is confirmed?</h3>
              <p className="faq-answer">
                You'll receive an instant confirmation email with your QR code after booking. This QR code is required 
                for check-in. If you don't receive it within 5 minutes, check your spam folder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Information */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Event Location</h2>
          </div>

          <div className="venue-info">
            <div className="venue-details">
              <h3 className="venue-name">{event.venue.name}</h3>
              <p className="venue-address">
                <i className="fas fa-map-marker-alt"></i>
                {event.venue.address}
              </p>
              <div className="venue-features">
                <div className="venue-feature">
                  <i className="fas fa-parking"></i>
                  <span>Free parking available</span>
                </div>
                <div className="venue-feature">
                  <i className="fas fa-universal-access"></i>
                  <span>Wheelchair accessible</span>
                </div>
                <div className="venue-feature">
                  <i className="fas fa-utensils"></i>
                  <span>Full BBQ equipment on-site</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-warm-white">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Details */}
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3 className="contact-title">Have Questions?</h3>
              <p className="contact-description">
                Our team is here to help with any questions about this {event.region} BBQ experience.
              </p>
              <a href="mailto:hello@yankdownunder.com" className="contact-link">
                <i className="fas fa-envelope"></i>
                hello@yankdownunder.com
              </a>
            </div>

            {/* Emergency Contact */}
            <div className="emergency-contact">
              <div className="emergency-header">
                <i className="fas fa-phone-alt"></i>
                <h3>Event Day Contact</h3>
              </div>
              <a href="tel:+61412345678" className="emergency-phone">
                <i className="fas fa-phone"></i>
                +61 412 345 678
              </a>
              <p className="emergency-note">
                Available on event day for urgent matters only
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}