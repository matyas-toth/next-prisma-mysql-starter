# SaaS Starter Kit Setup Guide

This is a complete SaaS starter kit built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and MariaDB/MySQL.

## Features

- 🔐 Complete authentication system with JWT
- 🔒 Two-factor authentication (2FA) with TOTP
- 👤 User management with roles (USER, PAID_USER, ADMIN)
- 🎨 Beautiful UI with Tailwind CSS
- 📊 Dashboard with sidebar navigation
- ⚙️ Account settings page
- 🗄️ Database integration with Prisma
- 🚀 Ready for production

## Prerequisites

- Node.js 18+ 
- MariaDB or MySQL database
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a MariaDB/MySQL database
2. Copy `.env.example` to `.env.local` and update the database URL:

```env
DATABASE_URL="mysql://username:password@localhost:3306/your_database_name"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## Project Structure

```
src/
├── app/
│   ├── api/auth/          # Authentication API routes
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── page.tsx          # Landing page
├── components/
│   ├── forms/            # Form components
│   ├── ui/               # Reusable UI components
│   ├── Navbar.tsx        # Navigation component
│   └── DashboardSidebar.tsx
├── lib/
│   ├── contexts/         # React contexts
│   ├── auth.ts           # Core authentication utilities
│   ├── client-auth.tsx   # Client-side auth helpers (HOCs)
│   ├── server-auth.ts    # Server-side auth helpers (API routes)
│   └── prisma.ts         # Prisma client
└── prisma/
    └── schema.prisma     # Database schema
```

## Authentication System

The authentication system includes:

- **Registration**: Email, username, full name, password
- **Login**: Email/username + password
- **JWT Tokens**: Secure token-based authentication
- **2FA Support**: TOTP-based two-factor authentication
- **Role-based Access**: USER, PAID_USER, ADMIN roles
- **Password Hashing**: bcrypt for secure password storage

## API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `POST /api/auth/2fa/setup` - Setup 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA token
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/disable` - Disable 2FA

## Usage Examples

### Protecting Pages (Client-side)

```tsx
import { withAuth, withRole } from '@/lib/client-auth';

// Require authentication
const ProtectedPage = withAuth(MyComponent);

// Require specific role
const AdminPage = withRole(MyComponent, 'ADMIN');
```

### Using User Context

```tsx
import { useUser } from '@/lib/contexts/UserContext';

function MyComponent() {
  const { user, loading, login, logout } = useUser();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome, {user.fullName}!</div>;
}
```

### API Route Protection (Server-side)

```tsx
import { requireAuthUser, requireAdmin } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  // Require authentication
  const user = await requireAuthUser(request);
  
  // Require admin role
  const admin = await requireAdmin(request);
  
  return Response.json({ user: admin });
}
```

## Customization

1. **Styling**: Modify Tailwind classes in components
2. **Database**: Add new models in `prisma/schema.prisma`
3. **Authentication**: Extend auth functions in `src/lib/auth.ts`
4. **UI Components**: Add new components in `src/components/`

## Deployment

1. Set up your production database
2. Update environment variables
3. Run `npm run build`
4. Deploy to your preferred platform (Vercel, Railway, etc.)

## Next Steps

- Add Google OAuth integration
- Implement email verification
- Add more dashboard features
- Set up monitoring and logging
- Add tests

Happy coding! 🚀
