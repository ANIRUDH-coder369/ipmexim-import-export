import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: 'Authorization token required' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    admin: {
      name: 'Trade Desk Administrator',
      email: 'ipmexim@gmail.com',
      role: 'superadmin',
    },
  });
}
