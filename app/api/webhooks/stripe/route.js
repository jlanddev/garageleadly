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
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  console.log('📨 Stripe webhook received:', event.type);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;

    case 'setup_intent.succeeded':
      await handleSetupIntentSucceeded(event.data.object);
      break;

    case 'payment_method.attached':
      await handlePaymentMethodAttached(event.data.object);
      break;

    case 'charge.failed':
      await handleChargeFailed(event.data.object);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session) {
  console.log('✅ Checkout completed:', session.id);

  if (session.mode === 'setup') {
    // Payment method setup completed
    const contractorId = session.metadata?.contractor_id;

    if (!contractorId) {
      console.error('No contractor_id in session metadata');
      return;
    }

    // Get the setup intent and payment method
    const setupIntent = await stripe.setupIntents.retrieve(session.setup_intent);
    const paymentMethodId = setupIntent.payment_method;

    if (paymentMethodId) {
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

      // Save payment method to database
      await supabase.from('payment_methods').insert([{
        contractor_id: contractorId,
        stripe_payment_method_id: paymentMethodId,
        is_default: true,
        last_four: paymentMethod.card?.last4,
        card_type: paymentMethod.card?.brand,
      }]);

      console.log(`✅ Payment method saved for contractor ${contractorId}`);
    }
  }
}

async function handleSetupIntentSucceeded(setupIntent) {
  console.log('✅ Setup intent succeeded:', setupIntent.id);
}

async function handlePaymentMethodAttached(paymentMethod) {
  console.log('💳 Payment method attached:', paymentMethod.id);

  // Payment method is attached to customer
  const customerId = paymentMethod.customer;

  if (!customerId) return;

  // Find contractor by stripe_customer_id
  const { data: contractor } = await supabase
    .from('contractors')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!contractor) {
    console.error('No contractor found for customer:', customerId);
    return;
  }

  // Save payment method if not already saved
  const { data: existing } = await supabase
    .from('payment_methods')
    .select('id')
    .eq('stripe_payment_method_id', paymentMethod.id)
    .single();

  if (!existing) {
    await supabase.from('payment_methods').insert([{
      contractor_id: contractor.id,
      stripe_payment_method_id: paymentMethod.id,
      is_default: true,
      last_four: paymentMethod.card?.last4,
      card_type: paymentMethod.card?.brand,
    }]);
  }
}

async function handleChargeFailed(charge) {
  console.error('❌ Charge failed:', charge.id, charge.failure_message);

  // Record the failed charge
  const contractorId = charge.metadata?.contractor_id;
  const leadId = charge.metadata?.lead_id;

  if (contractorId && leadId) {
    await supabase.from('lead_charges').insert([{
      contractor_id: contractorId,
      lead_id: leadId,
      stripe_charge_id: charge.id,
      amount_cents: charge.amount,
      status: 'failed',
      failure_reason: charge.failure_message,
    }]);
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('❌ Subscription deleted:', subscription.id);

  // Deactivate contractor
  const customerId = subscription.customer;

  await supabase
    .from('contractors')
    .update({ is_active: false })
    .eq('stripe_customer_id', customerId);
}
