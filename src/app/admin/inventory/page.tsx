'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Variant {
    id: string;
    product_id: string;
    name: string;
    weight: string;
    stock_quantity: number;
    product_name: string;
}

export default function AdminInventoryPage() {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'low'>('all');

    useEffect(() => {
        fetchVariants();
    }, [filter]);

    const fetchVariants = async () => {
        try {
            let query = supabase
                .from('product_variants')
                .select(`
                    *,
                    products!inner(name)
                `)
                .order('stock_quantity', { ascending: true });

            if (filter === 'low') {
                query = query.lt('stock_quantity', 10);
            }

            const { data, error } = await query;

            if (error) throw error;

            const transformed = (data || []).map((v: any) => ({
                id: v.id,
                product_id: v.product_id,
                name: v.name,
                weight: v.weight,
                stock_quantity: v.stock_quantity,
                product_name: v.products.name,
            }));

            setVariants(transformed);
        } catch (error) {
            console.error('Error fetching variants:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStock = async (variantId: string, newStock: number) => {
        try {
            const { error } = await supabase
                .from('product_variants')
                .update({ stock_quantity: newStock })
                .eq('id', variantId);

            if (error) throw error;

            // Log inventory change
            const variant = variants.find(v => v.id === variantId);
            if (variant) {
                await supabase
                    .from('inventory_logs')
                    .insert({
                        variant_id: variantId,
                        change_type: 'adjustment',
                        quantity_change: newStock - variant.stock_quantity,
                        previous_quantity: variant.stock_quantity,
                        new_quantity: newStock,
                        notes: 'Manual stock adjustment',
                    });
            }

            fetchVariants();
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Failed to update stock');
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground">Inventory Management</h1>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                    <option value="all">All Products</option>
                    <option value="low">Low Stock (&lt;10)</option>
                </select>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Variant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Current Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Update Stock</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {variants.map((variant) => (
                            <VariantRow
                                key={variant.id}
                                variant={variant}
                                onUpdateStock={updateStock}
                            />
                        ))}
                    </tbody>
                </table>

                {variants.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No variants found.
                    </div>
                )}
            </div>
        </div>
    );
}

function VariantRow({ variant, onUpdateStock }: { variant: Variant; onUpdateStock: (id: string, stock: number) => void }) {
    const [newStock, setNewStock] = useState(variant.stock_quantity.toString());
    const [updating, setUpdating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const stock = parseInt(newStock);
        if (isNaN(stock) || stock < 0) {
            alert('Please enter a valid stock quantity');
            return;
        }

        setUpdating(true);
        await onUpdateStock(variant.id, stock);
        setUpdating(false);
    };

    return (
        <tr className="hover:bg-muted/50">
            <td className="px-6 py-4 font-medium text-foreground">{variant.product_name}</td>
            <td className="px-6 py-4 text-foreground">{variant.name} ({variant.weight})</td>
            <td className="px-6 py-4">
                <span className={variant.stock_quantity < 10 ? 'text-red-600 font-semibold' : 'text-foreground'}>
                    {variant.stock_quantity}
                </span>
            </td>
            <td className="px-6 py-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        className="w-24"
                        min="0"
                    />
                    <Button type="submit" size="sm" isLoading={updating}>
                        Update
                    </Button>
                </form>
            </td>
        </tr>
    );
}




