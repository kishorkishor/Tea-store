import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { collections } from '@/data/collections';

export const metadata: Metadata = {
    title: 'Collections',
    description: 'Explore our curated tea collections - from refreshing green teas to soothing herbal blends.',
};

export default function CollectionsPage() {
    return (
        <div className="py-12 md:py-16">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Our Tea Collections
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our carefully curated tea collections, each crafted to deliver
                        unique flavors and experiences. From energizing mornings to peaceful evenings.
                    </p>
                </div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collections.map((collection) => (
                        <Link
                            key={collection.id}
                            href={`/collections/${collection.slug}`}
                            className="group relative aspect-[3/4] rounded-2xl overflow-hidden card-hover"
                        >
                            <Image
                                src={collection.image}
                                alt={collection.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <div className="text-sm text-secondary-400 font-medium mb-2">
                                    {collection.productCount} Products
                                </div>
                                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-secondary-300 transition-colors">
                                    {collection.name}
                                </h2>
                                <p className="text-white/80 mb-4 line-clamp-2">
                                    {collection.description}
                                </p>
                                <div className="flex items-center gap-2 text-white font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <span>Explore Collection</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
