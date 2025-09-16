import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/server-auth';
import { sanitizeUser, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    
    if (!authUser) {
      return createErrorResponse('Authentication required', 401);
    }

    // Fetch full user data from database
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    return createSuccessResponse(sanitizeUser(user));
  } catch (error) {
    console.error('Get user error:', error);
    return createErrorResponse('Failed to fetch user data', 500);
  }
}
