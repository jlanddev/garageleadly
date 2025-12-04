import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST() {
  const results = [];

  // Add counties column to campaigns if not exists
  try {
    await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS counties TEXT[] DEFAULT ARRAY[]::TEXT[]`
    });
    results.push('Added counties to campaigns');
  } catch (e) {
    // Try direct approach
    const { error } = await supabase.from('campaigns').select('counties').limit(1);
    if (error?.message?.includes('does not exist')) {
      results.push('Need to add counties column manually in Supabase dashboard');
    } else {
      results.push('Counties column already exists');
    }
  }

  // Add campaign_id to leads if not exists
  try {
    const { error } = await supabase.from('leads').select('campaign_id').limit(1);
    if (error?.message?.includes('does not exist')) {
      results.push('Need to add campaign_id to leads table manually');
    } else {
      results.push('campaign_id column exists in leads');
    }
  } catch (e) {
    results.push('Error checking leads: ' + e.message);
  }

  return NextResponse.json({ results });
}
