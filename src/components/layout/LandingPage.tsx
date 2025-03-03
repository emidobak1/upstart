'use client'
import { ArrowRight, Users, Code, Sparkles, MousePointer } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  // State for interactive feature hover
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  // Sample featured internship opportunities
  const featuredInternships = [
    {
      title: "UI/UX Design Intern",
      company: "DesignMind Studio",
      location: "Remote",
      tags: ["Figma", "UI/UX", "Prototyping"],
      isHot: true
    },
    {
      title: "Frontend Developer Intern",
      company: "TechFlow AI",
      location: "Hybrid",
      tags: ["React", "TypeScript", "Tailwind"],
      isNew: true
    },
    {
      title: "Data Science Intern",
      company: "DataVerse Analytics",
      location: "Remote",
      tags: ["Python", "ML", "Data Analysis"],
      isFeatured: true
    }
  ];

  // Interactive features with animations
  const features = [
    {
      id: 1,
      icon: Code,
      title: "Real-World Projects",
      description: "Work on actual projects that make meaningful impact at innovative startups",
      color: "from-blue-500 to-cyan-400",
      hoverEffect: "scale-105 shadow-blue-300/50"
    },
    {
      id: 2,
      icon: Users,
      title: "Direct Mentorship",
      description: "Connect and collaborate directly with startup founders and team leads",
      color: "from-purple-500 to-pink-400",
      hoverEffect: "scale-105 shadow-purple-300/50"
    },
    {
      id: 3,
      icon: Sparkles,
      title: "Build Your Portfolio",
      description: "Create an impressive portfolio with real startup projects that stands out to employers",
      color: "from-amber-500 to-orange-400",
      hoverEffect: "scale-105 shadow-amber-300/50"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section with animated gradient background */}
      <div className="relative pt-32 px-6 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute h-full w-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="inline-flex items-center bg-black/5 rounded-full px-3 py-1 text-sm mb-6 hover:bg-black/10 transition-colors">
                <span className="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">!</span>
                <span>No experience needed, just ambition</span>
              </div>
              <h1 className="text-5xl font-medium text-gray-900 leading-tight mb-6">
                Launch your career through{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  real startup projects
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with innovative startups, gain real-world experience, 
                and build an impressive portfolio that sets you apart.
              </p>
              <div className="flex items-center gap-4">
                <Link 
                  href="/how-it-works"
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-all duration-300 flex items-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  How it works
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative backdrop-blur-xl bg-white/50 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm px-4 py-1 rounded-full shadow-lg">
                Featured Internships
              </div>
              <div className="space-y-6">
                {featuredInternships.map((internship, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-100 p-4 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium mb-1 group-hover:text-blue-600 transition-colors">{internship.title}</h3>
                          {internship.isHot && (
                            <span className="ml-2 bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full">Hot</span>
                          )}
                          {internship.isNew && (
                            <span className="ml-2 bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full">New</span>
                          )}
                          {internship.isFeatured && (
                            <span className="ml-2 bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-full">Featured</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{internship.company}</p>
                      </div>
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full group-hover:bg-green-100 transition-colors">{internship.location}</span>
                    </div>
                    <div className="flex gap-2">
                      {internship.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
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

      {/* Stats Section with hover effects */}
      <div className="py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: '500+', label: 'Active Projects', color: 'from-blue-500' },
              { number: '200+', label: 'Startup Partners', color: 'from-purple-500' },
              { number: '1,000+', label: 'Students Matched', color: 'from-pink-500' }
            ].map((stat, index) => (
              <div key={index} className="group hover:transform hover:scale-105 transition-all duration-500 p-8 bg-white rounded-xl hover:shadow-xl">
                <div className={`text-5xl font-medium bg-gradient-to-r ${stat.color} to-gray-900 bg-clip-text text-transparent mb-3 transform transition-all duration-500 group-hover:scale-110`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 group-hover:text-gray-900 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revamped Interactive Features Section */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="text-sm bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full animate-pulse">
              Why Choose Upstart
            </span>
            <h2 className="mt-8 text-4xl font-medium text-gray-800">
              The platform built for your success
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;ve simplified the process of finding and securing meaningful startup experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.id} 
                className={`relative overflow-hidden bg-white p-8 rounded-xl shadow-sm transition-all duration-500 transform ${activeFeature === feature.id ? feature.hoverEffect : ''} hover:shadow-lg`}
                onMouseEnter={() => setActiveFeature(feature.id)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-r opacity-10 rounded-full"></div>
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 bg-gradient-to-r ${feature.color} transform ${activeFeature === feature.id ? 'scale-110 rotate-6' : ''}`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className={`mt-6 flex items-center text-sm font-medium bg-gradient-to-r ${feature.color} bg-clip-text text-transparent transition-all duration-300 ${activeFeature === feature.id ? 'translate-x-2' : ''}`}>
                  <span>Learn more</span>
                  <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Interactive call-to-action */}
          <div className="mt-20 bg-white border-2 border-gradient-to-r from-purple-600 to-blue-500 rounded-2xl overflow-hidden shadow-xl relative">
            <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ margin: '-2px' }}>
              <div className="absolute inset-0 bg-white opacity-30"></div>
            </div>
            <div className="relative p-12 text-center">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
              </div>
              
              <h3 className="text-3xl font-medium text-gray-800 mb-4 relative">
                Ready to jumpstart your career?
              </h3>
              
              <p className="text-gray-600 max-w-xl mx-auto mb-8 relative">
                Join hundreds of students who have accelerated their careers through real-world startup experience.
              </p>
              
              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-20 transition-all duration-300 group-hover:opacity-40 group-hover:blur-md"></div>
                <Link 
                  href="/signup" 
                  className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-medium transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
                >
                  <span>Get Started Now</span>
                  <MousePointer className="ml-2 animate-bounce" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}