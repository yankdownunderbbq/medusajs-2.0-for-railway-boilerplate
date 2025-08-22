interface CreateCartData {
  eventTicketVariantId: string
  ticketQuantity: number
  selectedPackages: Record<string, number>
  regionId: string
  customerEmail?: string
}

export async function createEventCart(data: CreateCartData): Promise<string> {
  try {
    // Create cart
    const cartResponse = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
        },
        body: JSON.stringify({
          region_id: data.regionId,
          email: data.customerEmail
        })
      }
    )

    if (!cartResponse.ok) {
      throw new Error('Failed to create cart')
    }

    const cartData = await cartResponse.json()
    const cartId = cartData.cart.id

    // Add event ticket to cart
    await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
        },
        body: JSON.stringify({
          variant_id: data.eventTicketVariantId,
          quantity: data.ticketQuantity
        })
      }
    )

    // Add BBQ packages to cart
    for (const [variantId, quantity] of Object.entries(data.selectedPackages)) {
      if (quantity > 0) {
        await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
            },
            body: JSON.stringify({
              variant_id: variantId,
              quantity: quantity
            })
          }
        )
      }
    }

    return cartId
  } catch (error) {
    console.error('Error creating cart:', error)
    throw error
  }
}

export function redirectToCheckout(cartId: string): void {
  window.location.href = `/checkout/${cartId}`
}

export async function getDefaultRegion(): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/regions`,
      {
        headers: {
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch regions')
    }

    const data = await response.json()
    // Look for AUD region first, fallback to first region
    const audRegion = data.regions.find((region: any) => 
      region.currency_code === 'aud' || region.name.toLowerCase().includes('australia')
    )
    
    return audRegion?.id || data.regions[0]?.id || 'reg_default'
  } catch (error) {
    console.error('Error fetching regions:', error)
    return 'reg_default'
  }
}