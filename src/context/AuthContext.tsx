'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import LogoutDialog from '@/components/LogoutDialog';

interface UserData extends User {
  role?: 'student' | 'startup';
}

interface AuthContextType {
  user: UserData | null;
  initiateLogout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Fetch the user session on initial load
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        if (session?.user && session.user.user_metadata?.role) {
          setUser({
            ...session.user,
            role: session.user.user_metadata.role,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Listen for auth state changes (e.g., login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && session.user.user_metadata?.role) {
        setUser({
          ...session.user,
          role: session.user.user_metadata?.role,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setShowLogoutDialog(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const initiateLogout = () => {
    setShowLogoutDialog(true);
  };

  return (
    <AuthContext.Provider value={{ user, initiateLogout, loading }}>
      {children}
      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={logout}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};