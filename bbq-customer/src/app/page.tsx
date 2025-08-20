import { Hero } from "@/components/sections/Hero"
import { BBQEventsSection } from "@/components/sections/BBQEventsSection"
import { FeaturedBBQ } from "@/components/sections/FeaturedBBQ"
import { Story } from "@/components/sections/Story"
import { SocialProof } from "@/components/sections/SocialProof"
import "./home-page.css"

export default function Home() {
  return (
    <>
      <Hero hasCurrentEvent={true} />
      <div id="events">
        <BBQEventsSection />
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
