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
        "rounded-xl border border-border bg-card px-5 py-4 shadow-none",
        highlight &&
          "bg-foreground text-background",
      )}
    >
      <div className="space-y-2">
        <p
          className={cn(
            "text-sm text-muted-foreground",
            highlight && "text-background/70",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "text-3xl font-semibold tracking-tight text-foreground",
            highlight && "text-background",
          )}
        >
          {value}
        </p>
        {hint ? (
          <p
            className={cn(
              "text-sm text-muted-foreground",
              highlight && "text-background/60",
            )}
          >
            {hint}
          </p>
        ) : null}
      </div>
    </article>
  );
}
