import { Hero } from "@/components/sections/Hero"
import { NextEvent } from "@/components/sections/NextEvent"
import { FeaturedBBQ } from "@/components/sections/FeaturedBBQ"
import { Story } from "@/components/sections/Story"
import { SocialProof } from "@/components/sections/SocialProof"
import { getUpcomingEvents } from "@/lib/events"

export default function Home() {
  // Get upcoming events data
  const upcomingEvents = getUpcomingEvents()
  const hasEvents = upcomingEvents.length > 0

  return (
    <>
      <Hero hasCurrentEvent={hasEvents} />
      <div id="events">
        <NextEvent events={upcomingEvents} />
      </div>
      <div id="menu">
        <FeaturedBBQ />
      </div>
      <div id="story">
        <Story />
      </div>
      <div id="contact">
        <SocialProof />
      </div>
    </>
  )
}
