'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { signOut as authSignOut } from '@/lib/auth';

interface UserProfile {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    role: 'customer' | 'admin' | 'super_admin';
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                // Don't log RLS recursion errors as they're expected until fixed
                if (!error.message.includes('infinite recursion')) {
                    console.error('Error fetching profile:', error);
                }
                setProfile(null);
            } else {
                setProfile(data);
            }
        } catch (error: any) {
            // Silently handle errors to prevent blocking
            if (!error?.message?.includes('infinite recursion')) {
                console.error('Error fetching profile:', error);
            }
            setProfile(null);
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    useEffect(() => {
        // Check if Supabase is properly configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
            console.warn('Supabase is not configured. Auth features will be disabled.');
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                // Try to fetch profile, but don't block if it fails
                fetchProfile(session.user.id).catch(() => {
                    // Silently fail - profile fetch is not critical for initial render
                });
            }
            setLoading(false);
        }).catch((error: any) => {
            console.error('Error getting session:', error);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                // Try to fetch profile, but don't block if it fails
                fetchProfile(session.user.id).catch(() => {
                    // Silently fail - profile will be fetched later when RLS is fixed
                });
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await authSignOut();
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                signOut: handleSignOut,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

