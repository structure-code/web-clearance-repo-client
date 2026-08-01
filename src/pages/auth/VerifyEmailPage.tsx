import React, { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { CheckCircle2, MailCheck, XCircle } from 'lucide-react';
import { verifyEmail } from '../../api/auth.api';
import { Button } from '../../components/ui/button';

export default function VerifyEmailPage() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || '';
  const formRef = useRef<HTMLDivElement>(null);

  const verifyMut = useMutation({
    mutationFn: verifyEmail,
  });

  useEffect(() => {
    if (token && verifyMut.isIdle) {
      verifyMut.mutate(token);
    }
  }, [token, verifyMut]);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div ref={formRef}>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: '#C89B3C' }}>Email verification</p>
        <h2 className="mt-2 text-3xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: '#0B1E3D' }}>
          Verify your email
        </h2>
        <p className="mt-2 text-[#5B6472]">Confirming your email address to activate your account.</p>
      </div>

      <div className="space-y-6">
        {!token && (
          <div className="flex items-start gap-3 rounded-md border p-4" style={{ borderColor: 'rgba(11,30,61,0.15)' }}>
            <MailCheck className="h-5 w-5 mt-0.5" style={{ color: '#0B1E3D' }} />
            <p className="text-sm text-[#5B6472]">The verification token is missing.</p>
          </div>
        )}

        {verifyMut.isPending && (
          <div className="flex items-start gap-3 rounded-md border p-4" style={{ borderColor: 'rgba(11,30,61,0.15)' }}>
            <MailCheck className="h-5 w-5 mt-0.5 animate-pulse" style={{ color: '#0B1E3D' }} />
            <p className="text-sm text-[#5B6472]">Verifying your email address...</p>
          </div>
        )}

        {verifyMut.isError && (
          <div className="flex items-start gap-3 rounded-md border p-4" style={{ borderColor: 'rgba(220,38,38,0.25)', backgroundColor: 'rgba(220,38,38,0.05)' }}>
            <XCircle className="h-5 w-5 mt-0.5 text-destructive" />
            <p className="text-sm text-destructive">Email verification failed. The token may be invalid or expired.</p>
          </div>
        )}

        {verifyMut.isSuccess && (
          <div className="flex items-start gap-3 rounded-md border p-4" style={{ borderColor: 'rgba(200,155,60,0.35)', backgroundColor: 'rgba(200,155,60,0.08)' }}>
            <CheckCircle2 className="h-5 w-5 mt-0.5" style={{ color: '#C89B3C' }} />
            <div>
              <p className="font-medium" style={{ color: '#0B1E3D' }}>Email verified successfully.</p>
              <p className="text-sm text-[#5B6472]">You can now sign in to continue.</p>
            </div>
          </div>
        )}

        <Button asChild className="w-full" style={{ backgroundColor: '#0B1E3D', color: '#fff' }}>
          <Link to="/login">Go to login</Link>
        </Button>
      </div>
    </div>
  );
}
