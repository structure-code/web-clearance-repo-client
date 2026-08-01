import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { toast } from 'sonner';

import { forgotPasswordSchema } from '../../validations/schemas';
import { forgotPassword } from '../../api/auth.api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';

export default function ForgotPasswordPage() {
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  const onSubmit = async (values: any) => {
    try {
      await forgotPassword(values.email);
      toast.success('Password reset instructions sent to your email.');
      form.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset instructions.');
    }
  };

  return (
    <div ref={formRef}>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: '#C89B3C' }}>Reset password</p>
        <h2 className="mt-2 text-3xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: '#0B1E3D' }}>
          Forgot your password?
        </h2>
        <p className="mt-2 text-[#5B6472]">Enter your email and we'll send you instructions to reset your password.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" style={{ backgroundColor: '#0B1E3D', color: '#fff' }} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Sending...' : 'Send reset link'}
          </Button>

          <div className="text-center text-sm text-[#5B6472] mt-4">
            <Link to="/login" className="font-medium hover:underline" style={{ color: '#0B1E3D' }}>
              Back to login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}