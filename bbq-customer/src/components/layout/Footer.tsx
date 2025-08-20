export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          Yank <span style={{ color: 'var(--warm-copper)' }}>DownUnder</span> BBQ
        </div>
        
        <div className="footer-social">
          <a href="#" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" aria-label="Email">
            <i className="fas fa-envelope"></i>
          </a>
        </div>
        
        <p className="footer-text">
          Regional American BBQ popup experiences in Australia. 
          Follow us for event announcements and BBQ education content.
        </p>
      </div>
    </footer>
  )
}