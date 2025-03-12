'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PencilLine, Plus, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface CompanyProfileData {
  id: string;
  email: string;
  role: 'startup';
  name: string;
  description: string;
  website_url: string;
  logo_url: string;
  industry: string;
  company_size: string;
  location: string;
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
    industry: '',
    company_size: '',
    location: '',
  });

  // Logo upload states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            industry: companyData.industry ?? '',
            company_size: companyData.company_size ?? '',
            location: companyData.location ?? '',
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
            industry: profileData.industry,
            company_size: profileData.company_size,
            location: profileData.location,
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

  // Simple logo upload function
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length || !user?.id) {
      console.log("No files selected or no user ID");
      return;
    }
    
    const file = e.target.files[0];
    console.log("File selected:", file.name, "Size:", file.size, "Type:", file.type);
    setLogoFile(file);
    setUploading(true);
    setUploadError(null);
    
    try {
      const supabase = createClientComponentClient();
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      console.log("Uploading file as:", fileName);
      
      // Upload to company_logo bucket
      console.log("Attempting to upload to 'company_logo' bucket...");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('company_logo')
        .upload(fileName, file);
      
      if (uploadError) {
        console.error("Upload error details:", uploadError.message, uploadError.name, uploadError);
        throw uploadError;
      }
      
      console.log("Upload successful:", uploadData);
      
      // Get public URL
      console.log("Getting public URL...");
      const { data } = supabase.storage
        .from('company_logo')
        .getPublicUrl(fileName);
      
      console.log("Public URL:", data.publicUrl);
      
      // Update profile data with new logo URL
      setProfileData(prev => ({
        ...prev,
        logo_url: data.publicUrl
      }));
      
    } catch (error) {
      console.error('Error uploading logo:', error);
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error name:', error.name);
        setUploadError(error.message || 'Failed to upload logo');
      } else {
        console.error('Unknown error type:', typeof error);
        console.error('Error stringified:', JSON.stringify(error));
        setUploadError('Failed to upload logo');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Background Blobs */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute h-full w-full">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <div className="relative backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-4 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-light">
                {profileData.name || 'Company Profile'}
              </h1>
              <p className="text-gray-600 font-light">Startup</p>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="self-start sm:self-auto px-4 py-2 text-sm font-light text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-300 flex items-center gap-2"
            >
              <PencilLine size={14} />
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Post Job Button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => {
                router.push('/startup/post-job');
            }}
            className="w-full sm:w-auto px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 text-center flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Post New Job
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Company Details */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-light text-gray-900 mb-4 sm:mb-6">Company Details</h2>
            <div className="space-y-4 sm:space-y-6">
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
              
              {/* Simple Logo Upload Section */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                {profileData.logo_url && (
                  <div className="mb-3">
                    <img 
                      src={profileData.logo_url} 
                      alt="Company Logo" 
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200" 
                    />
                  </div>
                )}
                
                {isEditing && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploading}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>Upload Logo</span>
                        </>
                      )}
                    </button>
                    
                    {profileData.logo_url && (
                      <button
                        type="button"
                        onClick={() => setProfileData({...profileData, logo_url: ''})}
                        className="text-sm text-red-600 hover:text-red-800 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
                
                {uploadError && (
                  <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}
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

          {/* Right Column - Additional Info */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-light text-gray-900 mb-4 sm:mb-6">Additional Information</h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={profileData.industry}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g., Technology, Healthcare, Finance"
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                <input
                  type="text"
                  name="company_size"
                  value={profileData.company_size}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g., 1-10, 11-50, 51-200 employees"
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g., San Francisco, CA or Remote"
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