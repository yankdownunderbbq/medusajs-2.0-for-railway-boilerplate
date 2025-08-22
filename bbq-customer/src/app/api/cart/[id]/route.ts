import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cartId = params.id

    // For now, return mock cart data to match the interface
    // TODO: Replace with actual Medusa cart API call
    const mockCart = {
      id: cartId,
      items: [
        {
          id: '1',
          title: 'Kansas City BBQ Experience',
          quantity: 2,
          unit_price: 2500, // In cents
        },
        {
          id: '2', 
          title: 'Kansas City Burnt Ends - 250g',
          quantity: 1,
          unit_price: 3000, // In cents
        }
      ],
      total: 8000 // In cents
    }

    return NextResponse.json(mockCart)
  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}