'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { user, initiateLogout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Define navigation links based on authentication state
  const getNavLinks = () => {
    // If user is logged in, show only dashboard and profile links
    if (user) {
      return [
        { 
          href: user.role === 'student' ? '/student/dashboard' : '/startup/dashboard', 
          label: 'Dashboard' 
        },
        { 
          href: user.role === 'student' ? '/student/profile' : '/startup/profile', 
          label: 'Profile' 
        },
        { href: '/blog', label: 'Stories' },
      ];
    }

    // If user is not logged in, show home, login and signup links
    return [
      { href: '/', label: 'Home' },
      { href: '/login', label: 'Login' },
      { href: '/signup', label: 'SignUp' },
      { href: '/blog', label: 'Stories' },
    ];
  };

  const navLinks = getNavLinks();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href={user ? (user.role === 'student' ? '/student/dashboard' : '/startup/dashboard') : '/'} 
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">U</span>
            </div>
            <span className="text-xl font-medium">upstart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
                onClick={initiateLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMounted && (
        <div 
          className={`md:hidden absolute w-full bg-white shadow-md transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`block py-2 text-sm ${
                  pathname === link.href 
                    ? 'text-black font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={initiateLogout}
                className="block w-full text-left py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}