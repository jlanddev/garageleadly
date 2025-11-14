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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 shadow-sm">

        {/* Payment Step */}
        {step === 'payment' && (
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Territory Membership</h1>
            <p className="text-sm text-gray-500 mb-8">Exclusive access to garage door leads in your county</p>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-900">$1,200</span>
                <span className="text-gray-500">/year</span>
              </div>
              <p className="text-sm text-gray-600">+ pay per lead as they're delivered (~$30 each)</p>
            </div>

            <div className="space-y-2.5 mb-8 text-sm">
              <div className="flex items-start gap-2.5">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Exclusive territory — no other contractors get your leads</span>
              </div>
              <div className="flex items-start gap-2.5">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Control your daily budget and pause anytime</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Pay $1,200'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">Secure payment processed by Stripe</p>
          </div>
        )}

        {/* Profile Setup Step */}
        {step === 'profile' && (
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Business Information</h1>
            <p className="text-sm text-gray-500 mb-6">We'll use this to set up your account</p>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company name</label>
                <input
                  type="text"
                  name="company_name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ABC Garage Doors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
              >
                {loading ? 'Creating account...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Campaign Setup Step */}
        {step === 'campaign' && (
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Territory & Budget</h1>
            <p className="text-sm text-gray-500 mb-6">Choose your service area and set spending limits</p>

            <form onSubmit={handleCampaignSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Service County</label>
                <select
                  name="county"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select county...</option>
                  <option value="Harris">Harris County</option>
                  <option value="Fort Bend">Fort Bend County</option>
                  <option value="Montgomery">Montgomery County</option>
                  <option value="Galveston">Galveston County</option>
                  <option value="Brazoria">Brazoria County</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Daily Budget</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    name="daily_budget"
                    required
                    min="50"
                    step="10"
                    defaultValue="100"
                    className="w-full border border-gray-300 rounded-lg pl-7 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  We'll stop sending leads when you hit this daily limit
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
              >
                {loading ? 'Finalizing...' : 'Add Payment Method'}
              </button>
              <p className="text-xs text-gray-500 text-center -mt-2">You'll add a card for per-lead charges next</p>
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
