'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ArrowLeft, Building2, MapPin, Calendar, Clock, Check, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";

interface JobDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  employment_type: string;
  requirements: string[];
  responsibilities: string[];
  created_at: string;
  company_id: string;
  companies: {
    name: string;
    description?: string;
    logo_url?: string;  // Added logo_url field
  };
  job_tag_mappings: Array<{
    job_tags: {
      id: string;
      name: string;
    }
  }>;
}

interface StudentProfile {
  first_name: string;
  last_name: string;
  university: string;
  major: string;
  resume: string;
}

export default function JobDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClientComponentClient();
        
        // Fetch the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }
        
        // Check if user has already applied
        const { data: existingApplication } = await supabase
          .from('applications')
          .select('id')
          .eq('job_id', id)
          .eq('student_id', user.id)
          .maybeSingle();
          
        setHasApplied(!!existingApplication);
        
        // Fetch student profile
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('first_name, last_name, university, major, resume')
          .eq('id', user.id)
          .single();
          
        if (studentError) {
          console.error("Error fetching student profile:", studentError);
        } else {
          setStudentProfile(studentData);
        }
        
        // Fetch the job with the specified ID including company data and tags
        const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name,
            description,
            logo_url
          ),
          job_tag_mappings (
            job_tags (
              id,
              name
            )
          )
        `)
        .eq('id', id)
        .single();
        
        if (error) {
          throw error;
        }
        
        setJob(data as JobDetails);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Failed to load job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id, router]);

  const handleApply = async () => {
    if (!job) return;
    
    setApplying(true);
    try {
      const supabase = createClientComponentClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      // Double-check if user has already applied to this job
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', job.id)
        .eq('student_id', user.id)
        .maybeSingle();
      
      if (existingApplication) {
        setHasApplied(true);
        return;
      }
      
      if (!studentProfile) {
        setError("Unable to retrieve your profile information. Please complete your profile before applying.");
        return;
      }
      
      // Insert application
      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          company_id: job.company_id,
          student_id: user.id,
          applicant_name: `${studentProfile.first_name} ${studentProfile.last_name}`,
          applicant_email: user.email,
          resume_url: studentProfile.resume || ''
        });
      
      if (applicationError) throw applicationError;
      
      setApplicationSuccess(true);
      setHasApplied(true);
      
      // Wait 2 seconds before redirecting to show success message
      setTimeout(() => {
        router.push('/student/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error applying for job:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };
  
  // Check if student profile is complete enough to apply
  const isProfileComplete = studentProfile && 
    studentProfile.first_name && 
    studentProfile.last_name;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4 text-5xl">⚠️</div>
          <h2 className="text-2xl font-medium text-gray-800 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the job posting you're looking for."}</p>
          <Link
            href="/student/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Job Listings
          </Link>
        </div>
      </div>
    );
  }

  // Format date to be more readable
  const formattedDate = new Date(job.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Map employment type to more readable format
  const formatEmploymentType = (type: string) => {
    const types: {[key: string]: string} = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'internship': 'Internship',
      'contract': 'Contract'
    };
    return types[type] || type;
  };

  // Extract tags from job_tag_mappings
  const tags = job.job_tag_mappings?.map(mapping => mapping.job_tags.name) || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute h-full w-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 relative">
        {/* Back Button */}
        <Link
          href="/student/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Jobs
        </Link>
        
        {/* Job Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6 backdrop-blur-sm bg-white/80">
          <h1 className="text-3xl font-medium text-gray-900 mb-3">{job.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Building2 size={16} className="mr-2 text-gray-400" />
              <span>{job.companies?.name || 'Unknown Company'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2 text-gray-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock size={16} className="mr-2 text-gray-400" />
              <span>{formatEmploymentType(job.employment_type)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar size={16} className="mr-2 text-gray-400" />
              <span>Posted on {formattedDate}</span>
            </div>
          </div>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Application Status/Button */}
          {applicationSuccess ? (
            <div className="flex items-center p-4 bg-green-50 text-green-700 rounded-lg">
              <Check className="mr-2" size={20} />
              <span>Application submitted successfully! Redirecting...</span>
            </div>
          ) : hasApplied ? (
            <div className="flex items-center p-4 bg-blue-50 text-blue-700 rounded-lg">
              <Check className="mr-2" size={20} />
              <span>You have already applied to this job</span>
            </div>
          ) : !isProfileComplete ? (
            <div className="flex items-center justify-between p-4 bg-yellow-50 text-yellow-700 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="mr-2" size={20} />
                <span>Complete your profile before applying</span>
              </div>
              <Link 
                href="/student/profile" 
                className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors"
              >
                Update Profile
              </Link>
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={applying}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            >
              {applying ? 'Submitting Application...' : 'Apply Now'}
              {!applying && <ChevronRight className="ml-2" size={16} />}
            </button>
          )}
        </div>
        
        {/* Job Details */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-md p-8 backdrop-blur-sm bg-white/80">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Job Description</h2>
              <div className="text-gray-600 whitespace-pre-line">
                {job.description}
              </div>
            </div>
            
            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8 backdrop-blur-sm bg-white/80">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Responsibilities</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index}>
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8 backdrop-blur-sm bg-white/80">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Requirements</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index}>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Company Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-8 backdrop-blur-sm bg-white/80">
              <h2 className="text-xl font-medium text-gray-900 mb-4">About the Company</h2>
              <div className="flex items-center justify-center mb-6">
                {job.companies?.logo_url ? (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={job.companies.logo_url} 
                      alt={`${job.companies.name} logo`}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {job.companies?.name?.charAt(0) || 'C'}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium text-center mb-4">{job.companies?.name}</h3>
              <p className="text-gray-600 text-sm">
                {job.companies?.description || 
                'This company has not provided a detailed description yet.'}
              </p>
            </div>
            
            {/* Your Application */}
            {studentProfile && (
              <div className="bg-white rounded-2xl shadow-md p-8 backdrop-blur-sm bg-white/80">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Your Application Info</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{studentProfile.first_name} {studentProfile.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Education</p>
                    <p className="font-medium">{studentProfile.university || '(Not specified)'}</p>
                    <p className="text-sm">{studentProfile.major || '(Not specified)'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Resume</p>
                    {studentProfile.resume ? (
                      <a href={studentProfile.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Resume</a>
                    ) : (
                      <span className="text-yellow-600">No resume uploaded</span>
                    )}
                  </div>
                  <Link 
                    href="/student/profile" 
                    className="block mt-4 text-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                  >
                    Update Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}