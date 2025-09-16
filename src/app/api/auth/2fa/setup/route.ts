import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthUser } from '@/lib/server-auth';
import { generate2FASecret, generate2FAQRCode, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);

    // Generate new 2FA secret
    const secret = generate2FASecret();
    const qrCode = await generate2FAQRCode(secret, user.email);

    // Update user with new secret (but don't enable 2FA yet)
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret },
    });

    return createSuccessResponse({
      secret,
      qrCode,
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return createErrorResponse('Failed to setup 2FA', 500);
  }
}
