import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type EventService from "../../../modules/event/services/event"

export const AUTHENTICATE = false // Skip auth for testing
export const CORS = true

// Test route to verify EventService is working
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const eventService: EventService = req.scope.resolve("event")
    
    // Test listing events
    const events = await eventService.list({}, { take: 10 })
    
    res.json({
      success: true,
      message: "EventService is working!",
      events_count: events.length,
      events: events
    })
  } catch (error) {
    console.error("Test events error:", error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}

// Test creating an event
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const eventService: EventService = req.scope.resolve("event")
    
    // Create a test event
    const testEvent = await eventService.create({
      title: "Test BBQ Event",
      description: "A test event to verify the service works",
      bbq_region: "texas",
      event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      duration_hours: 4,
      location: "Test Location",
      base_price: 99.99,
      max_capacity: 50,
      status: "active",
      slug: `test-event-${Date.now()}`
    })
    
    res.json({
      success: true,
      message: "Event created successfully!",
      event: testEvent
    })
  } catch (error) {
    console.error("Test create event error:", error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}