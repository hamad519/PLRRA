import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // Allow access to login page
  if (pathname.startsWith('/admin/login')) {
    // If already logged in, redirect from login to dashboard
    if (authToken && userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect all other /admin routes (including /admin/register)
  if (pathname.startsWith('/admin')) {
    if (!authToken || userRole !== 'admin') {
      // If not logged in, redirect to login
      // Exception: allow the register page if it's the very first setup (optional logic)
      // For now, we require login for everything under /admin except /admin/login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};