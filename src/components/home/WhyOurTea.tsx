import Image from 'next/image';

const features = [
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: '100% Organic',
        description: 'All our teas are certified organic, free from pesticides and harmful chemicals.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Direct Sourcing',
        description: 'We work directly with tea gardens to ensure quality and fair trade practices.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Fresh & Fast',
        description: 'Packed fresh and delivered to your doorstep within 2-3 business days.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        title: 'Crafted with Love',
        description: 'Each blend is carefully crafted by our master tea blenders.',
    },
];

export default function WhyOurTea() {
    return (
        <section className="py-16 md:py-24 bg-primary-900 text-white overflow-hidden">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left - Image */}
                    <div className="relative">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=600&fit=crop"
                                alt="Tea plantation in Sylhet"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-600/30 rounded-full blur-2xl"></div>

                        {/* Floating Card */}
                        <div className="absolute -bottom-8 -right-4 md:right-8 bg-white text-gray-900 rounded-xl p-5 shadow-2xl max-w-[200px]">
                            <div className="text-3xl font-display font-bold text-primary-700">15+</div>
                            <div className="text-sm text-gray-600">Years of Excellence</div>
                        </div>
                    </div>

                    {/* Right - Content */}
                    <div>
                        <span className="text-secondary-400 font-medium text-sm uppercase tracking-wider">
                            Why Choose Us
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-6">
                            From the Gardens of <span className="text-secondary-400">Sylhet</span> to Your Cup
                        </h2>
                        <p className="text-primary-200 mb-8">
                            For over 15 years, we have been on a mission to bring the finest teas from
                            the misty highlands of Sylhet and premium tea estates around the world.
                            Every leaf is hand-picked, every blend is perfected.
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary-800 rounded-lg flex items-center justify-center text-secondary-400">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                                        <p className="text-sm text-primary-300">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
