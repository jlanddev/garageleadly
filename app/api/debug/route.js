import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' });
  }

  // Check auth users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  const authUser = authUsers?.users?.find(u => u.email === email);

  // Check contractor
  const { data: contractor, error: contractorError } = await supabase
    .from('contractors')
    .select('*')
    .eq('email', email)
    .single();

  return NextResponse.json({
    email,
    authUserExists: !!authUser,
    authUserId: authUser?.id,
    authError: authError?.message,
    contractorExists: !!contractor,
    contractor: contractor,
    contractorError: contractorError?.message,
  });
}
