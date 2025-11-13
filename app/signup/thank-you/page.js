'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ThankYouPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Google Ads Conversion Tracking
    // TODO: Add your Google Ads conversion tracking code here

    // Facebook Pixel Tracking
    // TODO: Add your Facebook Pixel conversion tracking here

    console.log('Conversion tracking fired - add your tracking codes');

    // Get signup data from localStorage
    const signupData = localStorage.getItem('garageleadly_latest_signup');
    if (signupData) {
      setBookingData(JSON.parse(signupData));
    }
  }, []);

  // Generate next 14 days
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  // Available time slots (9 AM - 5 PM, 30 min intervals)
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const availableDates = getAvailableDates();

  const handleBookCall = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time');
      return;
    }

    try {
      const { error } = await supabase
        .from('calendar_bookings')
        .insert([{
          company_name: bookingData?.companyName || 'Unknown',
          contact_name: bookingData?.contactName || 'Unknown',
          email: bookingData?.email || '',
          phone: bookingData?.phone || '',
          county: bookingData?.county || '',
          scheduled_date: selectedDate.toISOString().split('T')[0],
          scheduled_time: selectedTime,
          status: 'scheduled',
          booking_type: 'strategy_call'
        }]);

      if (error) {
        console.error('Error booking call:', error);
        alert('Error: ' + error.message);
        return;
      }

      setBookingComplete(true);
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 min-h-screen py-12 px-4 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-6 shadow-2xl">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
              Call Confirmed!
            </h1>
            <p className="text-2xl text-blue-200 font-light mb-8">
              We'll see you on {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
            </p>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
              <h3 className="text-xl font-bold text-white mb-4">What to Expect</h3>
              <ul className="text-left text-blue-200 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>We'll send a calendar invite to your email</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>We'll call you at the scheduled time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>Bring any questions about leads, territory, or the platform</span>
                </li>
              </ul>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4 flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          {/* Success Message Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-6 shadow-2xl animate-bounce-slow">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
              Welcome to the Network
            </h1>
            <p className="text-2xl md:text-3xl text-blue-200 font-light mb-8">
              You're one step away from exclusive leads
            </p>

            <div className="flex items-center justify-center gap-3 text-green-400 font-semibold text-lg">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              Application Received
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Calendar Booking */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Book Your Strategy Call
                </h2>
                <p className="text-blue-200">
                  Choose a time that works for you. We'll discuss your territory, lead goals, and get you set up.
                </p>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Select a Date</h3>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {availableDates.map((date, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-lg text-sm font-medium transition ${
                        selectedDate?.toDateString() === date.toDateString()
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Select a Time (CST)</h3>
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {timeSlots.map((time, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg text-xs font-medium transition ${
                          selectedTime === time
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBookCall}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                {selectedDate && selectedTime ? 'Confirm Your Call' : 'Select Date & Time'}
              </button>
            </div>

            {/* Right: What Happens Next */}
            <div className="space-y-6">
              {/* Timeline Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 border border-blue-400/30 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">⚡</span>
                  Your Next Steps
                </h3>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      1
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">Schedule Your Call</h4>
                      <p className="text-blue-100">Pick a time that works for you. We'll send a calendar invite.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      2
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">Territory Confirmation</h4>
                      <p className="text-blue-100">We'll verify your county is available and discuss lead volume.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      3
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">Get Activated</h4>
                      <p className="text-blue-100">If we're a fit, we'll set up your dashboard and start sending leads immediately.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Preview Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">What Our Network Achieves</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-black text-green-400 mb-1">68%</div>
                    <div className="text-sm text-blue-200">Avg Close Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-green-400 mb-1">4.2x</div>
                    <div className="text-sm text-blue-200">Avg ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-green-400 mb-1">&lt;30s</div>
                    <div className="text-sm text-blue-200">Lead Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-green-400 mb-1">100%</div>
                    <div className="text-sm text-blue-200">Exclusive</div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-6 border border-purple-400/30 shadow-2xl text-center">
                <p className="text-purple-100 mb-2">Questions before your call?</p>
                <p className="text-white font-bold text-lg">We're here to help</p>
              </div>
            </div>
          </div>

          {/* Footer Link */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
