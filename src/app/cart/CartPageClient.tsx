'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Button from '@/components/ui/Button';

export default function CartPageClient() {
    const { items, removeItem, updateQuantity, clearCart, subtotal, shipping, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="font-display text-2xl font-semibold text-gray-900 mb-2">
                    Your cart is empty
                </h2>
                <p className="text-gray-600 mb-8">
                    Looks like you haven&apos;t added any teas yet. Start exploring our collections!
                </p>
                <Link href="/collections">
                    <Button size="lg">Browse Collections</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm text-gray-500">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                        <div
                            key={`${item.product.id}-${item.variant.id}`}
                            className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                        >
                            {/* Product Info */}
                            <div className="md:col-span-6 flex gap-4">
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        sizes="96px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Link
                                        href={`/products/${item.product.slug}`}
                                        className="font-semibold text-gray-900 hover:text-primary-700 transition-colors"
                                    >
                                        {item.product.name}
                                    </Link>
                                    <p className="text-sm text-gray-500 mt-1">{item.variant.name}</p>
                                    <button
                                        onClick={() => removeItem(item.product.id, item.variant.id)}
                                        className="text-sm text-red-600 hover:text-red-700 mt-2 md:hidden"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="md:col-span-2 text-center">
                                <span className="md:hidden text-sm text-gray-500">Price: </span>
                                <span className="font-medium">{formatPrice(item.variant.price)}</span>
                            </div>

                            {/* Quantity */}
                            <div className="md:col-span-2 flex justify-center">
                                <QuantitySelector
                                    quantity={item.quantity}
                                    onQuantityChange={(qty) => updateQuantity(item.product.id, item.variant.id, qty)}
                                    size="sm"
                                />
                            </div>

                            {/* Total */}
                            <div className="md:col-span-2 flex items-center justify-end gap-4">
                                <span className="font-semibold text-primary-700">
                                    {formatPrice(item.variant.price * item.quantity)}
                                </span>
                                <button
                                    onClick={() => removeItem(item.product.id, item.variant.id)}
                                    className="hidden md:block p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    aria-label={`Remove ${item.product.name}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Clear Cart */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                    <Link href="/collections" className="text-primary-700 font-medium hover:underline">
                        ← Continue Shopping
                    </Link>
                    <button
                        onClick={clearCart}
                        className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                        Clear Cart
                    </button>
                </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                    <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">
                        Order Summary
                    </h2>

                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal ({items.length} items)</span>
                            <span className="font-medium">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
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
                            <p className="text-xs text-gray-500 bg-secondary-50 p-3 rounded-lg">
                                💡 Add {formatPrice(1000 - subtotal)} more to get free shipping!
                            </p>
                        )}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span className="text-primary-700">{formatPrice(total)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Tax included</p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <Link href="/checkout">
                            <Button fullWidth size="lg">
                                Proceed to Checkout
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Secure checkout</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Easy returns within 7 days</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
