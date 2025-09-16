import { NextRequest } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { requireAuthUser } from '@/lib/server-auth';
import { createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);

    const prisma = await getPrisma();

    // Disable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        is2faEnabled: false,
        twoFactorSecret: null,
      },
    });

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error('2FA disable error:', error);
    return createErrorResponse('Failed to disable 2FA', 500);
  }
}
