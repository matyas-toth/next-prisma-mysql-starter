import { NextRequest } from 'next/server';
import { verifyToken, AuthUser, requireRole } from './auth';
import { UserRole } from '../generated/prisma';

// Server-side API route helpers
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  
  if (!payload) {
    return null;
  }

  return {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
    is2faEnabled: payload.is2faEnabled,
  };
}

export async function requireAuthUser(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(request);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function requireRoleUser(request: NextRequest, requiredRole: UserRole): Promise<AuthUser> {
  const user = await requireAuthUser(request);
  return requireRole(user, requiredRole);
}

export async function requirePaidUser(request: NextRequest): Promise<AuthUser> {
  return requireRoleUser(request, 'PAID_USER');
}

export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  return requireRoleUser(request, 'ADMIN');
}
