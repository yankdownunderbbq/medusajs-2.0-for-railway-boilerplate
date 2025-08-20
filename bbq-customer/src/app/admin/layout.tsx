import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Admin Navigation */}
      <nav className="admin-nav">
        <div className="admin-nav-container">
          <div className="admin-logo">
            <Link href="/admin">
              <i className="fas fa-fire"></i>
              <span>Yank DownUnder</span>
              <span className="admin-badge">Admin</span>
            </Link>
          </div>
          
          <ul className="admin-nav-links">
            <li>
              <Link href="/admin" className="admin-nav-link">
                <i className="fas fa-chart-line"></i>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/events" className="admin-nav-link">
                <i className="fas fa-calendar-alt"></i>
                Events
              </Link>
            </li>
            <li>
              <Link href="/admin/bookings" className="admin-nav-link">
                <i className="fas fa-users"></i>
                Bookings
              </Link>
            </li>
          </ul>
          
          <div className="admin-nav-actions">
            <Link href="/" className="view-site-btn">
              <i className="fas fa-external-link-alt"></i>
              View Site
            </Link>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}