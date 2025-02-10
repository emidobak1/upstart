// src/app/(auth)/login/page.tsx
'use client';

import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        </div>
        
        <div className="max-w-md w-full space-y-8 relative backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-black rounded-xl mx-auto flex items-center justify-center mb-6 shadow-lg">
              <span className="text-white text-xl font-medium">U</span>
            </div>
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <Lock size={20} className="text-purple-500" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Welcome back
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Do not have an account?{' '}
              <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                Create one
              </Link>
            </p>
          </div>

          <LoginForm />
        </div>
      </div>

      {/* Right Panel - Design Elements */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
          <div className="absolute h-full w-full">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>
        </div>
        <div className="relative h-full flex items-center justify-center text-white p-12">
          <div className="p-8 text-center">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Sign in to Upstart
            </h2>
            <p className="text-xl text-gray-300 max-w-md mx-auto">
              Continue your journey with innovative startups and meaningful projects
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}