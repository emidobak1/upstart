'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("Authenticating...");
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw new Error('Authentication failed');

        if (data?.session) {
          const userMetadata = data.session.user.user_metadata;
          
          if (!userMetadata) throw new Error('Error accessing user data');

          const userRole = userMetadata.role;
          
          if (!userRole) {
            const role = searchParams.get('role');
            if (!role) throw new Error('No existing user and Role not found in URL params');
            
            const { error: updateError } = await supabase.auth.updateUser({
              data: {
                role: role,
                onboarding_status: 'not_started'
              },
            });

            if (updateError) throw new Error(updateError.message);
            
            const { data: refreshedData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw new Error(sessionError.message);

            const userId = refreshedData.session?.user.id;
            if (!userId) throw new Error('Could not get user ID after update');

            if (role === 'student') {
              await createStudentRecord(userId);
            } else if (role === 'startup') {
              await createStartupRecord(userId);
            }
            
            router.push('/onboarding');
          } else {
            const onboardingStatus = userMetadata.onboarding_status;
            if (onboardingStatus === 'not_started') {
              router.push('/onboarding');
            } else {
              router.push(userRole === 'student' ? '/student/dashboard' : '/startup/dashboard');
            }
          }
        }
      } catch (error: unknown) {
        console.error('Error authenticating with OAuth:', error);
        
        if (
          error && 
          typeof error === 'object' && 
          'message' in error && 
          typeof error.message === 'string' && 
          (error.message.includes('429') || error.message.includes('Too Many Requests'))
        ) {
          setMessage("Too many authentication attempts. Please try again in a few minutes.");
        } else {
          setMessage("Authentication failed");
          router.push('/login?error=OAuth_Signup_Failed');
        }
      }
    };

    const createStudentRecord = async (userId: string) => {
      const { error } = await supabase
        .from('students')
        .insert({ id: userId });
      
      if (error) throw error;
    };

    const createStartupRecord = async (userId: string) => {
      const { error } = await supabase
        .from('companies')
        .insert({ id: userId });
      
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

export default function AuthCallbackWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallback />
    </Suspense>
  );
}
