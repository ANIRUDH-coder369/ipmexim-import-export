import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    app: 'IPM Exim Global',
    platform: 'Vercel / Production',
    timestamp: new Date().toISOString()
  });
}
