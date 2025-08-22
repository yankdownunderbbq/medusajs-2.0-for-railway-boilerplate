import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const AUTHENTICATE = false // Skip auth for development
export const CORS = true // Enable CORS

// GET /store/bbq-events/[id] - Get specific BBQ event details
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const eventService = req.scope.resolve("event")
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        message: "Event ID is required"
      })
    }

    let event
    
    console.log(`=== BACKEND DEBUG ===`)
    console.log(`Request ID: ${id}`)
    console.log(`Request headers:`, JSON.stringify(req.headers, null, 2))
    
    try {
      // Try to retrieve by ID first
      event = await eventService.retrieve(id)
      console.log(`Retrieved by ID: ${id}`)
    } catch (error) {
      if (error.type === "not_found") {
        // If not found by ID, try to retrieve by slug
        try {
          event = await eventService.retrieveBySlug(id)
          console.log(`Retrieved by slug: ${id}`)
        } catch (slugError) {
          return res.status(404).json({
            message: "BBQ event not found"
          })
        }
      } else {
        throw error
      }
    }

    console.log(`Raw event from DB:`, JSON.stringify(event, null, 2))
    console.log(`Event ticket_variant_id raw:`, event.ticket_variant_id)

    // Only return active, bookable events to store customers
    if (!event.is_active || event.status !== "active") {
      return res.status(404).json({
        message: "BBQ event not found"
      })
    }

    // Transform event to match frontend expectations
    const transformedEvent = {
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
      ticket_variant_id: event.ticket_variant_id,
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
      content: event.content || {},
      // Helper properties
      spots_left: event.getSpotsLeft(),
      is_bookable: event.isBookable(),
      is_upcoming: event.isUpcoming(),
      formatted_price: event.getFormattedPrice(),
      // Legacy compatibility
      menu_description: event.description
    }

    console.log(`Final response ticket_variant_id:`, transformedEvent.ticket_variant_id)
    console.log(`Final response object:`, JSON.stringify({ event: transformedEvent }, null, 2))
    
    res.json({ event: transformedEvent })
  } catch (error) {
    console.error("Store event GET error:", error)
    
    res.status(500).json({
      message: "Failed to fetch event"
    })
  }
}