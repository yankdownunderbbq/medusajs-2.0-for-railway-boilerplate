import { GET } from "../../../../api/store/bbq-events/route"
import { GET as GetSingle } from "../../../../api/store/bbq-events/[id]/route"

// Mock EventService
const mockEventService = {
  getBookableEvents: jest.fn(),
  getEventsByRegion: jest.fn(),
  list: jest.fn(),
  retrieve: jest.fn(),
  retrieveBySlug: jest.fn()
}

// Mock request and response
const createMockRequest = (query = {}, params = {}) => ({
  scope: {
    resolve: jest.fn(() => mockEventService)
  },
  query,
  params
})

const createMockResponse = () => {
  const res = {
    json: jest.fn(),
    status: jest.fn(() => res)
  }
  return res
}

// Mock event data
const createMockEvent = (overrides = {}) => ({
  id: "event_123",
  title: "Test BBQ Event",
  description: "Test description",
  bbq_region: "Kansas City",
  event_date: new Date("2025-12-15T18:00:00Z"),
  duration_hours: 3,
  location: "Test Location",
  base_price: 8900,
  max_capacity: 40,
  current_bookings: 10,
  status: "active",
  is_active: true,
  image_url: "https://example.com/image.jpg",
  content: {
    packages: [],
    takeHomeProducts: []
  },
  getSpotsLeft: jest.fn(() => 30),
  isBookable: jest.fn(() => true),
  isUpcoming: jest.fn(() => true),
  getFormattedPrice: jest.fn(() => "89"),
  ...overrides
})

describe("Store BBQ Events API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /store/bbq-events", () => {
    it("should return upcoming events by default", async () => {
      const mockEvents = [createMockEvent(), createMockEvent({ id: "event_456" })]
      mockEventService.list.mockResolvedValue(mockEvents)

      const req = createMockRequest()
      const res = createMockResponse()

      await GET(req, res)

      expect(mockEventService.list).toHaveBeenCalledWith(
        {
          status: "active",
          is_active: true,
          event_date: { gt: expect.any(Date) }
        },
        {
          order: { event_date: "ASC" }
        }
      )
      expect(res.json).toHaveBeenCalledWith({
        events: expect.arrayContaining([
          expect.objectContaining({
            id: "event_123",
            title: "Test BBQ Event",
            spots_left: 30,
            is_bookable: true,
            formatted_price: "89"
          })
        ]),
        count: 2
      })
    })

    it("should get upcoming events when upcoming=true", async () => {
      const mockEvents = [createMockEvent()]
      mockEventService.getBookableEvents.mockResolvedValue(mockEvents)

      const req = createMockRequest({ upcoming: "true" })
      const res = createMockResponse()

      await GET(req, res)

      expect(mockEventService.getBookableEvents).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        events: expect.any(Array),
        count: 1
      })
    })

    it("should get events by region", async () => {
      const mockEvents = [createMockEvent()]
      mockEventService.getEventsByRegion.mockResolvedValue(mockEvents)

      const req = createMockRequest({ bbq_region: "Kansas City" })
      const res = createMockResponse()

      await GET(req, res)

      expect(mockEventService.getEventsByRegion).toHaveBeenCalledWith("Kansas City")
      expect(res.json).toHaveBeenCalledWith({
        events: expect.any(Array),
        count: 1
      })
    })

    it("should handle pagination", async () => {
      const mockEvents = [createMockEvent()]
      mockEventService.list.mockResolvedValue(mockEvents)

      const req = createMockRequest({ limit: "5", offset: "10" })
      const res = createMockResponse()

      await GET(req, res)

      expect(mockEventService.list).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          take: 5,
          skip: 10
        })
      )
    })

    it("should handle validation errors", async () => {
      const req = createMockRequest({ limit: "invalid" })
      const res = createMockResponse()

      await GET(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid query parameters"
        })
      )
    })

    it("should handle service errors", async () => {
      mockEventService.list.mockRejectedValue(new Error("Database error"))

      const req = createMockRequest()
      const res = createMockResponse()

      await GET(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch events"
      })
    })

    it("should transform events with all expected fields", async () => {
      const mockEvent = createMockEvent({
        slug: "test-event",
        venue_address: "123 Test St",
        contact_email: "test@example.com",
        registration_deadline: new Date("2025-12-10T18:00:00Z"),
        content: {
          packages: [{ id: "1", name: "Standard" }],
          faqs: [{ question: "Test?", answer: "Yes" }],
          socialProof: { stats: { total_attendees: 100 } }
        }
      })
      mockEventService.list.mockResolvedValue([mockEvent])

      const req = createMockRequest()
      const res = createMockResponse()

      await GET(req, res)

      expect(res.json).toHaveBeenCalledWith({
        events: [
          expect.objectContaining({
            id: "event_123",
            title: "Test BBQ Event",
            event_date: expect.any(String),
            packages: [{ id: "1", name: "Standard" }],
            faqs: [{ question: "Test?", answer: "Yes" }],
            socialProof: { stats: { total_attendees: 100 } },
            spots_left: 30,
            is_bookable: true,
            is_upcoming: true,
            formatted_price: "89",
            slug: "test-event",
            venue_address: "123 Test St",
            contact_email: "test@example.com",
            registration_deadline: expect.any(String)
          })
        ],
        count: 1
      })
    })
  })

  describe("GET /store/bbq-events/[id]", () => {
    it("should return event by ID", async () => {
      const mockEvent = createMockEvent()
      mockEventService.retrieve.mockResolvedValue(mockEvent)

      const req = createMockRequest({}, { id: "event_123" })
      const res = createMockResponse()

      await GetSingle(req, res)

      expect(mockEventService.retrieve).toHaveBeenCalledWith("event_123")
      expect(res.json).toHaveBeenCalledWith({
        event: expect.objectContaining({
          id: "event_123",
          title: "Test BBQ Event",
          spots_left: 30,
          is_bookable: true
        })
      })
    })

    it("should fallback to slug lookup if ID not found", async () => {
      const mockEvent = createMockEvent()
      mockEventService.retrieve.mockRejectedValue({ type: "not_found" })
      mockEventService.retrieveBySlug.mockResolvedValue(mockEvent)

      const req = createMockRequest({}, { id: "test-event-slug" })
      const res = createMockResponse()

      await GetSingle(req, res)

      expect(mockEventService.retrieve).toHaveBeenCalledWith("test-event-slug")
      expect(mockEventService.retrieveBySlug).toHaveBeenCalledWith("test-event-slug")
      expect(res.json).toHaveBeenCalledWith({
        event: expect.objectContaining({
          id: "event_123"
        })
      })
    })

    it("should return 404 when event not found by ID or slug", async () => {
      mockEventService.retrieve.mockRejectedValue({ type: "not_found" })
      mockEventService.retrieveBySlug.mockRejectedValue({ type: "not_found" })

      const req = createMockRequest({}, { id: "nonexistent" })
      const res = createMockResponse()

      await GetSingle(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: "BBQ event not found"
      })
    })

    it("should return 404 for inactive events", async () => {
      const mockEvent = createMockEvent({ is_active: false })
      mockEventService.retrieve.mockResolvedValue(mockEvent)

      const req = createMockRequest({}, { id: "event_123" })
      const res = createMockResponse()

      await GetSingle(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: "BBQ event not found"
      })
    })

    it("should return 404 for non-active status events", async () => {
      const mockEvent = createMockEvent({ status: "cancelled" })
      mockEventService.retrieve.mockResolvedValue(mockEvent)

      const req = createMockRequest({}, { id: "event_123" })
      const res = createMockResponse()

      await GetSingle(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: "BBQ event not found"
      })
    })

    it("should return 400 when no ID provided", async () => {
      const req = createMockRequest({}, {})
      const res = createMockResponse()

      await GetSingle(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: "Event ID is required"
      })
    })

    it("should handle service errors", async () => {
      mockEventService.retrieve.mockRejectedValue(new Error("Database error"))

      const req = createMockRequest({}, { id: "event_123" })
      const res = createMockResponse()

      await GetSingle(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to fetch event"
      })
    })

    it("should include legacy compatibility fields", async () => {
      const mockEvent = createMockEvent()
      mockEventService.retrieve.mockResolvedValue(mockEvent)

      const req = createMockRequest({}, { id: "event_123" })
      const res = createMockResponse()

      await GetSingle(req, res)

      expect(res.json).toHaveBeenCalledWith({
        event: expect.objectContaining({
          menu_description: "Test description" // Legacy field
        })
      })
    })
  })
})