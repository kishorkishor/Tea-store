import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export default function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
    return (
        <div className={cn('bg-card border border-border rounded-lg p-6', className)}>
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{title}</p>
                {icon && <div className="text-primary">{icon}</div>}
            </div>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground">{value}</p>
                {trend && (
                    <span
                        className={cn(
                            'text-sm font-medium',
                            trend.isPositive ? 'text-green-600' : 'text-red-600'
                        )}
                    >
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                )}
            </div>
        </div>
    );
}




