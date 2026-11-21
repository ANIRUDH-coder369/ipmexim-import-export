import { NextResponse } from 'next/server';
import { sendAdminQuotationAlert, sendCustomerQuotationConfirmation, QuotationEmailPayload } from '@/utils/emailService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = (body.fullName || body.name || '').trim();
    const corporateEmail = (body.corporateEmail || body.businessEmail || body.email || '').toLowerCase().trim();
    const company = (body.company || body.companyName || '').trim();
    const phoneWhatsApp = (body.phoneWhatsApp || body.phone || '').trim();
    const destinationCountry = (body.destinationCountry || body.country || '').trim();
    const destinationPort = (body.destinationPort || '').trim();
    const productOfInterest = (body.productOfInterest || body.productName || body.productLine || 'General Export Sourcing').trim();
    const estimatedQuantity = String(body.estimatedQuantity || body.quantity || 'Standard Order').trim();
    const unit = (body.unit || '').trim();
    const preferredIncoterm = (body.preferredIncoterm || 'FOB / CIF').trim();
    const technicalSpecifications = (body.technicalSpecifications || body.message || '').trim();

    if (!fullName || !corporateEmail) {
      return NextResponse.json({
        success: false,
        message: 'Full Name and Corporate Email are required to submit an export inquiry.'
      }, { status: 400 });
    }

    const quotationId = `IPM-${Date.now().toString().slice(-6)}`;

    const quotationPayload: QuotationEmailPayload = {
      id: quotationId,
      fullName,
      corporateEmail,
      company,
      phoneWhatsApp,
      destinationCountry,
      destinationPort,
      productOfInterest,
      estimatedQuantity,
      unit,
      preferredIncoterm,
      technicalSpecifications,
      createdAt: new Date().toISOString(),
    };

    // Dispatch both emails in parallel:
    // 1. One email to admin (ipmexim@gmail.com) with customer details + logo
    // 2. One email to customer with confirmation + submitted info + logo
    let emailStatus = { adminSent: false, customerSent: false };
    try {
      const [adminResult, customerResult] = await Promise.allSettled([
        sendAdminQuotationAlert(quotationPayload),
        sendCustomerQuotationConfirmation(quotationPayload),
      ]);

      emailStatus = {
        adminSent: adminResult.status === 'fulfilled',
        customerSent: customerResult.status === 'fulfilled',
      };

      if (adminResult.status === 'rejected') {
        console.error('[Admin Email Error]', adminResult.reason);
      }
      if (customerResult.status === 'rejected') {
        console.error('[Customer Email Error]', customerResult.reason);
      }
    } catch (emailErr) {
      console.error('[Email Dispatch Error]', emailErr);
    }

    // Optional forwarding to external backend if configured
    if (process.env.BACKEND_API_URL) {
      try {
        fetch(`${process.env.BACKEND_API_URL}/enquiries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).catch((err) => console.warn('[Forwarding to Backend]', err.message));
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      message: `Your sourcing enquiry has been submitted successfully. A confirmation email has been dispatched to ${corporateEmail}, and our trade desk will respond within 24 business hours.`,
      enquiryId: quotationId,
      emailStatus,
      data: {
        id: quotationId,
        fullName,
        corporateEmail,
        destinationCountry,
        productOfInterest,
        estimatedQuantity,
        createdAt: quotationPayload.createdAt,
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred while submitting your quotation enquiry.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [],
    message: 'Enquiries retrieved successfully'
  });
}
