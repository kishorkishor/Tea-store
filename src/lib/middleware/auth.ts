import { supabase } from '@/lib/supabase';

export async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

export async function checkRole(requiredRole: 'admin' | 'super_admin'): Promise<boolean> {
    const session = await checkAuth();
    if (!session) return false;

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (!profile) return false;

    if (requiredRole === 'super_admin') {
        return profile.role === 'super_admin';
    }

    return profile.role === 'admin' || profile.role === 'super_admin';
}




