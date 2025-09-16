import { NextRequest } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/prisma';
import { generateToken, sanitizeUser, createErrorResponse, createSuccessResponse } from '@/lib/auth';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return createErrorResponse('ID token is required');
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return createErrorResponse('Invalid Google token');
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return createErrorResponse('Email is required from Google account');
    }

    // Check if user already exists
    let user = await prisma.user.findFirst({
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
      // Use Google ID as username to avoid conflicts
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
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      is2faEnabled: user.is2faEnabled,
    });

    return createSuccessResponse({
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return createErrorResponse('Google authentication failed', 500);
  }
}
