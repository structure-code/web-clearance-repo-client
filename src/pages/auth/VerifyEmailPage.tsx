import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CheckCircle2, MailCheck } from 'lucide-react';
import { verifyEmail } from '../../api/auth.api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function VerifyEmailPage() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || '';

  const verifyMut = useMutation({
    mutationFn: verifyEmail,
  });

  React.useEffect(() => {
    if (token && verifyMut.isIdle) {
      verifyMut.mutate(token);
    }
  }, [token, verifyMut]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <MailCheck className="h-6 w-6 text-primary" />
          <CardTitle>Email Verification</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!token && (
          <p className="text-sm text-muted-foreground">The verification token is missing.</p>
        )}

        {verifyMut.isPending && (
          <p className="text-sm text-muted-foreground">Verifying your email address...</p>
        )}

        {verifyMut.isError && (
          <p className="text-sm text-destructive">Email verification failed. The token may be invalid or expired.</p>
        )}

        {verifyMut.isSuccess && (
          <div className="flex items-start gap-3 rounded-md border bg-primary/5 p-4">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Email verified successfully.</p>
              <p className="text-sm text-muted-foreground">You can now sign in to continue.</p>
            </div>
          </div>
        )}

        <Button asChild>
          <Link to="/login">Go to login</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
