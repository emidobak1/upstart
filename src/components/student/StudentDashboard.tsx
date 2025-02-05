// src/components/student/StudentDashboard.tsx
'use client';

import Link from 'next/link';

// Simulated job postings data (replace with a database later)
const jobPostings = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'Tech Corp',
    location: 'Remote',
    description: 'Join our team as a Frontend Developer Intern and work on cutting-edge projects.',
  },
  {
    id: 2,
    title: 'Data Analyst Intern',
    company: 'Data Insights',
    location: 'New York, NY',
    description: 'We are looking for a Data Analyst Intern to help us analyze and visualize data.',
  },
  {
    id: 3,
    title: 'Marketing Intern',
    company: 'Creative Agency',
    location: 'Los Angeles, CA',
    description: 'Assist our marketing team in creating campaigns and managing social media.',
  },
];

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Postings</h1>
        <div className="space-y-6">
          {jobPostings.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
              <p className="text-gray-600 mt-2">{job.company} - {job.location}</p>
              <p className="text-gray-500 mt-4">{job.description}</p>
              <Link
                href={`/dashboard/student/jobs/${job.id}`}
                className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}