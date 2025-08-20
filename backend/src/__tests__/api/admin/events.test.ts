import { GET, POST } from "../../../api/admin/events/route"

// Mock EventService
const mockEventService = {
  listAndCount: jest.fn(),
  create: jest.fn()
}

// Mock request and response
const createMockRequest = (query = {}, body = {}) => ({
  scope: {
    resolve: jest.fn(() => mockEventService)
  },
  query,
  body
})

const createMockResponse = () => {
  const res = {
    json: jest.fn(),
    status: jest.fn(() => res)
  }
  return res
}

describe("Admin Events API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /admin/events", () => {
    it("should return events with default pagination", async () => {
      const mockEvents = [
        { id: "event_1", title: "Event 1" },
        { id: "event_2", title: "Event 2" }
      ]
      mockEventService.listAndCount.mockResolvedValue([mockEvents, 2])

      const req = createMockRequest()
      const res = createMockResponse()

      await GET(req, res)

      expect(mockEventService.listAndCount).toHaveBeenCalledWith({}, {})
      expect(res.json).toHaveBeenCalledWith({
        events: mockEvents,
        count: 2,
        offset: 0,
        limit: 2
      })
    })

    it("should handle query filters", async () => {
      const mockEvents = [{ id: "event_1", title: "KC Event" }]
      mockEventService.listAndCount.mockResolvedValue([mockEvents, 1])

      const query = {
        bbq_region: "Kansas City",
        status: "active",
        limit: "10",
        offset: "5",
        order: "event_date:DESC"
      }

      const req = createMockRequest(query)
      const res = createMockResponse()

      await GET(req, res)

      expect(mockEventService.listAndCount).toHaveBeenCalledWith(
        {
          bbq_region: "Kansas City",
          status: "active"
        },
        {
          take: 10,
          skip: 5,
          order: { event_date: "DESC" }
        }
      )
      expect(res.json).toHaveBeenCalledWith({
        events: mockEvents,
        count: 1,
        offset: 5,
        limit: 10
      })
    })

    it("should handle date range filters", async () => {
      const mockEvents = []
      mockEventService.listAndCount.mockResolvedValue([mockEvents, 0])

      const query = {
        event_date_gte: "2025-01-01T00:00:00Z",
        event_date_lte: "2025-12-31T23:59:59Z"
      }

      const req = createMockRequest(query)
      const res = createMockResponse()

      await GET(req, res)

      expect(mockEventService.listAndCount).toHaveBeenCalledWith(
        {
          event_date: {
            gte: new Date("2025-01-01T00:00:00Z"),
            lte: new Date("2025-12-31T23:59:59Z")
          }
        },
        {}
      )
    })

    it("should handle validation errors", async () => {
      const query = {
        limit: "invalid"
      }

      const req = createMockRequest(query)
      const res = createMockResponse()

      await GET(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String)
        })
      )
    })

    it("should handle service errors", async () => {
      mockEventService.listAndCount.mockRejectedValue(new Error("Database error"))

      const req = createMockRequest()
      const res = createMockResponse()

      await GET(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error"
      })
    })
  })

  describe("POST /admin/events", () => {
    const validEventData = {
      title: "Test BBQ Event",
      description: "A test event",
      bbq_region: "Kansas City",
      event_date: "2025-12-15T18:00:00Z",
      duration_hours: 3,
      location: "Test Location",
      base_price: 8900,
      max_capacity: 40
    }

    it("should create an event successfully", async () => {
      const mockEvent = { id: "event_123", ...validEventData }
      mockEventService.create.mockResolvedValue(mockEvent)

      const req = createMockRequest({}, validEventData)
      const res = createMockResponse()

      await POST(req, res)

      expect(mockEventService.create).toHaveBeenCalledWith({
        ...validEventData,
        event_date: new Date(validEventData.event_date)
      })
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        event: mockEvent,
        message: "Event created successfully"
      })
    })

    it("should handle validation errors", async () => {
      const invalidData = {
        ...validEventData,
        title: "", // Invalid empty title
        base_price: -100 // Invalid negative price
      }

      const req = createMockRequest({}, invalidData)
      const res = createMockResponse()

      await POST(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Validation failed",
          errors: expect.any(Array)
        })
      )
    })

    it("should handle service errors", async () => {
      mockEventService.create.mockRejectedValue(new Error("Creation failed"))

      const req = createMockRequest({}, validEventData)
      const res = createMockResponse()

      await POST(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: "Creation failed"
      })
    })

    it("should handle optional fields", async () => {
      const dataWithOptionals = {
        ...validEventData,
        status: "draft",
        image_url: "https://example.com/image.jpg",
        registration_deadline: "2025-12-10T18:00:00Z",
        content: {
          packages: [
            {
              id: "standard",
              name: "Standard Package",
              description: "Basic package",
              price: 8900,
              includes: ["BBQ", "Sides"],
              delivery_options: ["pickup"]
            }
          ]
        }
      }

      const mockEvent = { id: "event_123", ...dataWithOptionals }
      mockEventService.create.mockResolvedValue(mockEvent)

      const req = createMockRequest({}, dataWithOptionals)
      const res = createMockResponse()

      await POST(req, res)

      expect(mockEventService.create).toHaveBeenCalledWith({
        ...dataWithOptionals,
        event_date: new Date(dataWithOptionals.event_date),
        registration_deadline: new Date(dataWithOptionals.registration_deadline)
      })
      expect(res.status).toHaveBeenCalledWith(201)
    })
  })
})