'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, FileText, Github, Linkedin, Mail, 
  MapPin, Calendar, GraduationCap, ExternalLink, Clock
} from 'lucide-react';

interface StudentProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  university: string;
  major: string;
  graduation_year: string;
  intro: string;
  skills: string[] | string;
  github_profile: string;
  linkedin_profile: string;
  portfolio: string;
  resume: string;
  availability: string;
}

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  created_at: string;
}

export default function StudentProfileView() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!id || !user?.id) {
        console.error('Missing required parameters:', { studentId: id, userId: user?.id });
        setError('Missing required information to load profile');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching application data for student ID:', id, 'company ID:', user.id);
        
        // Check for valid ID formats
        if (typeof id !== 'string' || id.trim() === '') {
          throw new Error(`Invalid student ID: ${id}`);
        }
        
        if (typeof user.id !== 'string' || user.id.trim() === '') {
          throw new Error(`Invalid user ID: ${user.id}`);
        }
        try {
          // First, check if this company has received applications from this student
          const { data: applicationsData, error: applicationsError } = await supabase
            .from('applications')
            .select(`
              id,
              job_id,
              created_at,
              jobs (
                title
              )
            `)
            .eq('student_id', id)
            .eq('company_id', user.id);
          
          if (applicationsError) {
            console.error('Supabase applications fetch error:', applicationsError);
            throw applicationsError;
          }
          
          // Only proceed if the student has applied to this company's jobs
          if (!applicationsData || applicationsData.length === 0) {
            console.error('No applications found for student ID:', id, 'and company ID:', user.id);
            setError("This student hasn't applied to any of your job postings.");
            setLoading(false);
            return;
          }
          
          console.log('Found applications:', applicationsData.length);
          
          // Format applications data
          const formattedApplications = applicationsData.map((app: any) => {
            try {
              const jobData = Array.isArray(app.jobs) ? app.jobs[0] || {} : app.jobs || {};
              
              return {
                id: app.id,
                job_id: app.job_id,
                job_title: jobData.title || 'Unknown Job',
                created_at: app.created_at
              };
            } catch (formatError) {
              console.error('Error formatting application:', formatError, app);
              return {
                id: app.id || 'unknown',
                job_id: app.job_id || 'unknown',
                job_title: 'Error: Unable to get job title',
                created_at: app.created_at || new Date().toISOString()
              };
            }
          });
          
          setApplications(formattedApplications);
        } catch (appError: unknown) {
          console.error('Error fetching applications:', appError);
          throw new Error(`Failed to fetch application data: ${appError instanceof Error ? appError.message : 'Unknown error'}`);
        }
        
        // Format applications data
        const formattedApplications = applicationsData.map(app => {
          try {
            const jobData = Array.isArray(app.jobs) ? app.jobs[0] || {} : app.jobs || {};
            
            return {
              id: app.id,
              job_id: app.job_id,
              job_title: jobData.title || 'Unknown Job',
              created_at: app.created_at
            };
          } catch (formatError) {
            console.error('Error formatting application:', formatError, app);
            return {
              id: app.id || 'unknown',
              job_id: app.job_id || 'unknown',
              job_title: 'Error: Unable to get job title',
              created_at: app.created_at || new Date().toISOString()
            };
          }
        });
        
        setApplications(formattedApplications);
        
        try {
          // Fetch student profile data
          console.log('Fetching student data for ID:', id);
          const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select(`
              id,
              first_name,
              last_name,
              email,
              university,
              major,
              graduation_year,
              intro,
              skills,
              github_profile,
              linkedin_profile,
              portfolio,
              resume,
              availability
            `)
            .eq('id', id)
            .single();
          
          console.log('Student data response received');
          
          if (studentError) {
            console.error('Supabase student fetch error:', studentError);
            throw new Error(`Database error: ${studentError.message || 'Unknown error'}`);
          }
          
          if (!studentData) {
            console.error('No student data returned for ID:', id);
            setError("Student profile not found.");
            setLoading(false);
            return;
          }
          
          console.log('Successfully fetched student data');
          setStudent(studentData);
        } catch (studentFetchError: unknown) {
          console.error('Error in student fetch:', studentFetchError);
          throw new Error(`Failed to fetch student profile: ${studentFetchError instanceof Error ? studentFetchError.message : 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error fetching student profile:', error);
        // Log the full error object with a safer approach
        try {
          console.log('Error details:', error instanceof Error ? error.message : JSON.stringify(error));
        } catch (jsonError) {
          console.log('Error could not be stringified:', error);
        }
        setError(error instanceof Error ? error.message : 'Failed to load student profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentProfile();
  }, [id, user, supabase]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Parse skills array
  const getSkillsArray = (): string[] => {
    if (!student) return [];
    
    if (Array.isArray(student.skills)) {
      return student.skills;
    }
    
    if (typeof student.skills === 'string') {
      try {
        return JSON.parse(student.skills);
      } catch {
        // If parsing fails, treat as comma-separated string
        return student.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    
    return [];
  };

  // Go back to applications
  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4 text-5xl">⚠️</div>
          <h2 className="text-2xl font-medium text-gray-800 mb-4">Profile Not Available</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't load this student's profile."}</p>
          <button
            onClick={goBack}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const skills = getSkillsArray();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>
      
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Applications
        </button>
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6 backdrop-blur-sm bg-white/80 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                {student.first_name.charAt(0)}{student.last_name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-medium text-gray-900">
                  {student.first_name} {student.last_name}
                </h1>
                <p className="text-gray-600">{student.major || 'Student'}</p>
                
                <div className="flex flex-wrap gap-3 mt-2">
                  {student.email && (
                    <a 
                      href={`mailto:${student.email}`} 
                      className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 gap-1"
                    >
                      <Mail size={14} />
                      <span>Email</span>
                    </a>
                  )}
                  {student.resume && (
                    <a 
                      href={student.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 gap-1"
                    >
                      <FileText size={14} />
                      <span>Resume</span>
                    </a>
                  )}
                  {student.github_profile && (
                    <a 
                      href={student.github_profile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 gap-1"
                    >
                      <Github size={14} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {student.linkedin_profile && (
                    <a 
                      href={student.linkedin_profile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 gap-1"
                    >
                      <Linkedin size={14} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              {applications.length > 0 && (
                <div className="px-4 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm">
                  <p className="font-medium">Applied to {applications.length} of your jobs</p>
                  <p className="text-xs mt-1">Latest: {formatDate(applications[0].created_at)}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Bio */}
          {student.intro && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-2">About</h2>
              <p className="text-gray-600 whitespace-pre-line">{student.intro}</p>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 backdrop-blur-sm bg-white/80 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Education</h2>
              <div className="space-y-3">
                {student.university && (
                  <div className="flex items-start gap-3">
                    <GraduationCap size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{student.university}</p>
                      {student.major && (
                        <p className="text-gray-600">{student.major}</p>
                      )}
                      {student.graduation_year && (
                        <p className="text-sm text-gray-500">Class of {student.graduation_year}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Applications */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Applications</h2>
                <div className="space-y-3">
                  {applications.map(app => (
                    <div key={app.id} className="flex items-start gap-3">
                      <Calendar size={18} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{app.job_title}</p>
                        <p className="text-sm text-gray-500">Applied on {formatDate(app.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Availability */}
              {student.availability && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Availability</h2>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      {student.availability.split(',').map((slot, index) => (
                        <p key={index} className="text-gray-600 mb-1">{slot.trim()}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-md p-6 backdrop-blur-sm bg-white/80 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Skills</h2>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string, index: number) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills listed</p>
              )}
            </div>
            
            {/* Portfolio */}
            {student.portfolio && (
              <div className="bg-white rounded-2xl shadow-md p-6 backdrop-blur-sm bg-white/80 border border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Portfolio</h2>
                <a 
                  href={student.portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 gap-1 group"
                >
                  <ExternalLink size={16} />
                  <span className="group-hover:underline">{student.portfolio}</span>
                </a>
                <p className="text-sm text-gray-600 mt-2">
                  View this student's portfolio to see examples of their work and projects.
                </p>
              </div>
            )}
            
            {/* Resume Preview */}
            {student.resume && (
              <div className="bg-white rounded-2xl shadow-md p-6 backdrop-blur-sm bg-white/80 border border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Resume</h2>
                <div className="aspect-[8.5/11] bg-gray-100 rounded-lg flex items-center justify-center p-4 border border-gray-200">
                  {student.resume.toLowerCase().endsWith('.pdf') ? (
                    <iframe
                      src={`${student.resume}#toolbar=0&navpanes=0`}
                      className="w-full h-full"
                      title={`${student.first_name}'s Resume`}
                    />
                  ) : (
                    <div className="text-center">
                      <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                      <a 
                        href={student.resume} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Download Resume
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}