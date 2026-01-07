'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/admin/StatusBadge';

interface User {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
    created_at: string;
}

export default function SuperAdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState<string>('all');

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        try {
            let query = supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (roleFilter !== 'all') {
                query = query.eq('role', roleFilter);
            }

            const { data, error } = await query;

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId: string, newRole: string) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;
            fetchUsers();
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Failed to update user role');
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground">User Management</h1>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                    <option value="all">All Users</option>
                    <option value="customer">Customers</option>
                    <option value="admin">Admins</option>
                    <option value="super_admin">Super Admins</option>
                </select>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Joined</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-muted/50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-foreground">
                                        {user.first_name || user.last_name
                                            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                            : 'No name'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-foreground">{user.email}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                                        className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a href={`/super-admin/users/${user.id}`}>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}




