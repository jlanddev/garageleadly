import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, company_name, phone, county, leads_per_day, password } = body;

    // Check env vars
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ error: 'Missing SUPABASE_URL' }, { status: 500 });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 });
    }

    // Create Supabase auth user
    let authData;
    try {
      const result = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (result.error) {
        return NextResponse.json({ error: `Supabase auth: ${result.error.message}` }, { status: 400 });
      }
      authData = result.data;
    } catch (supabaseErr) {
      return NextResponse.json({ error: `Supabase connection: ${supabaseErr.message}` }, { status: 500 });
    }

    // Create Stripe Checkout Session for card setup (no charge)
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'setup',
        customer_email: email,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/success?free=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding-free?setup_canceled=true`,
        metadata: {
          contractor_name: name,
          company_name: company_name,
          phone: phone,
          county: county,
          leads_per_day: leads_per_day,
          free_account: 'true',
          auth_user_id: authData.user.id,
        },
      });
    } catch (stripeErr) {
      return NextResponse.json({ error: `Stripe: ${stripeErr.message}` }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: `General: ${error.message}` },
      { status: 500 }
    );
  }
}
