'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    county: '',
    currentLeads: '',
  });
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            GarageLeadly
          </Link>
          <p className="text-gray-600 mt-2 text-lg">Get Exclusive Garage Door Leads in Your Territory</p>
        </div>

        {/* Value Props */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-2">Tired of Fighting for the Same Leads?</h2>
            <p className="text-blue-100">Get hot garage door repair leads sent directly to your phone</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 rounded p-3">
              <div className="font-semibold mb-1">✓ Exclusive Territory</div>
              <div className="text-blue-100">Limited contractors per county</div>
            </div>
            <div className="bg-white/10 rounded p-3">
              <div className="font-semibold mb-1">✓ Instant Notifications</div>
              <div className="text-blue-100">SMS alerts within seconds</div>
            </div>
            <div className="bg-white/10 rounded p-3">
              <div className="font-semibold mb-1">✓ Qualified Leads</div>
              <div className="text-blue-100">Real customers ready to hire</div>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <div className={`w-20 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <div className={`w-20 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
            </div>
          </div>

          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Tell us about your business</h3>
                <p className="text-gray-600">We'll check if your territory is still available</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Your Garage Door Co."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="(555) 123-4567"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This is where we'll send your leads
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="john@yourgaragedoor.com"
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!formData.companyName || !formData.contactName || !formData.phone || !formData.email}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Territory */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">What's your service area?</h3>
                <p className="text-gray-600">We limit each county to ensure quality leads</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Your County *
                </label>
                <select
                  name="county"
                  required
                  value={formData.county}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                >
                  <option value="">Choose your county...</option>
                  <option value="Harris">Harris County (Houston)</option>
                  <option value="Fort Bend">Fort Bend County</option>
                  <option value="Montgomery">Montgomery County</option>
                  <option value="Galveston">Galveston County</option>
                  <option value="Brazoria">Brazoria County</option>
                  <option value="Williamson">Williamson County (Austin)</option>
                  <option value="Travis">Travis County (Austin)</option>
                  <option value="Bexar">Bexar County (San Antonio)</option>
                  <option value="Dallas">Dallas County</option>
                  <option value="Tarrant">Tarrant County (Fort Worth)</option>
                  <option value="Collin">Collin County</option>
                  <option value="Denton">Denton County</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How many leads do you get per month currently? *
                </label>
                <select
                  name="currentLeads"
                  required
                  value={formData.currentLeads}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                >
                  <option value="">Select range...</option>
                  <option value="0-10">0-10 leads</option>
                  <option value="10-25">10-25 leads</option>
                  <option value="25-50">25-50 leads</option>
                  <option value="50-100">50-100 leads</option>
                  <option value="100+">100+ leads</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-bold text-lg hover:bg-gray-300 transition"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!formData.county || !formData.currentLeads}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Book Call */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Great! Your territory is available</h3>
                <p className="text-gray-600 text-lg">
                  Book a 15-minute call to discuss how GarageLeadly works and if it's a fit for your business
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-lg mb-3">On this call we'll cover:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>How the lead delivery system works</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Territory exclusivity and lead volume</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Pricing and membership options</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Answer any questions you have</span>
                  </li>
                </ul>
              </div>

              {/* Calendly Embed */}
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 min-h-[500px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="mb-4">Calendar booking widget will be embedded here</p>
                  <p className="text-sm">(Add your Calendly link in the next step)</p>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
