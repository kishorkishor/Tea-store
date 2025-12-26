'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/services/products';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import ProductGallery from '@/components/product/ProductGallery';
import PriceDisplay from '@/components/ui/PriceDisplay';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Button from '@/components/ui/Button';

export default function ProductPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { addItem, setCartOpen } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        async function loadProduct() {
            setLoading(true);
            const data = await getProductBySlug(slug);
            setProduct(data);
            if (data?.variants.length) {
                setSelectedVariant(data.variants[0]);
            }
            setLoading(false);
        }
        loadProduct();
    }, [slug]);

    const handleAddToCart = () => {
        if (product && selectedVariant) {
            addItem(product, selectedVariant, quantity);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    const handleBuyNow = () => {
        if (product && selectedVariant) {
            addItem(product, selectedVariant, quantity);
            setCartOpen(true);
        }
    };

    if (loading) {
        return (
            <div className="py-12 md:py-16">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
                        <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-24 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="py-12 md:py-16">
                <div className="container-custom text-center">
                    <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
                        Product Not Found
                    </h1>
                    <p className="text-gray-600 mb-8">
                        The product you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link href="/collections" className="text-primary-700 font-medium hover:underline">
                        ← Browse Collections
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 md:py-16">
            <div className="container-custom">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 flex-wrap">
                        <li><Link href="/" className="text-gray-500 hover:text-primary-700">Home</Link></li>
                        <li className="text-gray-400">/</li>
                        <li><Link href="/collections" className="text-gray-500 hover:text-primary-700">Collections</Link></li>
                        <li className="text-gray-400">/</li>
                        <li><Link href={`/collections/${product.collection}`} className="text-gray-500 hover:text-primary-700 capitalize">{product.collection.replace('-', ' ')}</Link></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-900">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Product Gallery */}
                    <ProductGallery images={product.images} productName={product.name} />

                    {/* Product Info */}
                    <div>
                        {/* Category */}
                        <p className="text-sm text-secondary-600 uppercase tracking-wider mb-2">
                            {product.category.replace('-', ' ')}
                        </p>

                        {/* Name */}
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center" aria-label={`Rating: ${product.rating} out of 5`}>
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={cn('w-5 h-5', i < Math.floor(product.rating) ? 'text-secondary-500' : 'text-gray-300')}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-gray-600">{product.rating}</span>
                            <span className="text-gray-400">({product.reviewCount} reviews)</span>
                        </div>

                        {/* Price */}
                        {selectedVariant && (
                            <PriceDisplay
                                price={selectedVariant.price}
                                compareAtPrice={selectedVariant.compareAtPrice}
                                size="lg"
                                className="mb-6"
                            />
                        )}

                        {/* Description */}
                        <p className="text-gray-700 mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Variant Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Size / Weight
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={cn(
                                            'px-4 py-2 rounded-lg border-2 transition-all',
                                            selectedVariant?.id === variant.id
                                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                        )}
                                    >
                                        {variant.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Quantity
                            </label>
                            <QuantitySelector
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                size="lg"
                            />
                        </div>

                        {/* Add to Cart & Buy Now */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Button
                                onClick={handleAddToCart}
                                variant={addedToCart ? 'secondary' : 'outline'}
                                size="lg"
                                fullWidth
                                disabled={!product.inStock}
                            >
                                {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                            </Button>
                            <Button
                                onClick={handleBuyNow}
                                size="lg"
                                fullWidth
                                disabled={!product.inStock}
                            >
                                Buy Now
                            </Button>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 text-sm mb-8">
                            {product.inStock ? (
                                <>
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span className="text-green-700">In Stock</span>
                                </>
                            ) : (
                                <>
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    <span className="text-red-700">Out of Stock</span>
                                </>
                            )}
                            <span className="text-gray-400 mx-2">|</span>
                            <span className="text-gray-600">Free shipping over ৳1,000</span>
                        </div>

                        {/* Product Details Accordion */}
                        <div className="border-t border-gray-200 pt-8 space-y-6">
                            {/* Brewing Instructions */}
                            <details className="group" open>
                                <summary className="flex items-center justify-between cursor-pointer py-3">
                                    <h3 className="font-semibold text-gray-900">Brewing Instructions</h3>
                                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="pb-4 grid grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-cream-100 rounded-xl">
                                        <div className="text-2xl mb-1">🌡️</div>
                                        <div className="text-xs text-gray-500 mb-1">Temperature</div>
                                        <div className="font-semibold text-sm">{product.brewingInstructions.temperature}</div>
                                    </div>
                                    <div className="p-4 bg-cream-100 rounded-xl">
                                        <div className="text-2xl mb-1">⏱️</div>
                                        <div className="text-xs text-gray-500 mb-1">Steep Time</div>
                                        <div className="font-semibold text-sm">{product.brewingInstructions.steepTime}</div>
                                    </div>
                                    <div className="p-4 bg-cream-100 rounded-xl">
                                        <div className="text-2xl mb-1">🥄</div>
                                        <div className="text-xs text-gray-500 mb-1">Amount</div>
                                        <div className="font-semibold text-sm">{product.brewingInstructions.amount}</div>
                                    </div>
                                </div>
                            </details>

                            {/* Ingredients */}
                            <details className="group">
                                <summary className="flex items-center justify-between cursor-pointer py-3 border-t border-gray-100">
                                    <h3 className="font-semibold text-gray-900">Ingredients</h3>
                                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="pb-4">
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        {product.ingredients.map((ingredient, i) => (
                                            <li key={i}>{ingredient}</li>
                                        ))}
                                    </ul>
                                </div>
                            </details>

                            {/* Origin */}
                            <details className="group">
                                <summary className="flex items-center justify-between cursor-pointer py-3 border-t border-gray-100">
                                    <h3 className="font-semibold text-gray-900">Origin & Info</h3>
                                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="pb-4 space-y-2 text-gray-700">
                                    <p><strong>Origin:</strong> {product.origin}</p>
                                    <p><strong>Caffeine Level:</strong> <span className="capitalize">{product.caffeineLevel}</span></p>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
