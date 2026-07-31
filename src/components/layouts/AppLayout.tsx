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
import whiteBgLogo from '@/assets/white-bg-logo.jpg';

const NAVY = '#0B1E3D';
const GOLD = '#C89B3C';

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
    { to: '/profile', icon: UserIcon, label: 'Profile' },
  ];

  const facultyLinks = [
    { to: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/faculty/requests', icon: FileText, label: 'Review Requests' },
    { to: '/profile', icon: UserIcon, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/departments', icon: Building2, label: 'Departments' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
    { to: '/admin/activity-logs', icon: Activity, label: 'Activity Logs' },
    { to: '/profile', icon: UserIcon, label: 'Profile' },
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
            className={`flex items-center gap-3 rounded-sm border-l-2 px-3 py-2 text-sm transition-colors ${
              isActive ? 'text-white font-medium' : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'
            }`}
            style={isActive ? { backgroundColor: 'rgba(200,155,60,0.14)', borderColor: GOLD } : undefined}
          >
            <Icon size={18} style={{ color: isActive ? GOLD : undefined }} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 px-3 py-6 fixed h-full" style={{ backgroundColor: NAVY }}>
        <div className="flex items-center gap-2 mb-8 px-3">
          <img src={whiteBgLogo} alt="Admiralty University of Nigeria logo" className="h-9 w-9 rounded bg-white object-contain p-1" />
          <span className="font-semibold text-[15px] text-white tracking-tight">ADUN Clearance</span>
        </div>
        <nav className="flex-1 space-y-1">
          <NavLinks />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-10" style={{ borderBottomColor: 'rgba(11,30,61,0.1)' }}>
          <div className="flex items-center gap-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-6 border-none" style={{ backgroundColor: NAVY }}>
                <div className="flex items-center gap-2 mb-8">
                  <img src={whiteBgLogo} alt="Admiralty University of Nigeria logo" className="h-9 w-9 rounded bg-white object-contain p-1" />
                  <span className="font-semibold text-white tracking-tight">ADUN Clearance</span>
                </div>
                <nav className="space-y-1 mt-4">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
            <span className="font-semibold" style={{ color: NAVY }}>ADUN Clearance</span>
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
                  <Avatar className="h-8 w-8" style={{ border: `1.5px solid ${GOLD}` }}>
                    <AvatarFallback style={{ backgroundColor: 'rgba(11,30,61,0.08)', color: NAVY }}>
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
