'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface UserData extends User {
  role?: 'student' | 'startup';
}

interface AuthContextType {
  user: UserData | null;
  login: (email: string, password: string) => Promise<'student' | 'startup' | undefined>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        console.log('Checking session...'); // Debug log
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error); // Debug log
          throw error;
        }

        if (session?.user) {
          console.log('Found session for user:', session.user.email); // Debug log
          const { data } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

          console.log('User role data:', data); // Debug log

          setUser({
            ...session.user,
            role: data?.role
          });
        }
      } catch (error) {
        console.error('Error in getUser:', error); // Debug log
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event); // Debug log
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setUser({
          ...session.user,
          role: data?.role
        });
      } else {
        setUser(null);
      }
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login process in AuthContext...'); 
      
      const signInResponse = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      const { data: { user: authUser }, error } = signInResponse;
  
      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }
  
      if (authUser) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', authUser.id)
          .single();
  
        setUser({
          ...authUser,
          role: data?.role
        });
  
        return data?.role; // Return the role for the login page to handle redirect
      }
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
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