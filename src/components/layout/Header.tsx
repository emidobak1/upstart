'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getNavLinks = () => {
    const baseLinks = [
      { href: '/', label: 'Home' },
    ];

    const authLinks = user ? [
      { href: '/dashboard/student', label: 'Jobs' },
      { href: '/dashboard/profile', label: 'Profile' }
    ] : [
      { href: '/login', label: 'Login' },
      { href: '/signup', label: 'SignUp' }
    ];

    return [...baseLinks, ...authLinks];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">U</span>
            </div>
            <span className="text-xl font-medium">upstart</span>
          </Link>
          <div className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`text-sm h-16 flex items-center ${
                  pathname === link.href 
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}