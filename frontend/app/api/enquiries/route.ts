import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = (body.fullName || body.name || '').trim();
    const corporateEmail = (body.corporateEmail || body.businessEmail || body.email || '').toLowerCase().trim();
    const destinationCountry = (body.destinationCountry || body.country || '').trim();
    const productOfInterest = (body.productOfInterest || body.productName || body.productLine || 'General Export Sourcing').trim();
    const estimatedQuantity = String(body.estimatedQuantity || body.quantity || 'Standard Order').trim();

    if (!fullName || !corporateEmail) {
      return NextResponse.json({
        success: false,
        message: 'Full Name and Corporate Email are required to submit an export inquiry.'
      }, { status: 400 });
    }

    const quotationId = `IPM-${Date.now().toString().slice(-6)}`;

    // If an external backend is configured via environment variable, forward the payload asynchronously
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
      message: 'Your sourcing enquiry has been submitted successfully. Our trade desk will respond within 24 business hours.',
      enquiryId: quotationId,
      data: {
        id: quotationId,
        fullName,
        corporateEmail,
        destinationCountry,
        productOfInterest,
        estimatedQuantity,
        createdAt: new Date().toISOString()
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
