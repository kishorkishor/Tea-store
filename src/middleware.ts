import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Protect admin routes - actual auth check happens in the page components
    // This middleware just ensures the routes exist
    if (pathname.startsWith('/admin') || pathname.startsWith('/super-admin')) {
        // Let the request through - pages will handle auth checks
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/super-admin/:path*',
    ],
};

