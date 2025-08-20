import { useState, useEffect } from 'react'

export interface BBQEvent {
  id: string
  title: string
  description: string
  event_date: string
  duration_hours: number
  location: string
  max_capacity: number
  current_bookings: number
  base_price: number
  bbq_region: string
  menu_description: string
  status: string
  packages?: Array<{
    type: string
    name: string
    price: number
    description: string
  }>
}

export interface BBQEventsResponse {
  events: BBQEvent[]
  count: number
}

export function useBBQEvents() {
  const [events, setEvents] = useState<BBQEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/bbq-events`, {
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.statusText}`)
        }

        const data: BBQEventsResponse = await response.json()
        setEvents(data.events)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return { events, loading, error }
}

export function useBBQEvent(eventId: string) {
  const [event, setEvent] = useState<BBQEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) return

    async function fetchEvent() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/bbq-events/${eventId}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.statusText}`)
        }

        const data = await response.json()
        setEvent(data.event)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  return { event, loading, error }
}