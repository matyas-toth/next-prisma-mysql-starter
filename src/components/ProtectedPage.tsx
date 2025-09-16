'use client';

import { withAuth, withRole } from '@/lib/client-auth';

// Example of a page that requires authentication
function AdminOnlyContent() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">Admin Only Content</h1>
      <p>This content is only visible to admins!</p>
    </div>
  );
}

// Example of a page that requires paid user role
function PaidUserContent() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-600">Premium Content</h1>
      <p>This content is only visible to paid users!</p>
    </div>
  );
}

// Example of a page that requires any authenticated user
function UserContent() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-600">User Content</h1>
      <p>This content is visible to any authenticated user!</p>
    </div>
  );
}

// Export the protected components
export const AdminPage = withRole(AdminOnlyContent, 'ADMIN');
export const PaidUserPage = withRole(PaidUserContent, 'PAID_USER');
export const ProtectedPage = withAuth(UserContent);
