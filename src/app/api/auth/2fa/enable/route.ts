import { NextRequest } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { requireAuthUser } from '@/lib/server-auth';
import { verify2FAToken, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const { token } = await request.json();

    if (!token) {
      return createErrorResponse('2FA token is required');
    }

    const prisma = await getPrisma();

    // Get user's 2FA secret
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { twoFactorSecret: true, is2faEnabled: true },
    });

    if (!userData?.twoFactorSecret) {
      return createErrorResponse('2FA not set up for this user');
    }

    if (userData.is2faEnabled) {
      return createErrorResponse('2FA is already enabled');
    }

    // Verify the token
    const isValid = verify2FAToken(userData.twoFactorSecret, token);
    
    if (!isValid) {
      return createErrorResponse('Invalid 2FA token', 401);
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: { is2faEnabled: true },
    });

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error('2FA enable error:', error);
    return createErrorResponse('Failed to enable 2FA', 500);
  }
}
