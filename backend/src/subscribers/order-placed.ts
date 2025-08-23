import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"

// Define the Order type to ensure proper typing
interface OrderData {
  id: string
  email?: string
  display_id?: number
  created_at: string | Date
  total: number // Ensure this is typed as number
}

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const orderModuleService = container.resolve(Modules.ORDER)
  
  try {
    console.log("Order placed event received for order:", data.id)
    
    // Retrieve order with minimal data to avoid relationship issues
    const order = await orderModuleService.retrieveOrder(data.id) as OrderData
    
    console.log("Retrieved order:", {
      id: order.id,
      email: order.email,
      total: order.total,
      display_id: order.display_id
    })
    
    if (!order.email) {
      console.error("No email address found for order:", order.id)
      return
    }
    
    // Send basic email without trying to get complex relationships
    const emailData = {
      customer_name: "Valued Customer",
      customer_email: order.email,
      order_display_id: order.display_id?.toString() || order.id,
      order_date: new Date(order.created_at).toLocaleDateString(),
      order_total: (Number(order.total) / 100).toFixed(2),
      items: [{
        title: "BBQ Order Items",
        variant_title: null,
        quantity: 1,
        unit_price: (Number(order.total) / 100).toFixed(2)
      }],
      has_event_ticket: true, // Assume BBQ experience for now
      has_bbq_products: true  // Assume BBQ products for now
    }

    console.log("Sending email with data:", {
      to: order.email,
      itemCount: emailData.items.length,
      hasEvent: emailData.has_event_ticket,
      hasBBQ: emailData.has_bbq_products
    })

    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-placed",
      data: emailData,
    })

    console.log(`Order confirmation email queued for ${order.email}`)
    
  } catch (error) {
    console.error('Email handler error:', error.message)
    console.error('Order ID:', data.id)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
  }
}

export const config: SubscriberConfig = {
  event: 'order.placed'
}
