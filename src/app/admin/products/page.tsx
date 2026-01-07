'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/admin/StatusBadge';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    in_stock: boolean;
    is_featured: boolean;
    is_best_seller: boolean;
    created_at: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground">Products</h1>
                <Link href="/admin/products/new">
                    <Button>Add New Product</Button>
                </Link>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Flags</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-muted/50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-foreground">{product.name}</div>
                                    <div className="text-sm text-muted-foreground">{product.slug}</div>
                                </td>
                                <td className="px-6 py-4 text-foreground">৳{product.price}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={product.in_stock ? 'approved' : 'rejected'} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {product.is_featured && (
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Featured</span>
                                        )}
                                        {product.is_best_seller && (
                                            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">Best Seller</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/products/${product.id}`}>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </Link>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No products found. <Link href="/admin/products/new" className="text-primary hover:underline">Create one</Link>
                    </div>
                )}
            </div>
        </div>
    );
}




