# BBQ Pop-up Business - Project Brief

## Business Model
Multi-venue BBQ pop-up catering platform. Partner with breweries/bars to host BBQ events. Customers pre-order BBQ packages online, attend events for pickup.

## Tech Stack
- Backend: Medusa.js (already running) + PostgreSQL
- Frontend: Next.js 14 (App Router) + Tailwind CSS  
- Deployment: Railway
- Email: Resend
- Payments: Stripe (via Medusa)

## Architecture Decision: Hybrid Event-Product Model
- Events = Business entities (capacity, location, venue partnerships)
- Products = E-commerce entities (BBQ packages, pricing, cart/checkout)
- Link via products.metadata.event_id

## Immediate Priority: Landing Page → Complete Sales Flow
1. Landing page with event discovery
2. Event details and BBQ package selection
3. Checkout flow (existing Medusa)
4. Order confirmation and QR code generation
5. Basic admin for event creation

## Key Database Extensions Needed
See docs/architecture.md for complete schema. Priority tables:
- venues (partnership management)
- events (business logic)
- event_orders (links Medusa orders to events)
- bbq_fulfillment (package tracking)

## Email Templates
Located in backend/src/email-templates/
- Order confirmation with QR codes
- Event reminders  
- Welcome emails
- Built with responsive HTML/CSS, ready for Resend integration

## Next Steps
Start with customer-facing landing page, then build out admin event creation.