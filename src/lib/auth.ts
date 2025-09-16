import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { User, UserRole } from '../generated/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  role: UserRole;
  is2faEnabled: boolean;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  is2faEnabled: boolean;
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT utilities
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// 2FA utilities
export function generate2FASecret(): string {
  return speakeasy.generateSecret().base32;
}

export function generate2FAQRCode(secret: string, userEmail: string): Promise<string> {
  const otpauthUrl = speakeasy.otpauthURL({
    secret,
    label: userEmail,
    issuer: 'SaaS Starter',
  });
  
  return qrcode.toDataURL(otpauthUrl);
}

export function verify2FAToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2,
  });
}

// User utilities
export function sanitizeUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username || undefined,
    fullName: user.fullName || undefined,
    role: user.role,
    is2faEnabled: user.is2faEnabled,
  };
}

// Auth validation helpers
export function requireAuth(user: AuthUser | null): AuthUser {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export function requireRole(user: AuthUser, requiredRole: UserRole): AuthUser {
  const roleHierarchy: Record<UserRole, number> = {
    USER: 0,
    PAID_USER: 1,
    ADMIN: 2,
  };

  if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
    throw new Error(`Role ${requiredRole} required`);
  }

  return user;
}

export function requirePaidUser(user: AuthUser): AuthUser {
  return requireRole(user, 'PAID_USER');
}

export function requireAdmin(user: AuthUser): AuthUser {
  return requireRole(user, 'ADMIN');
}

// API response helpers
export function createErrorResponse(message: string, status: number = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createSuccessResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
