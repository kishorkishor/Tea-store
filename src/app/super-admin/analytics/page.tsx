'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

interface TopProduct {
    product_id: string;
    product_name: string;
    total_sold: number;
    revenue: number;
}

export default function SuperAdminAnalyticsPage() {
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            // Get top products
            const { data: salesData } = await supabase
                .from('sales_tracking')
                .select('product_id, quantity_sold, revenue, order_id');

            // Group by product
            const productMap = new Map<string, { name: string; total_sold: number; revenue: number }>();

            for (const sale of salesData || []) {
                if (!sale.product_id) continue;

                // Get product name
                const { data: product } = await supabase
                    .from('products')
                    .select('name')
                    .eq('id', sale.product_id)
                    .single();

                if (!productMap.has(sale.product_id)) {
                    productMap.set(sale.product_id, {
                        name: product?.name || 'Unknown',
                        total_sold: 0,
                        revenue: 0,
                    });
                }

                const productData = productMap.get(sale.product_id)!;
                productData.total_sold += sale.quantity_sold || 0;
                productData.revenue += parseFloat(sale.revenue || '0');
            }

            const topProductsList: TopProduct[] = Array.from(productMap.entries())
                .map(([product_id, data]) => ({
                    product_id,
                    product_name: data.name,
                    total_sold: data.total_sold,
                    revenue: data.revenue,
                }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 10);

            setTopProducts(topProductsList);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-8">Analytics</h1>

            <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Top Selling Products</h2>
                <div className="space-y-4">
                    {topProducts.map((product, index) => (
                        <div key={product.product_id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                            <div className="flex items-center gap-4">
                                <span className="text-muted-foreground w-8">#{index + 1}</span>
                                <div>
                                    <div className="font-medium text-foreground">{product.product_name}</div>
                                    <div className="text-sm text-muted-foreground">{product.total_sold} units sold</div>
                                </div>
                            </div>
                            <div className="text-foreground font-semibold">{formatPrice(product.revenue)}</div>
                        </div>
                    ))}
                </div>
                {topProducts.length === 0 && (
                    <p className="text-muted-foreground">No sales data available.</p>
                )}
            </div>
        </div>
    );
}




