import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"

// Debug: Log when this subscriber module loads
console.log("🔥 ORDER-PLACED SUBSCRIBER MODULE LOADED!")

// Define the Order type to ensure proper typing
interface OrderData {
  id: string
  email?: string
  display_id?: number
  created_at: string | Date
  total: number // Ensure this is typed as number
}

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const { data } = event
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const orderModuleService = container.resolve(Modules.ORDER)
  
  try {
    console.log("📧 EVENT TRIGGERED:", event.name, "for order:", data.id)
    console.log("📧 Order event received for order:", data.id)
    
    // Retrieve order with items included
    const order = await orderModuleService.retrieveOrder(data.id, {
      relations: ["items", "items.variant", "items.product", "billing_address", "shipping_address"]
    })
    
    console.log("📋 Retrieved order:", {
      id: order.id,
      email: order.email,
      total: order.total,
      display_id: order.display_id,
      items_count: order.items?.length || 0
    })
    
    if (!order.email) {
      console.error("❌ No email address found for order:", order.id)
      return
    }
    
    // Process order items with real data
    const items = (order.items || []).map((item: any) => ({
      title: item.title || item.product_title || 'BBQ Item',
      variant_title: item.subtitle || item.variant_title || null,
      quantity: item.quantity || 1,
      unit_price: (Number(item.unit_price || item.total || 0)).toFixed(2)
    }))
    
    // Determine product types based on item names
    const hasEventTicket = items.some(item => 
      item.title.toLowerCase().includes('experience') || 
      item.title.toLowerCase().includes('event') ||
      item.title.toLowerCase().includes('kansas city bbq')
    )
    
    const hasBBQProducts = items.some(item => 
      item.title.toLowerCase().includes('brisket') || 
      item.title.toLowerCase().includes('burnt ends') ||
      item.title.toLowerCase().includes('bbq') ||
      !item.title.toLowerCase().includes('experience')
    )
    
    // Get customer name from billing address if available
    const customerName = order.billing_address?.first_name 
      ? `${order.billing_address.first_name} ${order.billing_address.last_name || ''}`.trim()
      : "Valued Customer"
    
    const emailData = {
      customer_name: customerName,
      customer_email: order.email,
      order_display_id: order.display_id?.toString() || order.id,
      order_date: new Date(order.created_at).toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      }),
      order_total: Number(order.total).toFixed(2),
      items: items.length > 0 ? items : [{
        title: "BBQ Order Items",
        variant_title: null,
        quantity: 1,
        unit_price: Number(order.total).toFixed(2)
      }],
      has_event_ticket: hasEventTicket,
      has_bbq_products: hasBBQProducts
    }

    console.log("📤 Sending email with data:", {
      to: order.email,
      customer: customerName,
      items: emailData.items.length,
      has_event: hasEventTicket,
      has_bbq: hasBBQProducts,
      total: emailData.order_total
    })

    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-placed",
      data: {
        ...emailData,
        emailOptions: {
          subject: `Order Confirmation #${emailData.order_display_id} - Yank DownUnder BBQ`,
          replyTo: 'orders@yankdownunderbbq.com'
        }
      }
    })

    console.log(`✅ Order confirmation email queued for ${order.email}`)
    
  } catch (error) {
    console.error('❌ Email handler error:', error.message)
    console.error('Order ID:', data.id)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
    
    // Fallback: try sending a basic email with minimal data
    try {
      const basicOrder = await orderModuleService.retrieveOrder(data.id)
      if (basicOrder.email) {
        console.log("⚠️ Attempting fallback email send...")
        await notificationModuleService.createNotifications({
          to: basicOrder.email,
          channel: "email", 
          template: "order-placed",
          data: {
            customer_name: "Valued Customer",
            customer_email: basicOrder.email,
            order_display_id: basicOrder.display_id?.toString() || basicOrder.id,
            order_date: new Date().toLocaleDateString('en-AU'),
            order_total: Number(basicOrder.total).toFixed(2),
            items: [{
              title: "Your BBQ Order",
              variant_title: null,
              quantity: 1,
              unit_price: Number(basicOrder.total).toFixed(2)
            }],
            has_event_ticket: true,
            has_bbq_products: true,
            emailOptions: {
              subject: `Order Confirmation #${basicOrder.display_id || basicOrder.id} - Yank DownUnder BBQ`,
              replyTo: 'orders@yankdownunderbbq.com'
            }
          }
        })
        console.log("✅ Fallback email sent successfully")
      }
    } catch (fallbackError) {
      console.error("❌ Fallback email also failed:", fallbackError.message)
    }
  }
}

export const config: SubscriberConfig = {
  event: 'order.placed'  // Focus on single, primary Medusa 2.0 event
}
