import { collections } from '@/data/collections';
import { Collection } from '@/types';

/**
 * Get all collections
 * TODO: Replace with Supabase fetch
 * Example: const { data } = await supabase.from('collections').select('*')
 */
export async function getCollections(): Promise<Collection[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return collections;
}

/**
 * Get a single collection by slug
 * TODO: Replace with Supabase fetch
 * Example: const { data } = await supabase.from('collections').select('*').eq('slug', slug).single()
 */
export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const collection = collections.find(c => c.slug === slug);
    return collection || null;
}
