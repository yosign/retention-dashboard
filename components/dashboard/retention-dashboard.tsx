"use client";

import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  chartAxisColor,
  chartCursorColor,
  chartGridColor,
  defaultRetentionData,
  retentionChartConfig,
} from "@/lib/dashboard-data";
import { useRetentionChartData } from "@/lib/hooks/use-retention-chart-data";
import { cn } from "@/lib/utils";
import type {
  FilterState,
  RetentionCurvePoint,
  RetentionPageProps,
} from "@/src/types/dashboard";

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
  displayMode,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
    payload?: RetentionCurvePoint;
    color?: string;
  }>;
  label?: string;
  displayMode: RetentionDisplayMode;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-popover/95 p-4 shadow-xl backdrop-blur">
      <div className="mb-3 text-sm font-semibold text-popover-foreground">{label}</div>
      <div className="space-y-2">
        {payload.map((item) => {
          const point = item.payload;
          const seriesKey = item.dataKey as keyof RetentionCurvePoint;
          const usersKey = `${item.dataKey}Users` as keyof RetentionCurvePoint;

          return (
            <div
              key={item.dataKey}
              className="flex min-w-48 items-start justify-between gap-6 text-sm"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="mt-1 size-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>
                  {retentionChartConfig.find((series) => series.key === item.dataKey)?.label}
                </span>
              </div>
              <div className="text-right font-medium text-foreground">
                {displayMode !== "absolute" && (
                  <div>{formatPercent(Number(point?.[seriesKey] ?? item.value ?? 0))}</div>
                )}
                {displayMode !== "relative" && (
                  <div className="text-xs text-muted-foreground">
                    {formatUsers(Number(point?.[usersKey] ?? 0))} 用户
                  </div>
                )}
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
  const [activeTab, setActiveTab] = useState(
    dashboardData.viewTabs[0]?.value ?? "renewal-rate",
  );
  const [range, setRange] = useState(dashboardData.periodOptions[2]?.value ?? "12m");
  const [subscriptionCycle, setSubscriptionCycle] = useState(
    dashboardData.subscriptionCycles[0] ?? "全部",
  );
  const [displayMode, setDisplayMode] =
    useState<RetentionDisplayMode>("relative");
  const [includeTrial, setIncludeTrial] = useState(true);

  useEffect(() => {
    setSubscriptionCycle(dashboardData.subscriptionCycles[0] ?? "全部");
    setActiveTab(dashboardData.viewTabs[0]?.value ?? "renewal-rate");
  }, [dashboardData.subscriptionCycles, dashboardData.viewTabs]);

  const { chartData, maxAbsoluteValue } = useRetentionChartData(
    dashboardData.curve,
    displayMode,
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
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <Card className="dashboard-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-border/60 pb-4">
          <div className="flex flex-col gap-4">
            <CardTitle className="text-xl font-semibold">续订阶段曲线</CardTitle>
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
                className="justify-start"
              >
                {dashboardData.periodOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors data-[state=on]:bg-foreground data-[state=on]:text-background"
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <ToggleGroup
                type="single"
                value={subscriptionCycle}
                onValueChange={(value) => {
                  if (!value) return;
                  setSubscriptionCycle(value);
                  pushFilter(range, value, displayMode, includeTrial);
                }}
                className="justify-start"
              >
                {dashboardData.subscriptionCycles.map((option) => (
                  <ToggleGroupItem
                    key={option}
                    value={option}
                    className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors data-[state=on]:bg-foreground data-[state=on]:text-background"
                  >
                    {option}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <ToggleGroup
                type="single"
                value={displayMode === "absolute" ? "absolute" : "relative"}
                onValueChange={(value) => {
                  if (!value) return;
                  const next = value as "relative" | "absolute";
                  setDisplayMode(next);
                  pushFilter(range, subscriptionCycle, next, includeTrial);
                }}
                className="justify-start"
              >
                <ToggleGroupItem
                  value="relative"
                  className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  百分比
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="absolute"
                  className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  绝对值
                </ToggleGroupItem>
              </ToggleGroup>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-9 rounded-full border-border bg-background px-4 text-xs font-medium text-muted-foreground",
                  displayMode === "both" && "bg-foreground text-background",
                )}
                onClick={() => {
                  const next = displayMode === "both" ? "relative" : "both";
                  setDisplayMode(next);
                  pushFilter(range, subscriptionCycle, next, includeTrial);
                }}
              >
                同时显示
              </Button>
              <label className="flex h-9 items-center gap-2 rounded-full border border-border bg-background px-3 text-xs font-medium text-muted-foreground">
                <span>包含试用</span>
                <Switch
                  checked={includeTrial}
                  onCheckedChange={(checked) => {
                    setIncludeTrial(checked);
                    pushFilter(range, subscriptionCycle, displayMode, checked);
                  }}
                />
              </label>
              <Button
                variant="outline"
                className="h-9 rounded-full border-border bg-background px-4 text-xs font-medium"
                onClick={() => onExport?.()}
              >
                <Download className="mr-2 size-4" />
                导出 CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-4 pt-5 sm:p-6">
          <div className="rounded-[28px] border border-border bg-card p-4 sm:p-5">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="h-auto w-full justify-start rounded-none bg-transparent p-0">
                {dashboardData.viewTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground data-[state=active]:bg-foreground data-[state=active]:text-background"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 6, right: 10, left: -12, bottom: 18 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 8"
                    stroke={chartGridColor}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="stage"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: chartAxisColor, fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={44}
                    domain={
                      displayMode === "absolute"
                        ? [0, Math.ceil(maxAbsoluteValue / 1000) * 1000]
                        : [0, 100]
                    }
                    ticks={displayMode === "absolute" ? undefined : [0, 25, 50, 75, 100]}
                    tickFormatter={(value) =>
                      displayMode === "absolute"
                        ? formatUsers(Number(value))
                        : `${value}%`
                    }
                    tick={{ fill: chartAxisColor, fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{
                      stroke: chartCursorColor,
                      strokeDasharray: "4 6",
                    }}
                    content={<RetentionTooltip displayMode={displayMode} />}
                  />
                  {retentionChartConfig.map((series) => (
                    <Line
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      name={series.label}
                      stroke={series.color}
                      strokeWidth={2.4}
                      dot={false}
                      isAnimationActive={false}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
              {retentionChartConfig.map((series) => (
                <div key={series.key} className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: series.color }}
                  />
                  <span>{series.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {dashboardData.stageCards.map((stage) => (
              <Card
                key={stage.stage}
                className="rounded-lg border border-border bg-card shadow-none"
              >
                <CardContent className="space-y-5 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-lg font-semibold">{stage.stage}</div>
                    <div className="text-right text-sm font-semibold text-foreground">
                      {formatPercent(stage.retention)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      活跃用户
                    </div>
                    <div className="text-3xl font-semibold tracking-tight">
                      {formatUsers(stage.activeUsers)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      阶段收入
                    </div>
                    <div className="text-xl font-semibold">{stage.revenue}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-[24px] border border-border bg-card shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">分段数据表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
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
                              className={cn(
                                "size-2 rounded-full",
                                rowIndex === 0 ? "bg-foreground" : "bg-muted-foreground/40",
                              )}
                            />
                            {row.group}
                          </div>
                        </TableCell>
                        {row.values.map((value, valueIndex) => (
                          <TableCell
                            key={`${row.group}-${valueIndex}`}
                            className="text-center font-medium"
                          >
                            {formatPercent(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
