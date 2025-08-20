# BBQ Pop-up Business Architecture & Documentation

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 14 (App Router) + Tailwind CSS                        │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Customer UI   │  │   Admin Panel   │  │  Check-in App   │ │
│  │                 │  │                 │  │                 │ │
│  │ • Event Browse  │  │ • Event Mgmt    │  │ • QR Scanner    │ │
│  │ • Pre-ordering  │  │ • Order Tracking│  │ • Attendee List │ │
│  │ • Account Mgmt  │  │ • BBQ Fulfillmt │  │ • Status Update │ │
│  │ • Payment Flow  │  │ • Analytics     │  │ • Badge Print   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ API Calls
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Medusa.js Headless E-commerce + Custom Extensions              │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Core Medusa   │  │ Custom Services │  │  Integrations   │ │
│  │                 │  │                 │  │                 │ │
│  │ • Orders        │  │ • Event Service │  │ • Email Service │ │
│  │ • Products      │  │ • Check-in Svc  │  │ • Payment Proc  │ │
│  │ • Customers     │  │ • BBQ Fulfill   │  │ • SMS Notify    │ │
│  │ • Inventory     │  │ • QR Generator  │  │ • Weather API   │ │
│  │ • Notifications │  │ • Analytics     │  │ • Location API  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Data Persistence
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL Database + File Storage                             │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Medusa Tables   │  │  Custom Tables  │  │  File Storage   │ │
│  │                 │  │                 │  │                 │ │
│  │ • orders        │  │ • events        │  │ • Event Images  │ │
│  │ • products      │  │ • event_orders  │  │ • Menu Photos   │ │
│  │ • customers     │  │ • check_ins     │  │ • QR Codes      │ │
│  │ • line_items    │  │ • bbq_packages  │  │ • Receipts      │ │
│  │ • inventory     │  │ • dietary_reqs  │  │ • Branding      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Core Business Flows (Multi-Venue Pop-up Model)

### 1. Partnership & Event Creation Flow
```
Venue Outreach → Partnership Agreement → Event Planning → Venue Setup
   ↓
Admin → Create Event → Set Capacity → Configure Packages → Venue Coordination
   ↓
Marketing → Social Media → Venue Cross-promotion → Customer Discovery
   ↓
Customer Discovery → Browse Events → View Menu → Pre-order → Payment
   ↓
Event Day → Setup → Check-in → BBQ Fulfillment → Customer Satisfaction
   ↓
Post-Event → Venue Revenue Share → Customer Follow-up → Repeat Booking
```

### 2. Multi-Venue Management Flow
```
Venue Pipeline → Active Partnerships → Event Scheduling → Resource Planning
   ↓
Inventory Management → Equipment Logistics → Staff Scheduling
   ↓
Customer Database → Event History → Preference Tracking → Retention
```

### 2. Pre-Order Customer Journey
```
Event Browse → Package Selection → Account Creation (Optional) 
   ↓
Dietary Preferences → Pickup/Delivery Choice → Payment
   ↓
Confirmation Email → Event Reminders → QR Code Generation
   ↓
Event Day Check-in → Package Collection → Post-Event Follow-up
```

### 3. BBQ Fulfillment Operations
```
Pre-Event Prep → Inventory Check → Cooking Schedule
   ↓
Day-of Setup → Package Assembly → Quality Control
   ↓
Customer Check-in → Package Handoff → Inventory Update
   ↓
End-of-Event Cleanup → Leftover Management → Analytics Review
```

## 🔧 Technical Implementation Strategy

### Event-Product Relationship Model

**Design Decision: Hybrid Approach**
- **Events** = Business entities (capacity, location, timing, weather policies)
- **Products** = E-commerce entities (packages, pricing, inventory, cart/checkout)
- **Metadata linking** = Seamless connection between business logic and commerce

```
Event (1) ←→ (Many) Products ←→ (Many) Line Items ←→ (1) Order
   ↓                              ↓
Capacity Management          Cart/Checkout Flow
Location/Timing             Payment Processing
Weather Policies            Inventory Tracking
```

```sql
-- Enhanced Events table for multi-venue operations
CREATE TABLE events (
  id VARCHAR(255) PRIMARY KEY, -- evt_01HXXX format to match Medusa IDs
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Venue partnership details
  venue_id VARCHAR(255) NOT NULL REFERENCES venues(id),
  venue_contact_email VARCHAR(255),
  venue_contact_phone VARCHAR(50),
  venue_agreement_terms TEXT, -- Revenue split, responsibilities, etc.
  
  -- Location details  
  location_name VARCHAR(255) NOT NULL,
  location_address TEXT NOT NULL,
  location_coordinates POINT, -- PostGIS for mapping
  setup_instructions TEXT, -- Venue-specific setup notes
  
  -- Capacity and logistics
  capacity INTEGER NOT NULL,
  current_registrations INTEGER DEFAULT 0,
  equipment_requirements TEXT[], -- ["grills", "tables", "power_access"]
  staff_required INTEGER DEFAULT 2,
  
  -- Business details
  status VARCHAR(50) DEFAULT 'draft', -- draft, confirmed, published, sold_out, cancelled, completed
  weather_dependent BOOLEAN DEFAULT true,
  cancellation_policy TEXT,
  revenue_split_percentage DECIMAL(5,2), -- Venue's percentage (e.g., 15.00)
  estimated_revenue DECIMAL(10,2),
  actual_revenue DECIMAL(10,2),
  
  -- Marketing and content
  special_instructions TEXT,
  image_url VARCHAR(500),
  social_media_handles JSONB, -- Venue's social accounts for cross-promotion
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Venues table for partnership management
CREATE TABLE venues (
  id VARCHAR(255) PRIMARY KEY, -- ven_01HXXX format
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- brewery, bar, cafe, event_space
  address TEXT NOT NULL,
  coordinates POINT,
  
  -- Contact information
  primary_contact_name VARCHAR(255),
  primary_contact_email VARCHAR(255) NOT NULL,
  primary_contact_phone VARCHAR(50),
  manager_name VARCHAR(255),
  
  -- Business details
  capacity INTEGER,
  typical_customer_count INTEGER, -- For planning purposes
  food_service_available BOOLEAN DEFAULT false,
  liquor_license BOOLEAN DEFAULT false,
  kitchen_facilities BOOLEAN DEFAULT false,
  
  -- Partnership details
  partnership_status VARCHAR(50) DEFAULT 'prospective', -- prospective, active, paused, ended
  partnership_start_date DATE,
  standard_revenue_split DECIMAL(5,2), -- Default split percentage
  payment_terms VARCHAR(100), -- "net_7", "event_day", etc.
  
  -- Logistics
  setup_requirements TEXT,
  parking_availability TEXT,
  accessibility_features TEXT,
  equipment_storage BOOLEAN DEFAULT false,
  power_access_details TEXT,
  
  -- Social and marketing
  website_url VARCHAR(500),
  instagram_handle VARCHAR(100),
  facebook_page VARCHAR(500),
  google_maps_link TEXT,
  
  -- Internal notes
  notes TEXT,
  partnership_history TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Event-venue performance tracking
CREATE TABLE venue_event_metrics (
  id VARCHAR(255) PRIMARY KEY,
  venue_id VARCHAR(255) NOT NULL REFERENCES venues(id),
  event_id VARCHAR(255) NOT NULL REFERENCES events(id),
  
  -- Performance metrics
  tickets_sold INTEGER DEFAULT 0,
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  venue_cut DECIMAL(10,2) DEFAULT 0,
  customer_satisfaction_avg DECIMAL(3,2), -- Average rating 1-5
  
  -- Logistics tracking
  setup_duration_minutes INTEGER, -- How long setup took
  breakdown_duration_minutes INTEGER,
  equipment_issues TEXT,
  venue_support_rating INTEGER, -- 1-5 rating of venue cooperation
  
  -- Marketing effectiveness
  venue_promoted BOOLEAN DEFAULT false,
  social_media_reach INTEGER,
  walk_in_customers INTEGER, -- Non-pre-order customers
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Customer event history and preferences (extends Medusa customers)
CREATE TABLE customer_event_history (
  id VARCHAR(255) PRIMARY KEY,
  customer_id VARCHAR(255) NOT NULL REFERENCES customers(id),
  event_id VARCHAR(255) NOT NULL REFERENCES events(id),
  
  -- Attendance tracking
  registered_at TIMESTAMP NOT NULL,
  attended BOOLEAN DEFAULT false,
  check_in_timestamp TIMESTAMP,
  
  -- Preferences and feedback
  dietary_preferences TEXT[],
  satisfaction_rating INTEGER, -- 1-5
  feedback_text TEXT,
  would_attend_again BOOLEAN,
  
  -- Marketing insights
  referral_source VARCHAR(100), -- "social_media", "venue_promotion", "word_of_mouth"
  distance_traveled_km DECIMAL(6,2),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced event orders for multi-venue context
CREATE TABLE event_orders (
  id VARCHAR(255) PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_id VARCHAR(255) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  venue_id VARCHAR(255) NOT NULL REFERENCES venues(id),
  
  attendee_count INTEGER DEFAULT 1,
  attendee_status VARCHAR(50) DEFAULT 'registered', -- registered, checked_in, no_show, refunded
  dietary_requirements TEXT[], -- ["gluten_free", "nut_allergy"]
  pickup_preference VARCHAR(50) DEFAULT 'event', -- event, delivery (future)
  special_instructions TEXT,
  
  -- Check-in management
  qr_code VARCHAR(255) UNIQUE,
  check_in_timestamp TIMESTAMP,
  checked_in_by VARCHAR(255), -- staff member who checked them in
  
  -- Customer experience tracking
  wait_time_minutes INTEGER, -- Time from check-in to food pickup
  satisfaction_rating INTEGER, -- 1-5 post-event rating
  feedback TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(order_id, event_id)
);

-- Enhanced BBQ fulfillment for multi-venue operations
CREATE TABLE bbq_fulfillment (
  id VARCHAR(255) PRIMARY KEY,
  line_item_id VARCHAR(255) NOT NULL REFERENCES line_items(id) ON DELETE CASCADE,
  event_id VARCHAR(255) NOT NULL REFERENCES events(id),
  venue_id VARCHAR(255) NOT NULL REFERENCES venues(id),
  
  package_status VARCHAR(50) DEFAULT 'ordered', -- ordered, preparing, ready, collected, delivered
  package_type VARCHAR(100) NOT NULL, -- From product metadata
  
  -- Preparation tracking
  preparation_started_at TIMESTAMP,
  preparation_completed_at TIMESTAMP,
  cooking_time_minutes INTEGER,
  chef_notes TEXT,
  
  -- Service tracking
  estimated_pickup_time TIMESTAMP,
  actual_pickup_time TIMESTAMP,
  wait_time_minutes INTEGER,
  collector_name VARCHAR(255),
  
  -- Quality control
  quality_check_passed BOOLEAN DEFAULT false,
  temperature_check_passed BOOLEAN DEFAULT false,
  presentation_rating INTEGER, -- 1-5 internal rating
  
  fulfillment_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Resource and equipment tracking for multi-venue logistics
CREATE TABLE event_resources (
  id VARCHAR(255) PRIMARY KEY,
  event_id VARCHAR(255) NOT NULL REFERENCES events(id),
  
  -- Equipment tracking
  equipment_list JSONB, -- {"grills": 2, "tables": 4, "chairs": 16}
  equipment_transport_method VARCHAR(100), -- "truck", "trailer", "venue_provided"
  setup_crew_size INTEGER DEFAULT 2,
  breakdown_crew_size INTEGER DEFAULT 2,
  
  -- Inventory planning
  estimated_food_quantities JSONB, -- {"brisket_lbs": 50, "ribs_racks": 30}
  actual_food_used JSONB,
  leftover_quantities JSONB,
  
  -- Logistics
  load_in_time TIME,
  event_start_time TIME,
  breakdown_start_time TIME,
  load_out_complete_time TIME,
  
  -- Costs
  transportation_cost DECIMAL(8,2),
  equipment_rental_cost DECIMAL(8,2),
  staff_cost DECIMAL(8,2),
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance on multi-venue queries
CREATE INDEX idx_events_venue_date ON events(venue_id, event_date);
CREATE INDEX idx_events_status_date ON events(status, event_date);
CREATE INDEX idx_venues_partnership_status ON venues(partnership_status);
CREATE INDEX idx_event_orders_venue_event ON event_orders(venue_id, event_id);
CREATE INDEX idx_customer_event_history_customer ON customer_event_history(customer_id);
CREATE INDEX idx_venue_metrics_venue_date ON venue_event_metrics(venue_id, created_at);
```

#### API Flow Examples

**1. Event Creation Flow**
```typescript
// Admin creates event + associated products
POST /admin/events
{
  title: "Downtown BBQ Pit",
  event_date: "2024-12-14",
  location_name: "Central Park",
  capacity: 90
}
// Returns: { event: { id: "evt_01HXXX", ... } }

// Auto-create associated BBQ package products
POST /admin/products (automated)
{
  title: "Basic BBQ Package - Downtown BBQ Pit",
  description: "Includes brisket, ribs, and 2 sides",
  variants: [{ 
    title: "Basic Package", 
    price: 2500,
    inventory_quantity: 50 
  }],
  metadata: {
    event_id: "evt_01HXXX",
    package_type: "basic",
    includes_sides: true,
    dietary_options: ["gluten_free"]
  }
}
```

**2. Customer Browse & Purchase Flow**
```typescript
// Customer browsing
GET /store/events?status=published&date_from=2024-12-01
// Returns events with linked product info

GET /store/events/evt_01HXXX/packages  
// Returns products where metadata.event_id = evt_01HXXX

// Customer adds to cart (standard Medusa flow)
POST /store/carts/{cart_id}/line-items
{
  product_id: "prod_01HYYY",
  variant_id: "variant_01HZZZ", 
  quantity: 2,
  metadata: {
    dietary_requirements: ["gluten_free"],
    pickup_preference: "event",
    special_instructions: "Extra sauce please"
  }
}

// Checkout (standard Medusa)
POST /store/carts/{cart_id}/payment-sessions
POST /store/carts/{cart_id}/complete
// Triggers custom webhook to create event_orders record
```

**3. Event Registration & Capacity Management**
```typescript
// Webhook handler after order completion
async function handleOrderCompleted(order: Order) {
  const eventLineItems = order.items.filter(item => 
    item.product.metadata?.event_id
  );
  
  for (const item of eventLineItems) {
    const eventId = item.product.metadata.event_id;
    
    // Create event order record
    await eventOrderService.create({
      order_id: order.id,
      event_id: eventId,
      attendee_count: item.quantity,
      dietary_requirements: item.metadata.dietary_requirements,
      pickup_preference: item.metadata.pickup_preference,
      qr_code: await generateQRCode(order.id, eventId)
    });
    
    // Update event capacity
    await eventService.updateCapacity(eventId, item.quantity);
    
    // Create fulfillment tracking
    await bbqFulfillmentService.create({
      line_item_id: item.id,
      event_id: eventId,
      package_status: 'ordered'
    });
  }
}
```

**4. Event Day Check-in Flow**
```typescript
// QR code scan at event
POST /store/events/checkin
{
  qr_code: "qr_abc123def456",
  staff_id: "staff_789"
}

// Backend processes check-in
async function checkInAttendee(qrCode: string, staffId: string) {
  const eventOrder = await eventOrderRepo.findOne({
    where: { qr_code: qrCode },
    relations: ['order', 'event']
  });
  
  if (!eventOrder) throw new Error('Invalid QR code');
  if (eventOrder.attendee_status === 'checked_in') {
    throw new Error('Already checked in');
  }
  
  // Update check-in status
  await eventOrderRepo.update(eventOrder.id, {
    attendee_status: 'checked_in',
    check_in_timestamp: new Date(),
    checked_in_by: staffId
  });
  
  // Update BBQ fulfillment status
  const lineItems = await lineItemRepo.find({
    where: { order_id: eventOrder.order_id }
  });
  
  for (const item of lineItems) {
    await bbqFulfillmentRepo.update(
      { line_item_id: item.id },
      { package_status: 'preparing' }
    );
  }
  
  return {
    success: true,
    attendee: eventOrder,
    packages: lineItems.map(item => ({
      package_type: item.product.metadata.package_type,
      status: 'preparing'
    }))
  };
}
```

**5. Admin Dashboard Queries**
```typescript
// Event overview with commerce data
GET /admin/events/evt_01HXXX/dashboard

async function getEventDashboard(eventId: string) {
  const event = await eventRepo.findOne(eventId);
  
  // Get all products for this event
  const eventProducts = await productRepo.find({
    where: { 
      metadata: { event_id: eventId } 
    }
  });
  
  // Get registrations and revenue
  const eventOrders = await eventOrderRepo.find({
    where: { event_id: eventId },
    relations: ['order', 'order.items']
  });
  
  // Calculate metrics
  const totalRegistrations = eventOrders.reduce(
    (sum, eo) => sum + eo.attendee_count, 0
  );
  
  const totalRevenue = eventOrders.reduce((sum, eo) => 
    sum + eo.order.total, 0
  );
  
  const checkedInCount = eventOrders.filter(
    eo => eo.attendee_status === 'checked_in'
  ).length;
  
  return {
    event,
    capacity_utilization: totalRegistrations / event.capacity,
    total_revenue: totalRevenue,
    check_in_rate: checkedInCount / eventOrders.length,
    packages_by_type: getPackageBreakdown(eventOrders),
    dietary_requirements: getDietaryBreakdown(eventOrders)
  };
}
```

This hybrid approach gives you:
- **Clean separation**: Events handle business logic, Products handle commerce
- **Medusa compatibility**: Cart, checkout, payments work unchanged  
- **Flexible querying**: Can easily get all events, all products for an event, or all orders for an event
- **Capacity management**: Event-level capacity separate from product-level inventory
- **Rich admin experience**: Event dashboards with commerce insights

#### Custom Medusa Services

**Venue Service (`src/services/venue.ts`)**
```typescript
class VenueService extends TransactionBaseService {
  async createVenue(data: CreateVenueInput): Promise<Venue>
  async updatePartnershipStatus(venueId: string, status: PartnershipStatus): Promise<Venue>
  async getVenuePerformanceMetrics(venueId: string, dateRange?: DateRange): Promise<VenueMetrics>
  async findAvailableVenues(criteria: VenueSearchCriteria): Promise<Venue[]>
  async calculateRevenueSplit(eventId: string): Promise<RevenueSplitCalculation>
  async getVenueEventHistory(venueId: string): Promise<VenueEventHistory[]>
}
```

**Event Service (`src/services/event.ts`)**
```typescript
class EventService extends TransactionBaseService {
  async createEvent(data: CreateEventInput): Promise<Event>
  async updateEventCapacity(eventId: string, capacity: number): Promise<Event>
  async getEventRegistrations(eventId: string): Promise<EventRegistration[]>
  async cancelEvent(eventId: string, reason: string): Promise<void>
  async getUpcomingEvents(venueId?: string): Promise<Event[]>
  async getEventsByLocation(coordinates: Point, radiusKm: number): Promise<Event[]>
  async calculateEventProfitability(eventId: string): Promise<EventProfitability>
  async getMultiVenueSchedule(dateRange: DateRange): Promise<MultiVenueSchedule>
}
```

**Multi-Venue Operations Service (`src/services/operations.ts`)**
```typescript
class OperationsService extends TransactionBaseService {
  async planResourceAllocation(eventIds: string[]): Promise<ResourcePlan>
  async optimizeStaffScheduling(dateRange: DateRange): Promise<StaffSchedule>
  async trackEquipmentLogistics(eventId: string): Promise<EquipmentStatus>
  async generateVenuePayouts(venueId: string, dateRange: DateRange): Promise<VenuePayout>
  async getOperationalInsights(dateRange: DateRange): Promise<OperationalMetrics>
  async validateEventFeasibility(eventData: CreateEventInput): Promise<FeasibilityCheck>
}
```

**Check-in Service (`src/services/checkin.ts`)**
```typescript
class CheckInService extends TransactionBaseService {
  async generateQRCode(orderId: string): Promise<string>
  async checkInAttendee(qrCode: string, staffId: string): Promise<CheckInResult>
  async getEventAttendees(eventId: string): Promise<Attendee[]>
  async markNoShow(orderId: string): Promise<void>
  async getCheckInStats(eventId: string): Promise<CheckInStats>
}
```

**BBQ Fulfillment Service (`src/services/bbq-fulfillment.ts`)**
```typescript
class BBQFulfillmentService extends TransactionBaseService {
  async updatePackageStatus(lineItemId: string, status: PackageStatus): Promise<void>
  async getPackagesByPickupTime(eventId: string): Promise<BBQPackage[]>
  async markPackageReady(lineItemId: string, notes: string): Promise<void>
  async handoffPackage(lineItemId: string, collectorName: string): Promise<void>
  async getInventoryStatus(eventId: string): Promise<InventoryStatus>
}
```

```
src/
├── app/                          # Next.js 14 App Router
│   ├── (customer)/              # Customer-facing routes
│   │   ├── events/              # Multi-venue event browsing
│   │   │   ├── page.tsx         # All events with venue filtering
│   │   │   ├── [eventId]/       # Event details page
│   │   │   └── venues/          # Browse by venue
│   │   ├── checkout/            # Pre-order flow
│   │   ├── account/             # Customer dashboard with event history
│   │   └── order-confirmation/  # Post-purchase
│   │
│   ├── admin/                   # Admin dashboard
│   │   ├── venues/              # Venue partnership management
│   │   │   ├── page.tsx         # Venue directory
│   │   │   ├── [venueId]/       # Venue details & performance
│   │   │   ├── partnerships/    # Partnership pipeline
│   │   │   └── payouts/         # Revenue sharing
│   │   ├── events/              # Multi-venue event management
│   │   │   ├── calendar/        # Visual schedule across venues
│   │   │   ├── [eventId]/       # Event management
│   │   │   └── logistics/       # Resource planning
│   │   ├── operations/          # Operational dashboards
│   │   │   ├── scheduling/      # Staff & equipment scheduling
│   │   │   ├── inventory/       # Food & equipment tracking
│   │   │   └── performance/     # Business metrics
│   │   ├── customers/           # Customer insights
│   │   │   ├── segments/        # Customer segmentation
│   │   │   ├── retention/       # Repeat customer analysis
│   │   │   └── feedback/        # Reviews & satisfaction
│   │   └── analytics/           # Business intelligence
│   │       ├── revenue/         # Revenue analysis
│   │       ├── venues/          # Venue performance comparison
│   │       └── trends/          # Market insights
│   │
│   └── checkin/                 # Event day check-in app
│       ├── scanner/             # QR code scanner
│       ├── attendees/           # Multi-event attendee management
│       └── fulfillment/         # Package handoff tracking
│
├── components/                  # Reusable UI components
│   ├── ui/                      # Base UI components
│   ├── venue/                   # Venue-specific components
│   │   ├── VenueCard.tsx       # Venue listing card
│   │   ├── VenueMap.tsx        # Location mapping
│   │   └── PartnershipForm.tsx # Partnership management
│   ├── event/                   # Event components
│   │   ├── EventCalendar.tsx   # Multi-venue calendar
│   │   ├── EventMap.tsx        # Geographic event view
│   │   └── CapacityIndicator.tsx
│   ├── operations/              # Operational components
│   │   ├── ResourcePlanner.tsx # Equipment/staff scheduling
│   │   ├── LogisticsTracker.tsx
│   │   └── PerformanceChart.tsx
│   └── admin/                   # Admin panel components
│
├── lib/                         # Utility functions
│   ├── medusa-client.ts        # Medusa API client
│   ├── venue-matcher.ts        # Venue recommendation engine
│   ├── logistics-optimizer.ts  # Resource allocation algorithms
│   ├── revenue-calculator.ts   # Venue payout calculations
│   └── analytics-tracker.ts    # Business metrics tracking
│
└── types/                       # TypeScript definitions
    ├── venue.ts                # Venue and partnership types
    ├── operations.ts           # Logistics and resource types
    ├── analytics.ts            # Metrics and reporting types
    └── multi-venue.ts          # Cross-venue data types
```

## 🚀 Development Phases

### Phase 1: MVP (Multi-Venue Foundation)
**Timeline: 6-8 weeks**

**Week 1-2: Core Infrastructure**
- [done] Set up Medusa.js backend with PostgreSQL
- [ ] Implement multi-venue database schema
- [ ] Create Next.js frontend with venue-aware routing
- [ ] Set up Railway deployment pipeline

**Week 5-6: Customer Experience**
- [ ] BBQ package pre-ordering system
- [ ] Payment processing and order management
- [ ] Basic email notifications

- [ ] Event day check-in system with QR codes
- [ ] Basic fulfillment tracking
- [ ] Venue payout calculations
- [ ] Simple admin dashboard for multi-venue management

### Phase 2: Operational Excellence (Version 1.1)
**Timeline: 4-5 weeks**

**Week 3-4: Venue & Event Management**
- [ ] Venue partnership onboarding system
- [ ] Multi-venue event creation and management
- [ ] Basic venue directory and event browsing
- [ ] Revenue split calculations

- [ ] Advanced venue performance analytics
- [ ] Resource and equipment scheduling system
- [ ] Customer retention and segmentation tools
- [ ] Automated venue communication workflows
- [ ] Enhanced mobile check-in experience
- [ ] Inventory planning and waste tracking

- [ ] Customer event browsing with venue filtering

### Phase 3: Scale & Optimization (Version 1.2+)
**Timeline: 4-6 weeks**

- [ ] Advanced venue recommendation engine
- [ ] Multi-event customer journey optimization
- [ ] Sophisticated revenue optimization tools
- [ ] Advanced business intelligence dashboard
- [ ] Franchise/licensing preparation tools
- [ ] Integration with venue POS systems

## 📊 Key Metrics & Analytics

### Business Metrics (Multi-Venue Operations)
- **Venue Partnership Growth**: Active venues, pipeline venues, partnership conversion rate
- **Event Conversion Rate**: Browsers → Pre-orders across all venues
- **Average Order Value**: Revenue per customer across venue types
- **Customer Lifetime Value**: Multi-event attendance patterns
- **Venue Performance**: Revenue per venue, customer satisfaction by location
- **Market Penetration**: Geographic coverage, venue type diversification
- **Revenue per Event**: Total earnings breakdown by venue partnership

### Operational Metrics (Multi-Venue Logistics)
- **Multi-Venue Efficiency**: Setup/breakdown times across different venues
- **Resource Utilization**: Equipment usage across events, staff scheduling optimization
- **Venue Satisfaction**: Partnership health, venue renewal rates
- **Customer Retention**: Cross-venue attendance, repeat customer rates
- **Inventory Accuracy**: Food planning vs. actual consumption across venues
- **Logistics Performance**: Transportation costs, equipment reliability
- **Quality Consistency**: Customer satisfaction variance across venues

### Venue Partnership Metrics
- **Partnership Pipeline**: Prospective venues, conversion rates, partnership velocity
- **Revenue Split Performance**: Venue profitability, payout accuracy
- **Venue Cross-Promotion**: Marketing effectiveness, customer acquisition by venue
- **Operational Support**: Venue cooperation ratings, setup assistance quality

## 🔌 Third-Party Services & Integrations

### Essential Services (MVP Phase)

**Email Communications**
- **Primary**: Resend (excellent developer experience, reliable delivery)
- **Alternative**: SendGrid or Mailgun
- **Use Cases**: Order confirmations, event reminders, cancellation notifications, admin alerts

**Payment Processing**
- **Primary**: Stripe (integrates well with Medusa.js out-of-box)
- **Alternative**: PayPal for broader customer acceptance
- **Use Cases**: Pre-order payments, refund processing, subscription billing (future)

**File Storage**
- **Development**: Next.js built-in image optimization + local storage
- **Production**: AWS S3 or Cloudflare R2 (cheaper egress than S3)
- **Alternative**: Railway's built-in storage (simpler setup)
- **Use Cases**: Event photos, menu images, QR codes, receipt PDFs

**SMS Notifications** (Optional for MVP)
- **Primary**: Twilio (reliable, good documentation)
- **Alternative**: AWS SNS (cheaper at scale)
- **Use Cases**: Event day reminders, pickup notifications

### Enhanced Services (Post-MVP)

**Analytics & Monitoring**
- **Application Monitoring**: Railway's built-in monitoring + Sentry for error tracking
- **Business Analytics**: PostHog or Mixpanel for customer behavior
- **Performance**: Vercel Analytics (if deploying frontend there)

**Weather Integration**
- **Primary**: OpenWeatherMap API (free tier available)
- **Use Cases**: Event cancellation decisions, customer notifications

**Location Services**
- **Primary**: Google Maps Platform (geocoding, directions)
- **Alternative**: Mapbox (often cheaper, good UX)
- **Use Cases**: Event location display, delivery radius calculations

**Backup & Security**
- **Database Backups**: Railway automatic backups + manual S3 archival
- **Security Scanning**: Dependabot + Snyk for vulnerability management
- **SSL/CDN**: Cloudflare (free tier covers most needs)

### Service Architecture Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐│
│  │   Resend    │  │   Stripe    │  │ Cloudflare  │  │  Twilio  ││
│  │             │  │             │  │     R2      │  │   SMS    ││
│  │ • Transact  │  │ • Payments  │  │ • Images    │  │ • Alerts ││
│  │ • Marketing │  │ • Refunds   │  │ • Documents │  │ • Remind ││
│  │ • Alerts    │  │ • Webhooks  │  │ • Backups   │  │ • Status ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                                 ▲
                                 │ API Integrations
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                      MEDUSA.JS BACKEND                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐│
│  │Email Service│  │Payment Svc  │  │ File Service│  │ SMS Svc  ││
│  │             │  │             │  │             │  │          ││
│  │ • Templates │  │ • Webhook   │  │ • Upload    │  │ • Queue  ││
│  │ • Queue     │  │ • Retry     │  │ • Optimize  │  │ • Status ││
│  │ • Tracking  │  │ • Logging   │  │ • CDN       │  │ • Log    ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Cost Estimation (Monthly)

**MVP Phase (~100 orders/month)**
- Resend: $0 (free tier: 3k emails/month)
- Stripe: ~$30-50 (2.9% + 30¢ per transaction)
- Railway: ~$10-20 (hobby plan should suffice)
- File Storage: ~$1-5 (minimal usage)
- **Total: ~$40-75/month**

**Growth Phase (~500 orders/month)**
- Resend: ~$20 (paid plan for better deliverability)
- Stripe: ~$150-200
- Railway: ~$50-100 (pro plan for scaling)
- File Storage: ~$10-15
- SMS (Twilio): ~$10-20
- **Total: ~$240-355/month**

### Integration Implementation Strategy

**Phase 1: Core Integrations**
```typescript
// Medusa service structure
src/services/
├── email.ts              # Resend integration
├── payment.ts            # Stripe webhook handling  
├── file-storage.ts       # Image upload/optimization
└── notification.ts       # Multi-channel notifications
```

**Environment Variables Setup**
```bash
# Email
RESEND_API_KEY=

# Payment
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# File Storage  
CLOUDFLARE_R2_ACCESS_KEY=
CLOUDFLARE_R2_SECRET_KEY=
CLOUDFLARE_R2_BUCKET=

# SMS (Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

**Service Reliability Patterns**
- **Circuit Breakers**: Fail gracefully when services are down
- **Retry Logic**: Exponential backoff for transient failures
- **Fallback Options**: Local email queuing if Resend is down
- **Health Checks**: Monitor service availability

### Recommendations for Your Approach

**Start Simple (MVP)**
- Resend for email (free tier is generous)
- Stripe for payments (Medusa.js integration is mature)
- Railway's built-in file storage initially
- Skip SMS for MVP - email + in-app notifications suffice

**Add Complexity When Needed**
- Move to dedicated file storage when you have lots of images
- Add SMS when you see high email open rates declining
- Implement analytics when you have enough data to be meaningful

**Future-Proof Decisions**
- Choose services with good APIs and webhooks
- Avoid vendor lock-in where possible (keep data exportable)
- Pick services that scale pricing with your usage

This gives you a clear path from simple to sophisticated without over-engineering early on. What do you think about this service selection? Any specific concerns about particular integrations?

## 🔐 Security & Compliance Considerations

### Data Protection
- Customer PII encryption in database
- Secure payment processing (PCI compliance)
- GDPR-compliant data handling
- Regular security audits and updates

### Event Day Security
- QR code expiration and single-use validation
- Staff authentication for check-in systems
- Backup systems for offline operation
- Customer data access controls

## 🚨 Risk Management

### Technical Risks
- **Payment Processing Failures**: Multiple payment method fallbacks
- **Database Outages**: Regular backups and failover systems
- **High Traffic Events**: Load balancing and caching strategies
- **Mobile Connectivity**: Offline-capable check-in system

### Business Risks
- **Weather Cancellations**: Clear cancellation policies and automated refunds
- **Food Safety**: Proper preparation tracking and temperature monitoring
- **Capacity Management**: Real-time inventory updates and oversell prevention
- **Customer Communication**: Multi-channel notification systems

## 📝 Next Steps for Implementation

1. **Environment Setup**
   - Initialize Medusa.js project with PostgreSQL
   - Create Next.js frontend with Tailwind CSS
   - Set up Railway deployment configuration

2. **Database Design**
   - Implement custom schema migrations
   - Seed initial data for testing
   - Configure Medusa extensions

3. **Core Feature Development**
   - Start with event creation and customer browsing
   - Implement payment processing integration
   - Build basic admin dashboard

4. **Testing Strategy**
   - Unit tests for custom services
   - Integration tests for payment flows
   - End-to-end testing for critical customer journeys

This architecture provides a solid foundation that can scale with your business while maintaining the flexibility to add new features as you grow. The modular approach allows you to develop and deploy features incrementally, reducing risk and enabling faster time-to-market.