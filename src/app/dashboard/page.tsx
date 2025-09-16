'use client';

import { useUser } from '@/lib/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.fullName || user?.email}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <Badge variant="secondary">{user?.role}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Your account is in good standing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Badge variant={user?.is2faEnabled ? "default" : "secondary"}>
              {user?.is2faEnabled ? "2FA Enabled" : "2FA Disabled"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.is2faEnabled ? "Secure" : "Basic"}
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.is2faEnabled 
                ? "Two-factor authentication is active" 
                : "Consider enabling 2FA for better security"
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add Feature
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ArrowRight className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Welcome to your SaaS dashboard. Here are some next steps to get you started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">1</span>
            </div>
            <div>
              <p className="font-medium">Complete your profile</p>
              <p className="text-sm text-muted-foreground">
                Add your full name and profile information
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">2</span>
            </div>
            <div>
              <p className="font-medium">Enable two-factor authentication</p>
              <p className="text-sm text-muted-foreground">
                Secure your account with 2FA
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">3</span>
            </div>
            <div>
              <p className="font-medium">Start building your features</p>
              <p className="text-sm text-muted-foreground">
                Use the starter kit to build your SaaS
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
