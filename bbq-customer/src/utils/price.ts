/**
 * Price formatting utilities for Medusa v2.0
 * 
 * IMPORTANT: Backend stores prices as cents, but we display as dollars
 * - API returns 2500 = $25.00 (2500 cents = $25.00)
 * - API returns 1500 = $15.00 (1500 cents = $15.00)
 * 
 * This utility handles the conversion from cents (backend) to dollars (display)
 */

/**
 * Format a price amount for display
 * @param amount - Price amount from Medusa API (in cents)
 * @param currency - Currency code (default: 'AUD')
 * @param locale - Locale for formatting (default: 'en-AU')
 * @returns Formatted price string
 */
export function formatPrice(
  amount: number | string,
  currency: string = 'AUD',
  locale: string = 'en-AU'
): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numericAmount)) {
    return '$0.00'
  }
  
  // ✅ CORRECT: Convert cents to dollars for display
  const dollarAmount = numericAmount / 100
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollarAmount)
}

/**
 * Format a simple price with just dollar sign and amount
 * @param amount - Price amount from Medusa API (in cents)
 * @returns Simple formatted price string (e.g., "$25.00")
 */
export function formatSimplePrice(amount: number | string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numericAmount)) {
    return '$0.00'
  }
  
  // ✅ CORRECT: Convert cents to dollars for display
  const dollarAmount = numericAmount / 100
  return `$${dollarAmount.toFixed(2)}`
}

/**
 * Calculate line item total (price × quantity)
 * @param unitPrice - Unit price from Medusa API (in dollars)
 * @param quantity - Quantity of items
 * @returns Total amount (in dollars)
 */
export function calculateLineTotal(unitPrice: number, quantity: number): number {
  return unitPrice * quantity
}

/**
 * Format a line item total for display
 * @param unitPrice - Unit price from Medusa API (in dollars)
 * @param quantity - Quantity of items
 * @param currency - Currency code (default: 'AUD')
 * @returns Formatted line total string
 */
export function formatLineTotal(
  unitPrice: number,
  quantity: number,
  currency: string = 'AUD'
): string {
  const total = calculateLineTotal(unitPrice, quantity)
  return formatPrice(total, currency)
}

/**
 * Format cart total for display
 * @param total - Cart total from Medusa API (in dollars)
 * @param currency - Currency code (default: 'AUD')
 * @returns Formatted cart total string
 */
export function formatCartTotal(total: number, currency: string = 'AUD'): string {
  return formatPrice(total, currency)
}

/**
 * DEPRECATED FUNCTIONS - DO NOT USE
 * These functions incorrectly divide by 100 (for Medusa v1.x which used cents)
 */

/**
 * @deprecated Use formatPrice() instead - this incorrectly treats dollars as cents
 */
export function formatPriceCents(amount: number): string {
  console.warn('formatPriceCents is deprecated - use formatPrice() instead')
  return formatPrice(amount / 100)
}

/**
 * @deprecated Use formatSimplePrice() instead - this incorrectly treats dollars as cents
 */
export function formatSimplePriceCents(amount: number): string {
  console.warn('formatSimplePriceCents is deprecated - use formatSimplePrice() instead')
  return formatSimplePrice(amount / 100)
}