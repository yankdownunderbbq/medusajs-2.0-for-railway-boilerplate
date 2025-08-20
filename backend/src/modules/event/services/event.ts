import { Event, EventContent } from "../models/event"

type EventSelector = {
  id?: string
  title?: string
  bbq_region?: string
  status?: string
  is_active?: boolean
  slug?: string
  event_date?: {
    gte?: Date
    lte?: Date
    gt?: Date
    lt?: Date
  }
}

export interface CreateEventData {
  title: string
  description: string
  bbq_region: string
  event_date: Date
  duration_hours: number
  location: string
  base_price: number
  max_capacity: number
  status?: "draft" | "active" | "sold-out" | "cancelled" | "completed"
  image_url?: string
  hero_image_url?: string
  content?: EventContent
  registration_deadline?: Date
  cancellation_deadline?: Date
  venue_address?: string
  contact_email?: string
  contact_phone?: string
  special_instructions?: string
  slug?: string
  metadata?: Record<string, any>
}

export interface UpdateEventData {
  title?: string
  description?: string
  bbq_region?: string
  event_date?: Date
  duration_hours?: number
  location?: string
  base_price?: number
  max_capacity?: number
  status?: "draft" | "active" | "sold-out" | "cancelled" | "completed"
  image_url?: string
  hero_image_url?: string
  content?: EventContent
  registration_deadline?: Date
  cancellation_deadline?: Date
  is_active?: boolean
  venue_address?: string
  contact_email?: string
  contact_phone?: string
  special_instructions?: string
  slug?: string
  metadata?: Record<string, any>
  current_bookings?: number
}

export class EventService {
  private eventRepository: any
  private manager: any

  constructor({ manager }: { manager: any }) {
    this.manager = manager
    this.eventRepository = manager.getRepository(Event)
  }

  async create(data: CreateEventData): Promise<Event> {
    // Validate event date is in the future
    if (data.event_date <= new Date()) {
      throw new Error("Event date must be in the future")
    }

    // Validate capacity
    if (data.max_capacity <= 0) {
      throw new Error("Max capacity must be greater than 0")
    }

    // Validate price
    if (data.base_price < 0) {
      throw new Error("Base price cannot be negative")
    }

    // Check for duplicate slug if provided
    if (data.slug) {
      const existingEvent = await this.eventRepository.findOne({ slug: data.slug })
      if (existingEvent) {
        throw new Error(`Event with slug "${data.slug}" already exists`)
      }
    }

    const event = this.eventRepository.create(data)
    this.manager.persist(event)
    await this.manager.flush()
    
    return event
  }

  async retrieve(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ id: eventId })
    
    if (!event) {
      throw new Error(`Event with id "${eventId}" was not found`)
    }

    return event
  }

  async retrieveBySlug(slug: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ slug })
    
    if (!event) {
      throw new Error(`Event with slug "${slug}" was not found`)
    }

    return event
  }

  async list(
    selector: EventSelector = {},
    config: { skip?: number; take?: number; order?: any } = {}
  ): Promise<Event[]> {
    const where: any = {}

    if (selector.id) {
      where.id = selector.id
    }

    if (selector.title) {
      where.title = { $ilike: `%${selector.title}%` }
    }

    if (selector.bbq_region) {
      where.bbq_region = selector.bbq_region
    }

    if (selector.status) {
      where.status = selector.status
    }

    if (selector.is_active !== undefined) {
      where.is_active = selector.is_active
    }

    if (selector.slug) {
      where.slug = selector.slug
    }

    if (selector.event_date) {
      where.event_date = {}
      if (selector.event_date.gte) {
        where.event_date.$gte = selector.event_date.gte
      }
      if (selector.event_date.lte) {
        where.event_date.$lte = selector.event_date.lte
      }
      if (selector.event_date.gt) {
        where.event_date.$gt = selector.event_date.gt
      }
      if (selector.event_date.lt) {
        where.event_date.$lt = selector.event_date.lt
      }
    }

    const options: any = {
      orderBy: config.order || { event_date: 'ASC' }
    }
    
    if (config.skip) {
      options.offset = config.skip
    }

    if (config.take) {
      options.limit = config.take
    }

    return await this.eventRepository.find(where, options)
  }

  async listAndCount(
    selector: EventSelector = {},
    config: { skip?: number; take?: number; order?: any } = {}
  ): Promise<[Event[], number]> {
    const where: any = {}

    if (selector.id) {
      where.id = selector.id
    }

    if (selector.title) {
      where.title = { $ilike: `%${selector.title}%` }
    }

    if (selector.bbq_region) {
      where.bbq_region = selector.bbq_region
    }

    if (selector.status) {
      where.status = selector.status
    }

    if (selector.is_active !== undefined) {
      where.is_active = selector.is_active
    }

    if (selector.slug) {
      where.slug = selector.slug
    }

    if (selector.event_date) {
      where.event_date = {}
      if (selector.event_date.gte) {
        where.event_date.$gte = selector.event_date.gte
      }
      if (selector.event_date.lte) {
        where.event_date.$lte = selector.event_date.lte
      }
      if (selector.event_date.gt) {
        where.event_date.$gt = selector.event_date.gt
      }
      if (selector.event_date.lt) {
        where.event_date.$lt = selector.event_date.lt
      }
    }

    const options: any = {
      orderBy: config.order || { event_date: 'ASC' }
    }
    
    if (config.skip) {
      options.offset = config.skip
    }

    if (config.take) {
      options.limit = config.take
    }

    return await this.eventRepository.findAndCount(where, options)
  }

  async update(eventId: string, data: UpdateEventData): Promise<Event> {
    const event = await this.retrieve(eventId)

    // Validate event date if being updated
    if (data.event_date && data.event_date <= new Date()) {
      throw new Error("Event date must be in the future")
    }

    // Validate capacity if being updated
    if (data.max_capacity !== undefined) {
      if (data.max_capacity <= 0) {
        throw new Error("Max capacity must be greater than 0")
      }

      if (data.max_capacity < event.current_bookings) {
        throw new Error(`Cannot reduce capacity below current bookings (${event.current_bookings})`)
      }
    }

    // Validate price if being updated
    if (data.base_price !== undefined && data.base_price < 0) {
      throw new Error("Base price cannot be negative")
    }

    // Check for duplicate slug if being updated
    if (data.slug && data.slug !== event.slug) {
      const existingEvent = await this.eventRepository.findOne({ slug: data.slug })
      if (existingEvent) {
        throw new Error(`Event with slug "${data.slug}" already exists`)
      }
    }

    Object.assign(event, data)
    await this.manager.flush()

    return event
  }

  async delete(eventId: string): Promise<void> {
    const event = await this.retrieve(eventId)

    // Check if event has bookings
    if (event.current_bookings > 0) {
      throw new Error("Cannot delete event with existing bookings")
    }

    this.manager.remove(event)
    await this.manager.flush()
  }

  async incrementBookingCount(eventId: string, increment: number = 1): Promise<Event> {
    const event = await this.retrieve(eventId)
    
    event.updateBookingCount(increment)
    await this.manager.flush()

    return event
  }

  async decrementBookingCount(eventId: string, decrement: number = 1): Promise<Event> {
    return this.incrementBookingCount(eventId, -decrement)
  }

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    return this.list(
      {
        event_date: { gt: new Date() },
        status: "active",
        is_active: true
      },
      {
        take: limit,
        order: { event_date: "ASC" }
      }
    )
  }

  async getEventsByRegion(region: string): Promise<Event[]> {
    return this.list(
      {
        bbq_region: region,
        event_date: { gt: new Date() },
        status: "active",
        is_active: true
      },
      {
        order: { event_date: "ASC" }
      }
    )
  }

  async getBookableEvents(): Promise<Event[]> {
    const now = new Date()
    return this.list(
      {
        event_date: { gt: now },
        status: "active",
        is_active: true
      },
      {
        order: { event_date: "ASC" }
      }
    )
  }

  async setMetadata(eventId: string, metadata: Record<string, any>): Promise<Event> {
    const event = await this.retrieve(eventId)
    const updatedMetadata = { ...event.metadata, ...metadata }
    
    return await this.update(eventId, { metadata: updatedMetadata })
  }

  async updateContent(eventId: string, content: Partial<EventContent>): Promise<Event> {
    const event = await this.retrieve(eventId)
    const updatedContent = { ...event.content, ...content }

    return await this.update(eventId, { content: updatedContent })
  }
}