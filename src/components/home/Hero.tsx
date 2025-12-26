import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background Image */}
            <Image
                src="https://images.unsplash.com/photo-1758390282841-54fed998cc8b?q=80&w=1740&auto=format&fit=crop"
                alt="Premium tea cup"
                fill
                priority
                className="object-cover"
            />

            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-900/70 to-primary-900/40"></div>

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-pattern opacity-5"></div>

            {/* Decorative Elements */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl"></div>

            {/* Floating Tea Leaves */}
            <div className="absolute top-1/4 right-1/4 w-16 h-16 opacity-20 animate-float" style={{ animationDelay: '0s' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-secondary-400">
                    <path d="M17.73 3.73l1.41 1.42-8.49 8.48-1.41-1.41 8.49-8.49zM12 12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                </svg>
            </div>
            <div className="absolute bottom-1/3 left-1/3 w-12 h-12 opacity-15 animate-float" style={{ animationDelay: '1s' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-accent-400">
                    <path d="M17.73 3.73l1.41 1.42-8.49 8.48-1.41-1.41 8.49-8.49zM12 12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                </svg>
            </div>

            <div className="container-custom relative z-10 py-20">
                <div className="max-w-3xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6 animate-fade-in">
                        <span className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse"></span>
                        Premium Teas from Bangladesh & Beyond
                    </div>

                    {/* Heading */}
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
                        Discover the
                        <span className="block text-secondary-400">Art of Tea</span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Experience the finest hand-picked teas, carefully curated from the lush gardens of
                        Sylhet to exotic origins worldwide. Every cup tells a story.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link href="/collections">
                            <Button size="lg" variant="secondary">
                                Explore Collections
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Button>
                        </Link>
                        <Link href="/about">
                            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                Our Story
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div>
                            <div className="text-3xl font-display font-bold text-secondary-400">50+</div>
                            <div className="text-sm text-white/60">Tea Varieties</div>
                        </div>
                        <div>
                            <div className="text-3xl font-display font-bold text-secondary-400">10K+</div>
                            <div className="text-sm text-white/60">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-display font-bold text-secondary-400">100%</div>
                            <div className="text-sm text-white/60">Organic Sourcing</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
