import { supabase } from '@/lib/supabase';
import { Collection } from '@/types';

/**
 * Get all collections
 */
export async function getCollections(): Promise<Collection[]> {
    const { data: collections, error } = await supabase
        .from('collections')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching collections:', error);
        return [];
    }

    if (!collections) {
        return [];
    }

    return collections.map((c: any) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description || '',
        image: c.image || '',
        productCount: c.product_count || 0,
    }));
}

/**
 * Get a single collection by slug
 */
export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
    const { data: collection, error } = await supabase
        .from('collections')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !collection) {
        return null;
    }

    return {
        id: collection.id,
        slug: collection.slug,
        name: collection.name,
        description: collection.description || '',
        image: collection.image || '',
        productCount: collection.product_count || 0,
    };
}
