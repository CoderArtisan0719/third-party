import { NextResponse } from 'next/server';

export const middleware = (req: NextResponse) => {
  const token = req.cookies.get('auth-token');

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin/client'));
  }

  return NextResponse.next(); // Continue with the request if authenticated
};

// Define the paths to which this middleware applies
export const config = {
  matcher: [
    '/client',
    '/client/active',
    '/client/request/:id',
    '/vendor',
    '/vendor/active',
    '/vendor/request/:id',
    '/auth/settings',
  ],
};
