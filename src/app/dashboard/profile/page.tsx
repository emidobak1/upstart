'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Camera, PencilLine, Github, Linkedin, Globe, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ProfileData {
  id: string;
  email: string;          // Initialize all fields that are used in inputs
  role: 'student' | 'startup';
  first_name: string;     // Changed from optional to required with empty string default
  last_name: string;
  school: string;
  graduation_year: string;
  location: string;
  bio: string;
  skills: string[];
  profile_picture: string;
  created_at?: string;    // Keep optional if not used in inputs
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: '',
    email: '',
    role: 'student',
    first_name: '',
    last_name: '',
    school: '',
    graduation_year: '',
    location: '',
    bio: '',
    skills: [],
    profile_picture: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        const supabase = createClientComponentClient();
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data && !error) {
          console.log('Fetched user data:', data); // Debug log
          setProfileData(prevData => ({
            ...prevData,
            ...data,
            email: user.email, // Get email from auth user
          }));
        } else if (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      const supabase = createClientComponentClient();
      const { error } = await supabase
        .from('users')
        .update({
          role: profileData.role,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          school: profileData.school,
          graduation_year: profileData.graduation_year,
          location: profileData.location,
          bio: profileData.bio,
          skills: profileData.skills,
          profile_picture: profileData.profile_picture,
        })
        .eq('id', user.id);

      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Rest of the component code remains the same
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setProfileData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Profile Header */}
        <div className="relative backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-r from-purple-100 to-blue-100 ring-4 ring-white shadow-xl">
                {profileData.profile_picture ? (
                  <img
                    src={profileData.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera size={32} className="text-gray-400" />
                  </div>
                )}
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-between gap-4 mb-4">
                <h1 className="text-2xl font-light">
                  {profileData.first_name} {profileData.last_name}
                </h1>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="px-4 py-2 text-sm font-light text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-300 flex items-center gap-2"
                >
                  <PencilLine size={14} />
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
              <p className="text-gray-600 font-light text-sm mb-4">
                {profileData.role === 'student' ? 'Student' : 'Startup'} • {profileData.location}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors">
                  <Github size={18} />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors">
                  <Globe size={18} />
                </a>
                <a href={`mailto:${profileData.email}`} className="text-gray-500 hover:text-gray-800 transition-colors">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-light text-gray-900 mb-4">Education</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="school"
                  value={profileData.school}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="School"
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors disabled:text-gray-600 font-light"
                />
                <input
                  type="text"
                  name="graduationYear"
                  value={profileData.graduation_year}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Graduation Year"
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors disabled:text-gray-600 font-light"
                />
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-light text-gray-900 mb-4">Contact</h2>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Email"
                className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors disabled:text-gray-600 font-light"
              />
            </div>
          </div>

          {/* Center Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-light text-gray-900 mb-4">About</h2>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition-colors disabled:text-gray-600 min-h-[120px] font-light resize-none"
              />
            </div>

            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-light text-gray-900 mb-4">Skills</h2>
              {isEditing ? (
                <input
                  type="text"
                  name="skills"
                  value={profileData.skills.join(', ')}
                  onChange={handleSkillsChange}
                  placeholder="Add skills (comma-separated)"
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors font-light mb-4"
                />
              ) : null}
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-1 rounded-full text-sm font-light text-gray-600 bg-gray-100/50 border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}