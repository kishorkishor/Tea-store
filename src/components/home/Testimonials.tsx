'use client';

import { useState } from 'react';
import { testimonials } from '@/data/testimonials';
import { cn } from '@/lib/utils';

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Show 3 testimonials for desktop
    const visibleTestimonials = testimonials.slice(0, 6);

    return (
        <section className="py-16 md:py-24 bg-cream-100">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-secondary-600 font-medium text-sm uppercase tracking-wider">
                        What Our Customers Say
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                        Tea Lovers Speak
                    </h2>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleTestimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className={cn(
                                'bg-white rounded-2xl p-6 shadow-sm card-hover',
                                'border border-gray-100'
                            )}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={cn(
                                            'w-5 h-5',
                                            i < testimonial.rating ? 'text-secondary-500' : 'text-gray-300'
                                        )}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-primary-700 font-semibold text-lg">
                                        {testimonial.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>

                            {/* Product Tag */}
                            {testimonial.productName && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">Purchased: </span>
                                    <span className="text-xs text-primary-700 font-medium">
                                        {testimonial.productName}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pagination Dots (Mobile) */}
                <div className="flex justify-center gap-2 mt-8 md:hidden">
                    {visibleTestimonials.slice(0, 3).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                'w-2.5 h-2.5 rounded-full transition-all',
                                activeIndex === index ? 'bg-primary-600 w-6' : 'bg-gray-300'
                            )}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
