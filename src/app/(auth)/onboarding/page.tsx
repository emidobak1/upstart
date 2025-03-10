'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
  });

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw new Error('Authentication failed');
        
        if (data?.session) {
          const userId = data?.session?.user?.id;
          const userMetadata = data.session.user.user_metadata;
          
          if (!userId || !userMetadata) throw new Error('Error accessing user data');
          
          const userRole = userMetadata.role;
          setUserRole(userRole);
          setUserId(userId);
          
          const onboardingStatus = data.session.user.user_metadata.onboarding_status

          if (onboardingStatus != 'not_started') {
            // Redirect to profile page if onboarding is already completed
            router.push(userRole === 'student' ? '/student/profile' : '/startup/profile');
          }
        } else {
          // No session found, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Session error:', error);
        setError(error instanceof Error ? error.message : 'Failed to authenticate');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSession();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Update onboarding status in user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { 
          onboarding_status: 'complete'
        }
      });
      
      if (metadataError) throw new Error(metadataError.message);

      // Update the appropriate table based on user role
      if (userRole === 'student' && userId) {
        const { error: studentError } = await supabase
          .from('students')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName
          })
          .eq('id', userId);
        
        if (studentError) throw new Error(studentError.message);
      } else if (userRole === 'startup' && userId) {
        const { error: companyError } = await supabase
          .from('companies')
          .update({
            name: formData.companyName
          })
          .eq('id', userId);
        
        if (companyError) throw new Error(companyError.message);
      }

      // Redirect based on user role
      router.push(userRole === 'student' ? '/student/profile' : '/startup/profile');
    } catch (error) {
      console.error('Onboarding error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  /* const handleSkip = async () => {
    try {
      // Even when skipping, update onboarding status to complete
      const { error } = await supabase.auth.updateUser({
        data: { 
          onboarding_status: 'complete'
        }
      });
      
      if (error) throw new Error(error.message);
      
      router.push(userRole === 'student' ? '/student/profile' : '/startup/profile');
    } catch (error) {
      console.error('Skip error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }; */

  // Check if form is valid based on user role
  const isFormValid = userRole === 'student' 
    ? formData.firstName.trim() !== '' && formData.lastName.trim() !== ''
    : formData.companyName.trim() !== '';

  if (isLoading && !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

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
              <CheckCircle size={20} className="text-purple-500" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {userRole === 'student' ? 'Welcome, Student!' : 'Welcome, Startup!'}
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Let's get you set up with your account
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-5">
              {userRole === 'student' ? (
                <>
                  <div className="relative group">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white shadow-sm transition-all duration-300 focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none group-hover:border-gray-400"
                      placeholder="John"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="relative group">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white shadow-sm transition-all duration-300 focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none group-hover:border-gray-400"
                      placeholder="Doe"
                      disabled={isLoading}
                    />
                  </div>
                </>
              ) : (
                <div className="relative group">
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white shadow-sm transition-all duration-300 focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none group-hover:border-gray-400"
                    placeholder="Acme Inc."
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`group flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  (isLoading || !isFormValid) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Saving...' : 'Continue'}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              
              {/* <button
                type="button"
                onClick={handleSkip}
                disabled={isLoading}
                className="px-6 py-2 text-sm font-light rounded-lg transition-all duration-300 text-gray-600 hover:text-black border border-gray-300 hover:border-gray-400"
              >
                Skip for now
              </button> */}
            </div>
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
              {userRole === 'student' ? 'Start Your Journey' : 'Grow Your Startup'}
            </h2>
            <p className="text-xl text-gray-300 max-w-md mx-auto">
              {userRole === 'student' 
                ? 'Connect with innovative startups and build your portfolio with meaningful projects'
                : 'Find talented students and bring your vision to life with fresh perspectives'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}