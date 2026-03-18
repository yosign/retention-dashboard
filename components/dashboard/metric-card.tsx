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
        "dashboard-panel rounded-[24px] border border-border px-5 py-4 sm:px-6",
        highlight &&
          "border-foreground bg-foreground text-background shadow-[0_28px_70px_-42px_color-mix(in_oklab,hsl(var(--foreground))_90%,transparent)]",
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
