import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import whiteBgLogo from '@/assets/white-bg-logo.jpg';

const NAVY = '#0B1E3D';
const GOLD = '#C89B3C';
const serif = { fontFamily: "'Fraunces', Georgia, serif" };

const fileRows = [
  { office: 'Bursary', done: true },
  { office: 'Library', done: true },
  { office: 'Student Affairs', done: false },
];

function Seal({ filled = false, size = 22 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18.5" stroke={GOLD} strokeWidth={filled ? 0 : 1.5} fill={filled ? GOLD : 'transparent'} />
      {!filled && (
        <circle cx="20" cy="20" r="14" stroke={GOLD} strokeWidth="1" strokeDasharray="2.2 2.4" opacity="0.6" />
      )}
      {filled && (
        <path d="M12.5 20.5l4.8 4.8L27.5 14.5" stroke={NAVY} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export const AuthLayout = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 md:flex" style={{ backgroundColor: NAVY }}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 38px, rgba(255,255,255,0.6) 38px, rgba(255,255,255,0.6) 39px)',
          }}
        />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <img src={whiteBgLogo} alt="Admiralty University of Nigeria logo" className="h-11 w-11 rounded bg-white object-contain p-1" />
          <span className="text-xl font-semibold tracking-tight text-white">ADUN Clearance Portal</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Every desk, one file</p>
          <h1 className="text-3xl leading-tight text-white" style={serif}>
            The clearance run, without the running.
          </h1>
          <p className="mt-4 text-[15px] leading-6 text-white/65">
            Submit once, and every department reviews and stamps your file in parallel.
          </p>

          <div className="mt-8 rounded-sm p-5" style={{ backgroundColor: 'rgba(247,241,227,0.96)', color: '#1C1710' }}>
            <div className="space-y-1">
              {fileRows.map((row, i) => (
                <div
                  key={row.office}
                  className="flex items-center justify-between gap-3 py-2.5"
                  style={{ borderBottom: i < fileRows.length - 1 ? '1px dashed rgba(11,30,61,0.15)' : 'none' }}
                >
                  <span className="text-sm font-medium">{row.office}</span>
                  <Seal filled={row.done} size={22} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-white/45">
          &copy; {new Date().getFullYear()} Admiralty University of Nigeria. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col bg-white">
        <div className="flex items-center justify-between p-6 md:justify-end">
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <img src={whiteBgLogo} alt="Admiralty University of Nigeria logo" className="h-8 w-8 rounded bg-white object-contain p-1" style={{ border: `1px solid ${NAVY}20` }} />
            <span className="text-sm font-semibold tracking-tight" style={{ color: NAVY }}>ADUN Clearance</span>
          </Link>
          <Link to="/" className="hidden items-center gap-1.5 text-sm font-medium text-[#5B6472] transition hover:text-[#14213B] md:flex">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
