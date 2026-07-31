import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

type StatTone = 'navy' | 'gold' | 'success' | 'warning' | 'destructive' | 'muted';

const TONE_STYLES: Record<StatTone, { bg: string; fg: string }> = {
  navy: { bg: 'rgba(11,30,61,0.08)', fg: '#0B1E3D' },
  gold: { bg: 'rgba(200,155,60,0.14)', fg: '#A87F26' },
  success: { bg: 'hsl(var(--success) / 0.12)', fg: 'hsl(var(--success))' },
  warning: { bg: 'hsl(var(--warning) / 0.14)', fg: 'hsl(var(--warning))' },
  destructive: { bg: 'hsl(var(--destructive) / 0.1)', fg: 'hsl(var(--destructive))' },
  muted: { bg: 'hsl(var(--muted))', fg: 'hsl(var(--muted-foreground))' },
};

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: StatTone;
  suffix?: string;
}

export function StatCard({ label, value, icon: Icon, tone = 'muted', suffix }: StatCardProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const { bg, fg } = TONE_STYLES[tone];

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { innerHTML: 0 },
      {
        innerHTML: value,
        duration: 1.2,
        ease: 'power2.out',
        snap: { innerHTML: 1 },
        onUpdate: function () {
          if (ref.current) ref.current.innerHTML = Math.round(Number(this.targets()[0].innerHTML)).toString();
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: bg }}>
          <Icon className="h-5 w-5" style={{ color: fg }} />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold leading-none tracking-tight">
            <span ref={ref}>0</span>
            {suffix}
          </p>
          <p className="mt-1.5 truncate text-xs font-medium text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
