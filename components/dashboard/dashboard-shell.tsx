import type { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
}

export function DashboardShell({
  children,
  eyebrow,
  title,
  description,
}: DashboardShellProps) {
  return (
    <div className="dashboard-shell space-y-6">
      <header className="space-y-2 px-1 py-2">
        <div className="space-y-2">
          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </header>
      <main className="space-y-6">{children}</main>
    </div>
  );
}
