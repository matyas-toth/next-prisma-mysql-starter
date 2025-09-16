'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/contexts/UserContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/lib/providers/ThemeProviver';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();
  const { theme } = useTheme();
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');
      const googleAuth = searchParams.get('google_auth');
      const returnUrl = searchParams.get('returnUrl') || '/dashboard';

      if (error) {
        toast.error(error);
        router.push('/login');
        return;
      }

      if (token && googleAuth === 'true') {
        try {
          // Fetch user data with the token
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            login(userData, token);
            toast.success('Successfully signed in with Google!');
            router.push(returnUrl);
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (err) {
          toast.error('Google authentication failed');
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };

    handleGoogleCallback();
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 style={{ color: theme === 'light' ? '#555555' : 'white' }} className={` mx-auto animate-spin`} strokeWidth={1} size={64} />
        <p className="mt-4 text-muted-foreground">Completing Google authentication...</p>
      </div>
    </div>
  );
}
