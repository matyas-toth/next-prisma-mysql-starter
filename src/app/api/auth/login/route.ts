import { NextRequest } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { verifyPassword, generateToken, sanitizeUser, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { emailOrUsername, password } = await request.json();

    // Validate required fields
    if (!emailOrUsername || !password) {
      return createErrorResponse('Email/username and password are required');
    }

    const prisma = await getPrisma();

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
    });

    if (!user) {
      return createErrorResponse('Invalid credentials', 401);
    }

    // Check if user has a password (not OAuth-only user)
    if (!user.passwordHash) {
      return createErrorResponse('Please use social login for this account', 401);
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return createErrorResponse('Invalid credentials', 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate token
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
    console.error('Login error:', error);
    return createErrorResponse('Login failed', 500);
  }
}
