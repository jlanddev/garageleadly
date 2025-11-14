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
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                🎯 SECURE YOUR EXCLUSIVE TERRITORY
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-100">
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
                  <div className="inline-block bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 shadow-lg border-2 border-blue-200">
                    <div className="text-sm font-semibold text-gray-600 mb-2">ANNUAL MEMBERSHIP</div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-7xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">$1,200</span>
                    </div>
                    <div className="text-gray-500 mt-2">One-time annual fee</div>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="space-y-4 mb-10">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">🏆</div>
                      <div>
                        <div className="font-bold text-lg mb-1">100% Exclusive Territory</div>
                        <div className="text-blue-100">Be the ONLY contractor receiving leads in your county. Zero competition.</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">⚡</div>
                      <div>
                        <div className="font-bold text-lg mb-1">Instant Lead Delivery</div>
                        <div className="text-green-100">High-intent customers sent directly to your phone in 30 seconds.</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">📊</div>
                      <div>
                        <div className="font-bold text-lg mb-1">Professional Dashboard</div>
                        <div className="text-purple-100">Track ROI, manage leads, control your budget. Complete transparency.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-5 px-8 rounded-xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? 'Processing...' : '🔒 Secure Checkout - $1,200'}
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
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                ✅ PAYMENT CONFIRMED
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-green-100">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-10 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                  <h1 className="text-4xl font-black mb-3">📋 Business Information</h1>
                  <p className="text-xl text-green-100">Let's set up your account</p>
                </div>
              </div>

              <div className="p-10">
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">📧 Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">👤 Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                      placeholder="John Smith"
                    />
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">🏢 Company Name</label>
                    <input
                      type="text"
                      name="company_name"
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition"
                      placeholder="ABC Garage Doors"
                    />
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-green-50 rounded-xl p-6 border-2 border-orange-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">📱 Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition"
                      placeholder="(832) 555-1234"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-5 px-8 rounded-xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 mt-8"
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
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                🎯 FINAL STEP
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-100">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-10 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                  <h1 className="text-4xl font-black mb-3">⚙️ Campaign Settings</h1>
                  <p className="text-xl text-purple-100">Choose your territory and set your budget</p>
                </div>
              </div>

              <div className="p-10">
                <form onSubmit={handleCampaignSubmit} className="space-y-6">
                  {/* Territory Selection */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
                    <label className="block text-sm font-bold text-gray-700 mb-3">📍 Select Your Exclusive Territory</label>
                    <select
                      name="county"
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-4 text-base text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-white"
                    >
                      <option value="">Choose your county...</option>
                      <option value="Harris">🏆 Harris County</option>
                      <option value="Fort Bend">🏆 Fort Bend County</option>
                      <option value="Montgomery">🏆 Montgomery County</option>
                      <option value="Galveston">🏆 Galveston County</option>
                      <option value="Brazoria">🏆 Brazoria County</option>
                    </select>
                    <div className="mt-3 bg-blue-100 border border-blue-300 rounded-lg p-3">
                      <p className="text-sm text-blue-800 font-semibold">✨ 100% Exclusive - You'll be the ONLY contractor receiving leads in this county</p>
                    </div>
                  </div>

                  {/* Budget Setting */}
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200 shadow-lg">
                    <label className="block text-sm font-bold text-gray-700 mb-3">💰 Set Your Daily Lead Budget</label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-500 text-xl font-bold">$</span>
                      <input
                        type="number"
                        name="daily_budget"
                        required
                        min="50"
                        step="10"
                        defaultValue="100"
                        className="w-full border-2 border-gray-300 rounded-lg pl-10 pr-4 py-4 text-xl text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition bg-white"
                      />
                    </div>
                    <div className="mt-3 bg-green-100 border border-green-300 rounded-lg p-3">
                      <p className="text-sm text-green-800 font-semibold">💡 Recommended: $100-150/day for steady lead flow</p>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">⚡</div>
                      <div>
                        <div className="font-bold text-lg mb-2">How It Works</div>
                        <div className="text-orange-100 text-sm">
                          We'll automatically charge your payment method for each lead you receive. Pause or adjust your budget anytime from your dashboard. You're in complete control.
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5 px-8 rounded-xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? 'Setting Up Your Campaign...' : 'Add Payment Method & Launch 🚀'}
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
