import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

export const AUTHENTICATE = false // Skip auth for development
export const CORS = true // Enable CORS

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
    const eventService = req.scope.resolve("event")
    
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
      event_date: event.event_date.toISOString(),
      duration_hours: event.duration_hours,
      location: event.location,
      max_capacity: event.max_capacity,
      current_bookings: event.current_bookings,
      base_price: event.base_price,
      bbq_region: event.bbq_region,
      status: event.status,
      image_url: event.image_url,
      hero_image_url: event.hero_image_url,
      slug: event.slug,
      venue_address: event.venue_address,
      contact_email: event.contact_email,
      contact_phone: event.contact_phone,
      special_instructions: event.special_instructions,
      registration_deadline: event.registration_deadline?.toISOString(),
      cancellation_deadline: event.cancellation_deadline?.toISOString(),
      // Include content fields that frontend expects
      packages: event.content?.packages || [],
      takeHomeProducts: event.content?.takeHomeProducts || [],
      faqs: event.content?.faqs || [],
      socialProof: event.content?.socialProof || {},
      logistics: event.content?.logistics || {},
      timeline: event.content?.timeline || [],
      included_benefits: event.content?.included_benefits || [],
      // Helper properties
      spots_left: event.getSpotsLeft(),
      is_bookable: event.isBookable(),
      is_upcoming: event.isUpcoming(),
      formatted_price: event.getFormattedPrice()
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