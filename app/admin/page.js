'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSignups();
  }, [filter]);

  const fetchSignups = async () => {
    setLoading(true);
    let query = supabase
      .from('contractor_signups')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching signups:', error);
    } else {
      setSignups(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('contractor_signups')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    } else {
      fetchSignups();
    }
  };

  const addNote = async (id) => {
    const note = prompt('Add a note:');
    if (!note) return;

    const { error } = await supabase
      .from('contractor_signups')
      .update({ notes: note })
      .eq('id', id);

    if (error) {
      console.error('Error adding note:', error);
      alert('Error adding note');
    } else {
      fetchSignups();
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-purple-100 text-purple-800',
      qualified: 'bg-green-100 text-green-800',
      closed: 'bg-green-600 text-white',
      lost: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    total: signups.length,
    new: signups.filter(s => s.status === 'new').length,
    scheduled: signups.filter(s => s.status === 'scheduled').length,
    closed: signups.filter(s => s.status === 'closed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GarageLeadly Admin</h1>
              <p className="text-gray-600">Manage contractor signups and sales pipeline</p>
            </div>
            <Link
              href="/"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Site
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Signups</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
              <div className="text-sm text-gray-600">New Leads</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-purple-600">{stats.scheduled}</div>
              <div className="text-sm text-gray-600">Calls Scheduled</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-green-600">{stats.closed}</div>
              <div className="text-sm text-gray-600">Closed Deals</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {['all', 'new', 'contacted', 'scheduled', 'qualified', 'closed', 'lost'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Signups Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : signups.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No signups yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">County</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Leads</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {signups.map((signup) => (
                    <tr key={signup.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(signup.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{signup.company_name}</div>
                        <div className="text-sm text-gray-500">{signup.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {signup.contact_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a href={`tel:${signup.phone}`} className="text-blue-600 hover:text-blue-800">
                          {signup.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {signup.county}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {signup.current_leads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={signup.status}
                          onChange={(e) => updateStatus(signup.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(signup.status)}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed">Closed</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => addNote(signup.id)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          {signup.notes ? '📝 Edit Note' : '+ Add Note'}
                        </button>
                        {signup.notes && (
                          <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={signup.notes}>
                            {signup.notes}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
