'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/admin/StatusBadge';

interface User {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    role: string;
    created_at: string;
}

interface Order {
    id: string;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
}

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
        fetchOrders();
    }, [userId]);

    const fetchUser = async () => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const updateRole = async (newRole: string) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;
            fetchUser();
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role');
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (!user) {
        return <div className="text-center py-12">User not found</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground">User Details</h1>
                <Button variant="ghost" onClick={() => router.back()}>Back</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="font-display text-xl font-semibold text-foreground mb-4">User Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Name</label>
                                <div className="text-foreground">
                                    {user.first_name || user.last_name
                                        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                        : 'No name'}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Email</label>
                                <div className="text-foreground">{user.email}</div>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Phone</label>
                                <div className="text-foreground">{user.phone || 'Not provided'}</div>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Role</label>
                                <div className="mt-2">
                                    <select
                                        value={user.role}
                                        onChange={(e) => updateRole(e.target.value)}
                                        className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Joined</label>
                                <div className="text-foreground">{new Date(user.created_at).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Order History</h2>
                        {orders.length === 0 ? (
                            <p className="text-muted-foreground">No orders found.</p>
                        ) : (
                            <div className="space-y-2">
                                {orders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-border">
                                        <div>
                                            <div className="font-medium text-foreground">{order.order_number}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-foreground">৳{order.total}</span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}




