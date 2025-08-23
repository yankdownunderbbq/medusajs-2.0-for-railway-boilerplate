import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import type EventService from "../../../../../modules/event/services/event"

const UpdateContentSchema = z.object({
  productIds: z.array(z.string()).optional(),
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
})

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  try {
    const eventService: EventService = req.scope.resolve("event")
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({
        message: "Event ID is required"
      })
    }
    
    const validatedContent = UpdateContentSchema.parse(req.body)
    
    const event = await eventService.updateContent(id, validatedContent)
    
    res.json({
      event,
      message: "Event content updated successfully"
    })
  } catch (error) {
    console.error("Admin event content PUT error:", error)
    
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
      message: error instanceof Error ? error.message : "Failed to update event content"
    })
  }
}