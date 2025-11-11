'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [territory, setTerritory] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Stats
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalSpent: 0,
    totalRevenue: 0,
    closeRate: 0,
    avgLeadValue: 0,
  });

  useEffect(() => {
    checkUser();
    loadDashboardData();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
  };

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load member data
      const { data: memberData } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();
      setMember(memberData);

      // Load territory data
      const { data: territoryData } = await supabase
        .from('territories')
        .select('*')
        .eq('member_id', user.id)
        .single();
      setTerritory(territoryData);

      // Load leads
      const { data: leadsData } = await supabase
        .from('leads')
        .select(`
          *,
          lead_outcomes (*)
        `)
        .eq('delivered_to_member_id', user.id)
        .order('created_at', { ascending: false });
      setLeads(leadsData || []);

      // Calculate stats
      calculateStats(leadsData || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (leadsData) => {
    const totalLeads = leadsData.length;
    const totalSpent = leadsData.reduce((sum, lead) => sum + (lead.price_charged || 0), 0);

    const completedLeads = leadsData.filter(lead =>
      lead.lead_outcomes?.[0]?.status === 'completed'
    );
    const totalRevenue = completedLeads.reduce((sum, lead) =>
      sum + (lead.lead_outcomes?.[0]?.job_value || 0), 0
    );

    const closeRate = totalLeads > 0 ? (completedLeads.length / totalLeads) * 100 : 0;
    const avgLeadValue = completedLeads.length > 0 ? totalRevenue / completedLeads.length : 0;

    setStats({
      totalLeads,
      totalSpent: totalSpent / 100, // Convert cents to dollars
      totalRevenue: totalRevenue / 100,
      closeRate: closeRate.toFixed(1),
      avgLeadValue: avgLeadValue / 100,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const updateLeadStatus = async (leadId, status, jobValue = null) => {
    try {
      const { data, error } = await supabase
        .from('lead_outcomes')
        .upsert({
          lead_id: leadId,
          member_id: user.id,
          status,
          job_value: jobValue ? jobValue * 100 : null, // Convert to cents
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'lead_id'
        });

      if (error) throw error;

      // Reload data
      await loadDashboardData();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">Loading...</div>
          <div className="text-gray-600">Getting your dashboard ready</div>
        </div>
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
                <div className="text-sm text-gray-600">
                  {member?.company_name}
                </div>
                <div className="text-xs text-gray-500">{territory?.county}</div>
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
                <div className="text-3xl font-bold text-gray-900">{stats.totalLeads}</div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Total Spent</div>
                <div className="text-3xl font-bold text-gray-900">
                  ${stats.totalSpent.toLocaleString()}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                <div className="text-3xl font-bold text-green-600">
                  ${stats.totalRevenue.toLocaleString()}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Close Rate</div>
                <div className="text-3xl font-bold text-blue-600">{stats.closeRate}%</div>
              </div>
            </div>

            {/* ROI Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg mb-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-blue-100 mb-2">Return on Investment</div>
                  <div className="text-4xl font-bold">
                    {stats.totalSpent > 0
                      ? ((stats.totalRevenue / stats.totalSpent - 1) * 100).toFixed(0)
                      : 0}%
                  </div>
                  <div className="text-sm text-blue-100 mt-2">
                    ${stats.totalRevenue.toLocaleString()} revenue / ${stats.totalSpent.toLocaleString()} spent
                  </div>
                </div>

                <div>
                  <div className="text-blue-100 mb-2">Average Job Value</div>
                  <div className="text-4xl font-bold">
                    ${stats.avgLeadValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-100 mt-2">
                    Per closed lead
                  </div>
                </div>

                <div>
                  <div className="text-blue-100 mb-2">Daily Budget</div>
                  <div className="text-4xl font-bold">
                    ${territory?.daily_budget || 0}
                  </div>
                  <div className="text-sm text-blue-100 mt-2">
                    Spent today: ${territory?.spent_today || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Leads</h3>

              {leads.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-5xl mb-4">📞</div>
                  <div className="text-gray-600 mb-2">No leads yet</div>
                  <div className="text-sm text-gray-500">
                    Leads will appear here as they're delivered to your phone
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.slice(0, 5).map((lead) => {
                    const outcome = lead.lead_outcomes?.[0];
                    const status = outcome?.status || 'new';

                    return (
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
                            status === 'completed' ? 'bg-green-100 text-green-700' :
                            status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            status === 'called' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {status.toUpperCase()}
                          </span>
                          {outcome?.job_value && (
                            <span className="text-sm text-green-600 font-medium">
                              Job Value: ${(outcome.job_value / 100).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {leads.length > 5 && (
                <button
                  onClick={() => setActiveTab('leads')}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all {leads.length} leads →
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Lead CRM</h3>
              <p className="text-sm text-gray-600 mt-1">
                Track and manage all your leads
              </p>
            </div>

            {leads.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">📞</div>
                <div className="text-gray-600 mb-2">No leads yet</div>
                <div className="text-sm text-gray-500">
                  Leads will appear here as they're delivered
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Customer
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Issue
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Cost
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Job Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {leads.map((lead) => {
                      const outcome = lead.lead_outcomes?.[0];
                      const status = outcome?.status || 'new';

                      return (
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
                              value={status}
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
                            {status === 'completed' ? (
                              <input
                                type="number"
                                placeholder="Job value"
                                defaultValue={outcome?.job_value ? outcome.job_value / 100 : ''}
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Territory & Budget</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    County
                  </label>
                  <div className="text-gray-900">{territory?.county}</div>
                  <p className="text-sm text-gray-500 mt-1">
                    Contact support to change your territory
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Budget: ${territory?.daily_budget || 0}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="50"
                    value={territory?.daily_budget || 200}
                    onChange={async (e) => {
                      const newBudget = parseInt(e.target.value);
                      await supabase
                        .from('territories')
                        .update({ daily_budget: newBudget })
                        .eq('member_id', user.id);
                      await loadDashboardData();
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>$50</span>
                    <span>$500</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Budget changes take effect after 24 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Account Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <div className="text-gray-900">{member?.company_name}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="text-gray-900">{member?.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <div className="text-gray-900">{member?.phone}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Membership Status
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      member?.status === 'active' ? 'bg-green-100 text-green-700' :
                      member?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {member?.status?.toUpperCase()}
                    </span>
                    {member?.status === 'pending' && (
                      <span className="text-sm text-gray-600">
                        Complete payment to activate
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
