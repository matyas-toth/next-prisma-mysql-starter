import { NextRequest } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { requireAuthUser } from '@/lib/server-auth';
import { sanitizeUser, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const { fullName } = await request.json();

    const prisma = await getPrisma();

    // Update user profile (username cannot be changed)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName,
      },
    });

    return createSuccessResponse(sanitizeUser(updatedUser));
  } catch (error) {
    console.error('Profile update error:', error);
    return createErrorResponse('Failed to update profile', 500);
  }
}
