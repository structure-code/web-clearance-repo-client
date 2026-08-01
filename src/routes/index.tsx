import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import { AppLayout } from '../components/layouts/AppLayout';
import { AuthLayout } from '../components/layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { AdminRoute } from './AdminRoute';

// Auth
import RegisterPage from '@/pages/auth/RegisterPage';
import LoginPage from '../pages/auth/LoginPage';
import StaffLoginPage from '../pages/auth/StaffLoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import VerifyCertificatePage from '../pages/VerifyCertificatePage';
import LandingPage from '../pages/LandingPage';

// Student
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import ClearanceRequestsPage from '../pages/student/ClearanceRequestsPage';
import NewClearanceRequestPage from '../pages/student/NewClearanceRequestPage';
import ClearanceHistoryPage from '../pages/student/ClearanceHistoryPage';
import MyCertificatePage from '../pages/student/MyCertificatePage';

// Faculty
import FacultyDashboardPage from '../pages/faculty/FacultyDashboardPage';
import ReviewRequestsPage from '../pages/faculty/ReviewRequestsPage';
import RequestDetailPage from '../pages/faculty/RequestDetailPage';

// Admin
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import UsersPage from '../pages/admin/UsersPage';
import DepartmentsPage from '../pages/admin/DepartmentsPage';
import ReportsPage from '../pages/admin/ReportsPage';
import ActivityLogsPage from '../pages/admin/ActivityLogsPage';

// Shared
import ProfilePage from '../pages/ProfilePage';
import NotificationsPage from '../pages/NotificationsPage';
import NotFound from '../pages/not-found';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
      
      <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/staff-login" element={<StaffLoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        <Route path="/student">
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="requests" element={<ClearanceRequestsPage />} />
          <Route path="requests/new" element={<NewClearanceRequestPage />} />
          <Route path="requests/:id" element={<RequestDetailPage />} />
          <Route path="history" element={<ClearanceHistoryPage />} />
          <Route path="certificate" element={<MyCertificatePage />} />
        </Route>

        <Route path="/faculty">
          <Route path="dashboard" element={<FacultyDashboardPage />} />
          <Route path="requests" element={<ReviewRequestsPage />} />
          <Route path="requests/:id" element={<RequestDetailPage />} />
        </Route>

        <Route path="/admin" element={<AdminRoute><Outlet /></AdminRoute>}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="activity-logs" element={<ActivityLogsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}