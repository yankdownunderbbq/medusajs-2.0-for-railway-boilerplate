import { NextRequest, NextResponse } from 'next/server'

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
    const backendUrl = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/bbq-events/${eventId}`
    
    console.log('=== REQUEST DEBUG ===')
    console.log('URL:', backendUrl)
    console.log('Headers being sent:', {
      'Content-Type': 'application/json',
      'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    })
    console.log('Request method: GET')
    console.log('Environment variables:')
    console.log('- NEXT_PUBLIC_MEDUSA_BACKEND_URL:', process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL)
    console.log('- NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)
    
    // Connect to Medusa backend using the same pattern as useBBQEvents
    const response = await fetch(backendUrl, {
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
        }
      }
    )
    
    console.log('=== RESPONSE DEBUG ===')
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch event: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Raw backend response:', JSON.stringify(data, null, 2))
    
    // Detailed response analysis
    console.log('=== BACKEND RESPONSE ANALYSIS ===')
    console.log('Response data type:', typeof data)
    console.log('Has event property:', 'event' in data)
    console.log('Event object exists:', !!data.event)
    console.log('Event object type:', typeof data.event)
    
    if (data.event) {
      console.log('Event object keys:', Object.keys(data.event))
      console.log('ticket_variant_id value:', data.event.ticket_variant_id)
      console.log('ticket_variant_id type:', typeof data.event.ticket_variant_id)
      console.log('ticket_variant_id === null:', data.event.ticket_variant_id === null)
      console.log('ticket_variant_id === undefined:', data.event.ticket_variant_id === undefined)
      console.log('ticket_variant_id === "":', data.event.ticket_variant_id === "")
      console.log('Has ticket_variant_id property:', 'ticket_variant_id' in data.event)
    }
    
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

    // Before returning, add:
    console.log('=== DEBUG: What we are returning ===') 
    console.log('Final event object:', JSON.stringify(eventResponse, null, 2))

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
    
    console.log('=== FINAL FRONTEND RESPONSE ===')
    console.log('Original ticket_variant_id:', data.event?.ticket_variant_id)
    console.log('Using fallback?', !data.event?.ticket_variant_id)
    console.log('Final ticket_variant_id:', eventWithVariantId.ticket_variant_id)
    
    console.log('=== CURL COMPARISON ===')
    console.log('To compare with working curl, run this command:')
    console.log(`curl -H "Content-Type: application/json" -H "x-publishable-api-key: ${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}" "${backendUrl}"`)
    console.log('Compare the ticket_variant_id value in both responses!')
    
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