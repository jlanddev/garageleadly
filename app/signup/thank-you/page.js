'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ThankYouPage() {
  useEffect(() => {
    // Google Ads Conversion Tracking
    // TODO: Add your Google Ads conversion tracking code here
    // Example:
    // gtag('event', 'conversion', {
    //   'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'
    // });

    // Facebook Pixel Tracking
    // TODO: Add your Facebook Pixel conversion tracking here
    // Example:
    // fbq('track', 'Lead');

    console.log('Conversion tracking fired - add your tracking codes');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            GarageLeadly
          </Link>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              You're All Set!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We'll reach out within 24 hours to schedule your call
            </p>
          </div>

          {/* What Happens Next */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="font-bold text-lg mb-4 text-center text-gray-900">
              What Happens Next?
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3 text-xl">1.</span>
                <div>
                  <div className="font-semibold">Territory Check</div>
                  <div className="text-sm text-gray-600">We'll review your county availability</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3 text-xl">2.</span>
                <div>
                  <div className="font-semibold">Call You to Schedule</div>
                  <div className="text-sm text-gray-600">We'll discuss the program and answer your questions</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3 text-xl">3.</span>
                <div>
                  <div className="font-semibold">Get You Started</div>
                  <div className="text-sm text-gray-600">If it's a fit, we'll set you up and start sending leads</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center border-t pt-6">
            <p className="text-gray-600 mb-2">Questions? Need to reschedule?</p>
            <p className="text-gray-900 font-semibold">Contact us anytime</p>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Return to Home
            </Link>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Join Houston's top garage door contractors getting exclusive leads</p>
        </div>
      </div>
    </div>
  );
}
