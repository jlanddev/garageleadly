import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  try {
    const { to, message, email } = await request.json();

    // Send email notification via SendGrid
    if (email) {
      await sgMail.send({
        to: email,
        from: 'leads@garageleadly.com',
        subject: 'New Lead - GarageLeadly',
        text: message,
        html: message.replace(/\n/g, '<br>')
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SendGrid error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
