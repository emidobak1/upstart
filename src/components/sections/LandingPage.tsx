import { ArrowRight, Users, Star, ChevronRight, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
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
                <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-all duration-300 flex items-center group shadow-lg hover:shadow-xl">
                  Get Started
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button className="text-gray-600 hover:text-gray-900 flex items-center group">
                  How it works
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative backdrop-blur-xl bg-white/50">
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm px-4 py-1 rounded-full shadow-lg">
                Featured Projects
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border border-gray-100 p-4 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium mb-1 group-hover:text-blue-600 transition-colors">Frontend Developer</h3>
                        <p className="text-sm text-gray-600">TechStart AI</p>
                      </div>
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full group-hover:bg-green-100 transition-colors">Remote</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full group-hover:bg-gray-200 transition-colors">React</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full group-hover:bg-gray-200 transition-colors">UI/UX</span>
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
              <div key={index} className="group hover:transform hover:scale-105 transition-all duration-300">
                <div className={`text-4xl font-medium bg-gradient-to-r ${stat.color} to-gray-900 bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 group-hover:text-gray-900 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="text-sm text-gray-600 bg-blue-50/50 px-4 py-2 rounded-full">
              Why Choose Upstart
            </span>
            <h2 className="mt-6 text-3xl text-gray-800">
              The platform built for your success
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We've simplified the process of finding and securing meaningful startup experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: 'Real Projects', description: 'Work on actual projects that make real impact at growing startups' },
              { icon: Users, title: 'Direct Connection', description: 'Connect and work directly with startup founders and team leads' },
              { icon: Star, title: 'Build Portfolio', description: 'Create an impressive portfolio with real startup projects' }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="relative group bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <feature.icon className="text-blue-700/70" size={20} />
                </div>
                <h3 className="text-lg text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}