import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { resetPasswordSchema } from "../../validations/schemas";
import { resetPassword } from "../../api/auth.api";
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

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      if (!token) {
        toast.error("Invalid or missing reset token.");
        return;
      }
      await resetPassword({ token, newPassword: values.newPassword });
      toast.success("Password reset successfully. You can now login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Set new password
        </h2>
        <p className="text-muted-foreground mt-1">
          Please enter your new password below.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      className="pr-10"
                      placeholder="••••••••"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showNewPassword ? (
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
                      className="pr-10"
                      placeholder="••••••••"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
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
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
