import Link from 'next/link'

// Mock data - in a real app this would come from a database
const mockStats = {
  totalBookings: 47,
  totalRevenue: 1175,
  upcomingEvents: 1,
  totalSpots: 30,
  bookedSpots: 18,
  availableSpots: 12
}

const mockRecentBookings = [
  {
    id: 'BBQ001234',
    customerName: 'Sarah Mitchell',
    email: 'sarah@email.com',
    tickets: 2,
    total: 50,
    date: '2024-12-10',
    packages: ['Starter Pack']
  },
  {
    id: 'BBQ001235',
    customerName: 'Marcus Thompson',
    email: 'marcus@email.com',
    tickets: 4,
    total: 164,
    date: '2024-12-10',
    packages: ['Master Pack', 'Regional Combo']
  },
  {
    id: 'BBQ001236',
    customerName: 'Lisa Chen',
    email: 'lisa@email.com',
    tickets: 1,
    total: 25,
    date: '2024-12-11',
    packages: []
  }
]

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <h1 className="admin-title">Dashboard</h1>
          <p className="admin-subtitle">
            Overview of your BBQ popup business performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">${mockStats.totalRevenue.toLocaleString()}</h3>
              <p className="stat-label">Total Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{mockStats.totalBookings}</h3>
              <p className="stat-label">Total Bookings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{mockStats.upcomingEvents}</h3>
              <p className="stat-label">Upcoming Events</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chair"></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{mockStats.bookedSpots}/{mockStats.totalSpots}</h3>
              <p className="stat-label">Spots Filled</p>
            </div>
          </div>
        </div>

        {/* Current Event Status */}
        <div className="admin-section">
          <h2 className="section-title">Current Event Status</h2>
          <div className="event-status-card">
            <div className="event-status-header">
              <div className="event-info">
                <h3 className="event-name">Kansas City Burnt Ends Experience</h3>
                <p className="event-details">
                  <i className="fas fa-calendar-alt"></i>
                  December 14, 2024 • 11:00 AM - 3:00 PM
                </p>
                <p className="event-details">
                  <i className="fas fa-map-marker-alt"></i>
                  BBQ Galore Brisbane, Brisbane CBD
                </p>
              </div>
              <div className="event-actions">
                <Link href="/admin/events" className="btn-secondary">
                  <i className="fas fa-edit"></i>
                  Edit Event
                </Link>
                <Link href="/admin/bookings" className="btn-primary">
                  <i className="fas fa-users"></i>
                  View Bookings
                </Link>
              </div>
            </div>
            
            <div className="capacity-bar">
              <div className="capacity-info">
                <span>Capacity: {mockStats.bookedSpots} / {mockStats.totalSpots} spots</span>
                <span>{((mockStats.bookedSpots / mockStats.totalSpots) * 100).toFixed(0)}% full</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${(mockStats.bookedSpots / mockStats.totalSpots) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="admin-section">
          <div className="section-header">
            <h2 className="section-title">Recent Bookings</h2>
            <Link href="/admin/bookings" className="section-action">
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          
          <div className="bookings-table">
            <div className="table-header">
              <div className="table-cell">Booking ID</div>
              <div className="table-cell">Customer</div>
              <div className="table-cell">Tickets</div>
              <div className="table-cell">Total</div>
              <div className="table-cell">Date</div>
              <div className="table-cell">Actions</div>
            </div>
            
            {mockRecentBookings.map((booking) => (
              <div key={booking.id} className="table-row">
                <div className="table-cell">
                  <span className="booking-id">{booking.id}</span>
                </div>
                <div className="table-cell">
                  <div className="customer-info">
                    <span className="customer-name">{booking.customerName}</span>
                    <span className="customer-email">{booking.email}</span>
                  </div>
                </div>
                <div className="table-cell">
                  <span className="ticket-count">{booking.tickets}</span>
                </div>
                <div className="table-cell">
                  <span className="total-amount">${booking.total}</span>
                </div>
                <div className="table-cell">
                  <span className="booking-date">{booking.date}</span>
                </div>
                <div className="table-cell">
                  <button className="table-action">
                    <i className="fas fa-eye"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions">
            <Link href="/admin/events/new" className="quick-action-card">
              <div className="quick-action-icon">
                <i className="fas fa-plus"></i>
              </div>
              <h3 className="quick-action-title">Create New Event</h3>
              <p className="quick-action-description">
                Set up a new BBQ popup experience
              </p>
            </Link>
            
            <Link href="/admin/bookings" className="quick-action-card">
              <div className="quick-action-icon">
                <i className="fas fa-download"></i>
              </div>
              <h3 className="quick-action-title">Export Bookings</h3>
              <p className="quick-action-description">
                Download customer data as CSV
              </p>
            </Link>
            
            <Link href="/event" className="quick-action-card">
              <div className="quick-action-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h3 className="quick-action-title">Preview Event Page</h3>
              <p className="quick-action-description">
                See how customers view your event
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}