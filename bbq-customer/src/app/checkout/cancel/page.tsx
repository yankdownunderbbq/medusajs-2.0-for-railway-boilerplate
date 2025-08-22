import Link from 'next/link'

export default function CheckoutCancel() {
  return (
    <div className="max-w-md mx-auto text-center p-6">
      <div className="text-orange-500 text-6xl mb-4">⚠</div>
      <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-gray-600 mb-6">
        Your payment was cancelled. Your cart is still saved.
      </p>
      <Link 
        href="/event"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block"
      >
        Return to Booking
      </Link>
    </div>
  )
}