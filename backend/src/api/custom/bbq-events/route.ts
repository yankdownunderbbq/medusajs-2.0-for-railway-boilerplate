import { NextRequest, NextResponse } from 'next/server'

// GET /api/custom/bbq-events - Get all available BBQ events
export async function GET(req: NextRequest) {
  try {
    // Mock data - this would come from database in real implementation
    const events = [
      {
        id: "bbq_event_1",
        title: "Kansas City BBQ Experience",
        description: "Experience authentic Kansas City BBQ with our signature burnt ends, dry rub ribs, and traditional sides.",
        event_date: "2025-09-15T18:00:00Z",
        duration_hours: 3,
        location: "Brisbane Event Space",
        max_capacity: 40,
        current_bookings: 12,
        base_price: 8900, // $89.00 in cents
        bbq_region: "Kansas City",
        menu_description: "Burnt ends, dry rub ribs, brisket, coleslaw, beans, and cornbread",
        status: "published",
        packages: [
          {
            type: "standard",
            name: "Standard Experience",
            price: 8900, // $89.00
            description: "Full BBQ experience with all signature items, sides, and drinks included."
          },
          {
            type: "premium",
            name: "Premium Experience", 
            price: 12900, // $129.00
            description: "Enhanced experience with premium cuts, additional sides, craft beer pairings, and take-home sauce."
          },
          {
            type: "family",
            name: "Family Package",
            price: 6900, // $69.00 per person
            description: "Perfect for families with kid-friendly portions and activities. Ages 12 and under get reduced pricing."
          }
        ]
      },
      {
        id: "bbq_event_2", 
        title: "Carolina Whole Hog BBQ",
        description: "Traditional Carolina whole hog BBQ with authentic vinegar-based sauce and regional sides.",
        event_date: "2026-02-14T18:00:00Z",
        duration_hours: 3,
        location: "Brisbane Event Space",
        max_capacity: 35,
        current_bookings: 8,
        base_price: 9500, // $95.00 in cents
        bbq_region: "Carolina",
        menu_description: "Whole hog pulled pork, vinegar sauce, hush puppies, slaw, and mac & cheese",
        status: "published",
        packages: [
          {
            type: "standard",
            name: "Standard Experience",
            price: 9500, // $95.00
            description: "Authentic Carolina whole hog experience with traditional sides and regional beverages."
          },
          {
            type: "premium", 
            name: "Premium Experience",
            price: 13500, // $135.00
            description: "Premium cuts with chef demonstrations, bourbon pairings, and artisanal sides."
          },
          {
            type: "family",
            name: "Family Package", 
            price: 7500, // $75.00 per person
            description: "Family-style serving with mild sauce options and kid-friendly activities."
          }
        ]
      },
      {
        id: "bbq_event_3",
        title: "Memphis Dry Rub Ribs",
        description: "Memphis-style dry rub ribs with traditional preparation methods and authentic sides.",
        event_date: "2026-05-19T18:00:00Z", 
        duration_hours: 3,
        location: "Brisbane Event Space",
        max_capacity: 45,
        current_bookings: 3,
        base_price: 8700, // $87.00 in cents
        bbq_region: "Memphis",
        menu_description: "Dry rub ribs, wet ribs option, brisket, coleslaw, and banana pudding",
        status: "published",
        packages: [
          {
            type: "standard",
            name: "Standard Experience",
            price: 8700, // $87.00
            description: "Memphis-style ribs with choice of dry rub or wet, traditional sides, and sweet tea."
          },
          {
            type: "premium",
            name: "Premium Experience",
            price: 12400, // $124.00 
            description: "Both rib styles, premium brisket, craft beer selection, and signature banana pudding."
          },
          {
            type: "family",
            name: "Family Package",
            price: 6700, // $67.00 per person
            description: "Family portions with mild spice options and dessert for the kids."
          }
        ]
      }
    ]

    return NextResponse.json({
      events,
      count: events.length
    })

  } catch (error) {
    console.error('Error fetching BBQ events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}