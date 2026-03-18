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
        "dashboard-panel rounded-[24px] px-5 py-4 sm:px-6",
        highlight &&
          "!border-black !bg-black !text-white shadow-[0_28px_70px_-42px_rgba(17,17,17,0.9)]",
      )}
      style={highlight ? { backgroundColor: "#000", borderColor: "#000" } : undefined}
    >
      <div className="space-y-2">
        <p className={cn("text-sm text-muted-foreground", highlight && "!text-white/70")}>
          {label}
        </p>
        <p
          className={cn(
            "text-3xl font-semibold tracking-tight text-foreground",
            highlight && "!text-white",
          )}
        >
          {value}
        </p>
        {hint ? (
          <p className={cn("text-sm text-muted-foreground", highlight && "!text-white/60")}>
            {hint}
          </p>
        ) : null}
      </div>
    </article>
  );
}
