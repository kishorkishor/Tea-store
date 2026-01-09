import { supabase } from '@/lib/supabase';
import { Product, ProductFilters, ProductVariant } from '@/types';

// Transform database product to frontend Product type
function transformProduct(dbProduct: any, variants: ProductVariant[]): Product {
    return {
        id: dbProduct.id,
        slug: dbProduct.slug,
        name: dbProduct.name,
        description: dbProduct.description || '',
        shortDescription: dbProduct.short_description || '',
        price: parseFloat(dbProduct.price),
        compareAtPrice: dbProduct.compare_at_price ? parseFloat(dbProduct.compare_at_price) : undefined,
        images: dbProduct.images || [],
        category: dbProduct.category,
        collection: dbProduct.collection_id || '',
        tags: dbProduct.tags || [],
        variants: variants,
        inStock: dbProduct.in_stock,
        isFeatured: dbProduct.is_featured,
        isBestSeller: dbProduct.is_best_seller,
        brewingInstructions: {
            temperature: dbProduct.brewing_temperature || '',
            steepTime: dbProduct.brewing_steep_time || '',
            amount: dbProduct.brewing_amount || '',
        },
        ingredients: dbProduct.ingredients || [],
        origin: dbProduct.origin || '',
        caffeineLevel: dbProduct.caffeine_level as 'none' | 'low' | 'medium' | 'high',
        rating: parseFloat(dbProduct.rating || '0'),
        reviewCount: dbProduct.review_count || 0,
        createdAt: dbProduct.created_at,
    };
}

/**
 * Get all products
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
    let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    // Apply filters
    if (filters) {
        if (filters.collection) {
            const { data: collection } = await supabase
                .from('collections')
                .select('id')
                .eq('slug', filters.collection)
                .single();

            if (collection) {
                query = query.eq('collection_id', collection.id);
            }
        }

        if (filters.category) {
            query = query.eq('category', filters.category);
        }

        if (filters.inStock !== undefined) {
            query = query.eq('in_stock', filters.inStock);
        }

        if (filters.caffeineLevel && filters.caffeineLevel.length > 0) {
            query = query.in('caffeine_level', filters.caffeineLevel);
        }
    }

    const { data: products, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    if (!products || products.length === 0) {
        return [];
    }

    // Get variants for all products
    const productIds = products.map((p: { id: string }) => p.id);
    const { data: variants } = await supabase
        .from('product_variants')
        .select('*')
        .in('product_id', productIds);

    // Group variants by product
    const variantsByProduct = new Map<string, ProductVariant[]>();
    variants?.forEach((v: any) => {
        if (!variantsByProduct.has(v.product_id)) {
            variantsByProduct.set(v.product_id, []);
        }
        variantsByProduct.get(v.product_id)!.push({
            id: v.id,
            name: v.name,
            weight: v.weight,
            price: parseFloat(v.price),
            compareAtPrice: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
        });
    });

    // Transform products
    let transformedProducts = products.map((p: any) => {
        const productVariants = variantsByProduct.get(p.id) || [];
        return transformProduct(p, productVariants);
    });

    // Apply client-side filters that can't be done in DB
    if (filters) {
        if (filters.priceRange) {
            const [min, max] = filters.priceRange;
            transformedProducts = transformedProducts.filter(p => p.price >= min && p.price <= max);
        }

        // Sort
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price-asc':
                    transformedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    transformedProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'name':
                    transformedProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'newest':
                    transformedProducts.sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    break;
                case 'rating':
                    transformedProducts.sort((a, b) => b.rating - a.rating);
                    break;
            }
        }
    }

    return transformedProducts;
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !product) {
        return null;
    }

    // Get variants
    const { data: variants } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', product.id);

    const transformedVariants: ProductVariant[] = (variants || []).map((v: any) => ({
        id: v.id,
        name: v.name,
        weight: v.weight,
        price: parseFloat(v.price),
        compareAtPrice: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
    }));

    return transformProduct(product, transformedVariants);
}

/**
 * Get products by collection
 */
export async function getProductsByCollection(collectionSlug: string): Promise<Product[]> {
    return getProducts({ collection: collectionSlug });
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8);

    if (error || !products) {
        return [];
    }

    // Get variants
    const productIds = products.map((p: { id: string }) => p.id);
    const { data: variants } = await supabase
        .from('product_variants')
        .select('*')
        .in('product_id', productIds);

    const variantsByProduct = new Map<string, ProductVariant[]>();
    variants?.forEach((v: any) => {
        if (!variantsByProduct.has(v.product_id)) {
            variantsByProduct.set(v.product_id, []);
        }
        variantsByProduct.get(v.product_id)!.push({
            id: v.id,
            name: v.name,
            weight: v.weight,
            price: parseFloat(v.price),
            compareAtPrice: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
        });
    });

    return products.map((p: any) => {
        const productVariants = variantsByProduct.get(p.id) || [];
        return transformProduct(p, productVariants);
    });
}

/**
 * Get best-selling products
 */
export async function getBestSellers(): Promise<Product[]> {
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_best_seller', true)
        .order('created_at', { ascending: false })
        .limit(8);

    if (error || !products) {
        return [];
    }

    // Get variants
    const productIds = products.map((p: { id: string }) => p.id);
    const { data: variants } = await supabase
        .from('product_variants')
        .select('*')
        .in('product_id', productIds);

    const variantsByProduct = new Map<string, ProductVariant[]>();
    variants?.forEach((v: any) => {
        if (!variantsByProduct.has(v.product_id)) {
            variantsByProduct.set(v.product_id, []);
        }
        variantsByProduct.get(v.product_id)!.push({
            id: v.id,
            name: v.name,
            weight: v.weight,
            price: parseFloat(v.price),
            compareAtPrice: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
        });
    });

    return products.map((p: any) => {
        const productVariants = variantsByProduct.get(p.id) || [];
        return transformProduct(p, productVariants);
    });
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<Product[]> {
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(20);

    if (error || !products) {
        return [];
    }

    // Get variants
    const productIds = products.map((p: { id: string }) => p.id);
    const { data: variants } = await supabase
        .from('product_variants')
        .select('*')
        .in('product_id', productIds);

    const variantsByProduct = new Map<string, ProductVariant[]>();
    variants?.forEach((v: any) => {
        if (!variantsByProduct.has(v.product_id)) {
            variantsByProduct.set(v.product_id, []);
        }
        variantsByProduct.get(v.product_id)!.push({
            id: v.id,
            name: v.name,
            weight: v.weight,
            price: parseFloat(v.price),
            compareAtPrice: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
        });
    });

    return products.map((p: any) => {
        const productVariants = variantsByProduct.get(p.id) || [];
        return transformProduct(p, productVariants);
    });
}
