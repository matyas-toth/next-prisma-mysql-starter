'use client';

import React from 'react';
import { useUser } from './contexts/UserContext';
import { UserRole } from '../generated/prisma';

// Client-side page protection helpers
export function withAuth<T extends {}>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { user, loading } = useUser();
    
    if (loading) {
      return <div>Loading...</div>; // You can replace with a proper loading component
    }
    
    if (!user) {
      // Redirect to login or show unauthorized message
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }
    
    return <Component {...props} />;
  };
}

export function withRole<T extends {}>(Component: React.ComponentType<T>, requiredRole: UserRole) {
  return function RoleProtectedComponent(props: T) {
    const { user, loading } = useUser();
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }
    
    try {
      // Simple role check - you can make this more sophisticated
      const roleHierarchy: Record<UserRole, number> = {
        USER: 0,
        PAID_USER: 1,
        ADMIN: 2,
      };

      if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
        return <div>Access denied. Insufficient permissions.</div>;
      }
      
      return <Component {...props} />;
    } catch {
      return <div>Access denied. Insufficient permissions.</div>;
    }
  };
}
