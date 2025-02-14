'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/context/AuthContext';

export default function EditJobPage() {
  const { id } = useParams(); // Get the job ID from the URL
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    employment_type: 'full-time', // Default to full-time
    requirements: [] as string[], // Array of requirements
    responsibilities: [] as string[], // Array of responsibilities
    is_active: true, // Default to active
  });

  // Fetch job details on page load
  useEffect(() => {
    const fetchJob = async () => {
      if (!user?.id || !id) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .eq('company_id', user.id)
          .single();

        if (error) throw error;

        setFormData({
          title: data.title,
          description: data.description,
          location: data.location,
          employment_type: data.employment_type,
          requirements: data.requirements || [],
          responsibilities: data.responsibilities || [],
          is_active: data.is_active,
        });
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user?.id || !id) {
        throw new Error('User not authenticated or job ID missing');
      }

      // Update job posting in the database
      const { error: updateError } = await supabase
        .from('jobs')
        .update({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          employment_type: formData.employment_type,
          requirements: formData.requirements,
          responsibilities: formData.responsibilities,
          is_active: formData.is_active,
        })
        .eq('id', id)
        .eq('company_id', user.id);

      if (updateError) throw updateError;

      // Redirect to the startup dashboard or job listings page
      router.push('/dashboard/startup');
    } catch (error) {
      console.error('Error updating job:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while updating the job');
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
    const values = e.target.value.split('\n').filter(Boolean); // Split by newline and remove empty lines
    setFormData(prev => ({
      ...prev,
      [field]: values,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Edit Job Posting</h1>
          <p className="text-gray-600 font-light">
            Update the job posting details below.
          </p>
        </div>

        {/* Job Posting Form */}
        <form onSubmit={handleSubmit} className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Job Title */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter job title"
                className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
              />
            </div>

            {/* Job Description */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter job description"
                className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                rows={6}
              />
            </div>

            {/* Location */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Enter job location"
                className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
              />
            </div>

            {/* Employment Type */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            {/* Requirements */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements.join('\n')}
                onChange={(e) => handleArrayChange(e, 'requirements')}
                placeholder="Enter requirements (one per line)"
                className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                rows={4}
              />
            </div>

            {/* Responsibilities */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities.join('\n')}
                onChange={(e) => handleArrayChange(e, 'responsibilities')}
                placeholder="Enter responsibilities (one per line)"
                className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                rows={4}
              />
            </div>

            {/* Active Status */}
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
                className="w-full px-4 py-2 bg-transparent border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Job...' : 'Update Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}