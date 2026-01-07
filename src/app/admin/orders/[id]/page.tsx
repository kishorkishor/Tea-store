'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
    id: string;
    product_name: string;
    variant_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Order {
    id: string;
    order_number: string;
    customer_first_name: string;
    customer_last_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_district: string;
    shipping_postal_code: string;
    shipping_country: string;
    subtotal: number;
    shipping_cost: number;
    total: number;
    payment_method: string;
    payment_status: string;
    status: string;
    created_at: string;
    items: OrderItem[];
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (orderError) throw orderError;

            const { data: items, error: itemsError } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', orderId);

            if (itemsError) throw itemsError;

            setOrder({
                ...orderData,
                items: items || [],
            });
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            fetchOrder();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status');
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (!order) {
        return <div className="text-center py-12">Order not found</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-foreground">Order {order.order_number}</h1>
                    <p className="text-muted-foreground mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={order.status}
                        onChange={(e) => updateStatus(e.target.value)}
                        className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <Button variant="ghost" onClick={() => router.back()}>Back</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                                    <div>
                                        <div className="font-medium text-foreground">{item.product_name}</div>
                                        <div className="text-sm text-muted-foreground">{item.variant_name} × {item.quantity}</div>
                                    </div>
                                    <div className="text-foreground font-medium">{formatPrice(item.total_price)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Order Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Shipping</span>
                                <span>{formatPrice(order.shipping_cost)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold text-foreground pt-2 border-t border-border">
                                <span>Total</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Customer Info</h2>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Name:</span>
                                <span className="ml-2 text-foreground">{order.customer_first_name} {order.customer_last_name}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Email:</span>
                                <span className="ml-2 text-foreground">{order.customer_email}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="ml-2 text-foreground">{order.customer_phone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Shipping Address</h2>
                        <div className="text-sm text-foreground">
                            {order.shipping_address}<br />
                            {order.shipping_city}, {order.shipping_district}<br />
                            {order.shipping_postal_code}<br />
                            {order.shipping_country}
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Payment</h2>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Method:</span>
                                <span className="ml-2 text-foreground capitalize">{order.payment_method}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Status:</span>
                                <span className="ml-2"><StatusBadge status={order.payment_status} /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




