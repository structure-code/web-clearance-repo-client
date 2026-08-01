import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { type RegisterInput, registerSchema } from "../../validations/schemas";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { register } from "../../api/auth.api";
import { useActiveDepartments } from "../../hooks/useDepartments";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const { data: departments = [] } = useActiveDepartments();

  // States for hiding/showing password text
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      matricNo: "",
      departmentId: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    }
  }, []);

  const onSubmit = async (values: RegisterInput) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { confirmPassword, ...payload } = values;
      await register(payload);
      toast.success("Registration successful! You can now sign in with your matric number.");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong during registration.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={formRef}>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: '#C89B3C' }}>Get started</p>
        <h2 className="mt-2 text-3xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: '#0B1E3D' }}>
          Create your account
        </h2>
        <p className="mt-2 text-[#5B6472]">
          Set up your student account to start a clearance request.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Matric Number Field */}
          <FormField
            control={form.control}
            name="matricNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matriculation Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. ADUN/FS/SEN/22/074"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Department Field */}
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                      disabled={isLoading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      disabled={isLoading}
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

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                      disabled={isLoading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      disabled={isLoading}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
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

          <Button
            type="submit"
            className="w-full mt-2"
            style={{ backgroundColor: '#0B1E3D', color: '#fff' }}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          {/* Login Redirect Section */}
          <div className="text-center text-sm text-[#5B6472] mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium hover:underline"
              style={{ color: '#0B1E3D' }}
            >
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
