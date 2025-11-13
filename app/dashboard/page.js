'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, getLeads } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    // Fetch real leads from database
    const fetchLeads = async () => {
      const userLeads = await getLeads(currentUser.id);
      setLeads(userLeads || []);
    };

    fetchLeads();
  }, []);

  const handleLogout = () => {
    auth.logout();
    router.push('/');
  };

  const updateLeadStatus = (leadId, newStatus, jobValue = null) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status: newStatus,
          job_value: jobValue ? jobValue * 100 : lead.job_value,
        };
      }
      return lead;
    }));
  };

  // Calculate stats
  const totalLeads = leads.length;
  const totalSpent = leads.reduce((sum, lead) => sum + (lead.price_charged || 0), 0) / 100;
  const completedLeads = leads.filter(lead => lead.status === 'completed');
  const totalRevenue = completedLeads.reduce((sum, lead) => sum + (lead.job_value || 0), 0) / 100;
  const closeRate = totalLeads > 0 ? ((completedLeads.length / totalLeads) * 100).toFixed(1) : 0;
  const avgLeadValue = completedLeads.length > 0 ? (totalRevenue / completedLeads.length).toFixed(0) : 0;
  const roi = totalSpent > 0 ? (((totalRevenue / totalSpent - 1) * 100).toFixed(0)) : 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">GarageLeadly</div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">{user.companyName}</div>
                <div className="text-xs text-gray-500">{user.county}</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 font-medium ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-4 border-b-2 font-medium ${
                activeTab === 'leads'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Leads CRM
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 border-b-2 font-medium ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Total Leads</div>
                <div className="text-3xl font-bold text-gray-900">{totalLeads}</div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Total Spent</div>
                <div className="text-3xl font-bold text-gray-900">
                  ${totalSpent.toLocaleString()}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                <div className="text-3xl font-bold text-green-600">
                  ${totalRevenue.toLocaleString()}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Close Rate</div>
                <div className="text-3xl font-bold text-blue-600">{closeRate}%</div>
              </div>
            </div>

            {/* ROI Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg mb-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-blue-100 mb-2">Return on Investment</div>
                  <div className="text-4xl font-bold">{roi}%</div>
                  <div className="text-sm text-blue-100 mt-2">
                    ${totalRevenue.toLocaleString()} revenue / ${totalSpent.toLocaleString()} spent
                  </div>
                </div>

                <div>
                  <div className="text-blue-100 mb-2">Average Job Value</div>
                  <div className="text-4xl font-bold">${avgLeadValue}</div>
                  <div className="text-sm text-blue-100 mt-2">Per closed lead</div>
                </div>

                <div>
                  <div className="text-blue-100 mb-2">Daily Budget</div>
                  <div className="text-4xl font-bold">${user.dailyBudget || 200}</div>
                  <div className="text-sm text-blue-100 mt-2">
                    Spent today: ${Math.floor(totalSpent / 7)}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Leads</h3>

              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-600">{lead.phone}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${(lead.price_charged / 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {lead.address}, {lead.zip}
                    </div>
                    <div className="text-sm text-gray-700 mb-3">
                      {lead.issue_description}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        lead.status === 'completed' ? 'bg-green-100 text-green-700' :
                        lead.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'called' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {lead.status.toUpperCase()}
                      </span>
                      {lead.job_value && (
                        <span className="text-sm text-green-600 font-medium">
                          Job Value: ${(lead.job_value / 100).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Lead CRM</h3>
              <p className="text-sm text-gray-600 mt-1">Track and manage all your leads</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Issue</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Cost</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Job Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-600">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        {lead.issue_description?.slice(0, 60)}...
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${(lead.price_charged / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="new">New</option>
                          <option value="called">Called</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {lead.status === 'completed' ? (
                          <input
                            type="number"
                            placeholder="Job value"
                            defaultValue={lead.job_value ? lead.job_value / 100 : ''}
                            onBlur={(e) => {
                              const value = parseFloat(e.target.value);
                              if (value > 0) {
                                updateLeadStatus(lead.id, 'completed', value);
                              }
                            }}
                            className="w-24 text-sm border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Territory & Budget</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
                  <div className="text-gray-900">{user.county}</div>
                  <p className="text-sm text-gray-500 mt-1">Contact support to change your territory</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Budget: ${user.dailyBudget || 200}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="50"
                    value={user.dailyBudget || 200}
                    onChange={(e) => {
                      const updatedUser = { ...user, dailyBudget: parseInt(e.target.value) };
                      setUser(updatedUser);
                      localStorage.setItem('garageleadly_current_user', JSON.stringify(updatedUser));
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>$50</span>
                    <span>$500</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Account Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <div className="text-gray-900">{user.companyName}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="text-gray-900">{user.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="text-gray-900">{user.phone}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membership Status</label>
                  <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
