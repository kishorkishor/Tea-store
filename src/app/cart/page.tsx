import { Metadata } from 'next';
import Link from 'next/link';
import CartPageClient from './CartPageClient';

export const metadata: Metadata = {
    title: 'Shopping Cart',
    description: 'Review your cart and proceed to checkout.',
};

export default function CartPage() {
    return (
        <div className="py-12 md:py-16">
            <div className="container-custom">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2">
                        <li><Link href="/" className="text-gray-500 hover:text-primary-700">Home</Link></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-900">Cart</li>
                    </ol>
                </nav>

                <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                    Your Shopping Cart
                </h1>

                <CartPageClient />
            </div>
        </div>
    );
}
