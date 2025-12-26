import { products } from '@/data/products';
import { Product, ProductFilters } from '@/types';

/**
 * Get all products
 * TODO: Replace with Supabase fetch
 * Example: const { data } = await supabase.from('products').select('*')
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    let filteredProducts = [...products];

    if (filters) {
        // Filter by collection
        if (filters.collection) {
            filteredProducts = filteredProducts.filter(p => p.collection === filters.collection);
        }

        // Filter by category
        if (filters.category) {
            filteredProducts = filteredProducts.filter(p => p.category === filters.category);
        }

        // Filter by price range
        if (filters.priceRange) {
            const [min, max] = filters.priceRange;
            filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
        }

        // Filter by caffeine level
        if (filters.caffeineLevel && filters.caffeineLevel.length > 0) {
            filteredProducts = filteredProducts.filter(p =>
                filters.caffeineLevel!.includes(p.caffeineLevel)
            );
        }

        // Filter by stock
        if (filters.inStock !== undefined) {
            filteredProducts = filteredProducts.filter(p => p.inStock === filters.inStock);
        }

        // Sort
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price-asc':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'name':
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'newest':
                    filteredProducts.sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    break;
                case 'rating':
                    filteredProducts.sort((a, b) => b.rating - a.rating);
                    break;
            }
        }
    }

    return filteredProducts;
}

/**
 * Get a single product by slug
 * TODO: Replace with Supabase fetch
 * Example: const { data } = await supabase.from('products').select('*').eq('slug', slug).single()
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const product = products.find(p => p.slug === slug);
    return product || null;
}

/**
 * Get products by collection
 * TODO: Replace with Supabase fetch
 */
export async function getProductsByCollection(collectionSlug: string): Promise<Product[]> {
    return getProducts({ collection: collectionSlug });
}

/**
 * Get featured products
 * TODO: Replace with Supabase fetch
 * Example: const { data } = await supabase.from('products').select('*').eq('is_featured', true)
 */
export async function getFeaturedProducts(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    return products.filter(p => p.isFeatured);
}

/**
 * Get best-selling products
 * TODO: Replace with Supabase fetch
 * Example: const { data } = await supabase.from('products').select('*').eq('is_best_seller', true)
 */
export async function getBestSellers(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    return products.filter(p => p.isBestSeller);
}

/**
 * Search products
 * TODO: Replace with Supabase full-text search
 */
export async function searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}
