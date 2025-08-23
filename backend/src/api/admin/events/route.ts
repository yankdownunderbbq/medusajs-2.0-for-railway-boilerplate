import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import type EventService from "../../../modules/event/services/event"
import type { CreateEventData } from "../../../modules/event/types"

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

const CreateEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  bbq_region: z.string().min(1),
  event_date: z.string().datetime(),
  duration_hours: z.number().min(1),
  location: z.string().min(1),
  base_price: z.number().min(0),
  max_capacity: z.number().min(1),
  status: z.enum(["draft", "active", "sold-out", "cancelled", "completed"]).optional(),
  image_url: z.string().url().optional(),
  hero_image_url: z.string().url().optional(),
  content: EventContentSchema,
  registration_deadline: z.string().datetime().optional(),
  cancellation_deadline: z.string().datetime().optional(),
  venue_address: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  special_instructions: z.string().optional(),
  slug: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

const UpdateEventSchema = CreateEventSchema.partial()

const EventQuerySchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  bbq_region: z.string().optional(),
  status: z.enum(["draft", "active", "sold-out", "cancelled", "completed"]).optional(),
  is_active: z.boolean().optional(),
  event_date_gte: z.string().datetime().optional(),
  event_date_lte: z.string().datetime().optional(),
  event_date_gt: z.string().datetime().optional(),
  event_date_lt: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  order: z.string().optional()
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const eventService: EventService = req.scope.resolve("event")
    
    const query = EventQuerySchema.parse(req.query)
    
    const selector: any = {}
    
    if (query.id) selector.id = query.id
    if (query.title) selector.title = query.title
    if (query.bbq_region) selector.bbq_region = query.bbq_region
    if (query.status) selector.status = query.status
    if (query.is_active !== undefined) selector.is_active = query.is_active
    
    if (query.event_date_gte || query.event_date_lte || query.event_date_gt || query.event_date_lt) {
      selector.event_date = {}
      if (query.event_date_gte) selector.event_date.gte = new Date(query.event_date_gte)
      if (query.event_date_lte) selector.event_date.lte = new Date(query.event_date_lte)
      if (query.event_date_gt) selector.event_date.gt = new Date(query.event_date_gt)
      if (query.event_date_lt) selector.event_date.lt = new Date(query.event_date_lt)
    }
    
    const config: any = {}
    if (query.limit) config.take = query.limit
    if (query.offset) config.skip = query.offset
    if (query.order) {
      const [field, direction] = query.order.split(':')
      config.order = { [field]: direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC' }
    }
    
    const [events, count] = await eventService.listAndCount(selector, config)
    
    res.json({
      events,
      count,
      offset: query.offset || 0,
      limit: query.limit || events.length
    })
  } catch (error) {
    console.error("Admin events GET error:", error)
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to fetch events"
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const eventService: EventService = req.scope.resolve("event")
    
    const validatedData = CreateEventSchema.parse(req.body)
    
    const eventData = {
      ...validatedData,
      event_date: new Date(validatedData.event_date),
      registration_deadline: validatedData.registration_deadline 
        ? new Date(validatedData.registration_deadline) 
        : undefined,
      cancellation_deadline: validatedData.cancellation_deadline 
        ? new Date(validatedData.cancellation_deadline) 
        : undefined,
    } as CreateEventData
    
    const event = await eventService.create(eventData)
    
    res.status(201).json({
      event,
      message: "Event created successfully"
    })
  } catch (error) {
    console.error("Admin events POST error:", error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      })
    }
    
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to create event"
    })
  }
}