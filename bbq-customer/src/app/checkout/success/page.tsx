'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Clock, MapPin, Calendar, Package, ArrowRight, Mail, Phone } from 'lucide-react'
import { Suspense } from 'react'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">Thank you for booking your Kansas City BBQ Experience</p>
          {orderId && (
            <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>
          )}
        </div>

        {/* Confirmation Details */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What's Next?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100">
                    <Mail className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Confirmation Email Sent</h3>
                  <p className="text-sm text-gray-600">You'll receive a confirmation email with your booking details shortly.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Event Preparation</h3>
                  <p className="text-sm text-gray-600">Event details and preparation instructions will be sent 24 hours before your experience.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100">
                    <MapPin className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Event Location</h3>
                  <p className="text-sm text-gray-600">123 Queen Street, Brisbane - Detailed directions will be provided in your confirmation email.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100">
                    <Package className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Take-Home Packages</h3>
                  <p className="text-sm text-gray-600">Any take-home BBQ packages you ordered can be collected at the end of the experience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Details */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your BBQ Experience</h2>
            
            <div className="border-l-4 border-orange-500 pl-4 mb-4">
              <h3 className="text-lg font-medium text-gray-900">Kansas City BBQ Experience</h3>
              <p className="text-sm text-gray-600 mt-1">
                Authentic burnt ends tasting, regional BBQ education, exclusive store benefits, and priority access to take-home packages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">September 15, 2025</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">6:00 PM - 10:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Brisbane, Australia</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">4-hour experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg text-lg
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20
              transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>Back to Home</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          <button
            onClick={() => window.print()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20
              transition-colors duration-200"
          >
            Print Confirmation
          </button>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-2">Need help or have questions about your booking?</p>
          <p>
            Contact us at{' '}
            <a href="mailto:support@yankdownunder.com" className="text-orange-600 hover:text-orange-700">
              support@yankdownunder.com
            </a>{' '}
            or call{' '}
            <a href="tel:+61-400-000-000" className="text-orange-600 hover:text-orange-700">
              +61 400 000 000
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

function CheckoutSuccessFallback() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading checkout success...</p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<CheckoutSuccessFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}