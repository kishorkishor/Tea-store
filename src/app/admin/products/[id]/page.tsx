'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ImageUpload from '@/components/admin/ImageUpload';
import ProductPreview from '@/components/admin/ProductPreview';

export default function ProductEditPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const isNew = productId === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [collections, setCollections] = useState<Array<{ id: string; name: string; slug: string }>>([]);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        short_description: '',
        price: '',
        compare_at_price: '',
        category: '',
        collection_id: '',
        tags: '',
        in_stock: true,
        is_featured: false,
        is_best_seller: false,
        brewing_temperature: '',
        brewing_steep_time: '',
        brewing_amount: '',
        ingredients: '',
        origin: '',
        caffeine_level: 'medium' as 'none' | 'low' | 'medium' | 'high',
        images: [] as string[],
    });

    const [variants, setVariants] = useState<Array<{
        id?: string;
        name: string;
        weight: string;
        price: string;
        compare_at_price: string;
        stock_quantity: string;
    }>>([]);

    useEffect(() => {
        fetchCollections();
        if (!isNew) {
            fetchProduct();
        }
    }, [productId]);

    const fetchCollections = async () => {
        const { data } = await supabase
            .from('collections')
            .select('id, name, slug')
            .order('name');
        setCollections(data || []);
    };

    const fetchProduct = async () => {
        try {
            const { data: product, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (error) throw error;

            setFormData({
                name: product.name || '',
                slug: product.slug || '',
                description: product.description || '',
                short_description: product.short_description || '',
                price: product.price?.toString() || '',
                compare_at_price: product.compare_at_price?.toString() || '',
                category: product.category || '',
                collection_id: product.collection_id || '',
                tags: product.tags?.join(', ') || '',
                in_stock: product.in_stock ?? true,
                is_featured: product.is_featured ?? false,
                is_best_seller: product.is_best_seller ?? false,
                brewing_temperature: product.brewing_temperature || '',
                brewing_steep_time: product.brewing_steep_time || '',
                brewing_amount: product.brewing_amount || '',
                ingredients: product.ingredients?.join(', ') || '',
                origin: product.origin || '',
                caffeine_level: product.caffeine_level || 'medium',
                images: product.images || [],
            });

            // Fetch variants
            const { data: productVariants } = await supabase
                .from('product_variants')
                .select('*')
                .eq('product_id', productId);

            setVariants(
                (productVariants || []).map((v: { id: string; name: string; weight: string; price: number | null; compare_at_price: number | null; stock_quantity: number }) => ({
                    id: v.id,
                    name: v.name,
                    weight: v.weight,
                    price: v.price?.toString() || '',
                    compare_at_price: v.compare_at_price?.toString() || '',
                    stock_quantity: v.stock_quantity?.toString() || '0',
                }))
            );
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const productData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                short_description: formData.short_description,
                price: parseFloat(formData.price),
                compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
                category: formData.category,
                collection_id: formData.collection_id || null,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                in_stock: formData.in_stock,
                is_featured: formData.is_featured,
                is_best_seller: formData.is_best_seller,
                brewing_temperature: formData.brewing_temperature,
                brewing_steep_time: formData.brewing_steep_time,
                brewing_amount: formData.brewing_amount,
                ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(Boolean),
                origin: formData.origin,
                caffeine_level: formData.caffeine_level,
                images: formData.images,
            };

            let savedProductId = productId;

            if (isNew) {
                const { data, error } = await supabase
                    .from('products')
                    .insert(productData)
                    .select()
                    .single();

                if (error) throw error;
                savedProductId = data.id;
            } else {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productId);

                if (error) throw error;
            }

            // Get existing variant IDs
            const { data: existingVariants } = await supabase
                .from('product_variants')
                .select('id')
                .eq('product_id', savedProductId);

            const existingVariantIds = new Set((existingVariants || []).map((v: { id: string }) => v.id));
            const currentVariantIds = new Set(variants.filter((v) => v.id).map((v) => v.id));

            // Delete variants that were removed
            for (const existingId of existingVariantIds) {
                if (!currentVariantIds.has(existingId as string)) {
                    await supabase
                        .from('product_variants')
                        .delete()
                        .eq('id', existingId as string);
                }
            }

            // Save/update variants
            for (const variant of variants) {
                if (!variant.name || !variant.weight || !variant.price) {
                    continue; // Skip incomplete variants
                }

                const variantData = {
                    product_id: savedProductId,
                    name: variant.name,
                    weight: variant.weight,
                    price: parseFloat(variant.price),
                    compare_at_price: variant.compare_at_price ? parseFloat(variant.compare_at_price) : null,
                    stock_quantity: parseInt(variant.stock_quantity) || 0,
                };

                if (variant.id) {
                    await supabase
                        .from('product_variants')
                        .update(variantData)
                        .eq('id', variant.id);
                } else {
                    await supabase
                        .from('product_variants')
                        .insert(variantData);
                }
            }

            router.push('/admin/products');
        } catch (error: any) {
            console.error('Error saving product:', error);
            alert(error.message || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const addVariant = () => {
        setVariants([...variants, {
            name: '',
            weight: '',
            price: '',
            compare_at_price: '',
            stock_quantity: '0',
        }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground">
                    {isNew ? 'Create Product' : 'Edit Product'}
                </h1>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={showPreview ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Product Name"
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
                        </div>

                        <Input
                            label="Short Description"
                            value={formData.short_description}
                            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
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
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Price (৳)"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                            <Input
                                label="Compare at Price (৳)"
                                type="number"
                                step="0.01"
                                value={formData.compare_at_price}
                                onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                            />
                            <Input
                                label="Category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                        </div>

                        <Select
                            label="Collection"
                            value={formData.collection_id}
                            onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
                            options={[
                                { value: '', label: 'None' },
                                ...collections.map(c => ({ value: c.id, label: c.name })),
                            ]}
                        />

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Product Images
                            </label>
                            <ImageUpload
                                existingImages={formData.images}
                                onUploadComplete={(urls) => setFormData({ ...formData, images: urls })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Tags (comma-separated)
                                </label>
                                <Input
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="organic, premium, antioxidant"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Origin
                                </label>
                                <Input
                                    value={formData.origin}
                                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                    placeholder="Sylhet, Bangladesh"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Brewing Temperature
                                </label>
                                <Input
                                    value={formData.brewing_temperature}
                                    onChange={(e) => setFormData({ ...formData, brewing_temperature: e.target.value })}
                                    placeholder="75-80°C"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Steep Time
                                </label>
                                <Input
                                    value={formData.brewing_steep_time}
                                    onChange={(e) => setFormData({ ...formData, brewing_steep_time: e.target.value })}
                                    placeholder="2-3 minutes"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Amount
                                </label>
                                <Input
                                    value={formData.brewing_amount}
                                    onChange={(e) => setFormData({ ...formData, brewing_amount: e.target.value })}
                                    placeholder="1 teaspoon per cup"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Ingredients (comma-separated)
                            </label>
                            <Input
                                value={formData.ingredients}
                                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                                placeholder="100% Pure Green Tea Leaves"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Caffeine Level
                                </label>
                                <Select
                                    value={formData.caffeine_level}
                                    onChange={(e) => setFormData({ ...formData, caffeine_level: e.target.value as any })}
                                    options={[
                                        { value: 'none', label: 'None' },
                                        { value: 'low', label: 'Low' },
                                        { value: 'medium', label: 'Medium' },
                                        { value: 'high', label: 'High' },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.in_stock}
                                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm text-foreground">In Stock</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm text-foreground">Featured</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_best_seller}
                                    onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm text-foreground">Best Seller</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Product Variants
                            </label>
                            <div className="space-y-4">
                                {variants.map((variant, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 border border-border rounded-lg bg-muted/30">
                                        <Input
                                            placeholder="Variant Name"
                                            value={variant.name}
                                            onChange={(e) => {
                                                const updated = [...variants];
                                                updated[index].name = e.target.value;
                                                setVariants(updated);
                                            }}
                                            required
                                        />
                                        <Input
                                            placeholder="Weight (e.g., 50g)"
                                            value={variant.weight}
                                            onChange={(e) => {
                                                const updated = [...variants];
                                                updated[index].weight = e.target.value;
                                                setVariants(updated);
                                            }}
                                            required
                                        />
                                        <Input
                                            placeholder="Price (৳)"
                                            type="number"
                                            step="0.01"
                                            value={variant.price}
                                            onChange={(e) => {
                                                const updated = [...variants];
                                                updated[index].price = e.target.value;
                                                setVariants(updated);
                                            }}
                                            required
                                        />
                                        <Input
                                            placeholder="Compare Price (৳)"
                                            type="number"
                                            step="0.01"
                                            value={variant.compare_at_price}
                                            onChange={(e) => {
                                                const updated = [...variants];
                                                updated[index].compare_at_price = e.target.value;
                                                setVariants(updated);
                                            }}
                                        />
                                        <Input
                                            placeholder="Stock Qty"
                                            type="number"
                                            min="0"
                                            value={variant.stock_quantity}
                                            onChange={(e) => {
                                                const updated = [...variants];
                                                updated[index].stock_quantity = e.target.value;
                                                setVariants(updated);
                                            }}
                                            required
                                        />
                                        <div className="flex items-center">
                                            <span className="text-xs text-muted-foreground">
                                                Stock: {variant.stock_quantity || 0}
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeVariant(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addVariant}>
                                    + Add Variant
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" isLoading={saving}>
                                {isNew ? 'Create Product' : 'Save Changes'}
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => router.back()}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>

                {showPreview && (
                    <div className="lg:col-span-1">
                        <ProductPreview formData={formData} variants={variants} />
                    </div>
                )}
            </div>
        </div>
    );
}

