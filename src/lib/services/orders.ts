import { Order, CustomerInfo, ShippingAddress, PaymentMethod, CartItem } from '@/types';

/**
 * Create an order placeholder
 * TODO: Replace with Supabase insert
 * Example: 
 * const { data, error } = await supabase
 *   .from('orders')
 *   .insert({
 *     customer_info: orderData.customer,
 *     shipping_address: orderData.shippingAddress,
 *     items: orderData.items,
 *     subtotal: orderData.subtotal,
 *     shipping: orderData.shipping,
 *     total: orderData.total,
 *     payment_method: orderData.paymentMethod,
 *     status: 'pending'
 *   })
 *   .select()
 *   .single()
 */
export async function createOrderPlaceholder(orderData: {
    customer: CustomerInfo;
    shippingAddress: ShippingAddress;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
    paymentMethod: PaymentMethod;
}): Promise<Order> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate a mock order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const orderNumber = `#${Math.floor(10000 + Math.random() * 90000)}`;

    const order: Order = {
        id: orderId,
        orderNumber,
        customer: orderData.customer,
        shippingAddress: orderData.shippingAddress,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString(),
    };

    // TODO: In production, save to database and send confirmation email
    // await sendOrderConfirmationEmail(order);

    return order;
}

/**
 * Get order by ID
 * TODO: Replace with Supabase fetch
 * Example: const { data } = await supabase.from('orders').select('*').eq('id', orderId).single()
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 100));

    // In mock mode, we can't actually retrieve orders
    // This will be replaced with actual database fetch
    console.log('Fetching order:', orderId);
    return null;
}

/**
 * Process payment
 * TODO: Replace with payment gateway integration (bKash, SSLCommerz, Stripe, etc.)
 */
export async function processPayment(
    _orderId: string,
    _paymentMethod: PaymentMethod,
    _amount: number
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful payment
    // TODO: Integrate with actual payment gateway
    // For bKash: await bkashGateway.initiatePayment(amount)
    // For SSLCommerz: await sslcommerz.initiateTransaction(orderDetails)
    // For Card: await stripe.charges.create({ amount, currency: 'bdt', source: token })

    return {
        success: true,
        transactionId: `TXN-${Date.now()}`,
    };
}
