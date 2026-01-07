export type UserRole = 'customer' | 'admin' | 'super_admin';

export function hasPermission(userRole: UserRole, requiredRole: 'admin' | 'super_admin'): boolean {
    if (requiredRole === 'super_admin') {
        return userRole === 'super_admin';
    }
    return userRole === 'admin' || userRole === 'super_admin';
}




