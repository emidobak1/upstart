'use client';

import { useState, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface JobTag {
  name: string;
}

interface JobTagMapping {
  job_tags: JobTag;
}

interface Company {
  name: string;
}

interface JobData {
  id: string;
  title: string;
  company_id: string;
  location: string;
  employment_type: string;
  created_at: string;
  companies: Company;
  job_tag_mappings: JobTagMapping[];
}

interface Job {
  id: string;
  title: string;
  company_id: string;
  location: string;
  employment_type: string;
  created_at: string;
  tags: string[];
  company_name?: string;
  applied: boolean;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setUserId] = useState<string | null>(null);
  const [showOnlyApplied, setShowOnlyApplied] = useState(false);

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClientComponentClient();
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }
        
        setUserId(user.id);
        
        // Fetch the user's applications
        const { data: userApplications, error: applicationsError } = await supabase
          .from('applications')
          .select('job_id')
          .eq('student_id', user.id);
          
        if (applicationsError) {
          throw applicationsError;
        }
        
        // Create a set of job IDs that the user has applied to
        const appliedJobIds = new Set(userApplications.map(app => app.job_id));

        // Fetch jobs with company names
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select(`
            *,
            companies (
              name
            ),
            job_tag_mappings (
              job_tags (
                name
              )
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (jobsError) {
          throw jobsError;
        }

        // Transform the data to match our interface
        const transformedJobs = (jobsData as JobData[]).map(job => ({
          id: job.id,
          title: job.title,
          company_id: job.company_id,
          location: job.location,
          employment_type: job.employment_type,
          created_at: job.created_at,
          company_name: job.companies?.name || 'Unknown Company',
          tags: job.job_tag_mappings ? job.job_tag_mappings.map(mapping => mapping.job_tags.name) : [],
          applied: appliedJobIds.has(job.id) // Add the applied status
        }));

        setJobs(transformedJobs);

        // Fetch all unique tags for filtering
        const { data: tagsData, error: tagsError } = await supabase
          .from('job_tags')
          .select('name')
          .order('name');

        if (tagsError) {
          throw tagsError;
        }

        setAllTags(tagsData.map(tag => tag.name));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load job listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndJobs();
  }, [router]);

  // Filter jobs based on search, selected skills, and application status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.some((skill) => job.tags.includes(skill));

    const matchesApplicationStatus = showOnlyApplied ? job.applied : true;

    return matchesSearch && matchesSkills && matchesApplicationStatus;
  });

  // Toggle skill filter
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Toggle applied jobs filter
  const toggleAppliedFilter = () => {
    setShowOnlyApplied(!showOnlyApplied);
  };

  // Format employment type to be more readable
  const formatEmploymentType = (type: string) => {
    const types: {[key: string]: string} = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'internship': 'Internship',
      'contract': 'Contract'
    };
    return types[type] || type;
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      return 'Today';
    } else if (diffDays <= 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // View job details
  const viewJobDetails = (jobId: string) => {
    router.push(`/student/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative pt-20 px-6 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute h-full w-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-medium text-gray-900 leading-tight mb-6">
              Available{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Explore opportunities and find your next project
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search jobs by title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>

            <div className="flex flex-wrap justify-between mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {allTags.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-all duration-300 ${
                      selectedSkills.includes(skill)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                    {selectedSkills.includes(skill) && <X size={14} />}
                  </button>
                ))}
              </div>
              
              <button
                onClick={toggleAppliedFilter}
                className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-300 ${
                  showOnlyApplied
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {showOnlyApplied ? (
                  <>
                    <Check size={16} />
                    My Applications
                  </>
                ) : (
                  'Show Applied Jobs'
                )}
              </button>
            </div>
          </div>

          {/* Job Postings Section */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading job postings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-md">
              <div className="text-gray-400 text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No matching jobs found</h3>
              <p className="text-gray-600">
                {showOnlyApplied 
                  ? "You haven't applied to any jobs matching your criteria yet." 
                  : "Try adjusting your search criteria or removing some filters."}
              </p>
              {showOnlyApplied && (
                <button
                  onClick={() => setShowOnlyApplied(false)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Show All Jobs
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group ${
                    job.applied ? 'border-l-4 border-l-green-500' : ''
                  }`}
                  onClick={() => viewJobDetails(job.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-lg group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        {job.applied && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                            <Check size={12} className="mr-1" />
                            Applied
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{job.company_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        {formatEmploymentType(job.employment_type)}
                      </span>
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                        {job.location}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full group-hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                    {job.tags.length > 5 && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        +{job.tags.length - 5} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Posted {formatDate(job.created_at)}
                    </span>
                    <Link 
                      href={`/student/jobs/${job.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 group-hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}