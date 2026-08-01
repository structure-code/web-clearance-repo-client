import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  ScrollText,
  Search,
  UserRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';
import whiteBgLogo from '@/assets/white-bg-logo.jpg';

// Brand tokens — the university's actual navy + brass, not the app's generic
// slate/sky theme. Scoped to this page only.
const NAVY = '#0B1E3D';
const GOLD = '#C89B3C';
const PARCHMENT = '#F7F1E3';

const serif = { fontFamily: "'Fraunces', Georgia, serif" };

function Seal({ filled = false, size = 40 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18.5" stroke={GOLD} strokeWidth={filled ? 0 : 1.5} fill={filled ? GOLD : 'transparent'} />
      {!filled && (
        <circle cx="20" cy="20" r="14" stroke={GOLD} strokeWidth="1" strokeDasharray="2.2 2.4" opacity="0.6" />
      )}
      {filled && (
        <path
          d="M12.5 20.5l4.8 4.8L27.5 14.5"
          stroke={NAVY}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

const fileRows = [
  { office: 'Bursary', done: true },
  { office: 'Library', done: true },
  { office: 'Faculty Office', done: true },
  { office: 'Student Affairs', done: false },
];

const oldWay = [
  'Print the clearance form',
  'Queue at the Bursary in person',
  'Track down each HOD for a signature',
  'Wait weeks to hear back',
];

const newWay = [
  'Submit one request online',
  'Every department reviews in parallel',
  'Each office signs off with a verified stamp',
  'Certificate issues the moment the last office clears you',
];

const roles = [
  {
    icon: UserRound,
    eyebrow: 'For students',
    title: 'One request, every desk',
    description: 'Open your clearance once. Attach the document a department needs, then watch each office check off in real time — no more asking "abeg, una don sign am?"',
  },
  {
    icon: Building2,
    eyebrow: 'For department officers',
    title: 'Review, sign, done',
    description: 'See exactly who is waiting on you and why. Approve with your signature on file, reject with a clear reason, and let the record speak for itself.',
  },
  {
    icon: ClipboardCheck,
    eyebrow: 'For the registry',
    title: 'One record for the institution',
    description: 'Every clearance, every approval, every certificate issued — in a single audit trail across all faculties and departments.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#14213B]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10" style={{ backgroundColor: `${NAVY}F2`, backdropFilter: 'blur(8px)' }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="ADUN Clearance Portal home">
            <img
              src={whiteBgLogo}
              alt="Admiralty University of Nigeria logo"
              className="h-9 w-9 rounded-md bg-white object-contain p-1"
            />
            <span className="text-base font-semibold tracking-tight text-white">ADUN Clearance Portal</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
            <a href="#how-it-works" className="transition hover:text-white">How it works</a>
            <a href="#roles" className="transition hover:text-white">Who it's for</a>
            <Link to="/verify-certificate" className="transition hover:text-white">Verify a certificate</Link>
            <Link to="/staff-login" className="transition hover:text-white">Staff / Admin sign in</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" className="hidden sm:inline-flex" style={{ backgroundColor: GOLD, color: NAVY }} asChild>
              <Link to="/register">
                Start clearance
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden pt-16" style={{ backgroundColor: NAVY }}>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, transparent, transparent 38px, rgba(255,255,255,0.6) 38px, rgba(255,255,255,0.6) 39px)',
            }}
          />

          <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-28">
            <div className="max-w-xl">
              <div className="mb-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                <span className="h-px w-8" style={{ backgroundColor: GOLD }} />
                Admiralty University of Nigeria
              </div>

              <h1 className="text-4xl leading-[1.08] text-white sm:text-5xl lg:text-[3.4rem]" style={serif}>
                Clearance, without the desk-to-desk running.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/70">
                Submit your clearance once. Every department reviews it at the same time, signs off with a verified stamp, and your certificate is ready the moment the last office clears you.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" style={{ backgroundColor: GOLD, color: NAVY }} asChild>
                  <Link to="/register">
                    Start your clearance
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-transparent text-white shadow-none hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link to="/verify-certificate">
                    <Search className="h-4 w-4" />
                    Verify a certificate
                  </Link>
                </Button>
              </div>
            </div>

            {/* Signature element: the clearance file, digitized */}
            <div className="lg:justify-self-end">
              <div
                className="w-full max-w-sm rounded-sm p-6 shadow-2xl"
                style={{ backgroundColor: PARCHMENT, color: '#1C1710' }}
              >
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'rgba(11,30,61,0.15)' }}>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: NAVY, opacity: 0.6 }}>
                      Clearance file
                    </p>
                    <p className="mt-1 text-lg" style={serif}>Odeh Breakthrough Efe</p>
                  </div>
                  <ScrollText className="h-6 w-6 shrink-0" style={{ color: GOLD }} />
                </div>

                <div className="mt-5 space-y-1">
                  {fileRows.map((row, i) => (
                    <div
                      key={row.office}
                      className="flex items-center justify-between gap-3 rounded-sm px-2 py-3"
                      style={{ borderBottom: i < fileRows.length - 1 ? '1px dashed rgba(11,30,61,0.15)' : 'none' }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs tabular-nums" style={{ color: NAVY, opacity: 0.45 }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-medium">{row.office}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: row.done ? '#3F6E52' : NAVY, opacity: row.done ? 1 : 0.4 }}>
                          {row.done ? 'Cleared' : 'Pending'}
                        </span>
                        <Seal filled={row.done} size={26} />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-xs leading-5" style={{ color: NAVY, opacity: 0.55 }}>
                  3 of 4 offices have signed off. Your certificate issues automatically once Student Affairs clears you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OLD WAY / NEW WAY */}
        <section id="how-it-works" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>How it works</p>
              <h2 className="mt-3 text-3xl sm:text-4xl" style={serif}>The paper chase, retired.</h2>
            </div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-sm border md:grid-cols-2" style={{ borderColor: 'rgba(11,30,61,0.12)', backgroundColor: 'rgba(11,30,61,0.12)' }}>
              <div className="bg-white p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A8578]">Before</p>
                <ul className="mt-5 space-y-4">
                  {oldWay.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] leading-6 text-[#6B7280] line-through decoration-[#B8BCC4]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9DCE1]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8" style={{ backgroundColor: NAVY }}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: GOLD }}>The ADUN way</p>
                <ul className="mt-5 space-y-4">
                  {newWay.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] leading-6 text-white/90">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GOLD }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ROLES */}
        <section id="roles" className="py-20 sm:py-24" style={{ backgroundColor: '#FAFAF8' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>Who it's for</p>
              <h2 className="mt-3 text-3xl sm:text-4xl" style={serif}>One file, every desk.</h2>
              <p className="mt-4 text-base leading-7 text-[#5B6472]">
                Students, department officers, and the registry each see exactly what they need — and nothing they don't.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <article key={role.title} className="bg-white p-7" style={{ borderTop: `3px solid ${GOLD}`, boxShadow: '0 1px 2px rgba(11,30,61,0.06)' }}>
                    <Icon className="h-5 w-5" style={{ color: NAVY }} />
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#8A8578]">{role.eyebrow}</p>
                    <h3 className="mt-2 text-lg font-semibold" style={{ color: NAVY }}>{role.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#5B6472]">{role.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* VERIFY CTA */}
        <section className="py-16" style={{ backgroundColor: NAVY }}>
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex items-start gap-4 max-w-xl">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(200,155,60,0.14)' }}>
                <Seal filled size={26} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl text-white" style={serif}>Confirm a certificate is genuine.</h2>
                <p className="mt-3 text-white/70 text-sm leading-6">
                  Anyone can check a clearance certificate token against the university's record — no login required.
                </p>
              </div>
            </div>
            <Button size="lg" className="shrink-0" style={{ backgroundColor: GOLD, color: NAVY }} asChild>
              <Link to="/verify-certificate">
                <Search className="h-4 w-4" />
                Verify now
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-8" style={{ borderColor: 'rgba(11,30,61,0.1)' }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-[#5B6472] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2 font-semibold" style={{ color: NAVY }}>
            <img src={logo} alt="Admiralty University of Nigeria logo" className="h-7 w-7 object-contain" />
            ADUN Clearance Portal
          </div>
          <p>&copy; {new Date().getFullYear()} Admiralty University of Nigeria. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
