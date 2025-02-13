'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Define navigation links based on authentication state
  const getNavLinks = () => {
    const baseLinks = [
      { href: '/', label: 'Home' },
    ];

    // If user is logged in, show dashboard and profile links
    if (user) {
      return [
        ...baseLinks,
        { 
          href: user.role === 'student' ? '/dashboard/student' : '/dashboard/startup', 
          label: 'Dashboard' 
        },
        { href: '/dashboard/profile', label: 'Profile' },
      ];
    }

    // If user is not logged in, show login and signup links
    return [
      ...baseLinks,
      { href: '/login', label: 'Login' },
      { href: '/signup', label: 'SignUp' },
    ];
  };

  const navLinks = getNavLinks();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
                onClick={handleLogout}
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