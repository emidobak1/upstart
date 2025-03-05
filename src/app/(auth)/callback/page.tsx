'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("Authenticating...");
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the role from URL query parameters              
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw new Error ('Authentication failed');

        if (data?.session) {
          const userId = data.session.user.id;
          const userMetadata = data.session.user.user_metadata;
          
          if (!userMetadata) throw new Error('Error accessing user data');

          const userRole = userMetadata.role;
          
          // If user doesn't already have a role, it's a "signup" scenario
          if (!userRole) {
            const role = searchParams.get('role');
            if (!role) throw new Error('No existing user and Role not found in URL params');
            // Insert role into auth metadata
            const { error: updateError } = await supabase.auth.updateUser({
              data: {
                role: role, // Add role from the URL params
              },
            });

            if (updateError) throw new Error (updateError.message);
            
            // Create role-specific record based on the role
            if (role === 'student') {
              await createStudentRecord(userId);
            } else if (role === 'startup') {
              await createStartupRecord(userId);
            }
            
            // Redirect new users to onboarding
            router.push(role === 'student' ? '/student/profile' : '/startup/profile');
          } else {
            // User exists, it's a "login" scenario
            // Don't update role for existing users
            router.push(userRole === 'student' ? '/student/dashboard' : '/startup/dashboard');
          }
        }
      } catch (error) {
        console.error('Error authenticating with OAuth:', error);
        setMessage("Authentication failed");
        router.push('/login?error=OAuth_Signup_Failed');
      }
    };

    // Function to create student record
    const createStudentRecord = async (userId: string) => {
      const { error } = await supabase
        .from('students')
        .insert({
          id: userId,
        });
    
      if (error) throw error;
    };

    // Function to create startup record
    const createStartupRecord = async (userId: string) => {
      const { error } = await supabase
        .from('companies')
        .insert({
          id: userId,
        });
    
      if (error) throw error;
    };

    handleAuthCallback();
  }, [router, supabase, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>{message}</p>
    </div>
  );
}