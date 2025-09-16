'use client';

import Link from 'next/link';
import { useUser } from '@/lib/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Navbar() {
  const { user, loading } = useUser();

  return (
    <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
              SaaS Starter
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {loading ? (
              <Skeleton className="w-20 h-8" />
            ) : user ? (
              <Button asChild>
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register">
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
