import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@importexport.com').toLowerCase().trim();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const adminName = process.env.ADMIN_NAME || 'Super Admin';

    if (
      email &&
      password &&
      email.toLowerCase().trim() === expectedEmail &&
      password === expectedPassword
    ) {
      const token = `ipm-session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const response = NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
        token,
        admin: {
          name: adminName,
          email: expectedEmail,
          role: 'superadmin'
        }
      });

      // Set cookie for Next.js middleware protection
      response.cookies.set({
        name: 'adminToken',
        value: token,
        path: '/',
        maxAge: 86400,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });

      return response;
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid administrative email or security key.'
    }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Authentication error.'
    }, { status: 500 });
  }
}
