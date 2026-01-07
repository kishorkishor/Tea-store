'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // TODO: Replace with actual newsletter API integration
        // Example: await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus('success');
        setEmail('');

        // Reset after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <section className="py-16 md:py-24 bg-gradient-to-r from-secondary-500 to-secondary-600 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

            <div className="container-custom relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>

                    {/* Content */}
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                        Get 15% Off Your First Order
                    </h2>
                    <p className="text-white/90 mb-8">
                        Subscribe to our newsletter and be the first to know about new arrivals,
                        exclusive offers, and brewing tips from our tea masters.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            disabled={status === 'loading'}
                            className="flex-1 px-5 py-3 rounded-lg bg-white dark:bg-card text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-primary/50
                       disabled:opacity-50"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={status === 'loading'}
                            disabled={status === 'loading'}
                            className="bg-primary-800 hover:bg-primary-900"
                        >
                            {status === 'success' ? 'Subscribed!' : 'Subscribe'}
                        </Button>
                    </form>

                    {/* Success/Error Messages */}
                    {status === 'success' && (
                        <p className="mt-4 text-white/90 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Check your inbox for your discount code!
                        </p>
                    )}

                    {/* Privacy Note */}
                    <p className="mt-4 text-sm text-white/60">
                        No spam, ever. Unsubscribe anytime.
                        <a href="/privacy" className="underline hover:text-white ml-1">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </section>
    );
}
