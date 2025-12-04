'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testFreeCheckout = async () => {
    setLoading(true);
    setResult(null);

    const testData = {
      email: `test${Date.now()}@example.com`,
      name: 'Test User',
      company_name: 'Test Garage Co',
      phone: '555-123-4567',
      county: 'Harris',
      leads_per_day: '3',
      password: 'TestPassword123!',
    };

    try {
      const response = await fetch('/api/create-free-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
      });
    } catch (error) {
      setResult({
        error: error.message,
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test /api/create-free-checkout</h2>
          <button
            onClick={testFreeCheckout}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Test'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Result:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
