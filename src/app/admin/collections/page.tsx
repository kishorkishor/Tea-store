'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';

interface Collection {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    product_count: number;
}

export default function AdminCollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const { data, error } = await supabase
                .from('collections')
                .select('*')
                .order('name');

            if (error) throw error;
            setCollections(data || []);
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this collection?')) return;

        try {
            const { error } = await supabase
                .from('collections')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchCollections();
        } catch (error) {
            console.error('Error deleting collection:', error);
            alert('Failed to delete collection');
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground">Collections</h1>
                <Link href="/admin/collections/new">
                    <Button>Add New Collection</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                    <div key={collection.id} className="bg-card border border-border rounded-lg overflow-hidden">
                        {collection.image && (
                            <img
                                src={collection.image}
                                alt={collection.name}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-6">
                            <h3 className="font-display text-xl font-semibold text-foreground mb-2">{collection.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{collection.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{collection.product_count} products</span>
                                <div className="flex gap-2">
                                    <Link href={`/admin/collections/${collection.id}`}>
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </Link>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(collection.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {collections.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No collections found. <Link href="/admin/collections/new" className="text-primary hover:underline">Create one</Link>
                </div>
            )}
        </div>
    );
}




