"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { RetentionDashboard } from "@/components/dashboard/retention-dashboard";
import { PaybackDashboard } from "@/components/dashboard/payback-dashboard";
import { ForecastDashboard } from "@/components/dashboard/forecast-dashboard";
import { defaultRetentionData, defaultPaybackData, defaultForecastData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "retention", label: "留存分析" },
  { value: "payback", label: "回本分析" },
  { value: "forecast", label: "收入预测" },
] as const;

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "retention";

  return (
    <main className="min-h-screen bg-background">
      {/* Top nav tab bar */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-screen-2xl px-6">
          <nav className="flex h-12 items-end gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => router.push(`/?tab=${tab.value}`)}
                className={cn(
                  "relative h-12 px-4 text-sm font-medium transition-colors",
                  activeTab === tab.value
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "retention" && <RetentionDashboard data={defaultRetentionData} />}
      {activeTab === "payback" && <PaybackDashboard data={defaultPaybackData} />}
      {activeTab === "forecast" && <ForecastDashboard data={defaultForecastData} />}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
