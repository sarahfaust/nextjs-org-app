import { serialize } from 'cookie';

export function createTokenCookie(token: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  // Save the token in a cookie in the user's browser
  // (cookies get sent automatically to the server every time
  // a user makes a request)
  const maxAge = 60 * 60 * 24; // 2 hours

  return serialize('sessionToken', token, {
    maxAge: maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    // Important for security
    httpOnly: true,
    // Important for security
    // Set secure cookies on production (eg. Heroku)
    secure: isProduction,
    path: '/',
    // Be explicit about new default behavior
    // in browsers
    // https://web.dev/samesite-cookies-explained/
    sameSite: 'lax',
  });
}

// write update function for cookie in order to update
// either automatically with some sort of ping to keep
// session open while window is open, or to update on
// action to keep session open while user is active
