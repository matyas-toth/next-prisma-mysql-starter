import { NextRequest } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { requireAuthUser } from '@/lib/server-auth';
import { verifyPassword, hashPassword, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return createErrorResponse('Current password and new password are required');
    }

    const prisma = await getPrisma();

    // Get user's current password hash
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!userData?.passwordHash) {
      return createErrorResponse('User does not have a password set');
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, userData.passwordHash);
    if (!isValidPassword) {
      return createErrorResponse('Current password is incorrect', 401);
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error('Password change error:', error);
    return createErrorResponse('Failed to change password', 500);
  }
}
