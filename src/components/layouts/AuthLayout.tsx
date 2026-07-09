import React from 'react';
import { Outlet } from 'react-router-dom';
import whiteBgLogo from '@/assets/white-bg-logo.jpg';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/20 z-0" />
        
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl z-0" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl z-0" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img
              src={whiteBgLogo}
              alt="Admiralty University of Nigeria logo"
              className="h-11 w-11 rounded bg-white object-contain p-1"
            />
            <span className="font-bold text-2xl tracking-tight">ADUN Clearance Portal</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-4">ADUN Clearance, Simplified.</h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            The authoritative platform for managing Admiralty University of Nigeria academic clearance. Secure, transparent, and seamless graduation processing.
          </p>
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} Admiralty University of Nigeria. All rights reserved.
        </div>
      </div>
      
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
