"use client";

import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  chartAxisColor,
  chartCursorColor,
  chartGridColor,
  defaultRetentionData,
  retentionChartConfig,
} from "@/lib/dashboard-data";
import type { FilterState, RetentionPageProps } from "@/src/types/dashboard";

type RetentionDisplayMode = "relative" | "absolute" | "both";

function formatPercent(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

function formatUsers(value: number) {
  return new Intl.NumberFormat("zh-CN").format(Math.round(value));
}

function buildRetentionFilter(
  range: string,
  subscriptionCycle: string,
  displayMode: RetentionDisplayMode,
  includeTrial: boolean,
): FilterState {
  return { range, subscriptionCycle, displayMode, includeTrial };
}

function RetentionTooltip({
  active,
  payload,
  label,
  mode,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
    payload?: Record<string, number | string>;
    color?: string;
  }>;
  label?: string;
  mode: RetentionDisplayMode;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-popover p-4 text-sm shadow-none">
      <div className="mb-3 font-medium text-popover-foreground">{label}</div>
      <div className="space-y-2">
        {payload.map((item) => {
          const usersKey = `${item.dataKey}Users`;
          const users = Number(item.payload?.[usersKey] ?? 0);

          return (
            <div key={item.dataKey} className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="mt-0.5 size-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>
                  {retentionChartConfig.find((series) => series.key === item.dataKey)?.label}
                </span>
              </div>
              <div className="text-right font-medium text-foreground">
                {mode !== "absolute" ? <div>{formatPercent(Number(item.value ?? 0))}</div> : null}
                {mode !== "relative" ? (
                  <div className="text-xs text-muted-foreground">{formatUsers(users)} 用户</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RetentionDashboard({
  data,
  onFilterChange,
  onExport,
  onPeriodChange,
}: RetentionPageProps) {
  const dashboardData = data ?? defaultRetentionData;
  const [activeTab, setActiveTab] = useState(dashboardData.viewTabs[0]?.value ?? "renewal-rate");
  const [range, setRange] = useState(dashboardData.periodOptions[2]?.value ?? "12m");
  const [subscriptionCycle, setSubscriptionCycle] = useState("按订阅周期");
  const [displayMode, setDisplayMode] = useState<RetentionDisplayMode>("relative");
  const [includeTrial, setIncludeTrial] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = useMemo(() => {
    return dashboardData.curve.map((point) => ({
      ...point,
      overall: displayMode === "absolute" ? point.overallUsers : point.overall,
      monthly: displayMode === "absolute" ? point.monthlyUsers : point.monthly,
      yearly: displayMode === "absolute" ? point.yearlyUsers : point.yearly,
      quarterly: displayMode === "absolute" ? point.quarterlyUsers : point.quarterly,
    }));
  }, [dashboardData.curve, displayMode]);

  const absoluteMax = useMemo(
    () =>
      Math.max(
        ...dashboardData.curve.flatMap((point) => [
          point.overallUsers,
          point.monthlyUsers,
          point.yearlyUsers,
          point.quarterlyUsers,
        ]),
      ),
    [dashboardData.curve],
  );

  const pushFilter = (
    nextRange: string,
    nextSubscriptionCycle: string,
    nextDisplayMode: RetentionDisplayMode,
    nextIncludeTrial: boolean,
  ) => {
    onFilterChange?.(
      buildRetentionFilter(
        nextRange,
        nextSubscriptionCycle,
        nextDisplayMode,
        nextIncludeTrial,
      ),
    );
  };

  return (
    <DashboardShell eyebrow="收入与留存分析" title="留存分析">
      <section className="grid grid-cols-4 gap-4">
        {dashboardData.summaryMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
            highlight={metric.tone === "highlight"}
          />
        ))}
      </section>

      <Card className="rounded-2xl border border-border bg-card shadow-none">
        <CardHeader className="space-y-4 p-5 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">续订阶段曲线</CardTitle>
            <div className="flex gap-1">
              {dashboardData.viewTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "rounded-lg px-3 py-1 text-sm transition-colors",
                    activeTab === tab.value
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup
              type="single"
              value={range}
              onValueChange={(value) => {
                if (!value) return;
                setRange(value);
                onPeriodChange?.(value);
                pushFilter(value, subscriptionCycle, displayMode, includeTrial);
              }}
              className="gap-1"
            >
              {dashboardData.periodOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="h-10 rounded-xl border border-border px-3 text-sm data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <Select
              value={subscriptionCycle}
              onValueChange={(value) => {
                setSubscriptionCycle(value);
                pushFilter(range, value, displayMode, includeTrial);
              }}
            >
              <SelectTrigger className="h-10 w-[132px] rounded-xl border-border bg-background text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="按订阅周期">按订阅周期</SelectItem>
                {dashboardData.subscriptionCycles.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ToggleGroup
              type="single"
              value={displayMode === "absolute" ? "absolute" : "relative"}
              onValueChange={(value) => {
                if (!value) return;
                const next = value as "relative" | "absolute";
                setDisplayMode(next);
                pushFilter(range, subscriptionCycle, next, includeTrial);
              }}
              className="gap-0 rounded-xl border border-border bg-background p-1"
            >
              <ToggleGroupItem
                value="relative"
                className="rounded-xl px-3 text-sm data-[state=on]:bg-foreground data-[state=on]:text-background"
              >
                %相对
              </ToggleGroupItem>
              <ToggleGroupItem
                value="absolute"
                className="rounded-xl px-3 text-sm data-[state=on]:bg-foreground data-[state=on]:text-background"
              >
                #绝对
              </ToggleGroupItem>
            </ToggleGroup>

            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-xl px-4 text-sm"
              onClick={() => {
                const next = displayMode === "both" ? "relative" : "both";
                setDisplayMode(next);
                pushFilter(range, subscriptionCycle, next, includeTrial);
              }}
            >
              同时显示
            </Button>

            <label className="flex h-10 items-center gap-2 px-1 text-sm text-muted-foreground">
              <Switch
                checked={includeTrial}
                onCheckedChange={(checked) => {
                  setIncludeTrial(checked);
                  pushFilter(range, subscriptionCycle, displayMode, checked);
                }}
              />
              <span>包含试用</span>
            </label>

            <Button
              variant="outline"
              className="h-10 rounded-xl border-border px-4 text-sm"
              onClick={() => onExport?.()}
            >
              <Download className="size-4" />
              导出 CSV
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5">
          <div className="rounded-2xl border border-border bg-background p-5">
            <div className="h-[320px]">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 6, right: 8, left: -18, bottom: 14 }}>
                    <CartesianGrid stroke={chartGridColor} vertical={false} />
                    <XAxis
                      dataKey="stage"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: chartAxisColor, fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={48}
                      domain={displayMode === "absolute" ? [0, absoluteMax] : [0, 100]}
                      ticks={displayMode === "absolute" ? undefined : [0, 25, 50, 75, 100]}
                      tickFormatter={(value) =>
                        displayMode === "absolute" ? formatUsers(Number(value)) : `${value}%`
                      }
                      tick={{ fill: chartAxisColor, fontSize: 11 }}
                    />
                    <Tooltip
                      cursor={{ stroke: chartCursorColor, strokeDasharray: "4 6" }}
                      content={<RetentionTooltip mode={displayMode} />}
                    />
                    {retentionChartConfig.map((series) => (
                      <Line
                        key={series.key}
                        type="monotone"
                        dataKey={series.key}
                        stroke={series.color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                        isAnimationActive={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              {retentionChartConfig.map((series) => (
                <div key={series.key} className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ backgroundColor: series.color }} />
                  <span>{series.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {dashboardData.stageCards.map((stage) => (
                <Card key={stage.stage} className="rounded-xl border border-border bg-card shadow-none">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-medium">{stage.stage}</div>
                      <div className="text-sm font-medium text-foreground">
                        {formatPercent(stage.retention)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">活跃用户</div>
                      <div className="mt-1 text-3xl font-semibold tracking-tight">
                        {formatUsers(stage.activeUsers)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">阶段收入</div>
                      <div className="mt-1 text-xl font-semibold">{stage.revenue}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="rounded-2xl border border-border bg-card shadow-none">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-semibold">分段数据表</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[160px]">分组</TableHead>
                    {dashboardData.segmentColumns.map((column) => (
                      <TableHead key={column} className="text-center">
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.segmentRows.map((row, rowIndex) => (
                    <TableRow key={row.group} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2 rounded-full"
                            style={{
                              backgroundColor:
                                rowIndex === 0 ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                            }}
                          />
                          {row.group}
                        </div>
                      </TableCell>
                      {row.values.map((value, index) => (
                        <TableCell key={`${row.group}-${index}`} className="text-center font-medium">
                          {formatPercent(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
