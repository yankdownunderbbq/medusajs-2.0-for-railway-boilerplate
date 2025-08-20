import { Entity, PrimaryKey, Property, BeforeCreate, BeforeUpdate, Index } from "@mikro-orm/core"
import { generateEntityId } from "@medusajs/utils"

export interface EventContent {
  packages?: Array<{
    id: string
    name: string
    description: string
    price: number
    includes: string[]
    delivery_options: string[]
    max_quantity?: number
  }>
  takeHomeProducts?: Array<{
    id: string
    name: string
    description: string
    price: number
    category: string
    image_url?: string
    availability_status: 'available' | 'limited' | 'sold_out'
  }>
  faqs?: Array<{
    question: string
    answer: string
    category?: string
  }>
  socialProof?: {
    testimonials?: Array<{
      name: string
      comment: string
      rating: number
      event_attended?: string
    }>
    stats?: {
      total_attendees?: number
      average_rating?: number
      repeat_customer_rate?: number
    }
  }
  logistics?: {
    what_to_bring?: string[]
    parking_info?: string
    public_transport?: string
    accessibility?: string[]
    dietary_accommodations?: string[]
  }
  timeline?: Array<{
    time_offset_minutes: number
    title: string
    description: string
    icon?: string
  }>
  included_benefits?: Array<{
    title: string
    description: string
    value?: string
    category: 'main_event' | 'store_benefits' | 'exclusive_access'
  }>
}

@Entity({ tableName: "events" })
@Index({ properties: ["event_date"] })
@Index({ properties: ["bbq_region"] })
@Index({ properties: ["status"] })
export class Event {
  @PrimaryKey({ columnType: "varchar" })
  id: string

  @Property({ columnType: "varchar", length: 255 })
  title: string

  @Property({ columnType: "text" })
  description: string

  @Property({ columnType: "varchar", length: 100 })
  bbq_region: string

  @Property({ columnType: "timestamptz" })
  event_date: Date

  @Property({ columnType: "int" })
  duration_hours: number

  @Property({ columnType: "varchar", length: 500 })
  location: string

  @Property({ columnType: "int" })
  base_price: number

  @Property({ columnType: "int" })
  max_capacity: number

  @Property({ columnType: "int", default: 0 })
  current_bookings: number = 0

  @Property({ 
    columnType: "varchar", 
    length: 50, 
    default: "active" 
  })
  status: "draft" | "active" | "sold-out" | "cancelled" | "completed" = "active"

  @Property({ columnType: "varchar", length: 255, nullable: true })
  image_url?: string

  @Property({ columnType: "varchar", length: 255, nullable: true })
  hero_image_url?: string

  @Property({ columnType: "jsonb" })
  content: EventContent = {}

  @Property({ columnType: "timestamptz", nullable: true })
  registration_deadline?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  cancellation_deadline?: Date

  @Property({ columnType: "boolean", default: true })
  is_active: boolean = true

  @Property({ columnType: "varchar", length: 500, nullable: true })
  venue_address?: string

  @Property({ columnType: "varchar", length: 255, nullable: true })
  contact_email?: string

  @Property({ columnType: "varchar", length: 50, nullable: true })
  contact_phone?: string

  @Property({ columnType: "text", nullable: true })
  special_instructions?: string

  @Property({ columnType: "varchar", length: 255, nullable: true })
  slug?: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz", defaultRaw: "now()" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", defaultRaw: "now()", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @BeforeCreate()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "event")
    }
    
    if (!this.slug && this.title) {
      this.slug = this.generateSlug(this.title)
    }
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updated_at = new Date()
    
    if (this.title && !this.slug) {
      this.slug = this.generateSlug(this.title)
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Helper methods
  getSpotsLeft(): number {
    return Math.max(0, this.max_capacity - this.current_bookings)
  }

  isBookable(): boolean {
    return this.status === "active" && 
           this.is_active && 
           this.getSpotsLeft() > 0 && 
           new Date() < this.event_date &&
           (!this.registration_deadline || new Date() < this.registration_deadline)
  }

  getFormattedPrice(): string {
    return (this.base_price / 100).toFixed(0)
  }

  isUpcoming(): boolean {
    return this.event_date > new Date()
  }

  isPastDeadline(): boolean {
    if (!this.registration_deadline) return false
    return new Date() > this.registration_deadline
  }

  canBeCancelled(): boolean {
    if (!this.cancellation_deadline) return true
    return new Date() < this.cancellation_deadline
  }

  updateBookingCount(change: number): void {
    this.current_bookings = Math.max(0, this.current_bookings + change)
    
    if (this.current_bookings >= this.max_capacity && this.status === "active") {
      this.status = "sold-out"
    } else if (this.current_bookings < this.max_capacity && this.status === "sold-out") {
      this.status = "active"
    }
  }
}