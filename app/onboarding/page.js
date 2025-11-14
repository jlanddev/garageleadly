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
          <div className="text-center">
            <div className="mb-12">
              <div className="text-6xl font-bold text-gray-900 mb-3">$1,200</div>
              <div className="text-gray-500">Annual membership</div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-base font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>
          </div>
        )}

        {/* Profile Setup Step */}
        {step === 'profile' && (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Your information</h1>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <input
                type="email"
                name="email"
                required
                className="w-full border-0 border-b border-gray-300 px-0 py-3 text-base focus:outline-none focus:border-blue-600"
                placeholder="Email"
              />

              <input
                type="text"
                name="name"
                required
                className="w-full border-0 border-b border-gray-300 px-0 py-3 text-base focus:outline-none focus:border-blue-600"
                placeholder="Full name"
              />

              <input
                type="text"
                name="company_name"
                required
                className="w-full border-0 border-b border-gray-300 px-0 py-3 text-base focus:outline-none focus:border-blue-600"
                placeholder="Company name"
              />

              <input
                type="tel"
                name="phone"
                required
                className="w-full border-0 border-b border-gray-300 px-0 py-3 text-base focus:outline-none focus:border-blue-600"
                placeholder="Phone"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-base font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors mt-8"
              >
                {loading ? 'Loading...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Campaign Setup Step */}
        {step === 'campaign' && (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Campaign settings</h1>

            <form onSubmit={handleCampaignSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Territory</label>
                <select
                  name="county"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select county</option>
                  <option value="Harris">Harris County</option>
                  <option value="Fort Bend">Fort Bend County</option>
                  <option value="Montgomery">Montgomery County</option>
                  <option value="Galveston">Galveston County</option>
                  <option value="Brazoria">Brazoria County</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Daily budget</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    name="daily_budget"
                    required
                    min="50"
                    step="10"
                    defaultValue="100"
                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-base font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors mt-8"
              >
                {loading ? 'Loading...' : 'Add payment method'}
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
