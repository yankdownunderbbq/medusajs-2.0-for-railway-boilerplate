// Types and interfaces for the Event service

export interface EventSelector {
  id?: string
  title?: string
  bbq_region?: string
  status?: "draft" | "active" | "sold-out" | "cancelled" | "completed"
  is_active?: boolean
  slug?: string
  event_date?: {
    gte?: Date
    lte?: Date
    gt?: Date
    lt?: Date
  }
}

export interface EventContent {
  productIds?: string[]
  packages?: Array<{
    id?: string
    name?: string
    description?: string
    price?: number
    includes?: string[]
    delivery_options?: string[]
    max_quantity?: number
  }>
  takeHomeProducts?: Array<{
    id?: string
    name?: string
    description?: string
    price?: number
    category?: string
    image_url?: string
    availability_status?: 'available' | 'limited' | 'sold_out'
  }>
  faqs?: Array<{
    question?: string
    answer?: string
    category?: string
  }>
  socialProof?: {
    testimonials?: Array<{
      name?: string
      comment?: string
      rating?: number
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
    time_offset_minutes?: number
    title?: string
    description?: string
    icon?: string
  }>
  included_benefits?: Array<{
    title?: string
    description?: string
    value?: string
    category?: 'main_event' | 'store_benefits' | 'exclusive_access'
  }>
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
  ticket_variant_id?: string
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
  ticket_variant_id?: string
  metadata?: Record<string, any>
  current_bookings?: number
}

export interface EventListConfig {
  skip?: number
  take?: number
  order?: Record<string, 'ASC' | 'DESC'>
}

// API request body interfaces
export interface BBQBookingRequestBody {
  bbq_event_id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  number_of_guests: number
  package_type?: 'standard' | 'premium' | 'family'
  dietary_requirements?: string
  special_requests?: string
}

export interface PaymentRequestBody {
  booking_id: string
  return_url?: string
}

export interface CreatePaymentIntentRequestBody {
  amount: number
  booking_id: string
  customer_email?: string
}