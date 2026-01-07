'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import StatusBadge from '@/components/admin/StatusBadge';

interface Testimonial {
    id: string;
    name: string;
    location: string;
    rating: number;
    text: string;
    product_name: string | null;
    is_approved: boolean;
    created_at: string;
}

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

    useEffect(() => {
        fetchTestimonials();
    }, [filter]);

    const fetchTestimonials = async () => {
        try {
            let query = supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false });

            if (filter === 'approved') {
                query = query.eq('is_approved', true);
            } else if (filter === 'pending') {
                query = query.eq('is_approved', false);
            }

            const { data, error } = await query;

            if (error) throw error;
            setTestimonials(data || []);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleApproval = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('testimonials')
                .update({ is_approved: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            fetchTestimonials();
        } catch (error) {
            console.error('Error updating testimonial:', error);
            alert('Failed to update testimonial');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchTestimonials();
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            alert('Failed to delete testimonial');
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground">Testimonials</h1>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                    <option value="all">All</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            <div className="space-y-4">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={testimonial.is_approved ? 'approved' : 'pending'} />
                                <div className="text-yellow-500">
                                    {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                                </div>
                            </div>
                        </div>
                        <p className="text-foreground mb-2">{testimonial.text}</p>
                        {testimonial.product_name && (
                            <p className="text-sm text-muted-foreground">Product: {testimonial.product_name}</p>
                        )}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => toggleApproval(testimonial.id, testimonial.is_approved)}
                                className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                            >
                                {testimonial.is_approved ? 'Unapprove' : 'Approve'}
                            </button>
                            <button
                                onClick={() => handleDelete(testimonial.id)}
                                className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {testimonials.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No testimonials found.
                </div>
            )}
        </div>
    );
}




