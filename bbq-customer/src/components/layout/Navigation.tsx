'use client'

import React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    
    // Close mobile menu
    setIsMobileMenuOpen(false)
    
    // If we're on home page, scroll to section
    if (pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    } else {
      // If we're on another page, navigate to home page with hash
      window.location.href = `/#${sectionId}`
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav 
      className={`nav ${isScrolled ? 'bg-warm-white/98 shadow-subtle' : 'bg-warm-white/95'}`}
    >
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          Yank <span className="accent">DownUnder</span>
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="nav-links desktop-nav">
          <li>
            <a 
              href="#events" 
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'events')}
            >
              Events
            </a>
          </li>
          <li>
            <a 
              href="#menu" 
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'menu')}
            >
              Menu
            </a>
          </li>
          <li>
            <a 
              href="#story" 
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'story')}
            >
              Story
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'contact')}
            >
              Contact
            </a>
          </li>
        </ul>
        
        <Link href="/event" className="nav-cta desktop-nav">
          Reserve Spot
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <ul className="mobile-nav-links">
            <li>
              <a 
                href="#events" 
                className="mobile-nav-link"
                onClick={(e) => handleNavClick(e, 'events')}
              >
                <i className="fas fa-calendar-alt"></i>
                Events
              </a>
            </li>
            <li>
              <a 
                href="#menu" 
                className="mobile-nav-link"
                onClick={(e) => handleNavClick(e, 'menu')}
              >
                <i className="fas fa-utensils"></i>
                Menu
              </a>
            </li>
            <li>
              <a 
                href="#story" 
                className="mobile-nav-link"
                onClick={(e) => handleNavClick(e, 'story')}
              >
                <i className="fas fa-book"></i>
                Story
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="mobile-nav-link"
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                <i className="fas fa-envelope"></i>
                Contact
              </a>
            </li>
          </ul>
          
          <div className="mobile-menu-cta">
            <Link 
              href="/event" 
              className="mobile-reserve-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-calendar-check"></i>
              Reserve Your Spot
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-backdrop" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  )
}

export default React.memo(Navigation)