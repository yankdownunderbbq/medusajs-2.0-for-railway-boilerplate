import { Text, Section, Hr, Container, Heading } from '@react-email/components'
import * as React from 'react'
import { Base } from './base'
import { OrderDTO, OrderAddressDTO } from '@medusajs/framework/types'

export const ORDER_PLACED = 'order-placed'

interface OrderPlacedPreviewProps {
  customer_name: string
  customer_email: string
  order_display_id: string
  order_date: string
  order_total: string
  items: Array<{
    title: string
    variant_title?: string
    quantity: number
    unit_price: string
  }>
  has_event_ticket: boolean
  has_bbq_products: boolean
}

export interface OrderPlacedTemplateProps {
  customer_name: string
  customer_email: string
  order_display_id: string
  order_date: string
  order_total: string
  items: Array<{
    title: string
    variant_title?: string
    quantity: number
    unit_price: string
  }>
  has_event_ticket: boolean
  has_bbq_products: boolean
  preview?: string
}

export const isOrderPlacedTemplateData = (data: any): data is OrderPlacedTemplateProps =>
  typeof data.customer_name === 'string' && typeof data.customer_email === 'string'

export const OrderPlacedTemplate: React.FC<OrderPlacedTemplateProps> & {
  PreviewProps: OrderPlacedPreviewProps
} = ({ 
  customer_name,
  customer_email,
  order_display_id,
  order_date,
  order_total,
  items,
  has_event_ticket,
  has_bbq_products,
  preview = 'Your BBQ order has been confirmed!' 
}) => {

  return (
    <Base preview={preview}>
      <Section>
        {/* Header */}
        <div style={{ textAlign: 'center', margin: '0 0 40px' }}>
          <Text style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#d2691e', 
            margin: '0 0 10px' 
          }}>
            Yank DownUnder BBQ
          </Text>
          <Text style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            margin: '0 0 15px' 
          }}>
            Order Confirmation
          </Text>
          <Text style={{ 
            fontSize: '18px', 
            color: '#666', 
            margin: '0' 
          }}>
            Thank you for your order, {customer_name}!
          </Text>
        </div>

        {/* Order Summary */}
        <Container style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          margin: '0 0 30px'
        }}>
          <Text style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 15px' }}>
            Order Details
          </Text>
          <Text style={{ margin: '0 0 8px' }}>
            <strong>Order #:</strong> {order_display_id}
          </Text>
          <Text style={{ margin: '0 0 8px' }}>
            <strong>Order Date:</strong> {order_date}
          </Text>
          <Text style={{ margin: '0 0 8px' }}>
            <strong>Email:</strong> {customer_email}
          </Text>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', margin: '15px 0 0' }}>
            <strong>Total: ${order_total}</strong>
          </Text>
        </Container>

        {/* Order Items */}
        <Text style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 15px' }}>
          Items Ordered
        </Text>

        {items.map((item, index) => (
          <div key={index} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            margin: '0 0 10px',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <Text style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px' }}>
                  {item.title}
                </Text>
                {item.variant_title && (
                  <Text style={{ fontSize: '14px', color: '#666', margin: '0 0 5px' }}>
                    {item.variant_title}
                  </Text>
                )}
                <Text style={{ fontSize: '14px', margin: '0' }}>
                  Quantity: {item.quantity}
                </Text>
              </div>
              <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#d2691e' }}>
                ${item.unit_price}
              </Text>
            </div>
          </div>
        ))}

        <Hr style={{ margin: '30px 0' }} />

        {/* Pickup Information */}
        <Container style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeeba',
          borderRadius: '8px',
          padding: '20px',
          margin: '0 0 30px'
        }}>
          <Text style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 15px' }}>
            🏪 Pickup Information
          </Text>
          <Text style={{ margin: '0 0 8px' }}>
            <strong>Location:</strong> Yank DownUnder BBQ
          </Text>
          <Text style={{ margin: '0 0 8px' }}>
            <strong>Address:</strong> [Your Business Address]
          </Text>
          <Text style={{ margin: '0 0 8px' }}>
            <strong>Phone:</strong> [Your Phone Number]
          </Text>
          <Text style={{ margin: '0 0 15px' }}>
            <strong>Hours:</strong> [Your Business Hours]
          </Text>
          <Text style={{ fontSize: '14px', color: '#856404', margin: '0' }}>
            📧 Please bring this confirmation email when picking up your order.
          </Text>
        </Container>

        {/* Event-specific instructions */}
        {has_event_ticket && (
          <Container style={{
            backgroundColor: '#d1ecf1',
            border: '1px solid #bee5eb',
            borderRadius: '8px',
            padding: '20px',
            margin: '0 0 20px'
          }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px' }}>
              🍖 BBQ Experience Details
            </Text>
            <Text style={{ margin: '0 0 10px' }}>
              Your Kansas City BBQ Experience is confirmed! We'll send you detailed event information including:
            </Text>
            <ul style={{ margin: '0 0 10px', paddingLeft: '20px' }}>
              <li>Exact event location and timing</li>
              <li>What to bring and expect</li>
              <li>Special dietary accommodations (if any)</li>
            </ul>
            <Text style={{ fontSize: '14px', color: '#0c5460', margin: '0' }}>
              Event details will be sent 24-48 hours before your scheduled experience.
            </Text>
          </Container>
        )}

        {/* BBQ Products instructions */}
        {has_bbq_products && (
          <Container style={{
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            padding: '20px',
            margin: '0 0 20px'
          }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px' }}>
              🥩 Take-Home BBQ Products
            </Text>
            <Text style={{ margin: '0 0 10px' }}>
              Your vacuum-sealed BBQ products will be ready for pickup. All items include:
            </Text>
            <ul style={{ margin: '0 0 10px', paddingLeft: '20px' }}>
              <li>Vacuum-sealed for freshness</li>
              <li>Heating instructions included</li>
              <li>Best consumed within 7 days of pickup</li>
            </ul>
            <Text style={{ fontSize: '14px', color: '#155724', margin: '0' }}>
              Keep refrigerated and follow reheating instructions for best quality.
            </Text>
          </Container>
        )}

        {/* Footer */}
        <Hr style={{ margin: '30px 0' }} />
        
        <Text style={{ textAlign: 'center', fontSize: '16px', margin: '0 0 10px' }}>
          <strong>Questions about your order?</strong>
        </Text>
        <Text style={{ textAlign: 'center', margin: '0 0 20px' }}>
          Reply to this email or call us at [Your Phone Number]
        </Text>
        
        <Text style={{ textAlign: 'center', fontSize: '14px', color: '#666', margin: '0' }}>
          Thank you for choosing Yank DownUnder BBQ for your authentic American BBQ experience!
        </Text>
      </Section>
    </Base>
  )
}

OrderPlacedTemplate.PreviewProps = {
  customer_name: 'Test Customer',
  customer_email: 'test@yankdownunderbbq.com',
  order_display_id: 'ORD-123',
  order_date: new Date().toLocaleDateString(),
  order_total: '75.00',
  items: [
    { title: 'Kansas City BBQ Experience', variant_title: 'Standard Package', quantity: 2, unit_price: '30.00' },
    { title: 'Burnt Ends', variant_title: null, quantity: 1, unit_price: '15.00' }
  ],
  has_event_ticket: true,
  has_bbq_products: true
} as OrderPlacedPreviewProps

export default OrderPlacedTemplate
