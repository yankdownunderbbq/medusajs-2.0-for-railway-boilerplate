import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import type EventService from "../../../modules/event/services/event"

export const AUTHENTICATE = false
export const CORS = {
  origin: ["http://localhost:3000", "https://yankdownunderbbq.com", "*"],
  credentials: false
}

const StoreEventQuerySchema = z.object({
  bbq_region: z.string().optional(),
  upcoming: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional()
})

// GET /store/bbq-events - Get all available BBQ events
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const eventService: EventService = req.scope.resolve("bbq_event")
    
    const query = StoreEventQuerySchema.parse(req.query)
    
    let events
    
    if (query.upcoming) {
      // Get upcoming bookable events
      events = await eventService.getBookableEvents()
    } else if (query.bbq_region) {
      // Get events by region
      events = await eventService.getEventsByRegion(query.bbq_region)
    } else {
      // Get all active events
      const selector = {
        status: "active" as const,
        is_active: true,
        event_date: { gt: new Date() }
      }
      
      const config: any = {}
      if (query.limit) config.take = query.limit
      if (query.offset) config.skip = query.offset
      config.order = { event_date: "ASC" }
      
      events = await eventService.list(selector, config)
    }
    
    // Transform events to match frontend expectations
    const transformedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      menu_description: event.description, // Use description as menu_description
      event_date: event.event_date.toISOString(),
      duration_hours: event.duration_hours,
      location: event.location,
      max_capacity: event.max_capacity,
      current_bookings: event.current_bookings,
      base_price: event.base_price,
      bbq_region: event.bbq_region,
      status: event.status,
      packages: event.content?.packages?.map(pkg => ({
        type: pkg.name.toLowerCase().replace(/\s+/g, '-'), // Convert name to type format
        name: pkg.name,
        price: pkg.price,
        description: pkg.description
      })) || []
    }))
    
    res.json({
      events: transformedEvents,
      count: transformedEvents.length
    })
  } catch (error) {
    console.error("Store events GET error:", error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid query parameters",
        errors: error.errors
      })
    }
    
    res.status(500).json({
      message: "Failed to fetch events"
    })
  }
}

// POST /store/bbq-events - Create a new BBQ event (admin only)
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // This would be admin-only functionality
  // For now, return method not allowed
  res.status(405).json({
    message: "Event creation requires admin privileges"
  })
}