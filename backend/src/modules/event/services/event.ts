import { Event } from "../models/event"
import type { 
  EventSelector,
  EventContent, 
  CreateEventData, 
  UpdateEventData, 
  EventListConfig 
} from "../types"
import type { EntityManager } from "@mikro-orm/postgresql"

export default class EventService {
  private eventRepository: any
  private manager_: EntityManager

  constructor({ manager }: { manager: EntityManager }) {
    this.manager_ = manager
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
    this.manager_.persist(event)
    await this.manager_.flush()
    
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
    config: EventListConfig = {}
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
    config: EventListConfig = {}
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

    // ADD DEBUGGING HERE:
    Object.assign(event, data)
    await this.manager_.flush()

    return event
  }

  async delete(eventId: string): Promise<void> {
    const event = await this.retrieve(eventId)

    // Check if event has bookings
    if (event.current_bookings > 0) {
      throw new Error("Cannot delete event with existing bookings")
    }

    this.manager_.remove(event)
    await this.manager_.flush()
  }

  async incrementBookingCount(eventId: string, increment: number = 1): Promise<Event> {
    const event = await this.retrieve(eventId)
    
    event.updateBookingCount(increment)
    await this.manager_.flush()

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