import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { studentLoginSchema, adminLoginSchema, type StudentLoginInput, type AdminLoginInput } from '../../validations/schemas';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Checkbox } from '../../components/ui/checkbox';

type LoginMode = 'student' | 'admin';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<LoginMode>('student');

  const from = location.state?.from?.pathname || null;

  const studentForm = useForm<StudentLoginInput>({ resolver: zodResolver(studentLoginSchema), mode: 'onChange' });
  const adminForm = useForm<AdminLoginInput>({ resolver: zodResolver(adminLoginSchema), mode: 'onChange' });

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  const redirectAfterLogin = (currentUser: any) => {
    const roleDashboard =
      currentUser.role === 'ADMIN'
        ? '/admin/dashboard'
        : currentUser.role === 'DEPARTMENT_OFFICER' || currentUser.role === 'FACULTY_OFFICER'
          ? '/faculty/dashboard'
          : '/student/dashboard';

    navigate(from || roleDashboard, { replace: true });
  };

  const onStudentSubmit = async (values: StudentLoginInput) => {
    try {
      const currentUser = await login({ mode: 'student', ...values });
      redirectAfterLogin(currentUser);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid matriculation number or password');
    }
  };

  const onAdminSubmit = async (values: AdminLoginInput) => {
    try {
      const currentUser = await login({ mode: 'admin', ...values });
      redirectAfterLogin(currentUser);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div ref={formRef}>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: '#C89B3C' }}>Sign in</p>
        <h2 className="mt-2 text-3xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: '#0B1E3D' }}>Welcome back</h2>
        <p className="mt-2 text-[#5B6472]">Enter your details to access your clearance dashboard.</p>
      </div>

      <div className="mb-6 inline-flex rounded-md border p-1" style={{ borderColor: 'rgba(11,30,61,0.15)' }}>
        {(['student', 'admin'] as LoginMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className="rounded px-4 py-1.5 text-sm font-medium transition-colors"
            style={
              mode === m
                ? { backgroundColor: '#0B1E3D', color: '#fff' }
                : { color: '#5B6472' }
            }
          >
            {m === 'student' ? 'Student' : 'Staff / Admin'}
          </button>
        ))}
      </div>

      {mode === 'student' ? (
        <Form {...studentForm} key="student-login">
          <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-6">
            <FormField
              control={studentForm.control}
              name="matricNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matriculation Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. ADUN/FS/SEN/22/043" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={studentForm.control}
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
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Remember me
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" style={{ backgroundColor: '#0B1E3D', color: '#fff' }} disabled={studentForm.formState.isSubmitting}>
              {studentForm.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-center text-sm text-[#5B6472] mt-4">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium hover:underline" style={{ color: '#0B1E3D' }}>
                Create an account
              </Link>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...adminForm} key="admin-login">
          <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-6">
            <FormField
              control={adminForm.control}
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
              control={adminForm.control}
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
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm font-medium hover:underline" style={{ color: '#0B1E3D' }}>
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" style={{ backgroundColor: '#0B1E3D', color: '#fff' }} disabled={adminForm.formState.isSubmitting}>
              {adminForm.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
