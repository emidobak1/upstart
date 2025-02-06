// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import type { User } from '@/lib/types';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const cookieStore = await cookies();

    const storedUsers = cookieStore.get('users')?.value;
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { message: 'Login successful', user },
      { status: 200 }
    );

    // Set current user in cookies
    response.cookies.set('user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}