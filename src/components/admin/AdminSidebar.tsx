'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
    { href: '/admin/collections', label: 'Collections', icon: '📚' },
    { href: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
    { href: '/admin/inventory', label: 'Inventory', icon: '📋' },
];

const superAdminLinks = [
    { href: '/super-admin', label: 'Analytics', icon: '📈' },
    { href: '/super-admin/users', label: 'Users', icon: '👥' },
    { href: '/super-admin/sales', label: 'Sales Reports', icon: '💰' },
    { href: '/super-admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { profile } = useAuth();
    const isSuperAdmin = profile?.role === 'super_admin';

    const links = isSuperAdmin && pathname.startsWith('/super-admin') 
        ? superAdminLinks 
        : adminLinks;

    return (
        <aside className="w-64 bg-card border-r border-border min-h-screen p-4">
            <div className="mb-8">
                <h2 className="font-display text-xl font-bold text-foreground">
                    {isSuperAdmin && pathname.startsWith('/super-admin') ? 'Super Admin' : 'Admin'}
                </h2>
                {isSuperAdmin && (
                    <div className="mt-2 flex gap-2">
                        <Link
                            href="/admin"
                            className={cn(
                                'text-xs px-2 py-1 rounded',
                                pathname.startsWith('/admin') && !pathname.startsWith('/super-admin')
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            )}
                        >
                            Admin
                        </Link>
                        <Link
                            href="/super-admin"
                            className={cn(
                                'text-xs px-2 py-1 rounded',
                                pathname.startsWith('/super-admin')
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            )}
                        >
                            Super Admin
                        </Link>
                    </div>
                )}
            </div>

            <nav className="space-y-1">
                {links.map((link) => {
                    const isActive = pathname === link.href || 
                        (link.href !== '/admin' && link.href !== '/super-admin' && pathname.startsWith(link.href));
                    
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <span className="text-lg">{link.icon}</span>
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-8 pt-8 border-t border-border">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <span className="text-lg">🏠</span>
                    <span className="font-medium">Back to Store</span>
                </Link>
            </div>
        </aside>
    );
}




