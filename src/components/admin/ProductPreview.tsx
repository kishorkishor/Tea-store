'use client';

import Image from 'next/image';
import { Product, ProductVariant } from '@/types';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { cn } from '@/lib/utils';

interface ProductPreviewProps {
    formData: {
        name: string;
        slug: string;
        description: string;
        short_description: string;
        price: string;
        compare_at_price: string;
        category: string;
        images: string[];
        tags: string;
        in_stock: boolean;
        is_featured: boolean;
        is_best_seller: boolean;
        brewing_temperature: string;
        brewing_steep_time: string;
        brewing_amount: string;
        ingredients: string;
        origin: string;
        caffeine_level: 'none' | 'low' | 'medium' | 'high';
    };
    variants: Array<{
        name: string;
        weight: string;
        price: string;
        compare_at_price: string;
        stock_quantity: string;
    }>;
}

export default function ProductPreview({ formData, variants }: ProductPreviewProps) {
    // Extract price values with proper types
    const productPrice = parseFloat(formData.price) || 0;
    const comparePrice = formData.compare_at_price ? parseFloat(formData.compare_at_price) : undefined;
    
    // Transform form data to Product-like structure for preview
    const previewProduct: Partial<Product> = {
        name: formData.name || 'Product Name',
        slug: formData.slug || 'product-slug',
        description: formData.description || '',
        shortDescription: formData.short_description || '',
        price: productPrice,
        compareAtPrice: comparePrice,
        images: formData.images.length > 0 ? formData.images : ['/placeholder-product.jpg'],
        category: formData.category || '',
        collection: '',
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        inStock: formData.in_stock,
        isFeatured: formData.is_featured,
        isBestSeller: formData.is_best_seller,
        brewingInstructions: {
            temperature: formData.brewing_temperature || '',
            steepTime: formData.brewing_steep_time || '',
            amount: formData.brewing_amount || '',
        },
        ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(Boolean),
        origin: formData.origin || '',
        caffeineLevel: formData.caffeine_level,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        variants: variants.map((v, i) => ({
            id: `preview-${i}`,
            name: v.name || 'Variant Name',
            weight: v.weight || '',
            price: parseFloat(v.price) || 0,
            compareAtPrice: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
        })),
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Preview</h3>
            
            {/* Product Card Preview */}
            <div className="bg-background border border-border rounded-xl overflow-hidden mb-6">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {previewProduct.images && previewProduct.images[0] && previewProduct.images[0] !== '/placeholder-product.jpg' ? (
                        <Image
                            src={previewProduct.images[0]}
                            alt={previewProduct.name || 'Product'}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted">
                            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs">No image</span>
                        </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {previewProduct.isBestSeller && (
                            <span className="px-3 py-1 bg-secondary-500 text-white text-xs font-medium rounded-full">
                                Best Seller
                            </span>
                        )}
                        {comparePrice && comparePrice > productPrice && (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                                Sale
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {previewProduct.category.replace('-', ' ') || 'Category'}
                    </p>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                        {previewProduct.name || 'Product Name'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {previewProduct.shortDescription || 'Short description will appear here'}
                    </p>
                    <PriceDisplay
                        price={previewProduct.price}
                        compareAtPrice={previewProduct.compareAtPrice}
                        size="sm"
                    />
                    {!previewProduct.inStock && (
                        <p className="text-sm text-red-600 mt-2">Out of Stock</p>
                    )}
                </div>
            </div>

            {/* Product Detail Preview */}
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-foreground mb-2">Product Details</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Name:</strong> {previewProduct.name || 'Not set'}</p>
                        <p><strong>Slug:</strong> {previewProduct.slug || 'Not set'}</p>
                        <p><strong>Category:</strong> {previewProduct.category || 'Not set'}</p>
                        <p><strong>Origin:</strong> {previewProduct.origin || 'Not set'}</p>
                        <p><strong>Caffeine Level:</strong> {previewProduct.caffeineLevel || 'Not set'}</p>
                        <p><strong>In Stock:</strong> {previewProduct.inStock ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                {variants.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-foreground mb-2">Variants</h4>
                        <div className="space-y-2">
                            {variants.map((variant, index) => (
                                <div key={index} className="text-sm bg-muted p-2 rounded">
                                    <p><strong>{variant.name || 'Variant Name'}</strong> ({variant.weight || 'Weight'})</p>
                                    <p>Price: ৳{variant.price || '0'}</p>
                                    <p>Stock: {variant.stock_quantity || '0'} units</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {previewProduct.brewingInstructions?.temperature && (
                    <div>
                        <h4 className="font-semibold text-foreground mb-2">Brewing Instructions</h4>
                        <div className="text-sm text-muted-foreground">
                            <p>Temperature: {previewProduct.brewingInstructions.temperature}</p>
                            <p>Steep Time: {previewProduct.brewingInstructions.steepTime}</p>
                            <p>Amount: {previewProduct.brewingInstructions.amount}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

