'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
  companies: Company;
  job_tag_mappings: JobTagMapping[];
}

interface Job {
  id: string;
  title: string;
  company_id: string;
  location: string;
  tags: string[];
  company_name?: string;
}

export default function StudentDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const supabase = createClientComponentClient();

      // Fetch jobs with company names
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name
          ),
          job_tag_mappings!inner (
            job_tags (
              name
            )
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        return;
      }

      // Transform the data to match our interface
      const transformedJobs = (jobsData as JobData[]).map(job => ({
        id: job.id,
        title: job.title,
        company_id: job.company_id,
        location: job.location,
        company_name: job.companies?.name || 'Unknown Company',
        tags: job.job_tag_mappings.map(mapping => mapping.job_tags.name)
      }));

      setJobs(transformedJobs);

      // Fetch all unique tags for filtering
      const { data: tagsData, error: tagsError } = await supabase
        .from('job_tags')
        .select('name')
        .order('name');

      if (tagsError) {
        console.error('Error fetching tags:', tagsError);
        return;
      }

      setAllTags(tagsData.map(tag => tag.name));
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search and selected skills
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.every((skill) => job.tags.includes(skill));

    return matchesSearch && matchesSkills;
  });

  // Toggle skill filter
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
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
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>

            <div className="flex flex-wrap gap-2">
              {allTags.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all duration-300 ${
                    selectedSkills.includes(skill)
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                  {selectedSkills.includes(skill) && <X size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Job Postings Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 relative backdrop-blur-xl bg-white/50">
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm px-4 py-1 rounded-full shadow-lg">
              Featured Projects
            </div>
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-100 p-4 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium mb-1 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600">{job.company_name}</p>
                    </div>
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full group-hover:bg-green-100 transition-colors">
                      {job.location}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {job.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full group-hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}