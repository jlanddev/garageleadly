import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST() {
  // Clear in order: transactions -> leads -> daily_lead_counts -> campaigns -> contractors (except jordan)
  await supabase.from('transactions').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('leads').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('daily_lead_counts').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('campaigns').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('contractors').delete().neq('email', 'jordan@landreach.co');

  // Add test contractors
  const counties = ['Harris', 'Montgomery', 'Fort Bend', 'Galveston', 'Brazoria'];
  const contractors = [];

  for (const county of counties) {
    contractors.push(
      { email: `test1-${county.toLowerCase().replace(' ', '')}@test.com`, phone: '555-001-0001', name: `Test Pro 1`, company_name: `${county} Garage Doors`, counties: [county], daily_lead_cap: 3, job_types: ['residential'], status: 'active', daily_budget: 150 },
      { email: `test2-${county.toLowerCase().replace(' ', '')}@test.com`, phone: '555-002-0002', name: `Test Pro 2`, company_name: `${county} Door Masters`, counties: [county], daily_lead_cap: 5, job_types: ['residential', 'commercial'], status: 'active', daily_budget: 300 },
      { email: `test3-${county.toLowerCase().replace(' ', '')}@test.com`, phone: '555-003-0003', name: `Test Pro 3`, company_name: `${county} Premium`, counties: [county], daily_lead_cap: 10, job_types: ['residential', 'commercial'], status: 'active', daily_budget: 500 }
    );
  }

  const { data, error } = await supabase.from('contractors').insert(contractors).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: all } = await supabase.from('contractors').select('id, email, counties, daily_lead_cap, status');
  return NextResponse.json({ success: true, created: data.length, total: all.length, contractors: all });
}

export async function GET() {
  const { data } = await supabase.from('contractors').select('*');
  return NextResponse.json({ contractors: data });
}
