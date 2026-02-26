import { NextRequest, NextResponse } from 'next/server';

const EXCLUDED_IPS = (process.env.EXCLUDED_IPS ?? '')
  .split(',')
  .map((ip) => ip.trim())
  .filter(Boolean);

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (EXCLUDED_IPS.length === 0) return response;

  const forwarded = request.headers.get('x-forwarded-for');
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') ?? '';

  if (EXCLUDED_IPS.includes(clientIp)) {
    response.cookies.set('__exclude_tracking', '1', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
