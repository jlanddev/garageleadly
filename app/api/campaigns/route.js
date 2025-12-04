import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - List campaigns for a contractor
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const contractorId = searchParams.get('contractor_id');

  if (!contractorId) {
    return NextResponse.json({ error: 'contractor_id required' }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];

  // Get campaigns with today's lead count
  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('contractor_id', contractorId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get lead counts per campaign for today
  const { data: leads } = await supabase
    .from('leads')
    .select('campaign_id')
    .eq('contractor_id', contractorId)
    .gte('submitted_at', `${today}T00:00:00`)
    .lte('submitted_at', `${today}T23:59:59`);

  const leadCounts = {};
  leads?.forEach(l => {
    if (l.campaign_id) {
      leadCounts[l.campaign_id] = (leadCounts[l.campaign_id] || 0) + 1;
    }
  });

  const campaignsWithCounts = campaigns.map(c => ({
    ...c,
    leads_today: leadCounts[c.id] || 0
  }));

  return NextResponse.json({ campaigns: campaignsWithCounts });
}

// POST - Create a new campaign
export async function POST(request) {
  const body = await request.json();
  const { contractor_id, name, counties, job_types, daily_cap } = body;

  if (!contractor_id || !name || !counties?.length || !job_types?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('campaigns')
    .insert([{
      contractor_id,
      name,
      counties,
      job_types,
      daily_cap: daily_cap || 5,
      status: 'active'
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, campaign: data });
}

// PUT - Update a campaign
export async function PUT(request) {
  const body = await request.json();
  const { id, name, counties, job_types, daily_cap, status } = body;

  if (!id) {
    return NextResponse.json({ error: 'Campaign id required' }, { status: 400 });
  }

  const updates = {};
  if (name) updates.name = name;
  if (counties) updates.counties = counties;
  if (job_types) updates.job_types = job_types;
  if (daily_cap !== undefined) updates.daily_cap = daily_cap;
  if (status) updates.status = status;

  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, campaign: data });
}

// DELETE - Delete a campaign
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Campaign id required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
