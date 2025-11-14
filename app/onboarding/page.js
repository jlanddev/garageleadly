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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Payment Step */}
        {step === 'payment' && (
          <div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h1 className="text-2xl font-bold text-white mb-1">Houston Territory Membership</h1>
              <p className="text-blue-100">Exclusive access to garage door leads in your county</p>
            </div>

            <div className="p-8">
              <div className="flex items-baseline justify-between mb-8 pb-6 border-b">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Annual Membership</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">$1,200</span>
                    <span className="text-xl text-gray-500">/year</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Exclusive Territory Protection</div>
                    <div className="text-sm text-gray-600">Be the only contractor receiving leads in your selected county</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Pay Per Lead</div>
                    <div className="text-sm text-gray-600">Only pay when you receive qualified leads (charged automatically)</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Complete Control</div>
                    <div className="text-sm text-gray-600">Set daily budgets, pause anytime, track all leads in your dashboard</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/30"
              >
                {loading ? 'Processing...' : 'Secure Checkout - $1,200'}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure payment powered by Stripe
              </div>
            </div>
          </div>
        )}

        {/* Profile Setup Step */}
        {step === 'profile' && (
          <div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h1 className="text-2xl font-bold text-white mb-1">Business Information</h1>
              <p className="text-blue-100">Tell us about your garage door business</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ABC Garage Doors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/30 mt-8"
                >
                  {loading ? 'Creating Account...' : 'Continue to Campaign Setup'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Campaign Setup Step */}
        {step === 'campaign' && (
          <div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h1 className="text-2xl font-bold text-white mb-1">Campaign Settings</h1>
              <p className="text-blue-100">Configure your territory and budget preferences</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleCampaignSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Territory</label>
                  <select
                    name="county"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a county</option>
                    <option value="Harris">Harris County</option>
                    <option value="Fort Bend">Fort Bend County</option>
                    <option value="Montgomery">Montgomery County</option>
                    <option value="Galveston">Galveston County</option>
                    <option value="Brazoria">Brazoria County</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-500">You'll have exclusive rights to all leads in this county</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Budget</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500 text-lg font-medium">$</span>
                    <input
                      type="number"
                      name="daily_budget"
                      required
                      min="50"
                      step="10"
                      defaultValue="100"
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Recommended: $100-$150/day for consistent lead flow</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-blue-900">How billing works</div>
                      <div className="text-sm text-blue-700 mt-1">We'll charge your card automatically as you receive leads. You can pause or adjust your budget anytime from your dashboard.</div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/30 mt-8"
                >
                  {loading ? 'Setting up...' : 'Continue to Payment Setup'}
                </button>
              </form>
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
