'use client'

import Link from 'next/link'

interface CartItem {
  packageId: string
  title: string
  price: number
  quantity: number
  region: string
}

interface CartSummaryProps {
  items: CartItem[]
  eventPrice: number
}

export function CartSummary({ items, eventPrice }: CartSummaryProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal + eventPrice

  if (totalItems === 0) {
    return (
      <div className="bg-cream rounded-3xl p-8 text-center">
        <i className="fas fa-shopping-cart text-4xl text-text-muted mb-4"></i>
        <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
          Select Your BBQ Packages
        </h3>
        <p className="text-text-secondary">
          Choose quantities from the regional BBQ packages above to continue.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-warm-white rounded-3xl p-8 shadow-medium sticky top-24">
      <h3 className="font-display text-2xl font-bold text-text-primary mb-6 flex items-center">
        <i className="fas fa-receipt mr-3 text-warm-copper"></i>
        Order Summary
      </h3>

      {/* Event Entry */}
      <div className="mb-6 p-4 bg-cream rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-display font-semibold text-text-primary">
              Event Entry
            </h4>
            <p className="text-sm text-text-secondary">
              Access to BBQ experience + venue discounts
            </p>
          </div>
          <div className="text-right">
            <div className="font-display font-bold text-warm-copper">
              ${eventPrice}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.packageId} className="flex justify-between items-center py-2 border-b border-text-muted/20">
            <div>
              <h4 className="font-display font-semibold text-text-primary">
                {item.title}
              </h4>
              <p className="text-sm text-text-secondary">
                {item.region} • Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-text-primary">
                ${item.price * item.quantity}
              </div>
              {item.quantity > 1 && (
                <div className="text-xs text-text-secondary">
                  ${item.price} each
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-text-muted/20 pt-4 mb-6 space-y-2">
        <div className="flex justify-between text-text-secondary">
          <span>BBQ Packages:</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Event Entry:</span>
          <span>${eventPrice}</span>
        </div>
        <div className="flex justify-between font-display text-xl font-bold text-text-primary">
          <span>Total:</span>
          <span className="text-warm-copper">${total}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link 
        href="/checkout"
        className="block w-full bg-warm-copper text-warm-white py-4 px-6 rounded-lg font-display text-base font-semibold uppercase tracking-wide text-center transition-all duration-medium hover:bg-accent-hover hover:-translate-y-1 hover:shadow-copper"
      >
        <i className="fas fa-credit-card mr-2"></i>
        Proceed to Checkout
      </Link>

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <p className="text-xs text-text-muted flex items-center justify-center">
          <i className="fas fa-lock mr-1"></i>
          Secure checkout powered by Stripe
        </p>
      </div>
    </div>
  )
}