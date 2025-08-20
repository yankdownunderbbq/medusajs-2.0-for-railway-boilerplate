import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

const EventContentSchema = z.object({
  packages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    includes: z.array(z.string()),
    delivery_options: z.array(z.string()),
    max_quantity: z.number().optional()
  })).optional(),
  takeHomeProducts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    category: z.string(),
    image_url: z.string().optional(),
    availability_status: z.enum(['available', 'limited', 'sold_out'])
  })).optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    category: z.string().optional()
  })).optional(),
  socialProof: z.object({
    testimonials: z.array(z.object({
      name: z.string(),
      comment: z.string(),
      rating: z.number(),
      event_attended: z.string().optional()
    })).optional(),
    stats: z.object({
      total_attendees: z.number().optional(),
      average_rating: z.number().optional(),
      repeat_customer_rate: z.number().optional()
    }).optional()
  }).optional(),
  logistics: z.object({
    what_to_bring: z.array(z.string()).optional(),
    parking_info: z.string().optional(),
    public_transport: z.string().optional(),
    accessibility: z.array(z.string()).optional(),
    dietary_accommodations: z.array(z.string()).optional()
  }).optional(),
  timeline: z.array(z.object({
    time_offset_minutes: z.number(),
    title: z.string(),
    description: z.string(),
    icon: z.string().optional()
  })).optional(),
  included_benefits: z.array(z.object({
    title: z.string(),
    description: z.string(),
    value: z.string().optional(),
    category: z.enum(['main_event', 'store_benefits', 'exclusive_access'])
  })).optional()
}).optional()

const UpdateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  bbq_region: z.string().min(1).optional(),
  event_date: z.string().datetime().optional(),
  duration_hours: z.number().min(1).optional(),
  location: z.string().min(1).optional(),
  base_price: z.number().min(0).optional(),
  max_capacity: z.number().min(1).optional(),
  status: z.enum(["draft", "active", "sold-out", "cancelled", "completed"]).optional(),
  image_url: z.string().url().optional(),
  hero_image_url: z.string().url().optional(),
  content: EventContentSchema,
  registration_deadline: z.string().datetime().optional(),
  cancellation_deadline: z.string().datetime().optional(),
  is_active: z.boolean().optional(),
  venue_address: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  special_instructions: z.string().optional(),
  slug: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

const BookingCountSchema = z.object({
  increment: z.number().int().optional(),
  decrement: z.number().int().optional()
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const eventService = req.scope.resolve("event")
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({
        message: "Event ID is required"
      })
    }
    
    const event = await eventService.retrieve(id)
    
    res.json({
      event
    })
  } catch (error) {
    console.error("Admin event GET error:", error)
    
    if (error.type === "not_found") {
      return res.status(404).json({
        message: error.message
      })
    }
    
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to fetch event"
    })
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  try {
    const eventService = req.scope.resolve("event")
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({
        message: "Event ID is required"
      })
    }
    
    const validatedData = UpdateEventSchema.parse(req.body)
    
    const updateData = {
      ...validatedData,
      event_date: validatedData.event_date 
        ? new Date(validatedData.event_date) 
        : undefined,
      registration_deadline: validatedData.registration_deadline 
        ? new Date(validatedData.registration_deadline) 
        : undefined,
      cancellation_deadline: validatedData.cancellation_deadline 
        ? new Date(validatedData.cancellation_deadline) 
        : undefined,
    }
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })
    
    const event = await eventService.update(id, updateData)
    
    res.json({
      event,
      message: "Event updated successfully"
    })
  } catch (error) {
    console.error("Admin event PUT error:", error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      })
    }
    
    if (error.type === "not_found") {
      return res.status(404).json({
        message: error.message
      })
    }
    
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to update event"
    })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const eventService = req.scope.resolve("event")
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({
        message: "Event ID is required"
      })
    }
    
    await eventService.delete(id)
    
    res.json({
      message: "Event deleted successfully",
      deleted: true,
      id
    })
  } catch (error) {
    console.error("Admin event DELETE error:", error)
    
    if (error.type === "not_found") {
      return res.status(404).json({
        message: error.message
      })
    }
    
    if (error.type === "not_allowed") {
      return res.status(409).json({
        message: error.message
      })
    }
    
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to delete event"
    })
  }
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  try {
    const eventService = req.scope.resolve("event")
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({
        message: "Event ID is required"
      })
    }
    
    const validatedData = BookingCountSchema.parse(req.body)
    
    let event
    
    if (validatedData.increment) {
      event = await eventService.incrementBookingCount(id, validatedData.increment)
    } else if (validatedData.decrement) {
      event = await eventService.decrementBookingCount(id, validatedData.decrement)
    } else {
      return res.status(400).json({
        message: "Either increment or decrement must be provided"
      })
    }
    
    res.json({
      event,
      message: "Booking count updated successfully"
    })
  } catch (error) {
    console.error("Admin event PATCH error:", error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      })
    }
    
    if (error.type === "not_found") {
      return res.status(404).json({
        message: error.message
      })
    }
    
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to update booking count"
    })
  }
}