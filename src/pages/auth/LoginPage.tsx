import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { loginSchema, type LoginInput } from '../../validations/schemas';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Checkbox } from '../../components/ui/checkbox';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  const formRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || null;

  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema), mode: "onChange" });

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
      const currentUser = await login(values);
      
      const roleDashboard =
        currentUser.role === 'ADMIN'
          ? '/admin/dashboard'
          : currentUser.role === 'DEPARTMENT_OFFICER'
            ? '/faculty/dashboard'
            : '/student/dashboard';
      
      const redirectTo = from || roleDashboard;

      navigate(redirectTo, { replace: true });

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div ref={formRef}>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: '#C89B3C' }}>Sign in</p>
        <h2 className="mt-2 text-3xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: '#0B1E3D' }}>Welcome back</h2>
        <p className="mt-2 text-[#5B6472]">Enter your details to access your clearance dashboard.</p>
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
                  <div className="relative">
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      className="pr-10" 
                      {...field} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
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
            <Link to="/forgot-password" className="text-sm font-medium hover:underline" style={{ color: '#0B1E3D' }}>
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" style={{ backgroundColor: '#0B1E3D', color: '#fff' }} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>

          {/* New Section: Register Redirect */}
          <div className="text-center text-sm text-[#5B6472] mt-4">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium hover:underline" style={{ color: '#0B1E3D' }}>
              Create an account
            </Link>
          </div>
          
        </form>
      </Form>
    </div>
  );
}
