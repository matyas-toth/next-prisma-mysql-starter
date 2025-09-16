import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  
  // Check if required environment variables are set
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error('GOOGLE_CLIENT_ID is not set');
    return redirect('/login?error=Google OAuth not configured');
  }
  
  // Store return URL in session or pass as state
  const state = Buffer.from(JSON.stringify({ returnUrl })).toString('base64');
  
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  
  console.log('Google OAuth redirect:', {
    baseUrl,
    redirectUri,
    clientId: process.env.GOOGLE_CLIENT_ID,
    returnUrl,
  });
  
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('state', state);
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');
  
  return redirect(googleAuthUrl.toString());
}
