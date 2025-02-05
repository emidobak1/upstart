// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    // Validate the input
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a user object (this will later be replaced with a database call)
    const user = { email, password, role };

    // Create a response object
    const response = NextResponse.json(
      { message: 'Signup successful', user },
      { status: 200 }
    );

    // Store the user data in cookies using NextResponse
    response.cookies.set('user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    // Return the response
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}