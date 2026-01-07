'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SupabaseCheck() {
    const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const checkConnection = async () => {
            try {
                // Just check if we can reach Supabase auth, not the user_profiles table
                const { data, error } = await supabase.auth.getSession();
                
                if (error) {
                    throw error;
                }
                
                setStatus('connected');
            } catch (err: any) {
                setStatus('error');
                setError(err.message || 'Connection failed');
            }
        };

        // Add a small delay to avoid blocking initial render
        const timer = setTimeout(checkConnection, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (process.env.NODE_ENV === 'production') {
        return null; // Don't show in production
    }

    return (
        <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg text-sm z-50 max-w-xs">
            <div className="font-semibold mb-2">Supabase Connection:</div>
            {status === 'checking' && (
                <div className="text-yellow-600">Checking...</div>
            )}
            {status === 'connected' && (
                <div className="text-green-600">✓ Connected</div>
            )}
            {status === 'error' && (
                <div>
                    <div className="text-red-600 mb-1">✗ Connection Failed</div>
                    <div className="text-xs text-muted-foreground">{error}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                        Check .env.local and restart dev server
                    </div>
                </div>
            )}
        </div>
    );
}

