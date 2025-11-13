'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ThankYouPage() {
  useEffect(() => {
    // Google Ads Conversion Tracking
    // TODO: Add your Google Ads conversion tracking code here
    // Example:
    // gtag('event', 'conversion', {
    //   'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'
    // });

    // Facebook Pixel Tracking
    // TODO: Add your Facebook Pixel conversion tracking here
    // Example:
    // fbq('track', 'Lead');

    console.log('Conversion tracking fired - add your tracking codes');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4 flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          {/* Success Message Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-6 shadow-2xl animate-bounce-slow">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
              Welcome to the Network
            </h1>
            <p className="text-2xl md:text-3xl text-blue-200 font-light mb-8">
              You're one step away from exclusive leads
            </p>

            <div className="flex items-center justify-center gap-3 text-green-400 font-semibold text-lg">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              Application Received
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Calendar Booking */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Book Your Strategy Call
                </h2>
                <p className="text-blue-200">
                  Choose a time that works for you. We'll discuss your territory, lead goals, and get you set up.
                </p>
              </div>

              {/* Calendly Embed */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl" style={{ height: '600px' }}>
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="text-center p-8">
                    <div className="text-4xl mb-4">📅</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Calendar Booking</h3>
                    <p className="text-gray-600 mb-6">Add your Calendly embed code below</p>
                    <div className="bg-gray-100 rounded-lg p-4 text-left text-sm text-gray-700 font-mono">
                      <p className="mb-2">To add Calendly:</p>
                      <p className="text-xs">1. Get your Calendly embed URL</p>
                      <p className="text-xs">2. Replace this placeholder div</p>
                      <p className="text-xs">3. Use Calendly inline widget</p>
                    </div>
                  </div>
                </div>
                {/*
                  REPLACE THE ABOVE DIV WITH YOUR CALENDLY EMBED:

                  <iframe
                    src="https://calendly.com/YOUR-LINK"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                  ></iframe>
                */}
              </div>
            </div>

            {/* Right: What Happens Next */}
            <div className="space-y-6">
              {/* Timeline Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 border border-blue-400/30 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">⚡</span>
                  Your Next Steps
                </h3>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      1
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">Schedule Your Call</h4>
                      <p className="text-blue-100">Pick a time that works for you. We'll send a calendar invite.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      2
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">Territory Confirmation</h4>
                      <p className="text-blue-100">We'll verify your county is available and discuss lead volume.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      3
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">Get Activated</h4>
                      <p className="text-blue-100">If we're a fit, we'll set up your dashboard and start sending leads immediately.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Preview Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">What Our Network Achieves</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-black text-green-400 mb-1">68%</div>
                    <div className="text-sm text-blue-200">Avg Close Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-green-400 mb-1">4.2x</div>
                    <div className="text-sm text-blue-200">Avg ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-green-400 mb-1">&lt;30s</div>
                    <div className="text-sm text-blue-200">Lead Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-green-400 mb-1">100%</div>
                    <div className="text-sm text-blue-200">Exclusive</div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-6 border border-purple-400/30 shadow-2xl text-center">
                <p className="text-purple-100 mb-2">Questions before your call?</p>
                <p className="text-white font-bold text-lg">We're here to help</p>
              </div>
            </div>
          </div>

          {/* Footer Link */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
