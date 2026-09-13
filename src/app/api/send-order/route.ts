import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { name, email, role, message, htmlContent, plainContent, cartCount } = await request.json();

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.ORDER_RECIPIENT_EMAIL || 'titanssuperior@gmail.com';
    const fromEmail = process.env.ORDER_SENDER_EMAIL || 'PokeMart Orders <onboarding@resend.dev>';

    // If Resend API Key is set in environment, send real email directly via Resend
    if (apiKey) {
      const resend = new Resend(apiKey);

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        replyTo: email && email.includes('@') ? email : undefined,
        subject: `[Poké Mart Order] Skills Requisition from ${name || 'Prospective Collaborator'} (${cartCount || 0} Skills)`,
        html: htmlContent,
        text: plainContent,
      });

      if (error) {
        console.error('Resend API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, mode: 'api', id: data?.id });
    }

    // If no API key configured yet, return fallback signal so client seamlessly falls back
    return NextResponse.json({
      success: true,
      mode: 'unconfigured_fallback',
      message: 'RESEND_API_KEY not configured. Falling back to email client.'
    });
  } catch (err: unknown) {
    console.error('Server error sending order email:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
