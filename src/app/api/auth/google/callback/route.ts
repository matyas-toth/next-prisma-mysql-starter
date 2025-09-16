import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/prisma';
import { generateToken, sanitizeUser } from '@/lib/auth';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google/callback`
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return redirect(`/login?error=${encodeURIComponent('Google authentication was cancelled')}`);
  }

  if (!code) {
    return redirect('/login?error=No authorization code received');
  }

  let user;
  let token;

  try {
    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info from Google
    const response = await client.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    });

    const { email, name, picture, id: googleId } = response.data as any;

    if (!email) {
      return redirect('/login?error=No email received from Google');
    }

    // Check if user already exists
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { googleId },
        ],
      },
    });

    if (user) {
      // Update user with Google info if they don't have it
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            avatar: picture,
            emailVerified: true,
            emailVerifiedAt: new Date(),
            lastLoginAt: new Date(),
          },
        });
      } else {
        // Update last login
        user = await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
      }
    } else {
      // Create new user from Google account
      const username = `google_${googleId}`;
      
      user = await prisma.user.create({
        data: {
          email,
          username,
          fullName: name,
          googleId,
          avatar: picture,
          emailVerified: true,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date(),
        },
      });
    }

    // Generate JWT token
    token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      is2faEnabled: user.is2faEnabled,
    });

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: searchParams.get('code'),
      state: searchParams.get('state'),
      error: searchParams.get('error'),
    });
    return redirect('/login?error=Google authentication failed');
  }

  // Parse return URL from state
  let returnUrl = '/dashboard';
  if (state) {
    try {
      const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      returnUrl = stateData.returnUrl || '/dashboard';
    } catch (e) {
      // Use default return URL if state parsing fails
    }
  }

  // Redirect to frontend callback page with token
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const frontendUrl = new URL('/auth/google/callback', baseUrl);
  frontendUrl.searchParams.set('token', token);
  frontendUrl.searchParams.set('google_auth', 'true');
  frontendUrl.searchParams.set('returnUrl', returnUrl);
  
  return redirect(frontendUrl.toString());
}
