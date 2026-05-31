import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// 1. Import useLocation alongside Link and useNavigate
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { toast } from 'sonner';

import { loginSchema } from '../../validations/schemas';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Checkbox } from '../../components/ui/checkbox';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  // 2. Initialize useLocation to read the redirect state
  const location = useLocation(); 
  const formRef = useRef<HTMLDivElement>(null);

  // 3. Extract the 'from' pathname if it exists, otherwise default to null
  const from = location.state?.from?.pathname || null;

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
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
      // 4. Await the response from your login function to get the user's role
      const response = await login(values);
      toast.success('Login successful');
      
      /* 5. Determine the redirect target:
         - Priority 1: The 'from' location (if they tried accessing a specific guarded page)
         - Priority 2: Role-based dashboard (e.g., /admin/dashboard or /user/dashboard)
         - Fallback: Standard '/dashboard'
      */
      const userRole = response?.role || response?.user?.role; // Adjust based on your API response structure
      const roleDashboard = userRole ? `/${userRole.toLowerCase()}/dashboard` : '/dashboard';
      
      const redirectTo = from || roleDashboard;

      // 6. Programmatically navigate the user, replacing login in history stack
      navigate(redirectTo, { replace: true });

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div ref={formRef} className="bg-card p-8 rounded-xl shadow-sm border border-border">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
        <p className="text-muted-foreground mt-1">Please enter your details to sign in.</p>
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>
    </div>
  );
}