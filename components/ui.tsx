// file: components/ui.tsx
"use client";

import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

type TextProps = {
  children: ReactNode;
  className?: string;
};

function joinClasses(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={joinClasses(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({ children, className }: TextProps) {
  return (
    <header
      className={joinClasses(
        "flex flex-col gap-2 border-b border-slate-100 px-6 py-5",
        className,
      )}
    >
      {children}
    </header>
  );
}

export function CardTitle({ children, className }: TextProps) {
  return (
    <h2
      className={joinClasses(
        "text-lg font-semibold tracking-tight text-slate-900",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function CardDescription({ children, className }: TextProps) {
  return (
    <p className={joinClasses("text-sm leading-6 text-slate-600", className)}>
      {children}
    </p>
  );
}

export function CardBody({ children, className }: TextProps) {
  return <div className={joinClasses("px-6 py-5", className)}>{children}</div>;
}

type BadgeTone = "default" | "success" | "warning" | "danger";

const badgeToneClasses: Record<BadgeTone, string> = {
  default: "border-slate-200 bg-slate-100 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
};

export function Badge({
  children,
  className,
  tone = "default",
}: TextProps & { tone?: BadgeTone }) {
  return (
    <span
      className={joinClasses(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        badgeToneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
