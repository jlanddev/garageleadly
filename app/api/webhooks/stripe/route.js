import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Get the signup from contractor_signups table
    const { data: signup, error: signupError } = await supabase
      .from('contractor_signups')
      .select('*')
      .eq('email', session.customer_email)
      .single();

    if (signupError || !signup) {
      console.error('Could not find signup:', signupError);
      return NextResponse.json({ error: 'Signup not found' }, { status: 404 });
    }

    // Create contractor account
    const { error: contractorError } = await supabase
      .from('contractors')
      .insert([{
        email: signup.email,
        phone: signup.phone,
        name: signup.contact_name,
        company_name: signup.company_name,
        counties: [signup.county],
        daily_lead_cap: 5,
        job_types: ['residential', 'commercial'],
        status: 'active',
        membership_tier: 'basic',
        price_per_lead: 25,
      }]);

    if (contractorError) {
      console.error('Error creating contractor:', contractorError);
      return NextResponse.json({ error: 'Failed to create contractor' }, { status: 500 });
    }

    // Update signup status to paid
    await supabase
      .from('contractor_signups')
      .update({
        status: 'paid',
        stripe_session_id: session.id,
        paid_at: new Date().toISOString()
      })
      .eq('id', signup.id);

    // Create transaction record
    await supabase
      .from('transactions')
      .insert([{
        contractor_id: signup.id,
        type: 'membership_fee',
        amount: 1200,
        status: 'completed',
        payment_method: 'stripe',
        stripe_charge_id: session.payment_intent,
        description: 'Annual territory membership - ' + signup.county,
      }]);

    console.log('✅ Contractor activated:', signup.email);
  }

  return NextResponse.json({ received: true });
}
