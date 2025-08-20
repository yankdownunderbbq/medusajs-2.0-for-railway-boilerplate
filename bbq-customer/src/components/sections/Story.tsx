import Link from 'next/link'

export function Story() {
  return (
    <section className="story" id="story">
      <div className="story-container">
        <div className="story-content">
          <h2>Why I&apos;m Bringing Regional American BBQ to Australia</h2>
          <p>
            Here&apos;s what drives me crazy about BBQ in Australia - everyone thinks American BBQ is just one thing. 
            But I&apos;ve spent 20+ years learning that Kansas City does burnt ends completely different than Texas brisket. 
            Carolina whole-hog is nothing like Memphis ribs.
          </p>
          <p>
            I want you to experience what real American BBQ diversity tastes like. Each region has its own techniques, 
            rubs, sauces, and traditions. That&apos;s the beauty of American BBQ culture - and that&apos;s what I&apos;m bringing to Australia.
          </p>
          <Link href="#" className="story-cta">
            Learn About BBQ Regions
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="story-image"></div>
      </div>
    </section>
  )
}