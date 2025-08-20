'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// Mock bookings data - in a real app this would come from a database
const mockBookings = [
  {
    id: 'BBQ001234',
    customerName: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '+61 412 345 678',
    tickets: 2,
    packages: [
      { name: 'Starter Pack', quantity: 1, price: 15 }
    ],
    total: 65,
    date: '2024-12-10T14:30:00',
    eventId: 'event-001',
    eventTitle: 'Kansas City Burnt Ends Experience',
    status: 'confirmed',
    paymentMethod: 'Credit Card',
    specialRequests: 'Vegetarian option for 1 person',
    source: 'Website'
  },
  {
    id: 'BBQ001235',
    customerName: 'Marcus Thompson',
    email: 'marcus.thompson@email.com',
    phone: '+61 423 456 789',
    tickets: 4,
    packages: [
      { name: 'Master Pack', quantity: 2, price: 25 },
      { name: 'Regional Combo', quantity: 1, price: 35 }
    ],
    total: 185,
    date: '2024-12-08T09:15:00',
    eventId: 'event-001',
    eventTitle: 'Kansas City Burnt Ends Experience',
    status: 'confirmed',
    paymentMethod: 'PayPal',
    specialRequests: '',
    source: 'Social Media'
  },
  {
    id: 'BBQ001236',
    customerName: 'Lisa Chen',
    email: 'lisa.chen@email.com',
    phone: '+61 434 567 890',
    tickets: 1,
    packages: [],
    total: 25,
    date: '2024-12-11T16:45:00',
    eventId: 'event-001',
    eventTitle: 'Kansas City Burnt Ends Experience',
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    specialRequests: 'Gluten-free requirements',
    source: 'Website'
  },
  {
    id: 'BBQ001237',
    customerName: 'James Wilson',
    email: 'james.wilson@email.com',
    phone: '+61 445 678 901',
    tickets: 3,
    packages: [
      { name: 'Starter Pack', quantity: 3, price: 15 }
    ],
    total: 120,
    date: '2024-12-09T11:20:00',
    eventId: 'event-001',
    eventTitle: 'Kansas City Burnt Ends Experience',
    status: 'cancelled',
    paymentMethod: 'Credit Card',
    specialRequests: '',
    source: 'Referral'
  },
  {
    id: 'BBQ001238',
    customerName: 'Emma Rodriguez',
    email: 'emma.rodriguez@email.com',
    phone: '+61 456 789 012',
    tickets: 2,
    packages: [
      { name: 'Regional Combo', quantity: 2, price: 35 }
    ],
    total: 120,
    date: '2024-12-07T13:10:00',
    eventId: 'event-002',
    eventTitle: 'Carolina Whole-Hog Experience',
    status: 'confirmed',
    paymentMethod: 'Credit Card',
    specialRequests: 'Anniversary celebration',
    source: 'Website'
  }
]

export default function AdminBookingsPage() {
  const searchParams = useSearchParams()
  const eventFilter = searchParams.get('event')
  
  const [bookings, setBookings] = useState(mockBookings)
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')

  // Filter bookings based on current filters
  const filteredBookings = bookings.filter(booking => {
    const matchesEvent = !eventFilter || booking.eventId === eventFilter
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesSearch = !searchTerm || 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesEvent && matchesStatus && matchesSearch
  })

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'total-desc':
        return b.total - a.total
      case 'total-asc':
        return a.total - b.total
      case 'name-asc':
        return a.customerName.localeCompare(b.customerName)
      default:
        return 0
    }
  })

  const getStatusBadge = (status: string) => {
    const classes = {
      confirmed: 'status-badge confirmed',
      pending: 'status-badge pending',
      cancelled: 'status-badge cancelled'
    }
    return classes[status as keyof typeof classes] || 'status-badge'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#16a34a'
      case 'pending': return '#eab308'
      case 'cancelled': return '#dc2626'
      default: return '#6b7280'
    }
  }

  // Calculate analytics
  const analytics = {
    totalBookings: filteredBookings.length,
    totalRevenue: filteredBookings.reduce((sum, booking) => sum + booking.total, 0),
    confirmedBookings: filteredBookings.filter(b => b.status === 'confirmed').length,
    pendingBookings: filteredBookings.filter(b => b.status === 'pending').length,
    cancelledBookings: filteredBookings.filter(b => b.status === 'cancelled').length,
    averageOrderValue: filteredBookings.length > 0 
      ? filteredBookings.reduce((sum, booking) => sum + booking.total, 0) / filteredBookings.length 
      : 0
  }

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ))
  }

  const handleExportCSV = () => {
    const csvHeaders = ['Booking ID', 'Customer Name', 'Email', 'Phone', 'Event', 'Tickets', 'Total', 'Status', 'Date']
    const csvData = filteredBookings.map(booking => [
      booking.id,
      booking.customerName,
      booking.email,
      booking.phone,
      booking.eventTitle,
      booking.tickets,
      `$${booking.total}`,
      booking.status,
      new Date(booking.date).toLocaleDateString()
    ])

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="admin-bookings">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <nav className="breadcrumb">
              <Link href="/admin">Admin</Link>
              <span className="separator">/</span>
              <span>Bookings</span>
              {eventFilter && (
                <>
                  <span className="separator">/</span>
                  <span>Event Filter</span>
                </>
              )}
            </nav>
            <h1 className="admin-title">Booking Management</h1>
            <p className="admin-subtitle">
              Monitor and manage customer bookings across all events
            </p>
          </div>
          <div className="admin-header-actions">
            <button onClick={handleExportCSV} className="btn-secondary">
              <i className="fas fa-download"></i>
              Export CSV
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-icon">
              <i className="fas fa-ticket-alt"></i>
            </div>
            <div className="analytics-content">
              <h3 className="analytics-value">{analytics.totalBookings}</h3>
              <p className="analytics-label">Total Bookings</p>
            </div>
          </div>
          
          <div className="analytics-card primary">
            <div className="analytics-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="analytics-content">
              <h3 className="analytics-value">${analytics.totalRevenue.toLocaleString()}</h3>
              <p className="analytics-label">Total Revenue</p>
            </div>
          </div>
          
          <div className="analytics-card">
            <div className="analytics-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="analytics-content">
              <h3 className="analytics-value">{analytics.confirmedBookings}</h3>
              <p className="analytics-label">Confirmed</p>
            </div>
          </div>
          
          <div className="analytics-card">
            <div className="analytics-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="analytics-content">
              <h3 className="analytics-value">{analytics.pendingBookings}</h3>
              <p className="analytics-label">Pending</p>
            </div>
          </div>
          
          <div className="analytics-card">
            <div className="analytics-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="analytics-content">
              <h3 className="analytics-value">{analytics.cancelledBookings}</h3>
              <p className="analytics-label">Cancelled</p>
            </div>
          </div>
          
          <div className="analytics-card">
            <div className="analytics-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="analytics-content">
              <h3 className="analytics-value">${analytics.averageOrderValue.toFixed(0)}</h3>
              <p className="analytics-label">Avg Order Value</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bookings-controls">
          <div className="search-section">
            <div className="search-input-wrapper">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by name, email, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filters-section">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="total-desc">Highest Value</option>
              <option value="total-asc">Lowest Value</option>
              <option value="name-asc">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="admin-section">
          <div className="section-header">
            <h2 className="section-title">
              Bookings ({sortedBookings.length})
              {eventFilter && ' - Filtered by Event'}
            </h2>
            {eventFilter && (
              <Link href="/admin/bookings" className="section-action">
                <i className="fas fa-times"></i>
                Clear Filter
              </Link>
            )}
          </div>

          {sortedBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="fas fa-inbox"></i>
              </div>
              <h3 className="empty-state-title">No Bookings Found</h3>
              <p className="empty-state-description">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No bookings have been made yet'
                }
              </p>
            </div>
          ) : (
            <div className="bookings-list">
              {sortedBookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-id-section">
                      <span className="booking-id">{booking.id}</span>
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => setSelectedBooking(booking.id)}
                        title="View details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="action-btn email"
                        title="Send email"
                      >
                        <i className="fas fa-envelope"></i>
                      </button>
                    </div>
                  </div>

                  <div className="booking-content">
                    <div className="customer-section">
                      <h3 className="customer-name">{booking.customerName}</h3>
                      <p className="customer-contact">
                        <i className="fas fa-envelope"></i>
                        {booking.email}
                      </p>
                      <p className="customer-contact">
                        <i className="fas fa-phone"></i>
                        {booking.phone}
                      </p>
                    </div>

                    <div className="event-section">
                      <h4 className="event-title">{booking.eventTitle}</h4>
                      <p className="booking-date">
                        <i className="fas fa-calendar-alt"></i>
                        {new Date(booking.date).toLocaleDateString('en-AU', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="order-section">
                      <div className="order-summary">
                        <div className="order-item">
                          <span>Tickets</span>
                          <span>{booking.tickets}</span>
                        </div>
                        {booking.packages.map((pkg, index) => (
                          <div key={index} className="order-item">
                            <span>{pkg.name} (×{pkg.quantity})</span>
                            <span>${pkg.price * pkg.quantity}</span>
                          </div>
                        ))}
                        <div className="order-total">
                          <span>Total</span>
                          <span>${booking.total}</span>
                        </div>
                      </div>
                    </div>

                    <div className="booking-meta">
                      <div className="meta-item">
                        <i className="fas fa-credit-card"></i>
                        <span>{booking.paymentMethod}</span>
                      </div>
                      <div className="meta-item">
                        <i className="fas fa-globe"></i>
                        <span>{booking.source}</span>
                      </div>
                      {booking.specialRequests && (
                        <div className="meta-item special-requests">
                          <i className="fas fa-sticky-note"></i>
                          <span>{booking.specialRequests}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="booking-footer">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="status-select"
                      style={{ borderColor: getStatusColor(booking.status) }}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}