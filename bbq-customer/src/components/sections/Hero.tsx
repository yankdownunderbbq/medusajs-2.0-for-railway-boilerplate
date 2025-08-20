import Link from 'next/link'

interface HeroProps {
  hasCurrentEvent?: boolean
}

export function Hero({ hasCurrentEvent = true }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">Real American BBQ Regions</span>
          <h1 className="hero-title">
            American BBQ<br/>
            <span className="accent">Like You&apos;ve Never</span><br/>
            <span className="accent">Experienced</span>
          </h1>
          <p className="hero-subtitle">
            I&apos;m bringing you the distinct regional BBQ styles that make America&apos;s BBQ culture so incredible. 
            Kansas City burnt ends, Carolina pulled pork, Alabama white sauce, Memphis dry rubs - experience them all.
          </p>
          {hasCurrentEvent ? (
            <Link href="/event" className="hero-cta">
              <i className="fas fa-utensils"></i>
              Reserve Your Spot
            </Link>
          ) : (
            <div className="text-center">
              <p className="text-text-secondary mb-4">No events currently scheduled</p>
              <Link href="#story" className="hero-cta">
                <i className="fas fa-book"></i>
                Learn About BBQ Regions
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}