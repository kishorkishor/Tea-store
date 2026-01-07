'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Button from '@/components/ui/Button';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { itemCount, toggleCart } = useCart();
    const { user, profile, signOut, loading: authLoading } = useAuth();

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
                isScrolled
                    ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50'
                    : 'bg-transparent'
            )}
        >
            <nav className="container-custom">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-10 h-10 bg-primary-700 dark:bg-primary rounded-full flex items-center justify-center group-hover:bg-primary-800 dark:group-hover:bg-primary/90 transition-colors">
                            <svg
                                viewBox="0 0 24 24"
                                className="w-6 h-6 text-white dark:text-primary-foreground"
                                fill="currentColor"
                            >
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2 13h-4v-1h4v1zm0-3H10v-1h4v1zm1.5-3.5c-.42.78-1.14 1.34-2 1.56V12h-3V9.06c-.86-.22-1.58-.78-2-1.56-.5-.9-.5-2 0-2.9.42-.78 1.14-1.34 2-1.56V2h3v1.04c.86.22 1.58.78 2 1.56.5.9.5 2 0 2.9z" />
                            </svg>
                        </div>
                        <span className="font-display text-xl font-bold text-primary-700 dark:text-primary">
                            ChaiBari
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm font-medium transition-colors relative',
                                    'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5',
                                    'after:bg-primary-600 after:scale-x-0 after:transition-transform',
                                    'hover:after:scale-x-100',
                                    pathname === link.href
                                        ? 'text-primary-700 dark:text-primary after:scale-x-100'
                                        : 'text-foreground/80 hover:text-primary-700 dark:hover:text-primary'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {/* Search Button */}
                        <button
                            className="p-2 text-foreground/70 hover:text-primary-700 dark:hover:text-primary hover:bg-primary-50 dark:hover:bg-muted rounded-full transition-colors"
                            aria-label="Search"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Cart Button */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2 text-foreground/70 hover:text-primary-700 dark:hover:text-primary hover:bg-primary-50 dark:hover:bg-muted rounded-full transition-colors"
                            aria-label={`Cart with ${itemCount} items`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 dark:bg-primary text-white dark:text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                                    {itemCount > 9 ? '9+' : itemCount}
                                </span>
                            )}
                        </button>

                        {/* Auth Buttons */}
                        {!authLoading && (
                            <>
                                {user ? (
                                    <div className="flex items-center gap-2">
                                        {(profile?.role === 'admin' || profile?.role === 'super_admin') && (
                                            <Link href={profile?.role === 'super_admin' ? '/super-admin' : '/admin'}>
                                                <Button variant="ghost" size="sm">Admin</Button>
                                            </Link>
                                        )}
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
                                            <span className="text-sm text-foreground">
                                                {profile?.first_name || profile?.email?.split('@')[0] || 'User'}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    signOut();
                                                    router.push('/');
                                                }}
                                                className="text-sm text-muted-foreground hover:text-foreground"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">Login</Button>
                                    </Link>
                                )}
                            </>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-foreground/70 hover:text-primary-700 dark:hover:text-primary hover:bg-primary-50 dark:hover:bg-muted rounded-full transition-colors"
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={cn(
                        'md:hidden overflow-hidden transition-all duration-300',
                        isMobileMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
                    )}
                >
                    <div className="flex flex-col gap-1 pt-2 border-t border-border">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'px-4 py-3 rounded-lg font-medium transition-colors',
                                    pathname === link.href
                                        ? 'bg-primary-50 dark:bg-muted text-primary-700 dark:text-primary'
                                        : 'text-foreground/80 hover:bg-muted'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
}
