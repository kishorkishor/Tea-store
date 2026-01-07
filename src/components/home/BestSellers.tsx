import Link from 'next/link';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';

export default function BestSellers() {
    // Get best-selling products
    const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

    return (
        <section className="py-16 md:py-24">
            <div className="container-custom">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <div>
                        <span className="text-secondary-600 font-medium text-sm uppercase tracking-wider">
                            Customer Favorites
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                            Best Sellers
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-xl">
                            Our most loved teas, chosen by tea enthusiasts across Bangladesh.
                        </p>
                    </div>
                    <Link
                        href="/collections"
                        className="inline-flex items-center gap-2 text-primary-700 dark:text-primary font-medium hover:text-primary-800 dark:hover:text-primary/80 transition-colors whitespace-nowrap"
                    >
                        View All Products
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {bestSellers.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
