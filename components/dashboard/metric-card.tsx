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
        "rounded-2xl border border-border px-5 py-4",
        highlight ? "bg-foreground text-background" : "bg-card text-card-foreground",
      )}
    >
      <div className="space-y-2">
        <p
          className={cn(
            "text-sm",
            highlight ? "text-background/70" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "text-3xl font-semibold tracking-tight",
            highlight ? "text-background" : "text-foreground",
          )}
        >
          {value}
        </p>
        {hint ? (
          <p
            className={cn(
              "text-sm",
              highlight ? "text-background/60" : "text-muted-foreground",
            )}
          >
            {hint}
          </p>
        ) : null}
      </div>
    </article>
  );
}
