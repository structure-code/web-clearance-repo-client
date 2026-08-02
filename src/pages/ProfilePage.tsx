import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Upload, PenTool } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../hooks/useAuth";
import { useUploadFile } from "../hooks/useUploadFile";
import { PageHeader } from "../components/common/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { RoleBadge } from "../components/common/RoleBadge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { changePassword, updateProfile } from "../api/auth.api";
import {
  changePasswordSchema,
  profileSchema,
  studentProfileSchema,
  type ChangePasswordInput,
  type ProfileInput,
  type StudentProfileInput,
} from "../validations/schemas";
import { splitFullName } from "../utils/helpers";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const uploadFile = useUploadFile();
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const canApproveClearances = user?.role === "DEPARTMENT_OFFICER";
  const isStudent = user?.role === "STUDENT";

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  const studentProfileForm = useForm<StudentProfileInput>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: splitFullName(user?.name),
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    profileForm.reset({
      name: user?.name ?? "",
    });
    studentProfileForm.reset(splitFullName(user?.name));
  }, [profileForm, studentProfileForm, user?.name]);

  const handleProfileSubmit = async (values: ProfileInput) => {
    try {
      const updatedUser = await updateProfile({
        name: values.name,
      });
      setUser(updatedUser);
      toast.success("Profile updated successfully.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleStudentProfileSubmit = async (values: StudentProfileInput) => {
    try {
      const name = [values.firstName, values.middleName, values.lastName]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(" ");
      const updatedUser = await updateProfile({ name });
      setUser(updatedUser);
      toast.success("Profile updated successfully.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSavingSignature(true);
    try {
      const uploaded = await uploadFile.mutateAsync(file);
      const updatedUser = await updateProfile({ signatureUrl: uploaded.fileUrl });
      setUser(updatedUser);
      toast.success("Signature saved. You can now approve clearance requests.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save signature.");
    } finally {
      setIsSavingSignature(false);
      e.target.value = "";
    }
  };

  const handlePasswordSubmit = async (values: ChangePasswordInput) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed successfully.");
      passwordForm.reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to change password.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your account settings and preferences."
      />

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Full Name
              </p>
              <p className="text-base">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {user?.email ? 'Email Address' : 'Matriculation Number'}
              </p>
              <p className="text-base">{user?.email || user?.matricNo || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <div className="mt-1">
                <RoleBadge role={user?.role || ""} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Update Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {isStudent ? (
              <Form {...studentProfileForm}>
                <form
                  onSubmit={studentProfileForm.handleSubmit(handleStudentProfileSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FormField
                      control={studentProfileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={studentProfileForm.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Michael" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={studentProfileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={studentProfileForm.formState.isSubmitting}
                  >
                    {studentProfileForm.formState.isSubmitting
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={profileForm.formState.isSubmitting}
                  >
                    {profileForm.formState.isSubmitting
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            className="pr-10"
                            placeholder="Enter your current password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword((value) => !value)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={
                              showCurrentPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showCurrentPassword ? (
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
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            className="pr-10"
                            placeholder="Enter a new password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowNewPassword((value) => !value)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={
                              showNewPassword
                                ? "Hide password"
                                : "Show password"
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
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="pr-10"
                            placeholder="Confirm your new password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((value) => !value)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
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
                  disabled={passwordForm.formState.isSubmitting}
                >
                  {passwordForm.formState.isSubmitting
                    ? "Updating..."
                    : "Change Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {canApproveClearances && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Approval Signature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your signature is stamped onto clearance requests when you approve them. You must have a signature on file before you can approve any request.
            </p>

            {user?.signatureUrl ? (
              <div className="flex items-center gap-4">
                <img
                  src={user.signatureUrl}
                  alt="Your saved signature"
                  className="h-16 rounded-md border bg-white object-contain px-3"
                />
                <span className="text-sm text-success">Signature on file</span>
              </div>
            ) : (
              <p className="text-sm text-warning">
                No signature on file yet. Upload one below to enable approvals.
              </p>
            )}

            <div>
              <Input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                id="signature-upload"
                onChange={handleSignatureUpload}
                disabled={isSavingSignature}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("signature-upload")?.click()}
                disabled={isSavingSignature}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isSavingSignature
                  ? "Saving..."
                  : user?.signatureUrl
                    ? "Replace Signature"
                    : "Upload Signature"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
