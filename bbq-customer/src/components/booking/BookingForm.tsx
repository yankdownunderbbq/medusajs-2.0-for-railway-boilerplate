import { useState } from 'react'
import { BBQEvent } from '@/lib/hooks/useBBQEvents'

interface BookingFormProps {
  event: BBQEvent
  onSubmit: (bookingData: BookingFormData) => Promise<void>
  isSubmitting?: boolean
}

export interface BookingFormData {
  bbq_event_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  number_of_guests: number
  package_type: 'standard' | 'premium' | 'family'
  dietary_requirements: string
  special_requests: string
}

export function BookingForm({ event, onSubmit, isSubmitting = false }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    bbq_event_id: event.id,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    number_of_guests: 1,
    package_type: 'standard',
    dietary_requirements: '',
    special_requests: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors: Record<string, string> = {}
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required'
    }
    
    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Please enter a valid email'
    }
    
    if (formData.number_of_guests < 1) {
      newErrors.number_of_guests = 'At least 1 guest is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    await onSubmit(formData)
  }

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getPackagePrice = (packageType: string) => {
    const pkg = event.packages?.find(p => p.type === packageType)
    if (!pkg) return event.base_price

    if (packageType === 'family') {
      return pkg.price
    }
    return pkg.price * formData.number_of_guests
  }

  const formatPrice = (priceInCents: number) => {
    return `$${priceInCents.toFixed(2)}`
  }

  return (
    <div className="booking-form">
      <div className="booking-form-header">
        <h2>Reserve Your Spot</h2>
        <p>Complete your booking for {event.title}</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form-content">
        <div className="form-section">
          <h3>Guest Information</h3>
          
          <div className="form-group">
            <label htmlFor="customer_name">Full Name *</label>
            <input
              type="text"
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              className={errors.customer_name ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.customer_name && <span className="error-message">{errors.customer_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customer_email">Email Address *</label>
            <input
              type="email"
              id="customer_email"
              value={formData.customer_email}
              onChange={(e) => handleInputChange('customer_email', e.target.value)}
              className={errors.customer_email ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.customer_email && <span className="error-message">{errors.customer_email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customer_phone">Phone Number</label>
            <input
              type="tel"
              id="customer_phone"
              value={formData.customer_phone}
              onChange={(e) => handleInputChange('customer_phone', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Booking Details</h3>
          
          <div className="form-group">
            <label htmlFor="number_of_guests">Number of Guests *</label>
            <input
              type="number"
              id="number_of_guests"
              min="1"
              max="10"
              value={formData.number_of_guests}
              onChange={(e) => handleInputChange('number_of_guests', parseInt(e.target.value) || 1)}
              className={errors.number_of_guests ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.number_of_guests && <span className="error-message">{errors.number_of_guests}</span>}
          </div>

          <div className="form-group">
            <label>Package Type</label>
            <div className="package-options">
              {event.packages?.map((pkg) => (
                <div key={pkg.type} className="package-option">
                  <input
                    type="radio"
                    id={pkg.type}
                    name="package_type"
                    value={pkg.type}
                    checked={formData.package_type === pkg.type}
                    onChange={(e) => handleInputChange('package_type', e.target.value)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor={pkg.type} className="package-label">
                    <div className="package-info">
                      <span className="package-name">{pkg.name}</span>
                      <span className="package-price">
                        {pkg.type === 'family' 
                          ? formatPrice(pkg.price)
                          : `${formatPrice(pkg.price)} per person`
                        }
                      </span>
                    </div>
                    <p className="package-description">{pkg.description}</p>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Special Requirements</h3>
          
          <div className="form-group">
            <label htmlFor="dietary_requirements">Dietary Requirements</label>
            <textarea
              id="dietary_requirements"
              value={formData.dietary_requirements}
              onChange={(e) => handleInputChange('dietary_requirements', e.target.value)}
              placeholder="Please let us know about any allergies or dietary restrictions..."
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="special_requests">Special Requests</label>
            <textarea
              id="special_requests"
              value={formData.special_requests}
              onChange={(e) => handleInputChange('special_requests', e.target.value)}
              placeholder="Any special requests or questions..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="booking-summary">
          <div className="summary-row">
            <span>Package:</span>
            <span>{event.packages?.find(p => p.type === formData.package_type)?.name}</span>
          </div>
          <div className="summary-row">
            <span>Guests:</span>
            <span>{formData.number_of_guests}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatPrice(getPackagePrice(formData.package_type))}</span>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Reserve Spot & Continue to Payment'}
        </button>
      </form>
    </div>
  )
}