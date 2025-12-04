import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const { data: contractors, error } = await supabase
    .from('contractors')
    .select('id, email, name, company_name, counties, job_types, status, daily_lead_cap');

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  // Get daily counts
  const today = new Date().toISOString().split('T')[0];
  const { data: counts } = await supabase
    .from('daily_lead_counts')
    .select('contractor_id, lead_count')
    .eq('date', today);

  const countsMap = {};
  counts?.forEach(c => countsMap[c.contractor_id] = c.lead_count);

  const enriched = contractors.map(c => ({
    ...c,
    leads_today: countsMap[c.id] || 0
  }));

  return NextResponse.json({ contractors: enriched });
}
