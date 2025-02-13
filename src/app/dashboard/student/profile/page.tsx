'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PencilLine, Github, Linkedin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ProfileData {
  id: string;
  email: string;
  role: 'student' | 'startup';
  first_name: string;
  last_name: string;
  university: string;
  graduation_year: string;
  major: string;
  github_profile: string;
  linkedin_profile: string;
  resume: string;
  skills: string[];
  portfolio: string;
  availability: string;
  profile_visibility: boolean;
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
    university: '',
    graduation_year: '',
    major: '',
    github_profile: '',
    linkedin_profile: '',
    resume: '',
    skills: [],
    portfolio: '',
    availability: '',
    profile_visibility: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        const supabase = createClientComponentClient();

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          return;
        }

        if (userData.role === 'student') {
          const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('id', user.id)
            .single();

          if (studentError) {
            console.error('Error fetching student data:', studentError);
            return;
          }

          setProfileData({
            id: user.id,
            email: user.email ?? '',
            role: userData.role,
            first_name: studentData.first_name ?? '',
            last_name: studentData.last_name ?? '',
            university: studentData.university ?? '',
            graduation_year: studentData.graduation_year?.toString() ?? '',
            major: studentData.major ?? '',
            github_profile: studentData.github_profile ?? '',
            linkedin_profile: studentData.linkedin_profile ?? '',
            resume: studentData.resume ?? '',
            skills: studentData.skills ? (Array.isArray(studentData.skills) ? studentData.skills : []) : [],
            portfolio: studentData.portfolio ?? '',
            availability: studentData.availability ?? '',
            profile_visibility: studentData.profile_visibility ?? false,
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

      if (profileData.role === 'student') {
        const { error: updateError } = await supabase
          .from('students')
          .update({
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            university: profileData.university,
            graduation_year: parseInt(profileData.graduation_year),
            major: profileData.major,
            github_profile: profileData.github_profile,
            linkedin_profile: profileData.linkedin_profile,
            resume: profileData.resume,
            skills: profileData.skills,
            portfolio: profileData.portfolio,
            availability: profileData.availability,
            profile_visibility: profileData.profile_visibility
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setProfileData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    setProfileData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Profile Header */}
        <div className="relative backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-light">
                {profileData.first_name} {profileData.last_name}
              </h1>
              <p className="text-gray-600 font-light">{profileData.major} Student</p>
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

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-light text-gray-900 mb-4">Education</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="university"
                  value={profileData.university}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="University"
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors disabled:text-gray-600 font-light"
                />
                <input
                  type="text"
                  name="major"
                  value={profileData.major}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Major"
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors disabled:text-gray-600 font-light"
                />
                <input
                  type="number"
                  name="graduation_year"
                  value={profileData.graduation_year}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Graduation Year"
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors disabled:text-gray-600 font-light"
                />
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-light text-gray-900 mb-4">Profiles</h2>
              <div className="space-y-4">
                <div className="relative group">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Github size={16} />
                    <label className="text-sm">GitHub Profile</label>
                  </div>
                  <input
                    type="url"
                    name="github_profile"
                    value={profileData.github_profile}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors disabled:text-gray-600 font-light"
                  />
                </div>
                <div className="relative group">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Linkedin size={16} />
                    <label className="text-sm">LinkedIn Profile</label>
                  </div>
                  <input
                    type="url"
                    name="linkedin_profile"
                    value={profileData.linkedin_profile}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors disabled:text-gray-600 font-light"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-light text-gray-900 mb-4">Skills & Experience</h2>
              <div className="space-y-4">
                <div className="relative group">
                  <label className="text-sm text-gray-600 mb-1 block">Skills</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="skills"
                      value={profileData.skills.join(', ')}
                      onChange={handleSkillsChange}
                      placeholder="Add skills (comma-separated)"
                      className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors font-light"
                    />
                  ) : (
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
                  )}
                </div>
                
                <div className="relative group">
                  <label className="text-sm text-gray-600 mb-1 block">Portfolio</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={profileData.portfolio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Your portfolio URL"
                    className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors disabled:text-gray-600 font-light"
                  />
                </div>

                <div className="relative group">
                  <label className="text-sm text-gray-600 mb-1 block">Resume</label>
                  <input
                    type="url"
                    name="resume"
                    value={profileData.resume}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Link to your resume"
                    className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors disabled:text-gray-600 font-light"
                  />
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-light text-gray-900 mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="relative group">
                  <label className="text-sm text-gray-600 mb-1 block">Availability</label>
                  <select
                    name="availability"
                    value={profileData.availability}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-gray-400 outline-none transition-colors disabled:text-gray-600 font-light"
                  >
                    <option value="">Select availability</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Profile Visibility</h3>
                    <p className="text-sm text-gray-500">Make your profile visible to startups</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="profile_visibility"
                      checked={profileData.profile_visibility}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        profile_visibility: e.target.checked
                      }))}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}