import { ArrowRight, Users, Star, ChevronRight, Globe } from 'lucide-react';

export default function LandingPage() {
    return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-32 px-6 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-black/5 rounded-full px-3 py-1 text-sm mb-6">
                <span className="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">!</span>
                <span>No experience needed, just ambition</span>
              </div>
              <h1 className="text-5xl font-medium text-gray-900 leading-tight mb-6">
                Launch your career through real startup projects
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with innovative startups, gain real-world experience, 
                and build an impressive portfolio that sets you apart.
              </p>
              <div className="flex items-center gap-4">
                <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition flex items-center group">
                  Get Started
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="text-gray-600 hover:text-gray-900 flex items-center">
                  How it works
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 relative">
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white text-sm px-4 py-1 rounded-full">
                Featured Projects
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border border-gray-100 p-4 rounded-xl hover:shadow-md transition cursor-pointer group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium mb-1">Frontend Developer</h3>
                        <p className="text-sm text-gray-600">TechStart AI</p>
                      </div>
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">Remote</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">React</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">UI/UX</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-medium text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Active Projects</div>
            </div>
            <div>
              <div className="text-4xl font-medium text-gray-900 mb-2">200+</div>
              <div className="text-gray-600">Startup Partners</div>
            </div>
            <div>
              <div className="text-4xl font-medium text-gray-900 mb-2">1,000+</div>
              <div className="text-gray-600">Students Matched</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium text-gray-900 mb-4">Why Choose Upstart</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We have simplified the process of finding and securing meaningful startup experience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Globe className="text-blue-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">Real Projects</h3>
              <p className="text-gray-600">Work on actual projects that make real impact at growing startups</p>
            </div>
            <div className="bg-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-green-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">Direct Connection</h3>
              <p className="text-gray-600">Connect and work directly with startup founders and team leads</p>
            </div>
            <div className="bg-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                <Star className="text-purple-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">Build Portfolio</h3>
              <p className="text-gray-600">Create an impressive portfolio with real startup projects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};