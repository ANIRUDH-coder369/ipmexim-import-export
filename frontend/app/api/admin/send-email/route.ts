import { NextResponse } from 'next/server';
import { sendAdminDirectResponse } from '@/utils/emailService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const recipientEmail = (
      body.recipientEmail ||
      body.customerEmail ||
      body.toEmail ||
      body.email ||
      ''
    ).toLowerCase().trim();

    const subject = (body.subject || '').trim();
    const message = (body.message || body.html || '').trim();
    const quotationId = body.quotationId ? String(body.quotationId).trim() : undefined;
    const adminName = (body.adminName || 'Trade Desk Administrator').trim();

    if (!recipientEmail) {
      return NextResponse.json(
        { success: false, message: 'Recipient email address is required.' },
        { status: 400 }
      );
    }

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Both subject and message content are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid recipient email address format.' },
        { status: 400 }
      );
    }

    const result = await sendAdminDirectResponse({
      to: recipientEmail,
      subject,
      message,
      adminName,
      quotationId,
    });

    return NextResponse.json({
      success: true,
      message: `Commercial email successfully dispatched to ${recipientEmail}`,
      messageId: (result as any)?.messageId,
      recipient: recipientEmail,
      quotationId,
      status: body.newStatus || 'contacted',
    });
  } catch (error: any) {
    console.error('[Admin Send-Email Route Error]', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to dispatch email communication to customer.',
      },
      { status: 500 }
    );
  }
}
