'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CollectionEditPage() {
    const params = useParams();
    const router = useRouter();
    const collectionId = params.id as string;
    const isNew = collectionId === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
    });

    useEffect(() => {
        if (!isNew) {
            fetchCollection();
        }
    }, [collectionId]);

    const fetchCollection = async () => {
        try {
            const { data, error } = await supabase
                .from('collections')
                .select('*')
                .eq('id', collectionId)
                .single();

            if (error) throw error;

            setFormData({
                name: data.name || '',
                slug: data.slug || '',
                description: data.description || '',
                image: data.image || '',
            });
        } catch (error) {
            console.error('Error fetching collection:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const collectionData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                image: formData.image,
            };

            if (isNew) {
                const { error } = await supabase
                    .from('collections')
                    .insert(collectionData);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('collections')
                    .update(collectionData)
                    .eq('id', collectionId);

                if (error) throw error;
            }

            router.push('/admin/collections');
        } catch (error: any) {
            console.error('Error saving collection:', error);
            alert(error.message || 'Failed to save collection');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-8">
                {isNew ? 'Create Collection' : 'Edit Collection'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <Input
                    label="Collection Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <Input
                    label="Slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                        rows={4}
                    />
                </div>

                <Input
                    label="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                />

                {formData.image && (
                    <img
                        src={formData.image}
                        alt="Collection preview"
                        className="w-full h-64 object-cover rounded-lg border border-border"
                    />
                )}

                <div className="flex gap-4">
                    <Button type="submit" isLoading={saving}>
                        {isNew ? 'Create Collection' : 'Save Changes'}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}




