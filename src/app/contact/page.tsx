'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const subjectOptions = [
    { value: '', label: 'Select a subject' },
    { value: 'order', label: 'Order Inquiry' },
    { value: 'product', label: 'Product Question' },
    { value: 'shipping', label: 'Shipping & Delivery' },
    { value: 'returns', label: 'Returns & Refunds' },
    { value: 'wholesale', label: 'Wholesale Inquiry' },
    { value: 'other', label: 'Other' },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!formData.subject) newErrors.subject = 'Please select a subject';
        if (!formData.message) newErrors.message = 'Message is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        // TODO: Replace with actual contact form API
        // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <div className="py-12 md:py-16">
            <div className="container-custom">
                {/* Header */}
                <nav className="mb-8 text-sm">
                    <ol className="flex items-center gap-2">
                        <li><Link href="/" className="text-muted-foreground hover:text-primary-700 dark:hover:text-primary">Home</Link></li>
                        <li className="text-muted-foreground">/</li>
                        <li className="text-foreground">Contact</li>
                    </ol>
                </nav>

                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Have a question about our teas? Need help with an order?
                            We&apos;d love to hear from you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-primary-50 dark:bg-primary/10 p-6 rounded-2xl border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-primary-700 dark:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Visit Us</h3>
                                        <p className="text-sm text-muted-foreground">
                                            House 42, Road 11<br />
                                            Banani, Dhaka 1213<br />
                                            Bangladesh
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-secondary-50 dark:bg-secondary/10 p-6 rounded-2xl border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-secondary-700 dark:text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                                        <p className="text-sm text-muted-foreground">
                                            hello@chaibari.com<br />
                                            support@chaibari.com
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-accent-50 dark:bg-accent/10 p-6 rounded-2xl border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-accent-100 dark:bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-accent-700 dark:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                                        <p className="text-sm text-muted-foreground">
                                            +880 1234-567890<br />
                                            Mon-Sat: 10AM - 7PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            {isSubmitted ? (
                                <div className="text-center py-12 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-border">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                                    </p>
                                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-muted p-8 rounded-2xl space-y-6 border border-border">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Input
                                            label="Your Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            error={errors.name}
                                            required
                                        />
                                        <Input
                                            label="Email Address"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            error={errors.email}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Input
                                            label="Phone Number (optional)"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                        <Select
                                            label="Subject"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            options={subjectOptions}
                                            error={errors.subject}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">
                                            Message
                                        </label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows={5}
                                            className={`w-full px-4 py-2.5 rounded-lg border bg-card dark:bg-card text-foreground placeholder:text-muted-foreground
                                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary focus:border-transparent
                                ${errors.message ? 'border-red-500 dark:border-destructive' : 'border-border hover:border-primary-400 dark:hover:border-primary'}`}
                                            placeholder="How can we help you?"
                                        />
                                        {errors.message && (
                                            <p className="mt-1.5 text-sm text-red-600 dark:text-destructive">{errors.message}</p>
                                        )}
                                    </div>
                                    <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                                        Send Message
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
