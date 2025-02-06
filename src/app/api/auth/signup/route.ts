// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import type { User } from '@/lib/types';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const userData: User = await request.json();
    const cookieStore = await cookies();
    
    const existingUsers = cookieStore.get('users')?.value;
    const users: User[] = existingUsers ? JSON.parse(existingUsers) : [];

    if (users.find(user => user.email === userData.email)) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    users.push(userData);
    
    const response = NextResponse.json(
      { message: 'Signup successful', user: userData },
      { status: 200 }
    );

    // Set both users and current user cookies
    response.cookies.set('users', JSON.stringify(users), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    response.cookies.set('user', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}