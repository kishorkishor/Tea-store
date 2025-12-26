import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
    price: number;
    compareAtPrice?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function PriceDisplay({
    price,
    compareAtPrice,
    size = 'md',
    className,
}: PriceDisplayProps) {
    const hasDiscount = compareAtPrice && compareAtPrice > price;
    const discountPercentage = hasDiscount
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : 0;

    const sizeStyles = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-2xl',
    };

    const compareSizeStyles = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    return (
        <div className={cn('flex items-center gap-2 flex-wrap', className)}>
            <span
                className={cn(
                    'font-bold text-primary-700',
                    sizeStyles[size]
                )}
            >
                {formatPrice(price)}
            </span>

            {hasDiscount && (
                <>
                    <span
                        className={cn(
                            'text-gray-400 line-through',
                            compareSizeStyles[size]
                        )}
                    >
                        {formatPrice(compareAtPrice)}
                    </span>
                    <span
                        className={cn(
                            'px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium',
                            compareSizeStyles[size]
                        )}
                    >
                        -{discountPercentage}%
                    </span>
                </>
            )}
        </div>
    );
}
