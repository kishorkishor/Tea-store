import { Order, CustomerInfo, ShippingAddress, PaymentMethod, CartItem } from '@/types';
import { supabase } from '@/lib/supabase';

export async function createOrder(orderData: {
    customer: CustomerInfo;
    shippingAddress: ShippingAddress;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
    paymentMethod: PaymentMethod;
}): Promise<Order> {
    // Create order
    const { data: orderData_db, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: null, // Will be set when user is logged in
            customer_first_name: orderData.customer.firstName,
            customer_last_name: orderData.customer.lastName,
            customer_email: orderData.customer.email,
            customer_phone: orderData.customer.phone,
            shipping_address: orderData.shippingAddress.address,
            shipping_city: orderData.shippingAddress.city,
            shipping_district: orderData.shippingAddress.district,
            shipping_postal_code: orderData.shippingAddress.postalCode,
            shipping_country: orderData.shippingAddress.country,
            subtotal: orderData.subtotal,
            shipping_cost: orderData.shipping,
            total: orderData.total,
            payment_method: orderData.paymentMethod,
            payment_status: orderData.paymentMethod === 'cod' ? 'pending' : 'pending',
            status: 'pending',
        })
        .select()
        .single();

    if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error('Failed to create order');
    }

    // Create order items
    const orderItems = orderData.items.map(item => ({
        order_id: orderData_db.id,
        product_id: item.product.id,
        variant_id: item.variant.id,
        product_name: item.product.name,
        variant_name: item.variant.name,
        quantity: item.quantity,
        unit_price: item.variant.price,
        total_price: item.variant.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) {
        console.error('Order items creation error:', itemsError);
        // Order is created but items failed - you might want to handle this differently
    }

    // Return order in the format expected by frontend
    const order: Order = {
        id: orderData_db.id,
        orderNumber: orderData_db.order_number,
        customer: orderData.customer,
        shippingAddress: orderData.shippingAddress,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        status: orderData_db.status as Order['status'],
        createdAt: orderData_db.created_at,
    };

    return order;
}

export async function getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (*)
        `)
        .eq('id', orderId)
        .single();

    if (error || !data) {
        return null;
    }

    // Transform database order to frontend Order type
    return {
        id: data.id,
        orderNumber: data.order_number,
        customer: {
            firstName: data.customer_first_name,
            lastName: data.customer_last_name,
            email: data.customer_email,
            phone: data.customer_phone,
        },
        shippingAddress: {
            address: data.shipping_address,
            city: data.shipping_city,
            district: data.shipping_district,
            postalCode: data.shipping_postal_code,
            country: data.shipping_country,
        },
        items: (data.order_items || []).map((item: any) => ({
            product: {} as any, // You'll need to fetch product details if needed
            variant: {} as any,
            quantity: item.quantity,
        })),
        subtotal: parseFloat(data.subtotal),
        shipping: parseFloat(data.shipping_cost),
        total: parseFloat(data.total),
        paymentMethod: data.payment_method as PaymentMethod,
        status: data.status as Order['status'],
        createdAt: data.created_at,
    };
}

export async function processPayment(
    _orderId: string,
    _paymentMethod: PaymentMethod,
    _amount: number
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // For COD, payment is always successful
    if (_paymentMethod === 'cod') {
        return {
            success: true,
            transactionId: `COD-${Date.now()}`,
        };
    }

    // TODO: Add bKash integration later
    return {
        success: false,
        error: 'Payment method not yet implemented',
    };
}

// Keep old function for backward compatibility during transition
export async function createOrderPlaceholder(orderData: {
    customer: CustomerInfo;
    shippingAddress: ShippingAddress;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
    paymentMethod: PaymentMethod;
}): Promise<Order> {
    return createOrder(orderData);
}
