import { EventService, CreateEventData, UpdateEventData } from "../../modules/event/services/event"
import { Event } from "../../modules/event/models/event"

// Mock the Event repository
const mockEventRepo = {
  create: jest.fn(),
  persistAndFlush: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
  removeAndFlush: jest.fn()
}

// Mock the container and manager
const mockContainer = {
  manager: {
    getRepository: jest.fn(() => mockEventRepo)
  }
}

const mockManager = {
  getRepository: jest.fn(() => mockEventRepo)
}

describe("EventService", () => {
  let eventService: EventService
  let mockEvent: Event

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock the base service constructor
    eventService = new EventService(mockContainer)
    eventService.activeManager_ = mockManager
    eventService.atomicPhase_ = jest.fn((callback) => callback(mockManager))

    // Create a mock event
    mockEvent = new Event()
    mockEvent.id = "event_test123"
    mockEvent.title = "Test BBQ Event"
    mockEvent.description = "Test description"
    mockEvent.bbq_region = "Kansas City"
    mockEvent.event_date = new Date("2025-12-15T18:00:00Z")
    mockEvent.duration_hours = 3
    mockEvent.location = "Test Location"
    mockEvent.base_price = 8900
    mockEvent.max_capacity = 40
    mockEvent.current_bookings = 0
    mockEvent.status = "active"
    mockEvent.is_active = true
    mockEvent.content = {}
  })

  describe("create", () => {
    const validCreateData: CreateEventData = {
      title: "Test BBQ Event",
      description: "Test description",
      bbq_region: "Kansas City",
      event_date: new Date("2025-12-15T18:00:00Z"),
      duration_hours: 3,
      location: "Test Location",
      base_price: 8900,
      max_capacity: 40
    }

    it("should create an event successfully", async () => {
      mockEventRepo.create.mockReturnValue(mockEvent)
      mockEventRepo.persistAndFlush.mockResolvedValue(undefined)

      const result = await eventService.create(validCreateData)

      expect(mockEventRepo.create).toHaveBeenCalledWith(validCreateData)
      expect(mockEventRepo.persistAndFlush).toHaveBeenCalledWith(mockEvent)
      expect(result).toBe(mockEvent)
    })

    it("should throw error for past event date", async () => {
      const pastDate = new Date(Date.now() - 86400000) // yesterday
      const invalidData = { ...validCreateData, event_date: pastDate }

      await expect(eventService.create(invalidData)).rejects.toThrow(
        "Event date must be in the future"
      )
    })

    it("should throw error for zero capacity", async () => {
      const invalidData = { ...validCreateData, max_capacity: 0 }

      await expect(eventService.create(invalidData)).rejects.toThrow(
        "Max capacity must be greater than 0"
      )
    })

    it("should throw error for negative price", async () => {
      const invalidData = { ...validCreateData, base_price: -100 }

      await expect(eventService.create(invalidData)).rejects.toThrow(
        "Base price cannot be negative"
      )
    })

    it("should throw error for duplicate slug", async () => {
      const dataWithSlug = { ...validCreateData, slug: "existing-slug" }
      mockEventRepo.findOne.mockResolvedValue(mockEvent) // simulate existing event

      await expect(eventService.create(dataWithSlug)).rejects.toThrow(
        'Event with slug "existing-slug" already exists'
      )
    })
  })

  describe("retrieve", () => {
    it("should retrieve an event by ID", async () => {
      mockEventRepo.findOne.mockResolvedValue(mockEvent)

      const result = await eventService.retrieve("event_test123")

      expect(mockEventRepo.findOne).toHaveBeenCalledWith({ id: "event_test123" })
      expect(result).toBe(mockEvent)
    })

    it("should throw error when event not found", async () => {
      mockEventRepo.findOne.mockResolvedValue(null)

      await expect(eventService.retrieve("nonexistent")).rejects.toThrow(
        'Event with id "nonexistent" was not found'
      )
    })
  })

  describe("retrieveBySlug", () => {
    it("should retrieve an event by slug", async () => {
      mockEventRepo.findOne.mockResolvedValue(mockEvent)

      const result = await eventService.retrieveBySlug("test-bbq-event")

      expect(mockEventRepo.findOne).toHaveBeenCalledWith({ slug: "test-bbq-event" })
      expect(result).toBe(mockEvent)
    })

    it("should throw error when event not found by slug", async () => {
      mockEventRepo.findOne.mockResolvedValue(null)

      await expect(eventService.retrieveBySlug("nonexistent-slug")).rejects.toThrow(
        'Event with slug "nonexistent-slug" was not found'
      )
    })
  })

  describe("list", () => {
    it("should list events with default ordering", async () => {
      const mockEvents = [mockEvent]
      mockEventRepo.find.mockResolvedValue(mockEvents)

      const result = await eventService.list()

      expect(mockEventRepo.find).toHaveBeenCalledWith({}, { orderBy: { event_date: 'ASC' } })
      expect(result).toBe(mockEvents)
    })

    it("should list events with filters", async () => {
      const mockEvents = [mockEvent]
      mockEventRepo.find.mockResolvedValue(mockEvents)

      const selector = {
        bbq_region: "Kansas City",
        status: "active" as const,
        is_active: true
      }

      const result = await eventService.list(selector)

      expect(mockEventRepo.find).toHaveBeenCalledWith(
        {
          bbq_region: "Kansas City",
          status: "active",
          is_active: true
        },
        { orderBy: { event_date: 'ASC' } }
      )
      expect(result).toBe(mockEvents)
    })

    it("should handle date range filters", async () => {
      const mockEvents = [mockEvent]
      mockEventRepo.find.mockResolvedValue(mockEvents)

      const futureDate = new Date("2025-12-31T23:59:59Z")
      const selector = {
        event_date: {
          gt: new Date(),
          lte: futureDate
        }
      }

      await eventService.list(selector)

      expect(mockEventRepo.find).toHaveBeenCalledWith(
        {
          event_date: {
            $gt: selector.event_date.gt,
            $lte: selector.event_date.lte
          }
        },
        { orderBy: { event_date: 'ASC' } }
      )
    })

    it("should handle pagination and custom ordering", async () => {
      const mockEvents = [mockEvent]
      mockEventRepo.find.mockResolvedValue(mockEvents)

      const config = {
        skip: 10,
        take: 5,
        order: { title: "DESC" as const }
      }

      await eventService.list({}, config)

      expect(mockEventRepo.find).toHaveBeenCalledWith(
        {},
        {
          offset: 10,
          limit: 5,
          orderBy: { title: "DESC" }
        }
      )
    })
  })

  describe("listAndCount", () => {
    it("should return events and count", async () => {
      const mockEvents = [mockEvent]
      const mockCount = 1
      mockEventRepo.findAndCount.mockResolvedValue([mockEvents, mockCount])

      const result = await eventService.listAndCount()

      expect(result).toEqual([mockEvents, mockCount])
    })
  })

  describe("update", () => {
    const updateData: UpdateEventData = {
      title: "Updated Title",
      max_capacity: 50
    }

    it("should update an event successfully", async () => {
      mockEventRepo.findOne.mockResolvedValue(mockEvent)
      mockEventRepo.persistAndFlush.mockResolvedValue(undefined)

      const result = await eventService.update("event_test123", updateData)

      expect(mockEventRepo.findOne).toHaveBeenCalledWith({ id: "event_test123" })
      expect(Object.assign).toHaveBeenCalledWith(mockEvent, updateData)
      expect(mockEventRepo.persistAndFlush).toHaveBeenCalledWith(mockEvent)
    })

    it("should throw error when event not found", async () => {
      mockEventRepo.findOne.mockResolvedValue(null)

      await expect(eventService.update("nonexistent", updateData)).rejects.toThrow(
        'Event with id "nonexistent" was not found'
      )
    })

    it("should throw error when reducing capacity below bookings", async () => {
      mockEvent.current_bookings = 30
      mockEventRepo.findOne.mockResolvedValue(mockEvent)

      const invalidUpdate = { max_capacity: 25 }

      await expect(eventService.update("event_test123", invalidUpdate)).rejects.toThrow(
        "Cannot reduce capacity below current bookings (30)"
      )
    })

    it("should throw error for past event date", async () => {
      mockEventRepo.findOne.mockResolvedValue(mockEvent)

      const pastDate = new Date(Date.now() - 86400000)
      const invalidUpdate = { event_date: pastDate }

      await expect(eventService.update("event_test123", invalidUpdate)).rejects.toThrow(
        "Event date must be in the future"
      )
    })
  })

  describe("delete", () => {
    it("should delete an event with no bookings", async () => {
      mockEvent.current_bookings = 0
      mockEventRepo.findOne.mockResolvedValue(mockEvent)
      mockEventRepo.removeAndFlush.mockResolvedValue(undefined)

      await eventService.delete("event_test123")

      expect(mockEventRepo.findOne).toHaveBeenCalledWith({ id: "event_test123" })
      expect(mockEventRepo.removeAndFlush).toHaveBeenCalledWith(mockEvent)
    })

    it("should throw error when deleting event with bookings", async () => {
      mockEvent.current_bookings = 5
      mockEventRepo.findOne.mockResolvedValue(mockEvent)

      await expect(eventService.delete("event_test123")).rejects.toThrow(
        "Cannot delete event with existing bookings"
      )
    })

    it("should throw error when event not found", async () => {
      mockEventRepo.findOne.mockResolvedValue(null)

      await expect(eventService.delete("nonexistent")).rejects.toThrow(
        'Event with id "nonexistent" was not found'
      )
    })
  })

  describe("incrementBookingCount", () => {
    it("should increment booking count", async () => {
      mockEvent.current_bookings = 10
      mockEvent.updateBookingCount = jest.fn()
      mockEventRepo.findOne.mockResolvedValue(mockEvent)
      mockEventRepo.persistAndFlush.mockResolvedValue(undefined)

      const result = await eventService.incrementBookingCount("event_test123", 2)

      expect(mockEvent.updateBookingCount).toHaveBeenCalledWith(2)
      expect(mockEventRepo.persistAndFlush).toHaveBeenCalledWith(mockEvent)
      expect(result).toBe(mockEvent)
    })

    it("should use default increment of 1", async () => {
      mockEvent.updateBookingCount = jest.fn()
      mockEventRepo.findOne.mockResolvedValue(mockEvent)
      mockEventRepo.persistAndFlush.mockResolvedValue(undefined)

      await eventService.incrementBookingCount("event_test123")

      expect(mockEvent.updateBookingCount).toHaveBeenCalledWith(1)
    })
  })

  describe("decrementBookingCount", () => {
    it("should decrement booking count", async () => {
      mockEvent.current_bookings = 10
      mockEvent.updateBookingCount = jest.fn()
      mockEventRepo.findOne.mockResolvedValue(mockEvent)
      mockEventRepo.persistAndFlush.mockResolvedValue(undefined)

      const result = await eventService.decrementBookingCount("event_test123", 2)

      expect(mockEvent.updateBookingCount).toHaveBeenCalledWith(-2)
      expect(result).toBe(mockEvent)
    })
  })

  describe("specialized list methods", () => {
    beforeEach(() => {
      eventService.list = jest.fn()
    })

    it("should get upcoming events", async () => {
      const mockEvents = [mockEvent]
      ;(eventService.list as jest.Mock).mockResolvedValue(mockEvents)

      const result = await eventService.getUpcomingEvents(5)

      expect(eventService.list).toHaveBeenCalledWith(
        {
          event_date: { gt: expect.any(Date) },
          status: "active",
          is_active: true
        },
        {
          take: 5,
          order: { event_date: "ASC" }
        }
      )
      expect(result).toBe(mockEvents)
    })

    it("should get events by region", async () => {
      const mockEvents = [mockEvent]
      ;(eventService.list as jest.Mock).mockResolvedValue(mockEvents)

      const result = await eventService.getEventsByRegion("Kansas City")

      expect(eventService.list).toHaveBeenCalledWith(
        {
          bbq_region: "Kansas City",
          event_date: { gt: expect.any(Date) },
          status: "active",
          is_active: true
        },
        {
          order: { event_date: "ASC" }
        }
      )
      expect(result).toBe(mockEvents)
    })

    it("should get bookable events", async () => {
      const mockEvents = [mockEvent]
      ;(eventService.list as jest.Mock).mockResolvedValue(mockEvents)

      const result = await eventService.getBookableEvents()

      expect(eventService.list).toHaveBeenCalledWith(
        {
          event_date: { gt: expect.any(Date) },
          status: "active",
          is_active: true
        },
        {
          order: { event_date: "ASC" }
        }
      )
      expect(result).toBe(mockEvents)
    })
  })

  describe("updateContent", () => {
    it("should update event content", async () => {
      const existingContent = {
        packages: [{ id: "1", name: "Basic", description: "Basic package", price: 5000, includes: [], delivery_options: [] }]
      }
      mockEvent.content = existingContent
      mockEventRepo.findOne.mockResolvedValue(mockEvent)
      mockEventRepo.persistAndFlush.mockResolvedValue(undefined)

      const newContent = {
        faqs: [{ question: "Test?", answer: "Yes!" }]
      }

      const result = await eventService.updateContent("event_test123", newContent)

      expect(mockEvent.content).toEqual({
        ...existingContent,
        ...newContent
      })
      expect(mockEventRepo.persistAndFlush).toHaveBeenCalledWith(mockEvent)
      expect(result).toBe(mockEvent)
    })

    it("should throw error when event not found", async () => {
      mockEventRepo.findOne.mockResolvedValue(null)

      await expect(eventService.updateContent("nonexistent", {})).rejects.toThrow(
        'Event with id "nonexistent" was not found'
      )
    })
  })
})