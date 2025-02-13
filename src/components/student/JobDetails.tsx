// src/components/student/JobDetails.tsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

// Simulated job postings data (replace with a database later)
const jobPostings = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'Tech Corp',
    location: 'Remote',
    description: 'Join our team as a Frontend Developer Intern and work on cutting-edge projects.',
    responsibilities: [
      'Develop and maintain user interfaces for web applications.',
      'Collaborate with designers and backend developers.',
      'Write clean, maintainable, and efficient code.',
    ],
    requirements: [
      'Proficiency in HTML, CSS, and JavaScript.',
      'Experience with React or similar frameworks.',
      'Strong problem-solving skills.',
    ],
  },
  {
    id: 2,
    title: 'Data Analyst Intern',
    company: 'Data Insights',
    location: 'New York, NY',
    description: 'We are looking for a Data Analyst Intern to help us analyze and visualize data.',
    responsibilities: [
      'Collect and analyze data from various sources.',
      'Create visualizations and reports.',
      'Assist in data-driven decision-making processes.',
    ],
    requirements: [
      'Proficiency in SQL and Excel.',
      'Experience with data visualization tools like Tableau or Power BI.',
      'Strong analytical skills.',
    ],
  },
  {
    id: 3,
    title: 'Marketing Intern',
    company: 'Creative Agency',
    location: 'Los Angeles, CA',
    description: 'Assist our marketing team in creating campaigns and managing social media.',
    responsibilities: [
      'Assist in the creation of marketing campaigns.',
      'Manage social media accounts and create content.',
      'Analyze campaign performance and provide insights.',
    ],
    requirements: [
      'Strong communication and writing skills.',
      'Experience with social media platforms.',
      'Creative thinking and attention to detail.',
    ],
  },
];

export default function JobDetails() {
  const { id } = useParams();
  const job = jobPostings.find((job) => job.id === Number(id));

  if (!job) {
    return <div className="min-h-screen bg-gray-50 p-8">Job not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{job.title}</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">{job.company} - {job.location}</p>
          <p className="text-gray-500 mt-4">{job.description}</p>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800">Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-500 mt-2">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800">Requirements</h2>
            <ul className="list-disc list-inside text-gray-500 mt-2">
              {job.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
          <Link
            href="/dashboard/student"
            className="inline-block mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Job Postings
          </Link>
        </div>
      </div>
    </div>
  );
}