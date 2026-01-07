'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

interface SalesData {
    date: string;
    revenue: number;
    orders: number;
    products_sold: number;
}

export default function SuperAdminSalesPage() {
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

    useEffect(() => {
        fetchSalesData();
    }, [dateRange]);

    const fetchSalesData = async () => {
        try {
            let startDate: string | null = null;
            const today = new Date();

            if (dateRange === '7d') {
                startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            } else if (dateRange === '30d') {
                startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            } else if (dateRange === '90d') {
                startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            }

            let query = supabase
                .from('sales_tracking')
                .select('sale_date, revenue, quantity_sold');

            if (startDate) {
                query = query.gte('sale_date', startDate);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Group by date
            const grouped = new Map<string, { revenue: number; products_sold: number; orders: Set<string> }>();

            data?.forEach((sale: any) => {
                const date = sale.sale_date;
                if (!grouped.has(date)) {
                    grouped.set(date, { revenue: 0, products_sold: 0, orders: new Set() });
                }
                const dayData = grouped.get(date)!;
                dayData.revenue += parseFloat(sale.revenue || '0');
                dayData.products_sold += sale.quantity_sold || 0;
            });

            // Get order counts per day
            const orderQuery = supabase
                .from('orders')
                .select('id, created_at, status')
                .eq('status', 'delivered');

            if (startDate) {
                orderQuery.gte('created_at', startDate);
            }

            const { data: orders } = await orderQuery;

            orders?.forEach((order: any) => {
                const date = order.created_at.split('T')[0];
                if (grouped.has(date)) {
                    grouped.get(date)!.orders.add(order.id);
                }
            });

            const formatted: SalesData[] = Array.from(grouped.entries())
                .map(([date, data]) => ({
                    date,
                    revenue: data.revenue,
                    orders: data.orders.size,
                    products_sold: data.products_sold,
                }))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setSalesData(formatted);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
    const totalProductsSold = salesData.reduce((sum, d) => sum + d.products_sold, 0);

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground">Sales Reports</h1>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="all">All Time</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold text-foreground">{formatPrice(totalRevenue)}</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="text-sm text-muted-foreground mb-1">Total Orders</div>
                    <div className="text-2xl font-bold text-foreground">{totalOrders}</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="text-sm text-muted-foreground mb-1">Products Sold</div>
                    <div className="text-2xl font-bold text-foreground">{totalProductsSold}</div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Revenue</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Orders</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Products Sold</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {salesData.map((data) => (
                            <tr key={data.date} className="hover:bg-muted/50">
                                <td className="px-6 py-4 text-foreground">{new Date(data.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right text-foreground">{formatPrice(data.revenue)}</td>
                                <td className="px-6 py-4 text-right text-foreground">{data.orders}</td>
                                <td className="px-6 py-4 text-right text-foreground">{data.products_sold}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {salesData.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No sales data found for the selected period.
                    </div>
                )}
            </div>
        </div>
    );
}




