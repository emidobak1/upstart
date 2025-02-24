// src/components/layout/HowItWorks.tsx
'use client';

import { ArrowRight, CheckCircle2, Rocket, Building2, MessageSquare, Award } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      icon: Building2,
      title: "Create Your Profile",
      description: "Sign up and build your profile. For students, showcase your skills and interests. For startups, tell us about your company and needs."
    },
    {
      icon: MessageSquare,
      title: "Connect & Discuss",
      description: "Browse projects or candidates, and connect directly with potential matches. Discuss project details, expectations, and goals."
    },
    {
      icon: Rocket,
      title: "Start Contributing",
      description: "Begin working on real projects, gain valuable experience, and make a meaningful impact at innovative startups."
    },
    {
      icon: Award,
      title: "Build Your Portfolio",
      description: "Complete projects, receive endorsements, and build a portfolio of real-world experience that sets you apart."
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
            We've simplified the process of connecting talented students with innovative startups, 
            creating meaningful experiences for both.
          </p>
        </div>
      </div>

      {/* Process Steps */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <step.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50 px-6">
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
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
                    <span className="text-gray-600">{benefit}</span>
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
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
                    <span className="text-gray-600">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-medium text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
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

      {/* CTA Section */}
      <div className="py-20 bg-gray-50 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-medium mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join Upstart today and be part of the future of work and learning.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-all duration-300 flex items-center group shadow-lg hover:shadow-xl"
            >
              Create Account
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}