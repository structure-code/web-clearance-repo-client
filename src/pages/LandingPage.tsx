import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BarChart3,
  Building2,
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const roles = [
  {
    icon: UserRound,
    title: 'Students',
    description: 'Submit clearance requests, follow approvals, and access issued certificates from one place.',
  },
  {
    icon: Building2,
    title: 'Department officers',
    description: 'Review pending requests with the context needed to approve, reject, or request updates.',
  },
  {
    icon: BarChart3,
    title: 'Administrators',
    description: 'Manage users, departments, reports, and audit trails across the clearance process.',
  },
];

const workflow = [
  'Student submits clearance details',
  'Departments review assigned requirements',
  'Certificate is issued and verifiable',
];

const signals = [
  { value: '3', label: 'role-based workspaces' },
  { value: '24/7', label: 'certificate verification' },
  { value: '1', label: 'shared clearance record' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-primary/85 text-primary-foreground backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="ClearPath home">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-lg font-bold text-primary">
              C
            </span>
            <span className="text-lg font-bold tracking-tight">ClearPath</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-primary-foreground/80 md:flex">
            <a href="#workflow" className="transition hover:text-primary-foreground">
              Workflow
            </a>
            <a href="#roles" className="transition hover:text-primary-foreground">
              Roles
            </a>
            <Link to="/verify-certificate" className="transition hover:text-primary-foreground">
              Verify
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" className="hidden border-white bg-white text-primary hover:bg-white/90 sm:inline-flex" asChild>
              <Link to="/register">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-[88svh] items-center overflow-hidden bg-primary pt-20 text-primary-foreground">
          <img
            src="/opengraph.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-primary/70" />

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="max-w-3xl self-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-primary-foreground/85 backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                University clearance, approvals, and certificates
              </div>
              <h1 className="max-w-4xl text-4xl font-bold tracking-normal sm:text-5xl lg:text-6xl">
                ClearPath
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/82">
                A secure academic clearance platform that helps students submit requests, departments approve them, and institutions issue certificates that anyone can verify.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="border-white bg-white text-primary hover:bg-white/90" asChild>
                  <Link to="/register">
                    Start clearance
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-primary-foreground shadow-none hover:bg-white/10"
                  asChild
                >
                  <Link to="/verify-certificate">
                    <Search className="h-4 w-4" />
                    Verify certificate
                  </Link>
                </Button>
              </div>
            </div>

            <div className="self-end lg:justify-self-end">
              <div className="max-w-xl rounded-lg border border-white/18 bg-white/95 p-4 text-foreground shadow-2xl">
                <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <p className="text-sm font-semibold">Clearance overview</p>
                    <p className="text-xs text-muted-foreground">Live request progress</p>
                  </div>
                  <span className="rounded-md bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                    On track
                  </span>
                </div>

                <div className="space-y-3">
                  {workflow.map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{item}</p>
                        <div className="mt-2 h-2 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-accent"
                            style={{ width: `${92 - index * 18}%` }}
                          />
                        </div>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="border-b bg-card">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
            {signals.map((signal) => (
              <div key={signal.label} className="flex items-baseline gap-3">
                <span className="text-3xl font-bold tracking-normal text-primary">{signal.value}</span>
                <span className="text-sm font-medium text-muted-foreground">{signal.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="roles" className="bg-background py-18 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-normal sm:text-4xl">
                One clearance system for every office involved.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                ClearPath keeps each user focused on the work they are allowed to do while preserving a single trusted record for the institution.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {roles.map((role) => {
                const Icon = role.icon;

                return (
                  <article key={role.title} className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-accent/12 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{role.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{role.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 text-primary-foreground">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary-foreground/75">
                <LockKeyhole className="h-4 w-4" />
                Public verification without exposing private workflows
              </div>
              <h2 className="text-3xl font-bold tracking-normal">Need to confirm a clearance certificate?</h2>
              <p className="mt-4 text-primary-foreground/75">
                Use the verification portal to check a certificate token and open the issued document when available.
              </p>
            </div>
            <Button size="lg" className="border-white bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/verify-certificate">
                <Award className="h-4 w-4" />
                Verify now
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <FileCheck2 className="h-4 w-4" />
            ClearPath
          </div>
          <p>&copy; {new Date().getFullYear()} University Administration. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
