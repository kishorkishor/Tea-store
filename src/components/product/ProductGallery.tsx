'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100">
                <Image
                    src={images[selectedIndex]}
                    alt={`${productName} - Image ${selectedIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                'relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden',
                                'ring-2 ring-offset-2 transition-all duration-200',
                                selectedIndex === index
                                    ? 'ring-primary-600'
                                    : 'ring-transparent hover:ring-gray-300'
                            )}
                            aria-label={`View image ${index + 1}`}
                            aria-current={selectedIndex === index ? 'true' : 'false'}
                        >
                            <Image
                                src={image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
