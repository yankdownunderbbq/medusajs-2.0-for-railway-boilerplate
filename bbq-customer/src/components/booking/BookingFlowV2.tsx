'use client'

import { useState, useEffect } from 'react'

const styles = `
:root {
    /* Brand Colors */
    --charcoal: #2a2a2a;
    --warm-copper: #b85c38;
    --soft-copper: #d4a574;
    --cream: #f7f5f1;
    --off-black: #1a1a1a;
    --warm-white: #fefefe;
    
    /* Semantic Colors */
    --text-primary: var(--off-black);
    --text-secondary: var(--charcoal);
    --text-muted: #6a6a6a;
    --text-inverse: var(--warm-white);
    
    --bg-primary: var(--warm-white);
    --bg-secondary: var(--cream);
    --bg-dark: var(--charcoal);
    
    --accent-primary: var(--warm-copper);
    --accent-secondary: var(--soft-copper);
    --accent-hover: #a04d2f;
    
    /* Typography */
    --font-display: 'Anek Devanagari', sans-serif;
    --font-body: 'Inter', sans-serif;
    
    /* Spacing */
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-12: 3rem;
    --space-16: 4rem;
    --space-20: 5rem;
    
    /* Transitions */
    --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-medium: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Shadows */
    --shadow-subtle: 0 2px 8px rgba(42, 42, 42, 0.08);
    --shadow-medium: 0 4px 16px rgba(42, 42, 42, 0.12);
    --shadow-strong: 0 8px 32px rgba(42, 42, 42, 0.16);
    --shadow-copper: 0 4px 16px rgba(184, 92, 56, 0.15);
}

.booking-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-6);
    min-height: 100vh;
}

.booking-header {
    text-align: center;
    margin-bottom: var(--space-12);
}

.header-badge {
    display: inline-block;
    background-color: var(--warm-copper);
    color: var(--warm-white);
    padding: var(--space-2) var(--space-5);
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-4);
}

.header-title {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--space-4);
}

.header-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    max-width: 500px;
    margin: 0 auto var(--space-8);
    line-height: 1.6;
}

.booking-booking-progress-container {
    background-color: var(--bg-primary);
    border-radius: var(--space-6);
    padding: var(--space-6);
    margin-bottom: var(--space-12);
    box-shadow: var(--shadow-subtle);
}

.booking-progress-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-bottom: var(--space-8);
}
    @media (max-width: 480px) {
      .booking-progress-bar {
          margin-bottom: var(--space-4);
    }
}


/* Progress Container */
.booking-progress-container {
    background-color: #fefefe;
    border-radius: 24px;
    padding: 24px;
    margin-bottom: 48px;
    box-shadow: 0 2px 8px rgba(42, 42, 42, 0.08);
}

/* Progress Bar */
.booking-progress-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-bottom: 32px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

/* Connecting Line */
.booking-progress-bar::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 60px;
    right: 60px;
    height: 2px;
    background-color: #e5e5e5;
    z-index: 1;
}

/* Progress Fill */
.booking-progress-fill {
    position: absolute;
    top: 50%;
    left: 60px;
    height: 2px;
    background: linear-gradient(90deg, #b85c38 0%, #d4a574 100%);
    z-index: 2;
    transition: width 0.5s ease;
    transform: translateY(-50%);
}

/* Progress Step */
.booking-progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 3;
    position: relative;
}

/* Step Circle */
.booking-step-circle {
    width: 48px;
    height: 48px;
    border: 3px solid #e5e5e5;
    border-radius: 50%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Anek Devanagari', sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #6a6a6a;
    transition: all 0.3s ease;
}

.booking-progress-step.active .booking-step-circle {
    border-color: #b85c38;
    background-color: #b85c38;
    color: white;
}

.booking-progress-step.completed .booking-step-circle {
    border-color: #d4a574;
    background-color: #d4a574;
    color: white;
}

/* Step Label */
.booking-step-label {
    font-family: 'Anek Devanagari', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #6a6a6a;
    text-align: center;
    transition: color 0.3s ease;
}

.booking-progress-step.active .booking-step-label {
    color: #b85c38;
}

.booking-progress-step.completed .booking-step-label {
    color: #d4a574;
}

/* Mobile Styles */
@media (max-width: 768px) {
    .booking-progress-container {
        padding: 16px;
        margin-bottom: 32px;
    }
    
    .booking-progress-bar {
        margin-bottom: 24px;
    }
    
    .booking-progress-bar::before {
        left: 30px;
        right: 30px;
    }
    
    .booking-progress-fill {
        left: 30px;
    }
    
    .booking-step-circle {
        width: 40px;
        height: 40px;
        font-size: 16px;
    }
    
    .booking-step-label {
        font-size: 11px;
    }
}

.step-content {
    display: none;
    animation: fadeIn 0.5s ease-in-out;
}

.step-content.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.ticket-card {
    background-color: var(--bg-primary);
    border-radius: var(--space-6);
    padding: var(--space-8);
    box-shadow: var(--shadow-subtle);
    border: 3px solid var(--warm-copper);
    position: relative;
    overflow: hidden;
}

.ticket-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--warm-copper) 0%, var(--soft-copper) 100%);
}

.ticket-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-6);
}

.ticket-badge {
    background-color: var(--warm-copper);
    color: var(--warm-white);
    padding: var(--space-2) var(--space-4);
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.ticket-price {
    text-align: right;
}

.price-amount {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--warm-copper);
    line-height: 1;
}

.price-per {
    font-size: 0.875rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.ticket-title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-4);
}

.ticket-description {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--space-6);
}

.ticket-quantity {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
}

.quantity-label {
    font-family: var(--font-display);
    font-weight: 600;
    color: var(--text-primary);
}

.quantity-control {
    display: flex;
    align-items: center;
    gap: var(--space-4);
}

.quantity-btn {
    width: 40px;
    height: 40px;
    border: 2px solid var(--warm-copper);
    background-color: transparent;
    border-radius: var(--space-2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--warm-copper);
    cursor: pointer;
    transition: all var(--transition-medium);
}

.quantity-btn:hover {
    background-color: var(--warm-copper);
    color: var(--warm-white);
}

.quantity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.quantity-display {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    min-width: 40px;
    text-align: center;
}

.ticket-total {
    background: rgba(184, 92, 56, 0.1);
    border-radius: var(--space-4);
    padding: var(--space-4);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.total-label {
    font-family: var(--font-display);
    font-weight: 600;
    color: var(--text-primary);
}

.total-amount {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--warm-copper);
}

.packages-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
    margin-bottom: var(--space-8);
}

.package-card {
    background-color: var(--bg-primary);
    border-radius: var(--space-6);
    padding: var(--space-6);
    box-shadow: var(--shadow-subtle);
    border: 2px solid transparent;
    transition: all var(--transition-medium);
    cursor: pointer;
}

.package-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-strong);
    border-color: var(--warm-copper);
}

.package-card.selected {
    border-color: var(--warm-copper);
    background: linear-gradient(135deg, var(--bg-primary) 0%, #faf9f7 100%);
}

.package-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-4);
}

.package-visual {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--warm-copper) 0%, var(--soft-copper) 100%);
    border-radius: var(--space-4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--warm-white);
    font-size: 2rem;
    flex-shrink: 0;
}

.package-pricing {
    text-align: right;
}

.package-price {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--warm-copper);
    line-height: 1;
}

.package-per {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
}

.package-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-2);
}

.package-description {
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: var(--space-4);
}

.package-features {
    display: flex;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
    flex-wrap: wrap;
}

.feature-tag {
    background: rgba(184, 92, 56, 0.1);
    color: var(--warm-copper);
    padding: var(--space-1) var(--space-3);
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
}

.package-quantity {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.summary-container {
    background-color: var(--bg-primary);
    border-radius: var(--space-8);
    padding: var(--space-8);
    box-shadow: var(--shadow-subtle);
    border: 1px solid rgba(184, 92, 56, 0.2);
}

.summary-header {
    text-align: center;
    margin-bottom: var(--space-8);
}

.summary-title {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--space-2);
}

.summary-subtitle {
    color: var(--text-secondary);
}

.order-items {
    margin-bottom: var(--space-8);
}

.order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4) 0;
    border-bottom: 1px solid rgba(42, 42, 42, 0.1);
}

.item-details {
    flex: 1;
}

.item-name {
    font-family: var(--font-display);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-1);
}

.item-description {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.item-quantity {
    margin: 0 var(--space-4);
    color: var(--text-muted);
}

.item-price {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--warm-copper);
}

.order-total {
    background: linear-gradient(135deg, var(--cream) 0%, #f2efe9 100%);
    border-radius: var(--space-4);
    padding: var(--space-6);
    margin-bottom: var(--space-8);
}

.total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 0 20px;  /* Add horizontal padding */
}

.total-row.final {
    border-top: 2px solid var(--warm-copper);
    padding-top: var(--space-4);
    margin-top: var(--space-4);
    margin-bottom: 0;
}

.total-label {
    font-family: var(--font-display);
    font-weight: 600;
    color: var(--text-primary);
}

.total-label.final {
    font-size: 1.25rem;
}

.total-value {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--warm-copper);
}

.total-value.final {
    font-size: 2rem;
}

.step-navigation {
    display: flex;
    gap: var(--space-4);
    justify-content: center;
    margin-top: var(--space-8);
}

.nav-btn {
    padding: var(--space-5) var(--space-8);
    border: none;
    border-radius: var(--space-4);
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    transition: all var(--transition-medium);
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

.nav-btn.primary {
    background: linear-gradient(135deg, var(--warm-copper) 0%, #d4654a 100%);
    color: var(--warm-white);
    box-shadow: var(--shadow-copper);
}

.nav-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(184, 92, 56, 0.3);
}

.nav-btn.secondary {
    background-color: transparent;
    color: var(--warm-copper);
    border: 2px solid var(--warm-copper);
}

.nav-btn.secondary:hover {
    background-color: var(--warm-copper);
    color: var(--warm-white);
}

.nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (min-width: 768px) {
    .packages-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .header-title {
        font-size: 3rem;
    }

    .step-navigation {
        justify-content: flex-end;
    }
}

@media (min-width: 1024px) {
    .booking-container {
        padding: var(--space-8);
    }

    .packages-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
`

interface BookingFlowV2Props {
  bookingId?: string
  event: {
    id: string
    title: string
    base_price: number  // In cents (2500 = $25)
    max_capacity: number
    current_bookings: number
    description?: string
    packages?: Array<{
      id: string
      name: string
      description: string
      price: number
      includes?: string[]
    }>
    takeHomeProducts?: Array<{
      id: string
      name: string
      description: string
      price: number
    }>
  }
  products?: Array<{
    id: string
    title: string
    description: string
    thumbnail: string
    variants: Array<{
      id: string
      title: string
      prices?: Array<{
        amount: number
        currency_code: string
      }>
    }>
  }>
}

export default function BookingFlowV2({ event, products = [] }: BookingFlowV2Props) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPackages, setSelectedPackages] = useState<Record<string, number>>({
    family: 0,
    dinner: 0
  })
  const [ticketQuantity, setTicketQuantity] = useState(1)

  useEffect(() => {
    updateStepDisplay()
  }, [currentStep])

  const changeQuantity = (delta: number) => {
    const newQuantity = ticketQuantity + delta
    const availableSpots = event.max_capacity - event.current_bookings
    if (newQuantity >= 1 && newQuantity <= Math.min(10, availableSpots)) {
      setTicketQuantity(newQuantity)
    }
  }

  const selectPackage = () => {
    // Visual feedback for selection
    document.querySelectorAll('.package-card').forEach(card => {
      card.classList.remove('selected')
    })
  }

  const changePackageQuantity = (packageType: string, delta: number) => {
    const newQuantity = (selectedPackages[packageType] || 0) + delta
    if (newQuantity >= 0 && newQuantity <= 5) {
      setSelectedPackages(prev => ({
        ...prev,
        [packageType]: newQuantity
      }))

      // Update card selection state
      const card = document.querySelector(`[data-package="${packageType}"]`)
      if (newQuantity > 0) {
        card?.classList.add('selected')
      } else {
        card?.classList.remove('selected')
      }
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
      setTimeout(() => {
        const element = document.getElementById('booking-top')
        if (element) {
          const yOffset = -80
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 100)
      if (currentStep + 1 === 3) {
        updateOrderSummary()
      }
    } else {
      proceedToCheckout()
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setTimeout(() => {
        const element = document.getElementById('booking-top')
        if (element) {
          const yOffset = -80
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 100)
    }
  }

  function updateStepDisplay() {
    // Update progress bar
    const progressFill = document.getElementById('progressFill')
    if (progressFill) {
      progressFill.style.width = `${(currentStep / 3) * 100}%`
    }

    // Update progress steps
    document.querySelectorAll('.booking-progress-step').forEach((step, index) => {
      const stepNumber = index + 1
      step.classList.remove('active', 'completed')

      if (stepNumber < currentStep) {
        step.classList.add('completed')
        const circle = step.querySelector('.booking-step-circle')
        if (circle) {
          circle.innerHTML = '<i class="fas fa-check"></i>'
        }
      } else if (stepNumber === currentStep) {
        step.classList.add('active')
        const circle = step.querySelector('.booking-step-circle')
        if (circle) {
          circle.textContent = stepNumber.toString()
        }
      } else {
        const circle = step.querySelector('.booking-step-circle')
        if (circle) {
          circle.textContent = stepNumber.toString()
        }
      }
    })
  }

  function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary')
    let subtotal = 0
    const savings = 0
    let html = ''

    // Add tickets
    const ticketPrice = event.base_price / 100
    const ticketTotal = ticketQuantity * ticketPrice
    subtotal += ticketTotal
    html += `
      <div class="order-item">
        <div class="item-details">
          <div class="item-name">${event.title}</div>
          <div class="item-description">${event.description || 'Event entry with tasting, education & benefits'}</div>
        </div>
        <div class="item-quantity">×${ticketQuantity}</div>
        <div class="item-price">$${ticketTotal.toFixed(2)}</div>
      </div>
    `

    // Add products to summary
    products.forEach(product => {
      const quantity = selectedPackages[product.id]
      if (quantity > 0) {
        const variant = product.variants?.[0]
        const price = variant?.prices?.[0]
        const priceAmount = price?.amount || 0
        const productTotal = quantity * (priceAmount / 100)
        subtotal += productTotal
        
        html += `
          <div class="order-item">
            <div class="item-details">
              <div class="item-name">${product.title}</div>
              <div class="item-description">${product.description || 'Premium BBQ product'}</div>
            </div>
            <div class="item-quantity">×${quantity}</div>
            <div class="item-price">$${productTotal.toFixed(2)}</div>
          </div>
        `
      }
    })

    if (orderSummary) {
      orderSummary.innerHTML = html
    }

    // Update totals
    const subtotalEl = document.getElementById('subtotal')
    const savingsEl = document.getElementById('savings')
    const grandTotalEl = document.getElementById('grandTotal')

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`
    if (savingsEl) savingsEl.textContent = savings > 0 ? `-$${savings.toFixed(2)}` : '$0'
    if (grandTotalEl) grandTotalEl.textContent = `$${(subtotal - savings).toFixed(2)}`
  }

  function proceedToCheckout() {
    // Add loading state
    const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement
    if (nextBtn) {
      const originalContent = nextBtn.innerHTML
      nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
      nextBtn.disabled = true

      // Simulate processing
      setTimeout(() => {
        alert('Proceeding to secure checkout...\n\nThis would redirect to the payment form.')
        nextBtn.innerHTML = originalContent
        nextBtn.disabled = false
      }, 2000)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="booking-container">
        {/* Header */}
        <header className="booking-header">
          <div className="header-badge">
            <i className="fas fa-fire"></i>
            Book Your Experience
          </div>
          <h1 className="header-title">Complete Your Booking</h1>
          <p className="header-subtitle">
            Secure your spot and optional take-home BBQ packages in just 3 simple steps.
          </p>
        </header>

        {/* Progress Bar */}
        <div className="booking-progress-container" id="booking-top">
  <div className="booking-progress-bar">
    <div className="booking-progress-fill" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
    
    <div className={`booking-progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
      <div className="booking-step-circle">
        {currentStep > 1 ? '✓' : '1'}
      </div>
      <span className="booking-step-label">Select Tickets</span>
    </div>
    
    <div className={`booking-progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
      <div className="booking-step-circle">
        {currentStep > 2 ? '✓' : '2'}
      </div>
      <span className="booking-step-label">Take-Home BBQ</span>
    </div>
    
    <div className={`booking-progress-step ${currentStep >= 3 ? 'active' : ''}`}>
      <div className="booking-step-circle">3</div>
      <span className="booking-step-label">Review & Book</span>
    </div>
  </div>
</div>

        {/* Step 1: Select Tickets */}
        <div className={`step-content ${currentStep === 1 ? 'active' : ''}`} id="step1">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Choose Number of Attendees
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              How many people will attend the {event.title}?
            </p>
          </div>

          {/* Ticket Selection */}
          <div className="ticket-card">
            <div className="ticket-header">
              <div className="ticket-badge">Event Entry</div>
              <div className="ticket-price">
                <div className="price-amount">${(event.base_price / 100).toFixed(2)}</div>
                <div className="price-per">per person</div>
              </div>
            </div>

            <h3 className="ticket-title">{event.title}</h3>
            <p className="ticket-description">
              Full Kansas City BBQ experience including burnt ends tasting, regional BBQ education,
              exclusive store benefits, and priority access to take-home packages.
            </p>

            <div className="ticket-quantity">
              <span className="quantity-label">Number of Attendees</span>
              <div className="quantity-control">
                <button
                  className="quantity-btn"
                  onClick={() => changeQuantity(-1)}
                  id="decreaseBtn"
                  disabled={ticketQuantity <= 1}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <span className="quantity-display" id="ticketQuantity">{ticketQuantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => changeQuantity(1)}
                  id="increaseBtn"
                  disabled={ticketQuantity >= Math.min(10, event.max_capacity - event.current_bookings)}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>

            <div className="ticket-total">
              <span className="total-label">Ticket Total</span>
              <span className="total-amount" id="ticketTotal">${(ticketQuantity * (event.base_price / 100)).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Take-Home BBQ */}
        <div className={`step-content ${currentStep === 2 ? 'active' : ''}`} id="step2">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Take-Home BBQ Packages
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Exclusive Kansas City BBQ packages available only to event attendees.
              Vacuum-sealed and ready for your freezer.
            </p>
          </div>

          {products && products.length > 0 ? (
            <div className="packages-grid">
              {products.map((product) => {
                // Get the first variant and its price
                const variant = product.variants?.[0]
                const price = variant?.prices?.[0]
                const priceAmount = price?.amount || 0
                
                return (
                  <div key={product.id} className="package-card" onClick={() => selectPackage()} data-package={product.id}>
                    <div className="package-header">
                      <div className="package-visual">
                        {product.thumbnail ? (
                          <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--space-4)' }} />
                        ) : (
                          <i className="fas fa-box"></i>
                        )}
                      </div>
                      <div className="package-pricing">
                        <div className="package-price">${(priceAmount / 100).toFixed(2)}</div>
                        <div className="package-per">each</div>
                      </div>
                    </div>

                    <h3 className="package-title">{product.title}</h3>
                    <p className="package-description">
                      {product.description || 'Premium BBQ product for take-home.'}
                    </p>

                    <div className="package-features">
                      <span className="feature-tag">Premium quality</span>
                      <span className="feature-tag">Take-home</span>
                      {variant && <span className="feature-tag">{variant.title}</span>}
                    </div>

                    <div className="package-quantity">
                      <span className="quantity-label">Quantity</span>
                      <div className="quantity-control">
                        <button className="quantity-btn" onClick={() => changePackageQuantity(product.id, -1)}>
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="quantity-display">{selectedPackages[product.id] || 0}</span>
                        <button className="quantity-btn" onClick={() => changePackageQuantity(product.id, 1)}>
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-secondary)', borderRadius: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
              <i className="fas fa-box" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}></i>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                No Products Available
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                No take-home products are available for this event.
              </p>
            </div>
          )}
        </div>

        {/* Step 3: Review & Book */}
        <div className={`step-content ${currentStep === 3 ? 'active' : ''}`} id="step3">
          <div className="summary-container">
            <div className="summary-header">
              <h2 className="summary-title">Review Your Order</h2>
              <p className="summary-subtitle">Confirm your selection and secure your {event.title} experience</p>
            </div>

            <div className="order-items" id="orderSummary">
              {/* Order items will be populated by JavaScript */}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span className="total-label">Subtotal</span>
                {/* Mobile fix: add proper spacing between label and value */}
                <span className="total-value" id="subtotal">${(ticketQuantity * (event.base_price / 100)).toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span className="total-label">Event Savings</span>
                {/* Mobile fix: add proper spacing between label and value */}
                <span className="total-value" style={{ color: '#27ae60' }} id="savings">$0</span>
              </div>
              <div className="total-row final">
                <span className="total-label final">Total</span>
                {/* Mobile fix: add proper spacing between label and value */}
                <span className="total-value final" id="grandTotal">${(ticketQuantity * (event.base_price / 100)).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(184, 92, 56, 0.1)', borderRadius: '12px', padding: '16px', marginBottom: '32px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <i className="fas fa-shield-alt" style={{ color: 'var(--warm-copper)' }}></i>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Free Cancellation
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Cancel up to 24 hours before the event for a full refund
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="step-navigation">
          <button
            className="nav-btn secondary"
            id="backBtn"
            onClick={previousStep}
            style={{ display: currentStep > 1 ? 'flex' : 'none' }}
          >
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <button className="nav-btn primary" id="nextBtn" onClick={nextStep}>
            {currentStep === 3 ? (
              <>
                <i className="fas fa-lock"></i> Secure Checkout
              </>
            ) : (
              <>
                Continue
                <i className="fas fa-arrow-right"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}