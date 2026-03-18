"use client";

import { useEffect, useState } from "react";
import { Download, Percent, Users } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { defaultRetentionData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import type {
  FilterState,
  RetentionCurvePoint,
  RetentionPageProps,
} from "@/src/types/dashboard";

const RETENTION_SERIES = [
  { key: "overall", label: "整体", color: "#111111" },
  { key: "monthly", label: "月付", color: "#456eb2" },
  { key: "yearly", label: "年付", color: "#45c7b5" },
  { key: "quarterly", label: "季付", color: "#d3ad2f" },
] as const;

type RetentionDisplayMode = "relative" | "absolute" | "both";

function formatPercent(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

function formatUsers(value: number) {
  return new Intl.NumberFormat("zh-CN").format(Math.round(value));
}

const pillClassName =
  "rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors";

const activePillClassName =
  "data-[state=on]:border-black data-[state=on]:bg-black data-[state=on]:text-white";

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
    <div className="rounded-2xl border border-border/60 bg-white/95 p-4 shadow-xl">
      <div className="mb-3 text-sm font-semibold text-foreground">{label}</div>
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
                  {RETENTION_SERIES.find((series) => series.key === item.dataKey)?.label}
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
  const [range, setRange] = useState("12m");
  const [subscriptionCycle, setSubscriptionCycle] = useState(
    dashboardData.subscriptionCycles[0] ?? "按订阅周期",
  );
  const [displayMode, setDisplayMode] =
    useState<RetentionDisplayMode>("relative");
  const [includeTrial, setIncludeTrial] = useState(true);

  useEffect(() => {
    setSubscriptionCycle(dashboardData.subscriptionCycles[0] ?? "按订阅周期");
  }, [dashboardData.subscriptionCycles]);

  const chartData = dashboardData.curve.map((point) => {
    if (displayMode === "absolute") {
      return {
        ...point,
        overall: point.overallUsers,
        monthly: point.monthlyUsers,
        yearly: point.yearlyUsers,
        quarterly: point.quarterlyUsers,
      };
    }

    return point;
  });

  const maxAbsoluteValue = Math.max(
    ...dashboardData.curve.flatMap((point) => [
      point.overallUsers,
      point.monthlyUsers,
      point.yearlyUsers,
      point.quarterlyUsers,
    ]),
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
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <Card className="dashboard-panel overflow-hidden border-border/50">
        <CardHeader className="gap-4 pb-2">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl font-semibold">续订阶段曲线</CardTitle>
            </div>
            <div className="flex flex-col gap-3 xl:items-end">
              <ToggleGroup
                type="single"
                value={range}
                onValueChange={(value) => {
                  if (!value) return;
                  setRange(value);
                  onPeriodChange?.(value);
                  pushFilter(value, subscriptionCycle, displayMode, includeTrial);
                }}
                className="justify-start xl:justify-end"
              >
                <ToggleGroupItem value="3m" className={`${pillClassName} ${activePillClassName}`}>
                  最近 3 个月
                </ToggleGroupItem>
                <ToggleGroupItem value="6m" className={`${pillClassName} ${activePillClassName}`}>
                  最近 6 个月
                </ToggleGroupItem>
                <ToggleGroupItem value="12m" className={`${pillClassName} ${activePillClassName}`}>
                  最近 12 个月
                </ToggleGroupItem>
              </ToggleGroup>
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={subscriptionCycle}
                  onValueChange={(value) => {
                    setSubscriptionCycle(value);
                    pushFilter(range, value, displayMode, includeTrial);
                  }}
                >
                  <SelectTrigger className="h-9 w-[152px] rounded-full border-black/10 bg-white text-xs font-medium">
                    <SelectValue placeholder="按订阅周期" />
                  </SelectTrigger>
                  <SelectContent>
                    {dashboardData.subscriptionCycles.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ToggleGroup
                  type="single"
                  value={displayMode}
                  onValueChange={(value) => {
                    if (!value) return;
                    const next = value as RetentionDisplayMode;
                    setDisplayMode(next);
                    pushFilter(range, subscriptionCycle, next, includeTrial);
                  }}
                >
                  <ToggleGroupItem value="relative" className={`${pillClassName} ${activePillClassName}`}>
                    <Percent className="mr-1 size-4" />% 相对
                  </ToggleGroupItem>
                  <ToggleGroupItem value="absolute" className={`${pillClassName} ${activePillClassName}`}>
                    <Users className="mr-1 size-4" /># 绝对
                  </ToggleGroupItem>
                  <ToggleGroupItem value="both" className={`${pillClassName} ${activePillClassName}`}>
                    同时显示
                  </ToggleGroupItem>
                </ToggleGroup>
                <label className="flex h-9 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-xs font-medium text-muted-foreground">
                  <Switch
                    checked={includeTrial}
                    onCheckedChange={(checked) => {
                      setIncludeTrial(checked);
                      pushFilter(range, subscriptionCycle, displayMode, checked);
                    }}
                  />
                  预测显示
                </label>
                <Button
                  variant="outline"
                  className="h-9 rounded-full border-black/10 bg-white px-4 text-xs font-medium"
                  onClick={() => onExport?.()}
                >
                  <Download className="mr-2 size-4" />
                  导出 CSV
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-4 pt-2 sm:p-6 sm:pt-2">
          <div className="rounded-[28px] border border-black/10 bg-white/95 p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 border-b border-black/8 pb-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full border border-black/10 bg-black px-3 py-1 text-xs font-medium text-white">
                  续订率
                </Badge>
                <Badge variant="outline" className="rounded-full border-black/10 px-3 py-1 text-xs">
                  续订预测期
                </Badge>
                <Badge variant="outline" className="rounded-full border-black/10 px-3 py-1 text-xs">
                  首付 + Pn
                </Badge>
                <Badge variant="outline" className="rounded-full border-black/10 px-3 py-1 text-xs">
                  续订曲线
                </Badge>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 6, right: 10, left: -12, bottom: 18 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 8"
                    stroke="rgba(17,17,17,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="stage"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#8a8a8a", fontSize: 11 }}
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
                    tick={{ fill: "#8a8a8a", fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{
                      stroke: "rgba(17,17,17,0.12)",
                      strokeDasharray: "4 6",
                    }}
                    content={<RetentionTooltip displayMode={displayMode} />}
                  />
                  {RETENTION_SERIES.map((series) => (
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
              {RETENTION_SERIES.map((series) => (
                <div key={series.key} className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ backgroundColor: series.color }} />
                  <span>{series.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {dashboardData.stageCards.map((stage) => (
                <Card
                key={stage.stage}
                className="rounded-[24px] border-black/10 bg-white shadow-none"
              >
                <CardContent className="space-y-5 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-lg font-semibold">{stage.stage}</div>
                    <div className="text-sm font-medium text-muted-foreground">
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

          <Card className="rounded-[24px] border-black/10 bg-white shadow-none">
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
                                rowIndex === 0
                                  ? "bg-black"
                                  : "bg-muted-foreground/40",
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

