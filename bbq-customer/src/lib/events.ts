// Event data types and mock data for the application

export interface EventData {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: string
  spotsLeft: number
  totalSpots: number
  price: number
  status: 'active' | 'draft' | 'sold-out' | 'cancelled'
  venue: {
    name: string
    location: string
    address: string
  }
  packages: EventPackage[]
  highlights: string[]
  region: string
  featuredImage?: string
}

export interface EventPackage {
  id: string
  name: string
  price: number
  description: string
  includes: string[]
}

// Mock events data - in a real app this would come from a database/API
export const mockEvents: EventData[] = [
  {
    id: 'event-001',
    title: 'Kansas City Burnt Ends Experience',
    description: 'Discover why burnt ends are called "BBQ candy" in this educational tasting experience. Learn the history of Kansas City BBQ while enjoying authentic burnt ends with traditional sides.',
    date: '2025-09-15',
    time: '11:00 AM',
    duration: '4 hours',
    spotsLeft: 12,
    totalSpots: 30,
    price: 25,
    status: 'active',
    venue: {
      name: 'BBQ Galore Brisbane',
      location: 'Brisbane CBD',
      address: '123 BBQ Street, Brisbane QLD 4000'
    },
    packages: [
      {
        id: 'pkg-001',
        name: 'Starter Pack',
        price: 15,
        description: '2 extra burnt ends samples',
        includes: ['Extra burnt ends portion', 'KC sauce taster', 'Recipe card']
      },
      {
        id: 'pkg-002',
        name: 'Master Pack',
        price: 25,
        description: 'BBQ rub kit + recipe cards',
        includes: ['Premium BBQ rub kit', 'Recipe collection', 'BBQ tools', '15% store discount']
      },
      {
        id: 'pkg-003',
        name: 'Regional Combo',
        price: 35,
        description: 'All packages + KC sauce set',
        includes: ['Everything from other packs', 'Kansas City sauce collection', 'BBQ apron', 'VIP seating']
      }
    ],
    highlights: ['Burnt ends tasting', 'BBQ education', '15% store discount', 'Take-home packages'],
    region: 'Kansas City'
  },
  {
    id: 'event-002',
    title: 'Carolina Whole-Hog Experience',
    description: 'Explore the vinegar-based sauces and whole-hog traditions of the Carolina BBQ style. Learn about the regional differences between Eastern and Western Carolina BBQ.',
    date: '2026-02-14',
    time: '1:00 PM',
    duration: '4 hours',
    spotsLeft: 25,
    totalSpots: 25,
    price: 30,
    status: 'active',
    venue: {
      name: 'BBQ Galore Brisbane',
      location: 'Brisbane CBD',
      address: '123 BBQ Street, Brisbane QLD 4000'
    },
    packages: [
      {
        id: 'pkg-004',
        name: 'Starter Pack',
        price: 18,
        description: 'Extra pork samples',
        includes: ['Additional pork portions', 'Vinegar sauce samples', 'Carolina history booklet']
      },
      {
        id: 'pkg-005',
        name: 'Master Pack',
        price: 28,
        description: 'Vinegar sauce kit',
        includes: ['Carolina vinegar sauce kit', 'Pork rub blend', 'BBQ mop', 'Recipe cards']
      },
      {
        id: 'pkg-006',
        name: 'Regional Combo',
        price: 40,
        description: 'All packages + Carolina rub set',
        includes: ['Everything from other packs', 'Carolina spice collection', 'Pit master apron', 'Priority seating']
      }
    ],
    highlights: ['Whole-hog tasting', 'Vinegar sauce education', 'Regional comparison', 'Carolina techniques'],
    region: 'Carolina'
  },
  {
    id: 'event-003',
    title: 'Texas Brisket Masterclass',
    description: 'The holy grail of BBQ - learn the techniques behind perfect Texas-style brisket. Understand the importance of the bark, smoke ring, and the famous "salt and pepper" rub.',
    date: '2026-05-19',
    time: '10:00 AM',
    duration: '5 hours',
    spotsLeft: 20,
    totalSpots: 20,
    price: 40,
    status: 'active',
    venue: {
      name: 'BBQ Galore Brisbane',
      location: 'Brisbane CBD',
      address: '123 BBQ Street, Brisbane QLD 4000'
    },
    packages: [
      {
        id: 'pkg-007',
        name: 'Starter Pack',
        price: 25,
        description: 'Extra brisket samples',
        includes: ['Premium brisket portions', 'Texas rub sample', 'Smoking guide']
      },
      {
        id: 'pkg-008',
        name: 'Master Pack',
        price: 35,
        description: 'Pit master toolkit',
        includes: ['Texas rub blend', 'Brisket knife', 'Smoking wood chips', 'Technique guide']
      },
      {
        id: 'pkg-009',
        name: 'Regional Combo',
        price: 50,
        description: 'Complete Texas experience',
        includes: ['Everything from other packs', 'Texas sauce collection', 'Pit master certification', 'VIP experience']
      }
    ],
    highlights: ['Brisket masterclass', 'Smoking techniques', 'Bark formation', 'Texas tradition'],
    region: 'Texas'
  }
]

// Helper functions
export function getActiveEvents(): EventData[] {
  return mockEvents.filter(event => event.status === 'active')
}

export function getEventById(id: string): EventData | undefined {
  return mockEvents.find(event => event.id === id)
}

export function getUpcomingEvents(): EventData[] {
  const now = new Date()
  return getActiveEvents()
    .filter(event => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getNextEvent(): EventData | undefined {
  const upcoming = getUpcomingEvents()
  return upcoming.length > 0 ? upcoming[0] : undefined
}

export function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatEventTime(timeString: string): string {
  // Assuming time is in format "HH:MM AM/PM"
  return timeString
}

export function getEventStatus(event: EventData): {
  status: string
  statusClass: string
  message: string
} {
  if (event.status === 'sold-out' || event.spotsLeft === 0) {
    return {
      status: 'Sold Out',
      statusClass: 'sold-out',
      message: 'This event is fully booked'
    }
  }
  
  if (event.spotsLeft <= 5) {
    return {
      status: 'Almost Full',
      statusClass: 'almost-full',
      message: `Only ${event.spotsLeft} spots remaining`
    }
  }
  
  return {
    status: 'Available',
    statusClass: 'available',
    message: `${event.spotsLeft} spots available`
  }
}