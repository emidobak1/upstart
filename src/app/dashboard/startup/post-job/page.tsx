'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';

interface JobTag {
  id: string;
  name: string;
}

export default function PostJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<JobTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    employment_type: 'full-time',
    requirements: [] as string[],
    responsibilities: [] as string[],
    is_active: true,
  });

  // Fetch available tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      const { data: tagsData, error: tagsError } = await supabase
        .from('job_tags')
        .select('*')
        .order('name');

      if (tagsError) {
        console.error('Error fetching tags:', tagsError);
        return;
      }

      setAvailableTags(tagsData);
    };

    fetchTags();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Insert job posting
      const { data: jobData, error: insertError } = await supabase
        .from('jobs')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            employment_type: formData.employment_type,
            requirements: formData.requirements,
            responsibilities: formData.responsibilities,
            is_active: formData.is_active,
            company_id: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Create tag mappings if tags are selected
      if (selectedTags.length > 0 && jobData) {
        const mappings = selectedTags.map(tagId => ({
          job_id: jobData.id,
          tag_id: tagId,
        }));

        const { error: mappingError } = await supabase
          .from('job_tag_mappings')
          .insert(mappings);

        if (mappingError) throw mappingError;
      }

      router.push('/dashboard/startup');
    } catch (error) {
      console.error('Error posting job:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while posting the job');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: 'requirements' | 'responsibilities'
  ) => {
    const values = e.target.value.split('\n').filter(Boolean);
    setFormData(prev => ({
      ...prev,
      [field]: values,
    }));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleAddNewTag = async () => {
    if (!newTag.trim()) return;

    try {
      const { data, error } = await supabase
        .from('job_tags')
        .insert({ name: newTag.trim() })
        .select()
        .single();

      if (error) throw error;

      setAvailableTags(prev => [...prev, data]);
      setSelectedTags(prev => [...prev, data.id]);
      setNewTag('');
    } catch (error) {
      console.error('Error adding new tag:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Post a Job
            </span>
          </h1>
          <p className="text-gray-600 font-light">
            Fill out the form below to create a new job posting.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Details Section */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-colors"
                />
              </div>

              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-colors"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-colors"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-light mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Job Tags
            </h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all duration-300 ${
                      selectedTags.includes(tag.id)
                        ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag.name}
                    {selectedTags.includes(tag.id) && <X size={14} />}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a new tag"
                  className="flex-1 px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddNewTag}
                  className="px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Requirements & Responsibilities Section */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements.join('\n')}
                  onChange={(e) => handleArrayChange(e, 'requirements')}
                  rows={4}
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-colors"
                  placeholder="Enter each requirement on a new line"
                />
              </div>

              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities.join('\n')}
                  onChange={(e) => handleArrayChange(e, 'responsibilities')}
                  rows={4}
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-colors"
                  placeholder="Enter each responsibility on a new line"
                />
              </div>
            </div>
          </div>

          {/* Status & Submit Section */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Active Status</label>
                <select
                  name="is_active"
                  value={formData.is_active ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      is_active: e.target.value === 'true',
                    }))
                  }
                  required
                  className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-colors"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Posting Job...' : 'Post Job'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}