'use client';

import { useState, useEffect } from 'react';

const COUNTIES = ['Harris', 'Montgomery', 'Fort Bend', 'Galveston', 'Brazoria', 'Waller', 'Liberty', 'Chambers'];
const JOB_TYPES = ['residential', 'commercial'];

export default function CampaignManager({ contractorId }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    counties: [],
    job_types: [],
    daily_cap: 5
  });

  useEffect(() => {
    if (contractorId) loadCampaigns();
  }, [contractorId]);

  const loadCampaigns = async () => {
    const res = await fetch(`/api/campaigns?contractor_id=${contractorId}`);
    const data = await res.json();
    setCampaigns(data.campaigns || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      contractor_id: contractorId
    };

    if (editingCampaign) {
      payload.id = editingCampaign.id;
      await fetch('/api/campaigns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    setShowForm(false);
    setEditingCampaign(null);
    setFormData({ name: '', counties: [], job_types: [], daily_cap: 5 });
    loadCampaigns();
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      counties: campaign.counties || [],
      job_types: campaign.job_types || [],
      daily_cap: campaign.daily_cap || 5
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this campaign?')) return;
    await fetch(`/api/campaigns?id=${id}`, { method: 'DELETE' });
    loadCampaigns();
  };

  const handleToggleStatus = async (campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    await fetch('/api/campaigns', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: campaign.id, status: newStatus })
    });
    loadCampaigns();
  };

  const toggleCounty = (county) => {
    setFormData(prev => ({
      ...prev,
      counties: prev.counties.includes(county)
        ? prev.counties.filter(c => c !== county)
        : [...prev.counties, county]
    }));
  };

  const toggleJobType = (type) => {
    setFormData(prev => ({
      ...prev,
      job_types: prev.job_types.includes(type)
        ? prev.job_types.filter(t => t !== type)
        : [...prev.job_types, type]
    }));
  };

  if (loading) return <div className="text-gray-400">Loading campaigns...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Your Campaigns</h2>
        <button
          onClick={() => { setShowForm(true); setEditingCampaign(null); setFormData({ name: '', counties: [], job_types: [], daily_cap: 5 }); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          + New Campaign
        </button>
      </div>

      {/* Campaign List */}
      {campaigns.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No campaigns yet. Create one to start receiving leads.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      campaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-400 space-y-1">
                    <p><span className="text-gray-500">Counties:</span> {campaign.counties?.join(', ') || 'None'}</p>
                    <p><span className="text-gray-500">Job Types:</span> {campaign.job_types?.join(', ') || 'None'}</p>
                    <p><span className="text-gray-500">Daily Cap:</span> {campaign.daily_cap} leads</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{campaign.leads_today || 0}</div>
                  <div className="text-xs text-gray-500">leads today</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleToggleStatus(campaign)}
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    campaign.status === 'active'
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {campaign.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(campaign)}
                  className="px-3 py-1 rounded text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="px-3 py-1 rounded text-sm font-semibold bg-red-600/20 hover:bg-red-600/40 text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingCampaign ? 'Edit Campaign' : 'New Campaign'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  placeholder="e.g. Houston Residential"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Counties</label>
                <div className="flex flex-wrap gap-2">
                  {COUNTIES.map(county => (
                    <button
                      key={county}
                      type="button"
                      onClick={() => toggleCounty(county)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                        formData.counties.includes(county)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                      }`}
                    >
                      {county}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Job Types</label>
                <div className="flex gap-3">
                  {JOB_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleJobType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                        formData.job_types.includes(type)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Daily Lead Cap</label>
                <input
                  type="number"
                  value={formData.daily_cap}
                  onChange={(e) => setFormData({ ...formData, daily_cap: parseInt(e.target.value) || 5 })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  min="1"
                  max="50"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingCampaign(null); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.name || !formData.counties.length || !formData.job_types.length}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg font-semibold"
                >
                  {editingCampaign ? 'Save Changes' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
