'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PencilLine } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; // Import useRouter


interface CompanyProfileData {
  id: string;
  email: string;
  role: 'startup';
  name: string;
  description: string;
  website_url: string;
  logo_url: string;
}

export default function StartupProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [profileData, setProfileData] = useState<CompanyProfileData>({
    id: '',
    email: '',
    role: 'startup',
    name: '',
    description: '',
    website_url: '',
    logo_url: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        const supabase = createClientComponentClient();

        if (user.role === 'startup') {
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', user.id)
            .single();

          if (companyError) {
            console.error('Error fetching company data:', companyError);
            return;
          }

          setProfileData({
            id: user.id,
            email: user.email ?? '',
            role: user.role,
            name: companyData.name ?? '',
            description: companyData.description ?? '',
            website_url: companyData.website_url ?? '',
            logo_url: companyData.logo_url ?? '',
          });
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      const supabase = createClientComponentClient();

      if (profileData.role === 'startup') {
        const { error: updateError } = await supabase
          .from('companies')
          .update({
            name: profileData.name,
            description: profileData.description,
            website_url: profileData.website_url,
            logo_url: profileData.logo_url,
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw updateError;
        }

        console.log('Profile updated successfully');
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Background Blobs */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute h-full w-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Profile Header */}
        <div className="relative backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-light">
                {profileData.name}
              </h1>
              <p className="text-gray-600 font-light">Startup</p>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="px-4 py-2 text-sm font-light text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-300 flex items-center gap-2"
            >
              <PencilLine size={14} />
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Post Job Button */}
        <div className="mb-8">
          <button
            onClick={() => {
                router.push('/startup/post-job');
                console.log('Redirect to job posting page');
            }}
            className="w-36 px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 text-center"
          >
            Post Job
          </button>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Company Details */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-light text-gray-900 mb-6">Company Details</h2>
            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter company name"
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={profileData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter company description"
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  rows={4}
                />
              </div>
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                <input
                  type="url"
                  name="website_url"
                  value={profileData.website_url}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter website URL"
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="url"
                  name="logo_url"
                  value={profileData.logo_url}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter logo URL"
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info (Optional) */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-light text-gray-900 mb-6">Additional Information</h2>
            <div className="space-y-6">
              {/* Add more fields here if needed */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Field</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="Add custom field"
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}