// src/app/(auth)/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Backpack, Building2 } from 'lucide-react';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Signup failed');
      router.push(formData.role === 'student' ? '/dashboard/student' : '/dashboard/startup');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Create your account
            </h2>

            {/* Role Toggle */}
            <div className="mt-8 inline-flex rounded-full border border-gray-200 p-1 shadow-lg bg-white">
              <button
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  formData.role === 'student'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <Backpack size={16} />
                Student
              </button>
              <button
                onClick={() => setFormData({ ...formData, role: 'startup' })}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  formData.role === 'startup'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <Building2 size={16} />
                Startup
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              {formData.role === 'student' 
                ? 'Find projects and gain experience with startups'
                : 'Post projects and connect with talented students'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-5">
              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white shadow-sm transition-all duration-300 focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none group-hover:border-gray-400"
                  placeholder="your@email.com"
                />
              </div>
              <div className="relative group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white shadow-sm transition-all duration-300 focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none group-hover:border-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Account
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
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
              Welcome to Upstart
            </h2>
            <p className="text-xl text-gray-300 max-w-md mx-auto">
              {formData.role === 'student' 
                ? 'Launch your career through real projects with innovative startups'
                : 'Find passionate students ready to contribute to your startup\'s success'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}