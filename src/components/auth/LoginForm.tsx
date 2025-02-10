'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    console.log('Starting login process...'); // Debug log
  
    try {
      console.log('Attempting to login with:', formData.email); // Debug log
      await login(formData.email, formData.password);
      console.log('Login successful'); // Debug log
    } catch (error) {
      console.error('Login error details:', error); // Detailed error log
      setError(error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setIsLoading(false);
      console.log('Login process completed'); // Debug log
    }
  };

  return (
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-gray-700 hover:text-black transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full group flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}