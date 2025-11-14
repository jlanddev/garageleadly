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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">

        {/* Payment Step */}
        {step === 'payment' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">Houston Territory Membership</h1>
              <p className="text-lg text-gray-600">Secure your exclusive territory</p>
            </div>

            <div className="text-center mb-12">
              <div className="mb-2">
                <span className="text-6xl font-bold text-gray-900">$1,200</span>
              </div>
              <div className="text-gray-500">Annual membership</div>
            </div>

            <div className="space-y-3 mb-12 max-w-sm mx-auto">
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Exclusive territory protection</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Pay only for qualified leads</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Full control and transparency</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3.5 px-6 rounded-md text-base font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Processing...' : 'Continue to checkout'}
            </button>

            <div className="mt-6 text-center text-sm text-gray-500">
              Secure payment by Stripe
            </div>
          </div>
        )}

        {/* Profile Setup Step */}
        {step === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">Business Information</h1>
              <p className="text-lg text-gray-600">Tell us about your business</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  name="company_name"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="ABC Garage Doors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3.5 px-6 rounded-md text-base font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors mt-8"
              >
                {loading ? 'Creating account...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Campaign Setup Step */}
        {step === 'campaign' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">Campaign Settings</h1>
              <p className="text-lg text-gray-600">Configure your territory and budget</p>
            </div>

            <form onSubmit={handleCampaignSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Territory</label>
                <select
                  name="county"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select county</option>
                  <option value="Harris">Harris County</option>
                  <option value="Fort Bend">Fort Bend County</option>
                  <option value="Montgomery">Montgomery County</option>
                  <option value="Galveston">Galveston County</option>
                  <option value="Brazoria">Brazoria County</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">Exclusive rights to all leads in your county</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily budget</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    name="daily_budget"
                    required
                    min="50"
                    step="10"
                    defaultValue="100"
                    className="w-full border border-gray-300 rounded-md pl-8 pr-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Recommended: $100-150/day</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3.5 px-6 rounded-md text-base font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors mt-8"
              >
                {loading ? 'Setting up...' : 'Add payment method'}
              </button>
            </form>
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
