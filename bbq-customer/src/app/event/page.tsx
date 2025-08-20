import { redirect } from 'next/navigation'
import { getUpcomingEvents } from '@/lib/events'

export default function EventPage() {
  // Redirect to the first available event or events page
  const upcomingEvents = getUpcomingEvents()
  
  if (upcomingEvents.length > 0) {
    redirect(`/event/${upcomingEvents[0].id}`)
  } else {
    redirect('/events')
  }
}