'use client';

import { CheckCircle2, Rocket, Building2, MessageSquare, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      icon: Building2,
      title: "Create Your Profile",
      description: "Sign up and build your profile. For students, showcase your skills and interests. For startups, tell us about your company and needs.",
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: 2,
      icon: MessageSquare,
      title: "Connect & Discuss",
      description: "Browse projects or candidates, and connect directly with potential matches. Discuss project details, expectations, and goals.",
      color: "from-purple-500 to-violet-400"
    },
    {
      id: 3,
      icon: Rocket,
      title: "Start Contributing",
      description: "Begin working on real projects, gain valuable experience, and make a meaningful impact at innovative startups.",
      color: "from-pink-500 to-rose-400"
    },
    {
      id: 4,
      icon: Award,
      title: "Build Your Portfolio",
      description: "Complete projects, receive endorsements, and build a portfolio of real-world experience that sets you apart.",
      color: "from-amber-500 to-orange-400"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      school: "UC Berkeley",
      image: "/api/placeholder/64/64",
      quote: "Through Upstart, I landed a UI/UX project at a growing fintech startup. The experience was invaluable for my portfolio and helped me secure my dream internship."
    },
    {
      name: "David Park",
      role: "Founder",
      company: "TechFlow AI",
      image: "/api/placeholder/64/64",
      quote: "We found amazing student talent through Upstart. Their fresh perspective and dedication helped us accelerate our development timeline significantly."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-32 px-6 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute h-full w-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <h1 className="text-5xl font-medium text-center mb-6">
            How{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Upstart
            </span>{' '}
            Works
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
            We&apos;ve simplified the process of connecting talented students with innovative startups, 
            creating meaningful experiences for both.
          </p>
        </div>
      </div>

      {/* Roadmap Process Section */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Roadmap (vertical) */}
          <div className="md:hidden">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-orange-400"></div>
              
              {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`relative pl-12 pb-12 ${index === steps.length - 1 ? '' : ''}`}
                  onMouseEnter={() => setActiveStep(step.id)}
                >
                  <div 
                    className={`absolute left-0 w-9 h-9 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300 ${activeStep === step.id ? 'scale-125' : ''}`}
                    style={{ top: "0" }}
                  >
                    {step.id}
                  </div>
                  
                  <div 
                    className={`bg-white p-6 rounded-xl shadow-md transition-all duration-300 ${activeStep === step.id ? 'shadow-lg -translate-y-1' : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center mb-4`}>
                      <step.icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop Roadmap (horizontal) */}
          <div className="hidden md:block">
            <div className="relative mb-16">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 transform -translate-y-1/2"></div>
              
              {/* Timeline Dots */}
              <div className="flex justify-between relative">
                {steps.map((step) => (
                  <div 
                    key={step.id} 
                    className="flex flex-col items-center relative"
                    onMouseEnter={() => setActiveStep(step.id)}
                  >
                    <div 
                      className={`w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-600 text-lg font-medium z-10 shadow-md transition-all duration-500 ${activeStep === step.id ? 'scale-125 shadow-lg' : ''}`}
                    >
                      {step.id}
                    </div>
                    
                    {/* Connector Animation when active */}
                    {activeStep === step.id && (
                      <div className="absolute -bottom-5 w-8 h-8 bg-white rounded-full shadow-lg transform rotate-45 z-0"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Step Details */}
            <div className="grid grid-cols-4 gap-6">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className={`bg-white p-6 rounded-xl shadow-sm transition-all duration-500 ${activeStep === step.id ? 'shadow-xl -translate-y-3' : ''}`}
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 transition-all duration-300 ${activeStep === step.id ? 'scale-110' : ''}`}>
                    <step.icon className="text-white" size={28} />
                  </div>
                  <h3 className={`text-xl font-medium mb-3 transition-all duration-300 ${activeStep === step.id ? 'text-black' : 'text-gray-700'}`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Interactive Navigation Controls */}
          <div className="flex justify-center items-center mt-12 space-x-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === step.id 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 w-10' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Step ${step.id}: ${step.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-medium mb-6">Benefits for Students</h2>
              <div className="space-y-4">
                {[
                  "Gain real-world experience with innovative startups",
                  "Build a portfolio of actual projects",
                  "Develop professional networks",
                  "Learn from startup founders and teams",
                  "Flexible, project-based work",
                  "Potential for future opportunities"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <CheckCircle2 className="text-green-500 flex-shrink-0 transition-transform duration-300 group-hover:scale-125" size={20} />
                    <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-medium mb-6">Benefits for Startups</h2>
              <div className="space-y-4">
                {[
                  "Access to motivated, skilled student talent",
                  "Cost-effective project completion",
                  "Fresh perspectives and ideas",
                  "Flexible engagement models",
                  "Build your talent pipeline",
                  "Support the next generation"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <CheckCircle2 className="text-green-500 flex-shrink-0 transition-transform duration-300 group-hover:scale-125" size={20} />
                    <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-medium text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-gray-600 text-sm">{testimonial.school || testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section with subtler gradient */}
      <div className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border-2 rounded-2xl overflow-hidden shadow-xl relative p-12 text-center">
            <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ margin: '-2px' }}>
              <div className="absolute inset-0 bg-white opacity-20"></div>
            </div>
            
            <div className="relative">
              <h2 className="text-2xl font-medium mb-6">Ready to Get Started?</h2>
              <p className="text-l text-gray-600 mb-8">
                Join Upstart today and be part of the future of work and learning.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-lg transition-all duration-300 flex items-center group shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Create Account
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}