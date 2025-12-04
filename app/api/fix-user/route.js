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

  // Get auth user
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const authUser = authUsers?.users?.find(u => u.email === email);

  if (!authUser) {
    return NextResponse.json({ error: 'Auth user not found' });
  }

  // Check if contractor exists
  const { data: existing } = await supabase
    .from('contractors')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ message: 'Contractor already exists', contractor: existing });
  }

  // Create contractor record
  const { data: contractor, error } = await supabase
    .from('contractors')
    .insert([{
      id: authUser.id,
      email: email,
      name: 'Jordan',
      company_name: 'Test Company',
      phone: '555-123-4567',
      counties: ['Harris'],
      status: 'active',
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message, details: error });
  }

  return NextResponse.json({ message: 'Contractor created', contractor });
}
