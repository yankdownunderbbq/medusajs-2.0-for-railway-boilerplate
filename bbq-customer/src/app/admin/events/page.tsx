'use client'

import Link from 'next/link'
import { useState } from 'react'

// Mock events data - in a real app this would come from a database
const mockEvents = [
  {
    id: 'event-001',
    title: 'Kansas City Burnt Ends Experience',
    date: '2024-12-14',
    time: '11:00 AM',
    duration: '4 hours',
    venue: 'BBQ Galore Brisbane',
    location: 'Brisbane CBD',
    capacity: 30,
    booked: 18,
    price: 25,
    status: 'active',
    description: 'Discover why burnt ends are called "BBQ candy" in this educational tasting experience.',
    packages: [
      { name: 'Starter Pack', price: 15, description: '2 extra burnt ends samples' },
      { name: 'Master Pack', price: 25, description: 'BBQ rub kit + recipe cards' },
      { name: 'Regional Combo', price: 35, description: 'All packages + KC sauce set' }
    ]
  },
  {
    id: 'event-002',
    title: 'Carolina Whole-Hog Experience',
    date: '2025-02-15',
    time: '1:00 PM',
    duration: '4 hours',
    venue: 'BBQ Galore Brisbane',
    location: 'Brisbane CBD',
    capacity: 25,
    booked: 0,
    price: 30,
    status: 'draft',
    description: 'Explore the vinegar-based sauces and whole-hog traditions of the Carolina BBQ style.',
    packages: [
      { name: 'Starter Pack', price: 18, description: 'Extra pork samples' },
      { name: 'Master Pack', price: 28, description: 'Vinegar sauce kit' },
      { name: 'Regional Combo', price: 40, description: 'All packages + Carolina rub set' }
    ]
  }
]

export default function AdminEventsPage() {
  const [events, setEvents] = useState(mockEvents)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleDelete = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId))
    setDeleteConfirm(null)
  }

  const handleStatusToggle = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, status: event.status === 'active' ? 'draft' : 'active' }
        : event
    ))
  }

  const getStatusBadge = (status: string) => {
    const classes = {
      active: 'status-badge active',
      draft: 'status-badge draft',
      cancelled: 'status-badge cancelled'
    }
    return classes[status as keyof typeof classes] || 'status-badge'
  }

  return (
    <div className="admin-events">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-title">Events Management</h1>
            <p className="admin-subtitle">
              Create, edit, and manage your BBQ popup events
            </p>
          </div>
          <div className="admin-header-actions">
            <Link href="/admin/events/new" className="btn-primary">
              <i className="fas fa-plus"></i>
              Create New Event
            </Link>
          </div>
        </div>

        {/* Events List */}
        <div className="admin-section">
          <div className="events-header">
            <h2 className="section-title">All Events ({events.length})</h2>
            <div className="events-filters">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Active</button>
              <button className="filter-btn">Draft</button>
              <button className="filter-btn">Past</button>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="fas fa-calendar-plus"></i>
              </div>
              <h3 className="empty-state-title">No Events Created</h3>
              <p className="empty-state-description">
                Get started by creating your first BBQ popup event
              </p>
              <Link href="/admin/events/new" className="btn-primary">
                <i className="fas fa-plus"></i>
                Create First Event
              </Link>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.id} className="event-admin-card">
                  <div className="event-admin-header">
                    <div className="event-admin-status">
                      <span className={getStatusBadge(event.status)}>
                        {event.status}
                      </span>
                      <div className="event-admin-actions">
                        <button 
                          className="action-btn edit"
                          title="Edit event"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="action-btn delete"
                          title="Delete event"
                          onClick={() => setDeleteConfirm(event.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="event-admin-content">
                    <h3 className="event-admin-title">{event.title}</h3>
                    <p className="event-admin-description">{event.description}</p>
                    
                    <div className="event-admin-details">
                      <div className="event-detail">
                        <i className="fas fa-calendar-alt"></i>
                        <span>{new Date(event.date).toLocaleDateString('en-AU')} at {event.time}</span>
                      </div>
                      <div className="event-detail">
                        <i className="fas fa-clock"></i>
                        <span>{event.duration}</span>
                      </div>
                      <div className="event-detail">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{event.venue}, {event.location}</span>
                      </div>
                      <div className="event-detail">
                        <i className="fas fa-users"></i>
                        <span>{event.booked} / {event.capacity} spots</span>
                      </div>
                      <div className="event-detail">
                        <i className="fas fa-dollar-sign"></i>
                        <span>From ${event.price}</span>
                      </div>
                    </div>

                    <div className="event-admin-stats">
                      <div className="stat">
                        <span className="stat-value">{event.booked}</span>
                        <span className="stat-label">Bookings</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">${event.booked * event.price}</span>
                        <span className="stat-label">Revenue</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{Math.round((event.booked / event.capacity) * 100)}%</span>
                        <span className="stat-label">Capacity</span>
                      </div>
                    </div>
                  </div>

                  <div className="event-admin-footer">
                    <button 
                      className={`toggle-status-btn ${event.status === 'active' ? 'active' : 'inactive'}`}
                      onClick={() => handleStatusToggle(event.id)}
                    >
                      <i className={`fas ${event.status === 'active' ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      {event.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <Link href={`/admin/bookings?event=${event.id}`} className="view-bookings-btn">
                      <i className="fas fa-users"></i>
                      View Bookings
                    </Link>
                    <Link href="/event" className="preview-btn">
                      <i className="fas fa-external-link-alt"></i>
                      Preview
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">
                  <i className="fas fa-exclamation-triangle text-red-500"></i>
                  Delete Event
                </h3>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this event? This action cannot be undone.</p>
                <p className="text-sm text-gray-600 mt-2">
                  All associated bookings will be cancelled and customers will need to be notified manually.
                </p>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  <i className="fas fa-trash"></i>
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}