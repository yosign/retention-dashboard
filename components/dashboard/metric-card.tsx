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
      style={highlight ? { backgroundColor: "#18181b", color: "#fafafa" } : undefined}
      className={cn(
        "rounded-2xl border px-5 py-4 shadow-none",
        highlight ? "border-transparent" : "border-border bg-card",
      )}
    >
      <div className="space-y-2">
        <p
          className="text-sm"
          style={highlight ? { color: "rgba(250,250,250,0.7)" } : { color: "hsl(var(--muted-foreground))" }}
        >
          {label}
        </p>
        <p
          className="text-3xl font-semibold tracking-tight"
          style={highlight ? { color: "#fafafa" } : { color: "hsl(var(--foreground))" }}
        >
          {value}
        </p>
        {hint ? (
          <p
            className="text-sm"
            style={highlight ? { color: "rgba(250,250,250,0.6)" } : { color: "hsl(var(--muted-foreground))" }}
          >
            {hint}
          </p>
        ) : null}
      </div>
    </article>
  );
}
