'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Plus } from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  location: string;
  employment_type: string;
  requirements: string[];
  responsibilities: string[];
  created_at: string;
}

interface JobApplication {
  id: string;
  job_id: string;
  applicant_name: string;
  applicant_email: string;
  resume_url: string;
  created_at: string;
}

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active job postings
  const fetchJobPostings = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, location, employment_type, requirements, responsibilities, created_at')
        .eq('company_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      setJobPostings(data || []);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      setError('Failed to fetch job postings');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // Fetch job applications
  const fetchJobApplications = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id, job_id, applicant_name, applicant_email, resume_url, created_at')
        .eq('company_id', user.id);

      if (error) throw error;

      setJobApplications(data || []);
    } catch (error) {
      console.error('Error fetching job applications:', JSON.stringify(error, null, 2));
      setError('Failed to fetch job applications');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobPostings();
    } else if (activeTab === 'applications') {
      fetchJobApplications();
    }
  }, [activeTab, fetchJobApplications, fetchJobPostings]);

  return (
    <div className="min-h-screen bg-white">
      {/* Background Blobs */}
      <div className="relative pt-32 px-6 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute h-full w-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">Company Dashboard</h1>
            <p className="text-xl text-gray-600">
              Manage your job postings and review applications.
            </p>
          </div>

          {/* Post Job Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/dashboard/startup/post-job')}
              className="px-6 py-3 align-top text-gray-800 rounded-lg border border-gray-300 hover:bg-blue-300 transition-all duration-300 flex items-center gap-2"
            >
              <Plus size={16} />
              Post Job
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-6 py-2 text-sm font-light rounded-lg transition-all duration-300 ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm px-4 py-1 rounded-full shadow-lg'
                  : 'text-gray-600 hover:text-black border border-gray-300 hover:border-gray-300'
              }`}
            >
              Active Job Postings
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-2 text-sm font-light rounded-lg transition-all duration-300 ${
                activeTab === 'applications'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm px-4 py-1 rounded-full shadow-lg'
                  : 'text-gray-600 hover:text-black border border-gray-300 hover:border-gray-300'
              }`}
            >
              Applications
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : activeTab === 'jobs' ? (
            <div className="space-y-6">
              {jobPostings.length > 0 ? (
                jobPostings.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 relative"
                  >
                    {/* Edit Button */}
                    <button
                      onClick={() => router.push(`/dashboard/startup/edit-job/${job.id}`)}
                      className="absolute top-4 right-4 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>

                    <h2 className="text-xl font-medium text-gray-900 mb-2">{job.title}</h2>
                    <div className="text-sm text-gray-600 mb-4">
                      <p>{job.location}</p>
                      <p>{job.employment_type}</p>
                      <p>Posted on: {new Date(job.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Requirements</h3>
                      <ul className="list-disc list-inside">
                        {job.requirements.map((requirement, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Responsibilities</h3>
                      <ul className="list-disc list-inside">
                        {job.responsibilities.map((responsibility, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        // Redirect to job applications page (to be implemented)
                        console.log('View applications for job:', job.id);
                      }}
                      className="px-4 py-2 text-sm font-light text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300"
                    >
                      View Applications
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600">No active job postings found.</div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {jobApplications.length > 0 ? (
                jobApplications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
                  >
                    <h2 className="text-xl font-medium text-gray-900 mb-2">
                      {application.applicant_name}
                    </h2>
                    <div className="text-sm text-gray-600 mb-4">
                      <p>Email: {application.applicant_email}</p>
                      <p>Applied on: {new Date(application.created_at).toLocaleDateString()}</p>
                      <a
                        href={application.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600">No applications found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}