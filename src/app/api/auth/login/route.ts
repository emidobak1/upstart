// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

// Simulated user data (replace this with a database call later)
const simulatedUser = {
  email: 'emi.dobak@outlook.com',
  password: '1234', // In a real app, never store plain-text passwords!
  role: 'student',
};

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { email, password } = await request.json();

    // Validate the input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulate user lookup (replace with database query later)
    if (email !== simulatedUser.email || password !== simulatedUser.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return a success response
    return NextResponse.json(
      { message: 'Login successful', user: simulatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}