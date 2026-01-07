import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            fullWidth = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      btn-hover
    `;

        const variants = {
            primary: `
        bg-primary-700 text-white dark:bg-primary dark:text-primary-foreground
        hover:bg-primary-800 dark:hover:bg-primary/90 active:bg-primary-900 dark:active:bg-primary/80
        focus-visible:ring-primary-500 dark:focus-visible:ring-primary
      `,
            secondary: `
        bg-secondary-500 text-white dark:bg-secondary dark:text-secondary-foreground
        hover:bg-secondary-600 dark:hover:bg-secondary/90 active:bg-secondary-700 dark:active:bg-secondary/80
        focus-visible:ring-secondary-400 dark:focus-visible:ring-secondary
      `,
            outline: `
        border-2 border-primary-700 dark:border-primary text-primary-700 dark:text-primary
        hover:bg-primary-50 dark:hover:bg-muted active:bg-primary-100 dark:active:bg-muted/80
        focus-visible:ring-primary-500 dark:focus-visible:ring-primary
      `,
            ghost: `
        text-primary-700 dark:text-foreground
        hover:bg-primary-50 dark:hover:bg-muted active:bg-primary-100 dark:active:bg-muted/80
        focus-visible:ring-primary-500 dark:focus-visible:ring-primary
      `,
            danger: `
        bg-red-600 text-white dark:bg-destructive dark:text-destructive-foreground
        hover:bg-red-700 dark:hover:bg-destructive/90 active:bg-red-800 dark:active:bg-destructive/80
        focus-visible:ring-red-500 dark:focus-visible:ring-destructive
      `,
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm gap-1.5',
            md: 'px-5 py-2.5 text-base gap-2',
            lg: 'px-7 py-3.5 text-lg gap-2.5',
            icon: 'h-9 w-9 p-0',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    fullWidth && 'w-full',
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
