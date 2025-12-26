'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductsByCollection } from '@/lib/services/products';
import { getCollectionBySlug } from '@/lib/services/collections';
import { Product, Collection } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import Select from '@/components/ui/Select';

const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'rating', label: 'Highest Rated' },
];

const caffeineOptions = [
    { value: 'none', label: 'Caffeine Free' },
    { value: 'low', label: 'Low Caffeine' },
    { value: 'medium', label: 'Medium Caffeine' },
    { value: 'high', label: 'High Caffeine' },
];

export default function CollectionPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [collection, setCollection] = useState<Collection | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');
    const [caffeineFilter, setCaffeineFilter] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [collectionData, productsData] = await Promise.all([
                getCollectionBySlug(slug),
                getProductsByCollection(slug),
            ]);
            setCollection(collectionData);
            setProducts(productsData);
            setFilteredProducts(productsData);
            setLoading(false);
        }
        loadData();
    }, [slug]);

    // Apply filters and sorting
    useEffect(() => {
        let result = [...products];

        // Caffeine filter
        if (caffeineFilter.length > 0) {
            result = result.filter(p => caffeineFilter.includes(p.caffeineLevel));
        }

        // Sorting
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        setFilteredProducts(result);
    }, [products, sortBy, caffeineFilter]);

    const toggleCaffeineFilter = (value: string) => {
        setCaffeineFilter(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    if (loading) {
        return (
            <div className="py-12 md:py-16">
                <div className="container-custom">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square bg-gray-200 rounded-2xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="py-12 md:py-16">
                <div className="container-custom text-center">
                    <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
                        Collection Not Found
                    </h1>
                    <p className="text-gray-600 mb-8">
                        The collection you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link href="/collections" className="text-primary-700 font-medium hover:underline">
                        ← Back to Collections
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 md:py-16">
            <div className="container-custom">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2">
                        <li><Link href="/" className="text-gray-500 hover:text-primary-700">Home</Link></li>
                        <li className="text-gray-400">/</li>
                        <li><Link href="/collections" className="text-gray-500 hover:text-primary-700">Collections</Link></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-900">{collection.name}</li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                        {collection.name}
                    </h1>
                    <p className="text-gray-600 max-w-2xl">{collection.description}</p>
                </div>

                {/* Filters & Sort Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filters
                            {caffeineFilter.length > 0 && (
                                <span className="ml-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                                    {caffeineFilter.length}
                                </span>
                            )}
                        </button>
                        <span className="text-gray-500">
                            {filteredProducts.length} products
                        </span>
                    </div>

                    <div className="w-full sm:w-48">
                        <Select
                            options={sortOptions}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            aria-label="Sort products"
                        />
                    </div>
                </div>

                {/* Expandable Filters */}
                {showFilters && (
                    <div className="mb-8 p-6 bg-gray-50 rounded-xl animate-slide-down">
                        <h3 className="font-semibold mb-4">Caffeine Level</h3>
                        <div className="flex flex-wrap gap-2">
                            {caffeineOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => toggleCaffeineFilter(option.value)}
                                    className={`px-4 py-2 rounded-full border transition-colors ${caffeineFilter.includes(option.value)
                                            ? 'bg-primary-700 text-white border-primary-700'
                                            : 'bg-white border-gray-300 hover:border-primary-400'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        {caffeineFilter.length > 0 && (
                            <button
                                onClick={() => setCaffeineFilter([])}
                                className="mt-4 text-sm text-primary-700 hover:underline"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
                        <button
                            onClick={() => setCaffeineFilter([])}
                            className="text-primary-700 font-medium hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
