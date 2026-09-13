import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { name, email, role, message, htmlContent, plainContent, cartCount } = await request.json();

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.ORDER_RECIPIENT_EMAIL || 'aritrosaha2025@gmail.com';
    const fromEmail = process.env.ORDER_SENDER_EMAIL || 'PokeMart Orders <onboarding@resend.dev>';

    // If Resend API Key is set in environment, send real email directly via Resend
    if (apiKey) {
      const resend = new Resend(apiKey);
      const cleanCustomerEmail = typeof email === 'string' && email.includes('@') ? email.trim() : null;

      // 1. Primary dispatch to Aritro's inbox
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        replyTo: cleanCustomerEmail || undefined,
        subject: `[Poké Mart Order] Skills Requisition from ${name || 'Prospective Collaborator'} (${cartCount || 0} Skills)`,
        html: htmlContent,
        text: plainContent,
      });

      if (error) {
        console.error('Resend API Error sending to owner:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      // 2. Also send an immediate customer receipt copy to sender's email
      let senderCopySent = false;
      let senderCopyNotice: string | null = null;

      if (cleanCustomerEmail) {
        try {
          const senderRes = await resend.emails.send({
            from: fromEmail,
            to: [cleanCustomerEmail],
            replyTo: toEmail,
            subject: `[Copy / Receipt] Your Poké Mart Requisition to Aritro Saha (${cartCount || 0} Skills)`,
            html: htmlContent,
            text: plainContent,
          });

          if (senderRes.data?.id) {
            senderCopySent = true;
          } else if (senderRes.error) {
            // In free testing domains (onboarding@resend.dev), Resend restricts sending to unverified emails
            console.warn('Sender copy notification error (e.g. Resend free domain restriction):', senderRes.error);
            senderCopyNotice = senderRes.error.message;
          }
        } catch (copyErr) {
          console.warn('Could not send copy to customer email:', copyErr);
          senderCopyNotice = copyErr instanceof Error ? copyErr.message : 'Notice delivery failed';
        }
      }

      return NextResponse.json({
        success: true,
        mode: 'api',
        id: data?.id,
        senderCopySent,
        senderCopyNotice,
        customerEmail: cleanCustomerEmail,
      });
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
