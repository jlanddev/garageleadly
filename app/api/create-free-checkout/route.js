import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, company_name, phone, county, leads_per_day } = body;

    // Create Stripe Checkout Session for card setup (no charge)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'setup',
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?setup_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding-free?setup_canceled=true`,
      metadata: {
        contractor_name: name,
        company_name: company_name,
        phone: phone,
        county: county,
        leads_per_day: leads_per_day,
        free_account: 'true',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe setup error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
