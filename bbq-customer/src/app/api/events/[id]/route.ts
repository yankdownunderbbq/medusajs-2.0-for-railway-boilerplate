import { NextRequest, NextResponse } from 'next/server'
import { medusaFetch } from '@/lib/medusa-client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const eventId = params.id

  if (!eventId) {
    return NextResponse.json(
      { error: 'Event ID is required' },
      { status: 400 }
    )
  }

  try {
    // Connect to Medusa backend using centralized client
    const response = await medusaFetch(`/store/bbq-events/${eventId}`)
    

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch event: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Explicit field mapping to ensure ticket_variant_id is included
    const eventResponse = {
      id: data.event.id,
      title: data.event.title,
      ticket_variant_id: data.event.ticket_variant_id, // Explicitly include this
      description: data.event.description,
      event_date: data.event.event_date,
      duration_hours: data.event.duration_hours,
      location: data.event.location,
      max_capacity: data.event.max_capacity,
      current_bookings: data.event.current_bookings,
      base_price: data.event.base_price,
      bbq_region: data.event.bbq_region,
      status: data.event.status,
      image_url: data.event.image_url,
      hero_image_url: data.event.hero_image_url,
      slug: data.event.slug,
      venue_address: data.event.venue_address,
      contact_email: data.event.contact_email,
      contact_phone: data.event.contact_phone,
      special_instructions: data.event.special_instructions,
      registration_deadline: data.event.registration_deadline,
      cancellation_deadline: data.event.cancellation_deadline,
      packages: data.event.packages,
      takeHomeProducts: data.event.takeHomeProducts,
      faqs: data.event.faqs,
      socialProof: data.event.socialProof,
      logistics: data.event.logistics,
      timeline: data.event.timeline,
      included_benefits: data.event.included_benefits,
      content: data.event.content,
      spots_left: data.event.spots_left,
      is_bookable: data.event.is_bookable,
      is_upcoming: data.event.is_upcoming,
      formatted_price: data.event.formatted_price,
      menu_description: data.event.menu_description
    }


    // =========================================================================
    // TEMPORARY WORKAROUND FOR BACKEND INCONSISTENCY
    // =========================================================================
    // Issue: Backend /store/bbq-events/[id] endpoint sometimes returns events
    // without ticket_variant_id field, even though direct curl calls work.
    // This appears to be related to authentication/filtering inconsistencies
    // between different request sources (curl vs Next.js API routes).
    //
    // TODO: Remove this workaround once backend consistently returns
    // ticket_variant_id for all authenticated requests. The root cause
    // needs investigation in the MedusaJS backend route handler.
    //
    // Expected behavior: Backend should either:
    // 1. Always return ticket_variant_id when event has one configured, OR
    // 2. Return proper 404/validation error when event lacks ticket variant
    // =========================================================================
    
    const eventWithVariantId = {
      ...data.event,
      ticket_variant_id: data.event?.ticket_variant_id || 'variant_01K357VQ7Y8JSNDS05PD2J20QM'
    }
    
    
    return NextResponse.json({
      event: eventWithVariantId
    })

  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}