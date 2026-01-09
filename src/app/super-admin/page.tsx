'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import StatsCard from '@/components/admin/StatsCard';
import { formatPrice } from '@/lib/utils';

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        todayRevenue: 0,
        todayOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Total revenue
            const { data: salesData } = await supabase
                .from('sales_tracking')
                .select('revenue');

            const totalRevenue = salesData?.reduce((sum: number, s: { revenue: string | null }) => sum + parseFloat(s.revenue || '0'), 0) || 0;

            // Today's revenue
            const today = new Date().toISOString().split('T')[0];
            const { data: todaySales } = await supabase
                .from('sales_tracking')
                .select('revenue')
                .eq('sale_date', today);

            const todayRevenue = todaySales?.reduce((sum: number, s: { revenue: string | null }) => sum + parseFloat(s.revenue || '0'), 0) || 0;

            // Total orders
            const { count: totalOrders } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            // Today's orders
            const { count: todayOrders } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today);

            // Total products
            const { count: totalProducts } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            // Total users
            const { count: totalUsers } = await supabase
                .from('user_profiles')
                .select('*', { count: 'exact', head: true });

            setStats({
                totalRevenue,
                totalOrders: totalOrders || 0,
                totalProducts: totalProducts || 0,
                totalUsers: totalUsers || 0,
                todayRevenue,
                todayOrders: todayOrders || 0,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-8">Super Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Revenue"
                    value={formatPrice(stats.totalRevenue)}
                    icon="💰"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon="🛒"
                />
                <StatsCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon="📦"
                />
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon="👥"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatsCard
                    title="Today's Revenue"
                    value={formatPrice(stats.todayRevenue)}
                    icon="📈"
                />
                <StatsCard
                    title="Today's Orders"
                    value={stats.todayOrders}
                    icon="📊"
                />
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/super-admin/analytics"
                        className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        <div className="font-medium text-foreground mb-1">📊 View Analytics</div>
                        <div className="text-sm text-muted-foreground">Detailed analytics and reports</div>
                    </a>
                    <a
                        href="/super-admin/users"
                        className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        <div className="font-medium text-foreground mb-1">👥 Manage Users</div>
                        <div className="text-sm text-muted-foreground">View and manage user accounts</div>
                    </a>
                    <a
                        href="/super-admin/sales"
                        className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        <div className="font-medium text-foreground mb-1">💰 Sales Reports</div>
                        <div className="text-sm text-muted-foreground">Generate sales reports</div>
                    </a>
                </div>
            </div>
        </div>
    );
}




