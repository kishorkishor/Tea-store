'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import PriceDisplay from '@/components/ui/PriceDisplay';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    product: Product;
    className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Add the first variant by default
        addItem(product, product.variants[0], 1);
    };

    return (
        <Link
            href={`/products/${product.slug}`}
            className={cn(
                'group block bg-white rounded-2xl overflow-hidden shadow-sm',
                'border border-gray-100',
                'card-hover',
                className
            )}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-cream-100">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isBestSeller && (
                        <span className="px-3 py-1 bg-secondary-500 text-white text-xs font-medium rounded-full">
                            Best Seller
                        </span>
                    )}
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                            Sale
                        </span>
                    )}
                </div>

                {/* Quick Add Button */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Button
                        onClick={handleAddToCart}
                        size="sm"
                        fullWidth
                        className="shadow-lg"
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category */}
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {product.category.replace('-', ' ')}
                </p>

                {/* Name */}
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-1">
                    {product.name}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.shortDescription}
                </p>

                {/* Price */}
                <PriceDisplay
                    price={product.price}
                    compareAtPrice={product.compareAtPrice}
                    size="sm"
                />

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                    <div className="flex items-center" aria-label={`Rating: ${product.rating} out of 5`}>
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={cn(
                                    'w-4 h-4',
                                    i < Math.floor(product.rating)
                                        ? 'text-secondary-500'
                                        : 'text-gray-300'
                                )}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">
                        ({product.reviewCount})
                    </span>
                </div>
            </div>
        </Link>
    );
}
