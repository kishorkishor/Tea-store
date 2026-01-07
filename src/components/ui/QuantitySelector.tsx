'use client';

import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    min?: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    disabled?: boolean;
}

export default function QuantitySelector({
    quantity,
    onQuantityChange,
    min = 1,
    max = 99,
    size = 'md',
    className,
    disabled = false,
}: QuantitySelectorProps) {
    const handleDecrement = () => {
        if (quantity > min) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleIncrement = () => {
        if (quantity < max) {
            onQuantityChange(quantity + 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= min && value <= max) {
            onQuantityChange(value);
        }
    };

    const sizeStyles = {
        sm: {
            button: 'w-7 h-7 text-sm',
            input: 'w-10 h-7 text-sm',
        },
        md: {
            button: 'w-9 h-9 text-base',
            input: 'w-12 h-9 text-base',
        },
        lg: {
            button: 'w-11 h-11 text-lg',
            input: 'w-14 h-11 text-lg',
        },
    };

    return (
        <div
            className={cn(
                'inline-flex items-center border border-border rounded-lg overflow-hidden',
                disabled && 'opacity-50',
                className
            )}
        >
            <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || quantity <= min}
                className={cn(
                    'flex items-center justify-center bg-muted text-foreground',
                    'hover:bg-muted/80 active:bg-muted/60',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-colors duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary focus-visible:ring-inset',
                    sizeStyles[size].button
                )}
                aria-label="Decrease quantity"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                    />
                </svg>
            </button>

            <input
                type="number"
                value={quantity}
                onChange={handleInputChange}
                min={min}
                max={max}
                disabled={disabled}
                className={cn(
                    'text-center border-x border-border bg-card text-foreground',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary focus-visible:ring-inset',
                    '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                    sizeStyles[size].input
                )}
                aria-label="Quantity"
            />

            <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled || quantity >= max}
                className={cn(
                    'flex items-center justify-center bg-muted text-foreground',
                    'hover:bg-muted/80 active:bg-muted/60',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-colors duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary focus-visible:ring-inset',
                    sizeStyles[size].button
                )}
                aria-label="Increase quantity"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            </button>
        </div>
    );
}
