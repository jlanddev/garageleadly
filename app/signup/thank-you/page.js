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
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-l-4 border-green-500 p-12 mb-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Call Confirmed
              </h1>
              <p className="text-xl text-gray-300 mb-2">
                {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-2xl text-white font-bold">
                {selectedTime} CST
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-zinc-900 p-6 border-l-2 border-blue-500">
              <div className="text-blue-400 text-sm font-mono mb-2">STEP 1</div>
              <h3 className="text-white font-bold mb-2">Check Your Email</h3>
              <p className="text-gray-400 text-sm">Calendar invite sent to {bookingData?.email}</p>
            </div>

            <div className="bg-zinc-900 p-6 border-l-2 border-purple-500">
              <div className="text-purple-400 text-sm font-mono mb-2">STEP 2</div>
              <h3 className="text-white font-bold mb-2">We'll Call You</h3>
              <p className="text-gray-400 text-sm">At exactly {selectedTime} on the scheduled date</p>
            </div>

            <div className="bg-zinc-900 p-6 border-l-2 border-green-500">
              <div className="text-green-400 text-sm font-mono mb-2">STEP 3</div>
              <h3 className="text-white font-bold mb-2">Get Activated</h3>
              <p className="text-gray-400 text-sm">Start receiving leads within 24 hours</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-white underline"
            >
              Return to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-block bg-green-500/10 border border-green-500/30 px-4 py-1 rounded mb-6">
            <span className="text-green-400 text-sm font-mono">APPLICATION RECEIVED</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none">
            Welcome to<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              GarageLeadly
            </span>
          </h1>
          <p className="text-2xl text-gray-400 max-w-2xl">
            Book your strategy call below to discuss your territory, pricing, and start date.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Calendar - Takes up 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-900 border border-zinc-800 p-8">
              <h2 className="text-2xl font-bold text-white mb-8">Schedule Your Call</h2>

              {/* Date Selection */}
              <div className="mb-8">
                <label className="text-white font-mono text-sm mb-4 block">SELECT DATE</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableDates.map((date, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`p-4 text-left border transition-all ${
                        selectedDate?.toDateString() === date.toDateString()
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-black border-zinc-800 text-gray-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-xs font-mono opacity-70">
                        {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                      </div>
                      <div className="text-lg font-bold">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="mb-8">
                  <label className="text-white font-mono text-sm mb-4 block">SELECT TIME (CST)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 text-sm border transition-all ${
                          selectedTime === time
                            ? 'bg-blue-600 border-blue-500 text-white font-bold'
                            : 'bg-black border-zinc-800 text-gray-400 hover:border-zinc-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              <button
                onClick={handleBookCall}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-5 font-bold text-lg hover:from-blue-700 hover:to-green-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {selectedDate && selectedTime ? 'CONFIRM YOUR CALL' : 'SELECT DATE & TIME FIRST'}
              </button>
            </div>
          </div>

          {/* Sidebar - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* What We'll Cover */}
            <div className="bg-zinc-900 border border-zinc-800 p-8">
              <h3 className="text-white font-bold text-lg mb-6">On This Call</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <div className="text-white font-bold mb-1">Territory Confirmation</div>
                  <div className="text-gray-400 text-sm">Verify your county is available and discuss competition</div>
                </div>
                <div className="border-l-2 border-purple-500 pl-4">
                  <div className="text-white font-bold mb-1">Lead Volume Discussion</div>
                  <div className="text-gray-400 text-sm">Set your daily lead cap and budget expectations</div>
                </div>
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="text-white font-bold mb-1">Platform Walkthrough</div>
                  <div className="text-gray-400 text-sm">See the dashboard, CRM, and SMS notifications</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-blue-600/10 to-green-600/10 border border-blue-500/30 p-8">
              <h3 className="text-white font-bold text-lg mb-6">Network Performance</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-black text-white mb-1">68%</div>
                  <div className="text-gray-400 text-sm">Average Close Rate</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-white mb-1">4.2x</div>
                  <div className="text-gray-400 text-sm">Average ROI</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-white mb-1">30s</div>
                  <div className="text-gray-400 text-sm">Lead Delivery Time</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-white mb-1">100%</div>
                  <div className="text-gray-400 text-sm">Exclusive Leads</div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 text-center">
              <p className="text-gray-400 text-sm mb-1">Questions before the call?</p>
              <p className="text-white font-bold">Contact us anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
