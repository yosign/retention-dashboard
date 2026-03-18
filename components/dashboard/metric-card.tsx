import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
}

export function MetricCard({
  label,
  value,
  hint,
  highlight = false,
}: MetricCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border px-5 py-4 shadow-none",
        highlight ? "border-transparent" : "border-border bg-card",
      )}
      style={highlight ? { backgroundColor: "#1a1714", color: "#f5f0ea" } : undefined}
    >
      <div className="space-y-2">
        <p
          className="text-sm"
          style={highlight ? { color: "rgba(245,240,234,0.65)" } : { color: "hsl(var(--muted-foreground))" }}
        >
          {label}
        </p>
        <p
          className="text-3xl font-semibold tracking-tight"
          style={highlight ? { color: "#f5f0ea" } : { color: "hsl(var(--foreground))" }}
        >
          {value}
        </p>
        {hint ? (
          <p
            className="text-sm"
            style={highlight ? { color: "rgba(245,240,234,0.55)" } : { color: "hsl(var(--muted-foreground))" }}
          >
            {hint}
          </p>
        ) : null}
      </div>
    </article>
  );
}
