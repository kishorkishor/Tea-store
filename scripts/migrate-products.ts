/**
 * Migration script to move products from static data to Supabase
 * 
 * Usage:
 * 1. Set up your .env.local with Supabase credentials
 * 2. Run: npx tsx scripts/migrate-products.ts
 * 
 * This script will:
 * - Create collections if they don't exist
 * - Create products with their variants
 * - Skip duplicates based on slug
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { products } from '../src/data/products';
import { collections } from '../src/data/collections';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCollections() {
    console.log('Migrating collections...');
    const collectionMap = new Map<string, string>();

    for (const collection of collections) {
        // Check if collection exists
        const { data: existing } = await supabase
            .from('collections')
            .select('id')
            .eq('slug', collection.slug)
            .single();

        if (existing) {
            console.log(`  Collection "${collection.name}" already exists, skipping...`);
            collectionMap.set(collection.slug, existing.id);
            continue;
        }

        // Create collection
        const { data, error } = await supabase
            .from('collections')
            .insert({
                slug: collection.slug,
                name: collection.name,
                description: collection.description,
                image: collection.image,
            })
            .select()
            .single();

        if (error) {
            console.error(`  Error creating collection "${collection.name}":`, error);
            continue;
        }

        console.log(`  ✓ Created collection: ${collection.name}`);
        collectionMap.set(collection.slug, data.id);
    }

    return collectionMap;
}

async function migrateProducts(collectionMap: Map<string, string>) {
    console.log('\nMigrating products...');
    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const product of products) {
        // Check if product exists
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('slug', product.slug)
            .single();

        if (existing) {
            console.log(`  Product "${product.name}" already exists, skipping...`);
            skipped++;
            continue;
        }

        // Get collection ID
        const collectionId = collectionMap.get(product.collection) || null;

        // Create product
        const { data: productData, error: productError } = await supabase
            .from('products')
            .insert({
                slug: product.slug,
                name: product.name,
                description: product.description,
                short_description: product.shortDescription,
                price: product.price,
                compare_at_price: product.compareAtPrice || null,
                images: product.images,
                category: product.category,
                collection_id: collectionId,
                tags: product.tags,
                in_stock: product.inStock,
                is_featured: product.isFeatured,
                is_best_seller: product.isBestSeller,
                brewing_temperature: product.brewingInstructions.temperature,
                brewing_steep_time: product.brewingInstructions.steepTime,
                brewing_amount: product.brewingInstructions.amount,
                ingredients: product.ingredients,
                origin: product.origin,
                caffeine_level: product.caffeineLevel,
                rating: product.rating,
                review_count: product.reviewCount,
            })
            .select()
            .single();

        if (productError) {
            console.error(`  ✗ Error creating product "${product.name}":`, productError);
            errors++;
            continue;
        }

        console.log(`  ✓ Created product: ${product.name}`);

        // Create variants
        for (const variant of product.variants) {
            const { error: variantError } = await supabase
                .from('product_variants')
                .insert({
                    product_id: productData.id,
                    name: variant.name,
                    weight: variant.weight,
                    price: variant.price,
                    compare_at_price: variant.compareAtPrice || null,
                    stock_quantity: 100, // Default stock
                });

            if (variantError) {
                console.error(`    ✗ Error creating variant "${variant.name}":`, variantError);
            } else {
                console.log(`    ✓ Created variant: ${variant.name}`);
            }
        }

        created++;
    }

    console.log(`\nMigration complete!`);
    console.log(`  Created: ${created} products`);
    console.log(`  Skipped: ${skipped} products`);
    console.log(`  Errors: ${errors} products`);
}

async function main() {
    console.log('Starting product migration...\n');

    try {
        const collectionMap = await migrateCollections();
        await migrateProducts(collectionMap);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

main();




