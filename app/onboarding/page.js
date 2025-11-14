'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState('payment');
  const [loading, setLoading] = useState(false);
  const [contractorId, setContractorId] = useState(null);

  // Handle successful payment redirect
  useEffect(() => {
    if (searchParams.get('payment_success') === 'true') {
      setStep('profile');
    }
  }, [searchParams]);

  const handlePayment = async () => {
    setLoading(true);

    const response = await fetch('/api/create-membership-checkout', {
      method: 'POST',
    });

    const { url } = await response.json();
    window.location.href = url;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email'),
      name: formData.get('name'),
      company_name: formData.get('company_name'),
      phone: formData.get('phone'),
    };

    const response = await fetch('/api/contractors/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      setContractorId(result.contractor.id);
      setStep('campaign');
    }

    setLoading(false);
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      contractor_id: contractorId,
      counties: [formData.get('county')],
      daily_budget: parseFloat(formData.get('daily_budget')),
    };

    const response = await fetch('/api/contractors/update-campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      // Redirect to payment method setup
      window.location.href = result.setupUrl;
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">

        {/* Payment Step */}
        {step === 'payment' && (
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                SECURE YOUR EXCLUSIVE TERRITORY
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200">
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-10 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                  <h1 className="text-4xl font-black mb-3">Houston Territory Membership</h1>
                  <p className="text-xl text-blue-100">Lock in your exclusive county rights</p>
                </div>
              </div>

              <div className="p-10">
                {/* Price Display */}
                <div className="text-center mb-10 relative">
                  <div className="inline-block bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 shadow-lg border-2 border-gray-200">
                    <div className="text-sm font-semibold text-gray-600 mb-2">ANNUAL MEMBERSHIP</div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-7xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">$1,200</span>
                    </div>
                    <div className="text-gray-500 mt-2">One-time annual fee</div>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="space-y-3 mb-10">
                  <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-start gap-4">
                      <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-bold text-lg mb-1">Exclusive Territory Protection</div>
                        <div className="text-blue-100">Be the only contractor receiving leads in your county</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-start gap-4">
                      <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-bold text-lg mb-1">Instant Lead Delivery</div>
                        <div className="text-blue-100">High-intent customers sent to your phone in 30 seconds</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-start gap-4">
                      <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-bold text-lg mb-1">Professional Dashboard & CRM</div>
                        <div className="text-blue-100">Track ROI, manage leads, control your budget</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-5 px-8 rounded-xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Secure Checkout - $1,200
                    </>
                  )}
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Powered by Stripe · SSL Encrypted · 100% Secure
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Setup Step */}
        {step === 'profile' && (
          <div className="relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                PAYMENT CONFIRMED
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-10 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                  <h1 className="text-4xl font-black mb-3">Business Information</h1>
                  <p className="text-xl text-blue-100">Let's set up your account</p>
                </div>
              </div>

              <div className="p-10">
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="company_name"
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                      placeholder="ABC Garage Doors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                      placeholder="(832) 555-1234"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-5 px-8 rounded-xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 mt-8"
                  >
                    {loading ? 'Creating Your Account...' : 'Continue to Territory Selection →'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Campaign Setup Step */}
        {step === 'campaign' && (
          <div className="relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                FINAL STEP
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-10 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                  <h1 className="text-4xl font-black mb-3">Campaign Settings</h1>
                  <p className="text-xl text-blue-100">Choose your territory and set your budget</p>
                </div>
              </div>

              <div className="p-10">
                <form onSubmit={handleCampaignSubmit} className="space-y-6">
                  {/* Territory Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Your Territory</label>
                    <select
                      name="county"
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-4 text-base text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-white"
                    >
                      <option value="">Choose your county...</option>
                      <option value="Harris">Harris County</option>
                      <option value="Fort Bend">Fort Bend County</option>
                      <option value="Montgomery">Montgomery County</option>
                      <option value="Galveston">Galveston County</option>
                      <option value="Brazoria">Brazoria County</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-600">100% exclusive - you'll be the only contractor receiving leads in this county</p>
                  </div>

                  {/* Budget Setting */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Lead Budget</label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-500 text-lg font-semibold">$</span>
                      <input
                        type="number"
                        name="daily_budget"
                        required
                        min="50"
                        step="10"
                        defaultValue="100"
                        className="w-full border-2 border-gray-300 rounded-lg pl-10 pr-4 py-4 text-lg text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-white"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Recommended: $100-150/day for steady lead flow</p>
                  </div>

                  {/* Info Card */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">How billing works</div>
                        <div className="text-sm text-gray-700">
                          We'll automatically charge your payment method for each lead you receive. Pause or adjust your budget anytime from your dashboard.
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-5 px-8 rounded-xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Setting Up Your Campaign...' : (
                      <>
                        Add Payment Method & Launch
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
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
