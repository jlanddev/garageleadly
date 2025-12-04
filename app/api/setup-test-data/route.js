import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST() {
  try {
    // Get Jordan's contractor ID to preserve
    const { data: jordan } = await supabase
      .from('contractors')
      .select('id')
      .eq('email', 'jordan@landreach.co')
      .single();

    const jordanId = jordan?.id;

    // Step 1: Delete transactions (references leads)
    const { error: txError } = await supabase.from('transactions').delete().gt('created_at', '2000-01-01');
    if (txError) console.log('TX delete error:', txError.message);

    // Step 2: Delete leads (references contractors)
    const { error: leadsError } = await supabase.from('leads').delete().gt('submitted_at', '2000-01-01');
    if (leadsError) console.log('Leads delete error:', leadsError.message);

    // Step 3: Delete daily_lead_counts
    const { error: countsError } = await supabase.from('daily_lead_counts').delete().gt('date', '2000-01-01');
    if (countsError) console.log('Counts delete error:', countsError.message);

    // Step 4: Delete campaigns
    const { error: campaignsError } = await supabase.from('campaigns').delete().gt('created_at', '2000-01-01');
    if (campaignsError) console.log('Campaigns delete error:', campaignsError.message);

    // Step 5: Delete payment_methods if exists
    try {
      await supabase.from('payment_methods').delete().gt('created_at', '2000-01-01');
    } catch (e) {
      // Table may not exist
    }

    // Step 6: Delete all contractors except jordan
    const { error: deleteError } = await supabase
      .from('contractors')
      .delete()
      .neq('email', 'jordan@landreach.co');

    if (deleteError) {
      return NextResponse.json({ error: 'Delete failed: ' + deleteError.message, jordanId }, { status: 500 });
    }

    // Counties to set up
    const counties = ['Harris', 'Montgomery', 'Fort Bend', 'Galveston', 'Brazoria'];

    const testContractors = [];

    for (const county of counties) {
      // Contractor 1: Standard residential, low cap
      testContractors.push({
        email: `test1-${county.toLowerCase().replace(' ', '')}@test.com`,
        phone: '555-001-0001',
        name: `Test Pro 1 - ${county}`,
        company_name: `${county} Garage Doors`,
        counties: [county],
        daily_lead_cap: 3,
        job_types: ['residential'],
        status: 'active',
        price_per_lead: 45,
        daily_budget: 150,
      });

      // Contractor 2: Residential + Commercial, medium cap
      testContractors.push({
        email: `test2-${county.toLowerCase().replace(' ', '')}@test.com`,
        phone: '555-002-0002',
        name: `Test Pro 2 - ${county}`,
        company_name: `${county} Door Masters`,
        counties: [county],
        daily_lead_cap: 5,
        job_types: ['residential', 'commercial'],
        status: 'active',
        price_per_lead: 55,
        daily_budget: 300,
      });

      // Contractor 3: High volume, all types
      testContractors.push({
        email: `test3-${county.toLowerCase().replace(' ', '')}@test.com`,
        phone: '555-003-0003',
        name: `Test Pro 3 - ${county}`,
        company_name: `${county} Premium Doors`,
        counties: [county],
        daily_lead_cap: 10,
        job_types: ['residential', 'commercial'],
        status: 'active',
        price_per_lead: 65,
        daily_budget: 500,
      });
    }

    // Insert all test contractors
    const { data: inserted, error: insertError } = await supabase
      .from('contractors')
      .insert(testContractors)
      .select();

    if (insertError) {
      return NextResponse.json({ error: 'Insert failed: ' + insertError.message }, { status: 500 });
    }

    // Get final contractor count
    const { data: allContractors } = await supabase
      .from('contractors')
      .select('id, email, name, counties, daily_lead_cap, job_types, status');

    return NextResponse.json({
      success: true,
      message: 'Test data setup complete',
      contractorsDeleted: 'all except jordan@landreach.co',
      contractorsCreated: inserted.length,
      totalContractors: allContractors.length,
      contractors: allContractors
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // List current contractors
  const { data: contractors } = await supabase
    .from('contractors')
    .select('id, email, name, company_name, counties, daily_lead_cap, job_types, status, daily_budget');

  const today = new Date().toISOString().split('T')[0];
  const { data: counts } = await supabase
    .from('daily_lead_counts')
    .select('contractor_id, lead_count')
    .eq('date', today);

  const countsMap = {};
  counts?.forEach(c => countsMap[c.contractor_id] = c.lead_count);

  const enriched = contractors?.map(c => ({
    ...c,
    leads_today: countsMap[c.id] || 0
  }));

  return NextResponse.json({ contractors: enriched });
}
