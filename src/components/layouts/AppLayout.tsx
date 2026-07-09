import React, { useEffect, useRef } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  History,
  LogOut,
  User as UserIcon,
  Menu,
  Moon,
  Sun,
  Bell,
  Activity,
  Award,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import logo from '@/assets/logo.png';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { data: notifications = [] } = useNotifications();
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((notification) => !(notification.isRead ?? notification.read ?? false)).length;

  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [location.pathname]);

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/requests', icon: FileText, label: 'My Requests' },
    { to: '/student/history', icon: History, label: 'History' },
    { to: '/student/certificate', icon: Award, label: 'Certificate' },
  ];

  const facultyLinks = [
    { to: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/faculty/requests', icon: FileText, label: 'Review Requests' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/departments', icon: Building2, label: 'Departments' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
    { to: '/admin/activity-logs', icon: Activity, label: 'Activity Logs' },
  ];

  let links: any[] = [];
  if (user?.role === 'STUDENT') links = studentLinks;
  else if (user?.role === 'DEPARTMENT_OFFICER') links = facultyLinks;
  else if (user?.role === 'ADMIN') links = adminLinks;

  const NavLinks = () => (
    <>
      {links.map((link) => {
        const isActive = location.pathname.startsWith(link.to);
        const Icon = link.icon;
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon size={18} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card px-4 py-6 fixed h-full">
        <div className="flex items-center gap-2 mb-8 px-2">
          <img src={logo} alt="Admiralty University of Nigeria logo" className="h-9 w-9 object-contain" />
          <span className="font-bold text-lg text-foreground tracking-tight">ADUN Clearance</span>
        </div>
        <nav className="flex-1 space-y-1">
          <NavLinks />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-10">
          <div className="flex items-center gap-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-6">
                <div className="flex items-center gap-2 mb-8">
                  <img src={logo} alt="Admiralty University of Nigeria logo" className="h-9 w-9 object-contain" />
                  <span className="font-bold text-lg tracking-tight">ADUN Clearance</span>
                </div>
                <nav className="space-y-1 mt-4">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
            <span className="font-bold">ADUN Clearance</span>
          </div>

          <div className="hidden md:flex flex-1" />

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/notifications" aria-label="Notifications">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
                )}
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8" ref={mainRef}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
