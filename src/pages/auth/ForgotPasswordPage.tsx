import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { forgotPasswordSchema } from '../../validations/schemas';
import { forgotPassword } from '../../api/auth.api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';

export default function ForgotPasswordPage() {
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

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
    <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h2>
        <p className="text-muted-foreground mt-1">Enter your email and we'll send you instructions to reset your password.</p>
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

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Sending...' : 'Send reset link'}
          </Button>

          <div className="text-center mt-4">
            <Link to="/login" className="text-sm font-medium text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
