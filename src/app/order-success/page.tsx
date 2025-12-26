import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'Order Confirmed',
    description: 'Your order has been placed successfully.',
};

function OrderSuccessContent() {
    return (
        <div className="py-16 md:py-24">
            <div className="container-custom">
                <div className="max-w-lg mx-auto text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Success Message */}
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
                        Order Confirmed!
                    </h1>
                    <p className="text-gray-600 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Thank you for your order. We&apos;ve received your order and will begin processing it shortly.
                    </p>

                    {/* Order Info Card */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="text-sm text-gray-500 mb-1">Order Number</div>
                        <div className="font-display text-2xl font-bold text-primary-700 mb-4">
                            #XXXXXX
                        </div>
                        <p className="text-sm text-gray-600">
                            A confirmation email has been sent to your email address with order details.
                        </p>
                    </div>

                    {/* What's Next */}
                    <div className="bg-secondary-50 rounded-2xl p-6 mb-8 text-left animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-secondary-600 mt-0.5">1.</span>
                                <span>We&apos;ll process your order within 24 hours</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-secondary-600 mt-0.5">2.</span>
                                <span>You&apos;ll receive a shipping confirmation with tracking details</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-secondary-600 mt-0.5">3.</span>
                                <span>Your tea will be delivered within 2-3 business days</span>
                            </li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <Link href="/collections">
                            <Button size="lg">
                                Continue Shopping
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" size="lg">
                                Back to Home
                            </Button>
                        </Link>
                    </div>

                    {/* Contact Support */}
                    <p className="mt-8 text-sm text-gray-500 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                        Have questions? <Link href="/contact" className="text-primary-700 hover:underline">Contact our support team</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="py-16 md:py-24">
                <div className="container-custom text-center">
                    <div className="animate-pulse">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-8"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                    </div>
                </div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
