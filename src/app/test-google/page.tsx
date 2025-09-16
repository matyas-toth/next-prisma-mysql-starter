'use client';

import GoogleAuthButton from '@/components/GoogleAuthButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestGooglePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Google OAuth Test</CardTitle>
          <CardDescription>
            Test the Google OAuth integration with redirect flow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleAuthButton returnUrl="/test-google">
            Test Google Sign In
          </GoogleAuthButton>
          
          <div className="text-sm text-muted-foreground">
            <p>This will redirect you to Google's OAuth page, then back here after authentication.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}