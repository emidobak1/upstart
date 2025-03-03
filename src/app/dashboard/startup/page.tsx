'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Plus, Users, FileText, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  location: string;
  employment_type: string;
  requirements: string[];
  responsibilities: string[];
  created_at: string;
  application_count: number;
}

interface JobApplication {
  id: string;
  job_id: string;
  job_title: string;
  applicant_name: string;
  applicant_email: string;
  resume_url: string;
  created_at: string;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    university: string;
    major: string;
    graduation_year: string;
    skills: string[];
    github_profile?: string;
    linkedin_profile?: string;
  };
}

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active job postings
  const fetchJobPostings = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      // First, get the jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, location, employment_type, requirements, responsibilities, created_at')
        .eq('company_id', user.id)
        .eq('is_active', true);

      if (jobsError) throw jobsError;

      if (!jobsData) {
        setJobPostings([]);
        return;
      }

      // For each job, count the applications
      const jobsWithApplicationCounts = await Promise.all(
        jobsData.map(async (job) => {
          const { count, error: countError } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('job_id', job.id);

          if (countError) {
            console.error(`Error counting applications for job ${job.id}:`, countError);
            return { ...job, application_count: 0 };
          }

          return { ...job, application_count: count || 0 };
        })
      );

      setJobPostings(jobsWithApplicationCounts);
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
      // Get applications with student data and job title
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          job_id,
          applicant_name,
          applicant_email,
          resume_url,
          created_at,
          student_id,
          jobs (
            title
          ),
          students (
            id,
            first_name,
            last_name,
            university,
            major,
            graduation_year,
            skills,
            github_profile,
            linkedin_profile
          )
        `)
        .eq('company_id', user.id);
  
      if (error) throw error;
  
      if (!data) {
        setJobApplications([]);
        setFilteredApplications([]);
        return;
      }

      // Transform the data to match our interface
      const transformedApplications = data.map(app => {
        // Handle the case where students might be an array or undefined
        const studentData = Array.isArray(app.students) 
          ? app.students[0] || {} 
          : app.students || {};
          
        // Handle the case where jobs might be an array or undefined
        const jobData = Array.isArray(app.jobs)
          ? app.jobs[0] || {}
          : app.jobs || {};
          
        return {
          id: app.id,
          job_id: app.job_id,
          job_title: jobData.title || 'Unknown Job',
          applicant_name: app.applicant_name,
          applicant_email: app.applicant_email,
          resume_url: app.resume_url,
          created_at: app.created_at,
          student: {
            id: studentData.id || '',
            first_name: studentData.first_name || '',
            last_name: studentData.last_name || '',
            university: studentData.university || '',
            major: studentData.major || '',
            graduation_year: studentData.graduation_year || '',
            skills: studentData.skills || [],
            github_profile: studentData.github_profile,
            linkedin_profile: studentData.linkedin_profile
          }
        };
      });
      
      setJobApplications(transformedApplications);
      setFilteredApplications(transformedApplications);
      
      // If a job is selected, filter applications for that job
      if (selectedJobId) {
        setFilteredApplications(
          transformedApplications.filter(app => app.job_id === selectedJobId)
        );
      }
    } catch (error) {
      console.error('Error fetching job applications:', error);
      setError('Failed to fetch job applications');
    } finally {
      setLoading(false);
    }
  }, [user, supabase, selectedJobId]);

  // Filter applications by job ID
  const filterApplicationsByJob = (jobId: string | null) => {
    setSelectedJobId(jobId);
    
    if (!jobId) {
      setFilteredApplications(jobApplications);
      return;
    }
    
    setFilteredApplications(
      jobApplications.filter(app => app.job_id === jobId)
    );
  };

  // View all applications
  const viewAllApplications = () => {
    setActiveTab('applications');
    setSelectedJobId(null);
    setFilteredApplications(jobApplications);
  };

  // View applications for a specific job
  const viewJobApplications = (jobId: string) => {
    setActiveTab('applications');
    setSelectedJobId(jobId);
    setFilteredApplications(
      jobApplications.filter(app => app.job_id === jobId)
    );
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format employment type
  const formatEmploymentType = (type: string) => {
    const types: {[key: string]: string} = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'internship': 'Internship',
      'contract': 'Contract'
    };
    return types[type] || type;
  };

  // View student profile - redirects to detailed profile page
  const viewStudentProfile = (studentId: string) => {
    router.push(`/dashboard/startup/applicants/${studentId}`);
  };

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
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-medium">U</span>
              </div>
            </div>
            <h1 className="text-4xl font-medium text-gray-900 leading-tight mb-4">
              Welcome to your{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Company Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Manage your job postings and review applications from talented students.
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
              className={`px-6 py-2 text-sm font-light rounded-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-black border border-gray-300 hover:border-gray-300'
              }`}
            >
              <FileText size={16} />
              Active Job Postings
            </button>
            <button
              onClick={viewAllApplications}
              className={`px-6 py-2 text-sm font-light rounded-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'applications'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-black border border-gray-300 hover:border-gray-300'
              }`}
            >
              <Users size={16} />
              Applications
              {jobApplications.length > 0 && (
                <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {jobApplications.length}
                </span>
              )}
            </button>
          </div>

          {/* Filter bar for Applications tab */}
          {activeTab === 'applications' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Filter by job:</span>
                <button
                  onClick={() => filterApplicationsByJob(null)}
                  className={`px-3 py-1 text-xs rounded-full transition-all duration-300 ${
                    selectedJobId === null
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  All Applications
                </button>
                {jobPostings.map(job => (
                  <button
                    key={job.id}
                    onClick={() => filterApplicationsByJob(job.id)}
                    className={`px-3 py-1 text-xs rounded-full transition-all duration-300 ${
                      selectedJobId === job.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {job.title}
                    {job.application_count > 0 && (
                      <span className="ml-1 bg-white text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                        {job.application_count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-xl">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : activeTab === 'jobs' ? (
            <div className="space-y-6">
              {jobPostings.length > 0 ? (
                jobPostings.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 relative border border-gray-100"
                  >
                    {/* Application Count Badge */}
                    {job.application_count > 0 && (
                      <div className="absolute top-4 right-16 bg-blue-100 text-blue-800 rounded-full px-3 py-0.5 text-sm flex items-center gap-1">
                        <Users size={14} />
                        <span>{job.application_count} application{job.application_count !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    
                    {/* Edit Button */}
                    <button
                      onClick={() => router.push(`/dashboard/startup/edit-job/${job.id}`)}
                      className="absolute top-4 right-4 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>

                    <h2 className="text-xl font-medium text-gray-900 mb-3">{job.title}</h2>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400" />
                        <p>{job.location}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        <p>{formatEmploymentType(job.employment_type)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <p>Posted on: {formatDate(job.created_at)}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Requirements</h3>
                      <ul className="list-disc list-inside">
                        {job.requirements.slice(0, 3).map((requirement, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {requirement}
                          </li>
                        ))}
                        {job.requirements.length > 3 && (
                          <li className="text-sm text-gray-500 italic">
                            +{job.requirements.length - 3} more requirements
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => viewJobApplications(job.id)}
                        className={`px-4 py-2 text-sm font-light ${
                          job.application_count > 0 
                            ? 'text-blue-600 border border-blue-600 hover:bg-blue-50' 
                            : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
                        } rounded-lg transition-all duration-300 flex items-center gap-1`}
                      >
                        <Users size={14} />
                        View {job.application_count > 0 ? `${job.application_count} ` : ''}Applications
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-gray-100">
                  <div className="text-gray-400 text-5xl mb-4">📝</div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No active job postings</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first job posting to start receiving applications from talented students.
                  </p>
                  <button
                    onClick={() => router.push('/dashboard/startup/post-job')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    Post a Job
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredApplications.length > 0 ? (
                <>
                  {selectedJobId && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-blue-800">
                          Viewing applications for: {jobPostings.find(j => j.id === selectedJobId)?.title}
                        </h3>
                        <p className="text-sm text-blue-600">
                          {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <button
                        onClick={viewAllApplications}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View all applications
                      </button>
                    </div>
                  )}
                
                  {filteredApplications.map((application) => (
                    <div
                      key={application.id}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                        <div>
                          <h2 className="text-xl font-medium text-gray-900 mb-1">
                            {application.applicant_name}
                          </h2>
                          <div className="text-sm text-gray-600 mb-2">
                            <p>{application.student?.university || 'University not specified'}</p>
                            <p>{application.student?.major || 'Major not specified'}{application.student?.graduation_year ? `, Class of ${application.student?.graduation_year}` : ''}</p>
                          </div>
                          <div className="text-sm text-blue-600">
                            Applied for: <span className="font-medium">{application.job_title}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Applied on: {formatDate(application.created_at)}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {application.resume_url && (
                            <a
                              href={application.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 text-sm font-light text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center gap-1"
                            >
                              <FileText size={14} />
                              View Resume
                            </a>
                          )}
                          
                        </div>
                      </div>
                      
                      {/* Skills section */}
                      {application.student?.skills && application.student.skills.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(application.student.skills) 
                              ? application.student.skills.map((skill, index) => (
                                  <span 
                                    key={index} 
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))
                              : typeof application.student.skills === 'string' 
                                ? JSON.parse(application.student.skills).map((skill: string, index: number) => (
                                    <span 
                                      key={index} 
                                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))
                                : null
                            }
                          </div>
                        </div>
                      )}
                      
                      {/* Social Links */}
                      <div className="flex flex-wrap gap-3 mb-2">
                        {application.student?.github_profile && (
                          <a 
                            href={application.student.github_profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            GitHub Profile
                          </a>
                        )}
                        {application.student?.linkedin_profile && (
                          <a 
                            href={application.student.linkedin_profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            LinkedIn Profile
                          </a>
                        )}
                      </div>
                      
                      <div className="mt-4 text-right">
                        <button
                          onClick={() => viewStudentProfile(application.student?.id)}
                          className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1 ml-auto"
                        >
                          <span>View Full Profile</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-gray-100">
                  <div className="text-gray-400 text-5xl mb-4">👥</div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No applications found</h3>
                  <p className="text-gray-600 mb-6">
                    {selectedJobId 
                      ? "This job posting hasn't received any applications yet." 
                      : "You haven't received any applications yet."}
                  </p>
                  {selectedJobId ? (
                    <button
                      onClick={viewAllApplications}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                    >
                      View All Applications
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('jobs')}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                    >
                      View Job Postings
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}