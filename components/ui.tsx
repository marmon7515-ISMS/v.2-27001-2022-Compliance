"use client";

import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border bg-white shadow-sm">{children}</div>;
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="border-b px-5 py-4">{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function CardDescription({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-sm text-slate-500">{children}</p>;
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="p-5">{children}</div>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-full border px-2 py-1 text-xs">{children}</span>;
}
