import Image from 'next/image';
import Link from 'next/link';
import { collections } from '@/data/collections';

export default function FeaturedCollections() {
    // Show first 4 collections
    const featuredCollections = collections.slice(0, 4);

    return (
        <section className="py-16 md:py-24 bg-cream-50">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-secondary-600 font-medium text-sm uppercase tracking-wider">
                        Explore Our Range
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                        Tea Collections
                    </h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        From energizing green teas to soothing herbal blends, find your perfect cup
                        in our curated collections.
                    </p>
                </div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredCollections.map((collection, index) => (
                        <Link
                            key={collection.id}
                            href={`/collections/${collection.slug}`}
                            className="group relative aspect-[4/5] rounded-2xl overflow-hidden card-hover"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Background Image */}
                            <Image
                                src={collection.image}
                                alt={collection.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="font-display text-xl font-semibold mb-1 group-hover:text-secondary-300 transition-colors">
                                    {collection.name}
                                </h3>
                                <p className="text-sm text-white/70 mb-3 line-clamp-2">
                                    {collection.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-secondary-400 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <span>Shop Now</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>

                            {/* Product Count Badge */}
                            <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
                                {collection.productCount} Products
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-10">
                    <Link
                        href="/collections"
                        className="inline-flex items-center gap-2 text-primary-700 font-medium hover:text-primary-800 transition-colors"
                    >
                        View All Collections
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
