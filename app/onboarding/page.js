'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company_name: '',
    phone: '',
    county: '',
    daily_budget: '100',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // First create the Stripe checkout session
    const response = await fetch('/api/create-membership-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const { url } = await response.json();
    window.location.href = url;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Trust Metrics Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Metric 1 */}
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">2,500+</div>
              <div className="text-sm text-gray-600">Active Contractors</div>
            </div>

            {/* Metric 2 */}
            <div className="text-center border-l border-gray-200">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">$15M+</div>
              <div className="text-sm text-gray-600">Leads Generated</div>
            </div>

            {/* Metric 3 */}
            <div className="text-center border-l border-gray-200">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">87%</div>
              <div className="text-sm text-gray-600">Close Rate</div>
            </div>

            {/* Metric 4 */}
            <div className="text-center border-l border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600 mb-2">Support Available</div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Banner */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-gray-700 font-medium mb-4">Trusted by leading garage door companies across Texas</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Placeholder company logos */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-24 h-12 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Start Getting Exclusive Leads Today</h1>
              <p className="text-gray-600 mb-8">Join Houston's top garage door contractors</p>

              {/* Pricing Display */}
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 mb-8 border-2 border-blue-100">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">ANNUAL MEMBERSHIP</div>
                    <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      $1,200
                    </div>
                    <div className="text-sm text-gray-600 mt-1">One-time annual fee</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Plus pay-per-lead</div>
                    <div className="text-lg font-bold text-gray-900">$30-50</div>
                    <div className="text-sm text-gray-600">per qualified lead</div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        name="company_name"
                        required
                        value={formData.company_name}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="ABC Garage Doors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="you@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="(832) 555-1234"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Area */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Area</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Territory</label>
                      <select
                        name="county"
                        required
                        value={formData.county}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      >
                        <option value="">Choose your county...</option>
                        <option value="Harris">Harris County</option>
                        <option value="Fort Bend">Fort Bend County</option>
                        <option value="Montgomery">Montgomery County</option>
                        <option value="Galveston">Galveston County</option>
                        <option value="Brazoria">Brazoria County</option>
                      </select>
                      <p className="mt-2 text-sm text-gray-600">Select your primary service area</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Daily Lead Budget</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
                        <input
                          type="number"
                          name="daily_budget"
                          required
                          min="50"
                          step="10"
                          value={formData.daily_budget}
                          onChange={handleInputChange}
                          className="w-full border-2 border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Recommended: $100-150/day</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-8 rounded-lg text-lg font-bold hover:shadow-xl transform hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? 'Processing...' : 'Continue to Secure Checkout'}
                </button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 pt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    SSL Secure
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Money-back Guarantee
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Benefits & Social Proof */}
          <div className="space-y-6">
            {/* What's Included */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Qualified Lead Generation</div>
                    <div className="text-sm text-gray-600">Receive high-quality garage door service requests from customers in your area.</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Instant Lead Delivery</div>
                    <div className="text-sm text-gray-600">High-intent customers sent directly to your phone in under 30 seconds via SMS.</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Professional Dashboard & CRM</div>
                    <div className="text-sm text-gray-600">Track ROI, manage leads, control budgets. Full transparency and control.</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">24/7 Support</div>
                    <div className="text-sm text-gray-600">Dedicated support team available anytime you need help or have questions.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg mb-4">"GarageLeadly transformed my business. I went from chasing leads to having quality customers reach out to me. The steady flow of qualified leads helps me stay booked solid."</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20"></div>
                <div>
                  <div className="font-semibold">Mike Rodriguez</div>
                  <div className="text-sm text-blue-100">ABC Garage Doors, Harris County</div>
                </div>
              </div>
            </div>

            {/* Money Back Guarantee */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg mb-2">30-Day Money Back Guarantee</div>
                  <div className="text-gray-600">Try GarageLeadly risk-free. If you're not satisfied within the first 30 days, we'll refund your membership fee in full. No questions asked.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Elements - Bottom Section */}
      <div className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Image Card 1 */}
            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">1. Get Instant Alerts</h3>
                <p className="text-gray-600">Receive SMS notifications the moment a customer requests service in your territory.</p>
              </div>
            </div>

            {/* Image Card 2 */}
            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">2. Close The Job</h3>
                <p className="text-gray-600">Contact the customer, provide your expert service, and grow your business.</p>
              </div>
            </div>

            {/* Image Card 3 */}
            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center">
                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">3. Track Your ROI</h3>
                <p className="text-gray-600">Monitor performance, manage budgets, and scale your business with our dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
      <OnboardingContent />
    </Suspense>
  );
}
