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
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">

        {/* Payment Step */}
        {step === 'payment' && (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900">GarageLeadly</h1>
            <p className="text-gray-500 mb-8">Exclusive territory membership</p>

            <div className="border border-gray-200 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-gray-700">Annual Membership</span>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900">$1,200</span>
                  <span className="text-gray-500 text-sm">/year</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Exclusive county territory</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Pay per lead received</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Set daily budget limits</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition"
            >
              {loading ? 'Processing...' : 'Continue to payment'}
            </button>
          </div>
        )}

        {/* Profile Setup Step */}
        {step === 'profile' && (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900">Business Profile</h1>
            <p className="text-gray-500 mb-6">Set up your account</p>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="ABC Garage Doors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition"
              >
                {loading ? 'Creating...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Campaign Setup Step */}
        {step === 'campaign' && (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900">Campaign Setup</h1>
            <p className="text-gray-500 mb-6">Configure your territory and budget</p>

            <form onSubmit={handleCampaignSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service County</label>
                <select
                  name="county"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select a county...</option>
                  <option value="Harris">Harris County</option>
                  <option value="Fort Bend">Fort Bend County</option>
                  <option value="Montgomery">Montgomery County</option>
                  <option value="Galveston">Galveston County</option>
                  <option value="Brazoria">Brazoria County</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Daily Budget</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    name="daily_budget"
                    required
                    min="50"
                    step="10"
                    defaultValue="100"
                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum $50/day. Average lead cost: $25-$35
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Next: Add payment method for lead charges
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition"
              >
                {loading ? 'Setting up...' : 'Continue'}
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
