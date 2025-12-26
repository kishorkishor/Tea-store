'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { cn, formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import QuantitySelector from '@/components/ui/QuantitySelector';

export default function CartDrawer() {
    const {
        items,
        isOpen,
        setCartOpen,
        removeItem,
        updateQuantity,
        subtotal,
        shipping,
        total,
    } = useCart();

    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setCartOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, setCartOpen]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={() => setCartOpen(false)}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={cn(
                    'fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50',
                    'transform transition-transform duration-300 ease-out',
                    'flex flex-col',
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}
                role="dialog"
                aria-modal="true"
                aria-label="Shopping cart"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="font-display text-xl font-semibold text-gray-900">
                        Your Cart ({items.length})
                    </h2>
                    <button
                        onClick={() => setCartOpen(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close cart"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">
                                Your cart is empty
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Looks like you haven&apos;t added any teas yet.
                            </p>
                            <Button onClick={() => setCartOpen(false)}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li
                                    key={`${item.product.id}-${item.variant.id}`}
                                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            onClick={() => setCartOpen(false)}
                                            className="font-medium text-gray-900 hover:text-primary-700 transition-colors line-clamp-1"
                                        >
                                            {item.product.name}
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {item.variant.name}
                                        </p>
                                        <p className="text-sm font-semibold text-primary-700 mt-1">
                                            {formatPrice(item.variant.price)}
                                        </p>

                                        {/* Quantity & Remove */}
                                        <div className="flex items-center gap-3 mt-2">
                                            <QuantitySelector
                                                quantity={item.quantity}
                                                onQuantityChange={(quantity) =>
                                                    updateQuantity(item.product.id, item.variant.id, quantity)
                                                }
                                                size="sm"
                                            />
                                            <button
                                                onClick={() => removeItem(item.product.id, item.variant.id)}
                                                className="text-sm text-red-600 hover:text-red-700 transition-colors"
                                                aria-label={`Remove ${item.product.name} from cart`}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer - Only show if items exist */}
                {items.length > 0 && (
                    <div className="border-t border-gray-200 px-6 py-4 space-y-4">
                        {/* Totals */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">
                                    {shipping === 0 ? (
                                        <span className="text-green-600">Free</span>
                                    ) : (
                                        formatPrice(shipping)
                                    )}
                                </span>
                            </div>
                            {subtotal < 1000 && (
                                <p className="text-xs text-gray-500">
                                    Add {formatPrice(1000 - subtotal)} more for free shipping!
                                </p>
                            )}
                            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-100">
                                <span>Total</span>
                                <span className="text-primary-700">{formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <Link href="/cart" onClick={() => setCartOpen(false)}>
                                <Button variant="outline" fullWidth>
                                    View Cart
                                </Button>
                            </Link>
                            <Link href="/checkout" onClick={() => setCartOpen(false)}>
                                <Button fullWidth>
                                    Checkout
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
