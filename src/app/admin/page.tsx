'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import StatsCard from '@/components/admin/StatsCard';

export default function AdminDashboard() {
    const router = useRouter();
    const { user, profile, loading: authLoading } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalProducts: 0,
        lowStockProducts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user || (profile?.role !== 'admin' && profile?.role !== 'super_admin')) {
                router.push('/login?redirect=/admin');
                return;
            }
            fetchStats();
        }
    }, [user, profile, authLoading]);

    const fetchStats = async () => {
        try {
            // Get order stats
            const { count: totalOrders } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            const { count: pendingOrders } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            // Get product stats
            const { count: totalProducts } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            // Get low stock products (variants with stock < 10)
            const { data: lowStockVariants } = await supabase
                .from('product_variants')
                .select('product_id')
                .lt('stock_quantity', 10);

            const uniqueLowStockProducts = new Set(lowStockVariants?.map((v: { product_id: string }) => v.product_id) || []);

            setStats({
                totalOrders: totalOrders || 0,
                pendingOrders: pendingOrders || 0,
                totalProducts: totalProducts || 0,
                lowStockProducts: uniqueLowStockProducts.size,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (!user || (profile?.role !== 'admin' && profile?.role !== 'super_admin')) {
        return null;
    }

    return (
        <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon="🛒"
                />
                <StatsCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon="⏳"
                />
                <StatsCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon="📦"
                />
                <StatsCard
                    title="Low Stock Products"
                    value={stats.lowStockProducts}
                    icon="⚠️"
                />
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/products/new"
                        className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        <div className="font-medium text-foreground mb-1">➕ Add New Product</div>
                        <div className="text-sm text-muted-foreground">Create a new product listing</div>
                    </a>
                    <a
                        href="/admin/orders"
                        className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        <div className="font-medium text-foreground mb-1">📋 View Orders</div>
                        <div className="text-sm text-muted-foreground">Manage customer orders</div>
                    </a>
                    <a
                        href="/admin/inventory"
                        className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        <div className="font-medium text-foreground mb-1">📊 Manage Inventory</div>
                        <div className="text-sm text-muted-foreground">Update stock levels</div>
                    </a>
                </div>
            </div>
        </div>
    );
}

