'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface EventPackage {
  name: string
  price: number
  description: string
}

interface EventForm {
  title: string
  description: string
  date: string
  time: string
  duration: string
  venue: string
  location: string
  capacity: number
  price: number
  status: 'draft' | 'active'
  packages: EventPackage[]
}

export default function NewEventPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<EventForm>({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '4 hours',
    venue: 'BBQ Galore Brisbane',
    location: 'Brisbane CBD',
    capacity: 30,
    price: 25,
    status: 'draft',
    packages: [
      { name: 'Starter Pack', price: 15, description: '' },
      { name: 'Master Pack', price: 25, description: '' },
      { name: 'Regional Combo', price: 35, description: '' }
    ]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof EventForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePackageChange = (index: number, field: keyof EventPackage, value: any) => {
    const updatedPackages = [...formData.packages]
    updatedPackages[index] = { ...updatedPackages[index], [field]: value }
    setFormData(prev => ({ ...prev, packages: updatedPackages }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Event title is required'
    if (!formData.description.trim()) newErrors.description = 'Event description is required'
    if (!formData.date) newErrors.date = 'Event date is required'
    if (!formData.time) newErrors.time = 'Event time is required'
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1'
    if (formData.price < 0) newErrors.price = 'Price must be 0 or greater'

    // Validate date is in the future
    if (formData.date) {
      const eventDate = new Date(formData.date + 'T' + formData.time)
      if (eventDate <= new Date()) {
        newErrors.date = 'Event date must be in the future'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real app, this would make an API call to create the event
    console.log('Creating event:', formData)

    // Redirect to events list
    router.push('/admin/events')
  }

  return (
    <div className="admin-new-event">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <nav className="breadcrumb">
              <Link href="/admin">Admin</Link>
              <span className="separator">/</span>
              <Link href="/admin/events">Events</Link>
              <span className="separator">/</span>
              <span>New Event</span>
            </nav>
            <h1 className="admin-title">Create New Event</h1>
            <p className="admin-subtitle">
              Set up a new BBQ popup experience for your customers
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-sections">
            {/* Basic Information */}
            <div className="form-section">
              <h2 className="form-section-title">
                <i className="fas fa-info-circle"></i>
                Basic Information
              </h2>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="title" className="form-label">Event Title *</label>
                  <input
                    type="text"
                    id="title"
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Kansas City Burnt Ends Experience"
                  />
                  {errors.title && <span className="form-error">{errors.title}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea
                    id="description"
                    rows={4}
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what attendees will learn and experience..."
                  />
                  {errors.description && <span className="form-error">{errors.description}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="date" className="form-label">Event Date *</label>
                  <input
                    type="date"
                    id="date"
                    className={`form-input ${errors.date ? 'error' : ''}`}
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                  {errors.date && <span className="form-error">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="time" className="form-label">Start Time *</label>
                  <input
                    type="time"
                    id="time"
                    className={`form-input ${errors.time ? 'error' : ''}`}
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                  {errors.time && <span className="form-error">{errors.time}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="duration" className="form-label">Duration</label>
                  <select
                    id="duration"
                    className="form-input"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                  >
                    <option value="2 hours">2 hours</option>
                    <option value="3 hours">3 hours</option>
                    <option value="4 hours">4 hours</option>
                    <option value="5 hours">5 hours</option>
                    <option value="6 hours">6 hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Capacity */}
            <div className="form-section">
              <h2 className="form-section-title">
                <i className="fas fa-map-marker-alt"></i>
                Location & Capacity
              </h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="venue" className="form-label">Venue Name *</label>
                  <input
                    type="text"
                    id="venue"
                    className={`form-input ${errors.venue ? 'error' : ''}`}
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    placeholder="e.g., BBQ Galore Brisbane"
                  />
                  {errors.venue && <span className="form-error">{errors.venue}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">Location *</label>
                  <input
                    type="text"
                    id="location"
                    className={`form-input ${errors.location ? 'error' : ''}`}
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Brisbane CBD"
                  />
                  {errors.location && <span className="form-error">{errors.location}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="capacity" className="form-label">Max Capacity *</label>
                  <input
                    type="number"
                    id="capacity"
                    min="1"
                    className={`form-input ${errors.capacity ? 'error' : ''}`}
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                  />
                  {errors.capacity && <span className="form-error">{errors.capacity}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="price" className="form-label">Base Price (AUD) *</label>
                  <input
                    type="number"
                    id="price"
                    min="0"
                    step="0.01"
                    className={`form-input ${errors.price ? 'error' : ''}`}
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  />
                  {errors.price && <span className="form-error">{errors.price}</span>}
                </div>
              </div>
            </div>

            {/* Add-on Packages */}
            <div className="form-section">
              <h2 className="form-section-title">
                <i className="fas fa-box"></i>
                Add-on Packages
              </h2>
              
              <div className="packages-grid">
                {formData.packages.map((pkg, index) => (
                  <div key={index} className="package-form-card">
                    <h3 className="package-form-title">{pkg.name}</h3>
                    <div className="package-form-fields">
                      <div className="form-group">
                        <label className="form-label">Price (AUD)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-input"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(index, 'price', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                          rows={3}
                          className="form-textarea"
                          value={pkg.description}
                          onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                          placeholder="What's included in this package?"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="form-section">
              <h2 className="form-section-title">
                <i className="fas fa-toggle-on"></i>
                Status
              </h2>
              
              <div className="status-options">
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    />
                    <span className="radio-label">
                      <strong>Draft</strong>
                      <span className="radio-description">Save as draft - not visible to customers</span>
                    </span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    />
                    <span className="radio-label">
                      <strong>Active</strong>
                      <span className="radio-description">Publish immediately - customers can book</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Link href="/admin/events" className="btn-secondary">
              <i className="fas fa-times"></i>
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}