import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();

  const path = request.nextUrl.pathname;

  // If user is not logged in and trying to access protected route
  if (!session) {
    if (path.startsWith('/student') || path.startsWith('/startup')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const userRole = session.user.user_metadata?.role;

  // If user is logged in and trying to access login/signup
  if (session && (path === '/login' || path === '/signup')) {
    if (userRole === 'student') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    } else if (userRole === 'startup') {
      return NextResponse.redirect(new URL('/startup/dashboard', request.url));
    }
  }

  if (path.startsWith('/student') && userRole !== 'student') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (path.startsWith('/startup') && userRole !== 'startup') {
    return NextResponse.redirect(new URL('/login', request.url)); 
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};