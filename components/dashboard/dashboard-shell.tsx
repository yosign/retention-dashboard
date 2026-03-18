import type { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
  eyebrow?: string;
  title: string;
}

export function DashboardShell({
  children,
  eyebrow,
  title,
}: DashboardShellProps) {
  return (
    <div className="dashboard-shell space-y-6">
      <header className="dashboard-panel overflow-hidden px-6 py-5 sm:px-8">
        <div className="space-y-2">
          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
        </div>
      </header>
      <main className="space-y-6">{children}</main>
    </div>
  );
}
