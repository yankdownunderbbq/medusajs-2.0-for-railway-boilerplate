import { Event, EventContent } from "../../modules/event/models/event"

describe("Event Model", () => {
  let event: Event

  beforeEach(() => {
    event = new Event()
    event.title = "Test BBQ Event"
    event.description = "A test BBQ event"
    event.bbq_region = "Kansas City"
    event.event_date = new Date("2025-12-15T18:00:00Z")
    event.duration_hours = 3
    event.location = "Brisbane Event Space"
    event.base_price = 8900
    event.max_capacity = 40
    event.current_bookings = 0
    event.content = {}
  })

  describe("constructor and basic properties", () => {
    it("should create an event with default values", () => {
      const newEvent = new Event()
      expect(newEvent.current_bookings).toBe(0)
      expect(newEvent.status).toBe("active")
      expect(newEvent.is_active).toBe(true)
      expect(newEvent.content).toEqual({})
    })

    it("should generate ID on beforeCreate", () => {
      expect(event.id).toBeUndefined()
      event.beforeCreate()
      expect(event.id).toBeDefined()
      expect(event.id).toMatch(/^event_/)
    })

    it("should generate slug from title on beforeCreate", () => {
      event.title = "Amazing BBQ Event with Special Characters!"
      event.beforeCreate()
      expect(event.slug).toBe("amazing-bbq-event-with-special-characters")
    })

    it("should update timestamp on beforeUpdate", () => {
      const originalUpdatedAt = event.updated_at
      setTimeout(() => {
        event.beforeUpdate()
        expect(event.updated_at).not.toEqual(originalUpdatedAt)
      }, 10)
    })
  })

  describe("helper methods", () => {
    describe("getSpotsLeft", () => {
      it("should return correct spots left", () => {
        event.max_capacity = 40
        event.current_bookings = 12
        expect(event.getSpotsLeft()).toBe(28)
      })

      it("should return 0 when fully booked", () => {
        event.max_capacity = 40
        event.current_bookings = 40
        expect(event.getSpotsLeft()).toBe(0)
      })

      it("should return 0 when overbooked", () => {
        event.max_capacity = 40
        event.current_bookings = 45
        expect(event.getSpotsLeft()).toBe(0)
      })
    })

    describe("isBookable", () => {
      it("should return true for active upcoming event with spots", () => {
        event.status = "active"
        event.is_active = true
        event.event_date = new Date(Date.now() + 86400000) // tomorrow
        event.max_capacity = 40
        event.current_bookings = 10
        expect(event.isBookable()).toBe(true)
      })

      it("should return false for inactive event", () => {
        event.is_active = false
        expect(event.isBookable()).toBe(false)
      })

      it("should return false for non-active status", () => {
        event.status = "cancelled"
        expect(event.isBookable()).toBe(false)
      })

      it("should return false for past event", () => {
        event.event_date = new Date(Date.now() - 86400000) // yesterday
        expect(event.isBookable()).toBe(false)
      })

      it("should return false for sold out event", () => {
        event.current_bookings = event.max_capacity
        expect(event.isBookable()).toBe(false)
      })

      it("should return false when past registration deadline", () => {
        event.registration_deadline = new Date(Date.now() - 3600000) // 1 hour ago
        expect(event.isBookable()).toBe(false)
      })
    })

    describe("getFormattedPrice", () => {
      it("should format price correctly", () => {
        event.base_price = 8900
        expect(event.getFormattedPrice()).toBe("89")
      })

      it("should handle zero price", () => {
        event.base_price = 0
        expect(event.getFormattedPrice()).toBe("0")
      })
    })

    describe("isUpcoming", () => {
      it("should return true for future event", () => {
        event.event_date = new Date(Date.now() + 86400000)
        expect(event.isUpcoming()).toBe(true)
      })

      it("should return false for past event", () => {
        event.event_date = new Date(Date.now() - 86400000)
        expect(event.isUpcoming()).toBe(false)
      })
    })

    describe("isPastDeadline", () => {
      it("should return false when no deadline set", () => {
        event.registration_deadline = undefined
        expect(event.isPastDeadline()).toBe(false)
      })

      it("should return true when past deadline", () => {
        event.registration_deadline = new Date(Date.now() - 3600000)
        expect(event.isPastDeadline()).toBe(true)
      })

      it("should return false when before deadline", () => {
        event.registration_deadline = new Date(Date.now() + 3600000)
        expect(event.isPastDeadline()).toBe(false)
      })
    })

    describe("canBeCancelled", () => {
      it("should return true when no cancellation deadline set", () => {
        event.cancellation_deadline = undefined
        expect(event.canBeCancelled()).toBe(true)
      })

      it("should return true when before cancellation deadline", () => {
        event.cancellation_deadline = new Date(Date.now() + 3600000)
        expect(event.canBeCancelled()).toBe(true)
      })

      it("should return false when past cancellation deadline", () => {
        event.cancellation_deadline = new Date(Date.now() - 3600000)
        expect(event.canBeCancelled()).toBe(false)
      })
    })

    describe("updateBookingCount", () => {
      it("should increment booking count", () => {
        event.current_bookings = 10
        event.updateBookingCount(5)
        expect(event.current_bookings).toBe(15)
      })

      it("should decrement booking count", () => {
        event.current_bookings = 15
        event.updateBookingCount(-5)
        expect(event.current_bookings).toBe(10)
      })

      it("should not go below zero", () => {
        event.current_bookings = 5
        event.updateBookingCount(-10)
        expect(event.current_bookings).toBe(0)
      })

      it("should update status to sold-out when reaching capacity", () => {
        event.current_bookings = 39
        event.max_capacity = 40
        event.status = "active"
        event.updateBookingCount(1)
        expect(event.status).toBe("sold-out")
      })

      it("should update status back to active when dropping below capacity", () => {
        event.current_bookings = 40
        event.max_capacity = 40
        event.status = "sold-out"
        event.updateBookingCount(-1)
        expect(event.status).toBe("active")
      })
    })
  })

  describe("slug generation", () => {
    it("should handle special characters", () => {
      event.title = "BBQ & Grill Event 2024!"
      event.beforeCreate()
      expect(event.slug).toBe("bbq-grill-event-2024")
    })

    it("should handle multiple spaces", () => {
      event.title = "Multiple    Spaces    Event"
      event.beforeCreate()
      expect(event.slug).toBe("multiple-spaces-event")
    })

    it("should handle leading/trailing spaces", () => {
      event.title = "  Trimmed Event  "
      event.beforeCreate()
      expect(event.slug).toBe("trimmed-event")
    })

    it("should handle consecutive dashes", () => {
      event.title = "Event---With---Dashes"
      event.beforeCreate()
      expect(event.slug).toBe("event-with-dashes")
    })
  })

  describe("EventContent interface", () => {
    it("should support packages content", () => {
      const content: EventContent = {
        packages: [
          {
            id: "standard",
            name: "Standard Package",
            description: "Basic package",
            price: 8900,
            includes: ["BBQ meal", "Sides", "Drinks"],
            delivery_options: ["pickup", "delivery"],
            max_quantity: 4
          }
        ]
      }
      event.content = content
      expect(event.content.packages).toHaveLength(1)
      expect(event.content.packages?.[0].name).toBe("Standard Package")
    })

    it("should support takeHomeProducts content", () => {
      const content: EventContent = {
        takeHomeProducts: [
          {
            id: "family-pack",
            name: "Family Pack",
            description: "Family-sized portion",
            price: 4500,
            category: "family",
            availability_status: "available"
          }
        ]
      }
      event.content = content
      expect(event.content.takeHomeProducts).toHaveLength(1)
    })

    it("should support social proof content", () => {
      const content: EventContent = {
        socialProof: {
          testimonials: [
            {
              name: "John Doe",
              comment: "Amazing BBQ!",
              rating: 5,
              event_attended: "previous-event"
            }
          ],
          stats: {
            total_attendees: 150,
            average_rating: 4.8,
            repeat_customer_rate: 0.65
          }
        }
      }
      event.content = content
      expect(event.content.socialProof?.testimonials).toHaveLength(1)
      expect(event.content.socialProof?.stats?.average_rating).toBe(4.8)
    })
  })
})