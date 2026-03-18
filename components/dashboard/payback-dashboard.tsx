"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  chartGridColor,
  defaultPaybackData,
  paybackChartConfig,
} from "@/lib/dashboard-data";
import { usePaybackMatrixData } from "@/lib/hooks/use-payback-matrix-data";
import { cn } from "@/lib/utils";
import type { FilterState, PaybackPageProps } from "@/src/types/dashboard";

type PaybackView = "renewal" | "daily";
type MatrixDisplay = "absolute" | "relative";
type MatrixHorizon = "6" | "12";

function formatCurrency(value: number) {
  return `¥${new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value)}`;
}

function formatPercent(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

function buildPaybackFilter(
  paybackView: PaybackView,
  matrixMetric: string,
  matrixGranularity: string,
  matrixDisplay: MatrixDisplay,
  horizon: MatrixHorizon,
): FilterState {
  return {
    paybackView,
    matrixMetric,
    matrixGranularity,
    matrixDisplay,
    horizon,
  };
}

function PaybackTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-popover/95 p-4 shadow-xl backdrop-blur">
      <div className="mb-3 text-sm font-semibold text-popover-foreground">{label}</div>
      <div className="space-y-2 text-sm">
        {payload.map((item) => (
          <div
            key={item.name}
            className="flex min-w-48 items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <div className="font-medium text-foreground">
              {item.name?.includes("留存")
                ? formatPercent(Number(item.value ?? 0))
                : formatCurrency(Number(item.value ?? 0))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getMatrixCellClass(value: number, display: MatrixDisplay) {
  if (display === "relative") {
    if (value >= 80) return "bg-foreground text-background";
    if (value >= 60) return "bg-foreground/85 text-background";
    if (value >= 40) return "bg-foreground/70 text-background";
    return "bg-muted text-muted-foreground";
  }

  if (value >= 420) return "bg-foreground text-background";
  if (value >= 340) return "bg-foreground/85 text-background";
  if (value >= 240) return "bg-foreground/70 text-background";
  return "bg-muted text-muted-foreground";
}

export function PaybackDashboard({
  data,
  onFilterChange,
  onExport,
  onPeriodChange,
}: PaybackPageProps) {
  const dashboardData = data ?? defaultPaybackData;
  const [paybackView, setPaybackView] = useState<PaybackView>("renewal");
  const [matrixMetric, setMatrixMetric] = useState(
    dashboardData.matrixMetricOptions[0] ?? "付费同期群",
  );
  const [matrixBreakdown, setMatrixBreakdown] = useState("人均 LTV");
  const [matrixGranularity, setMatrixGranularity] = useState(
    dashboardData.matrixGranularityOptions[0] ?? "按月同期群",
  );
  const [matrixDisplay, setMatrixDisplay] = useState<MatrixDisplay>("absolute");
  const [horizon, setHorizon] = useState<MatrixHorizon>("6");

  useEffect(() => {
    setMatrixMetric(dashboardData.matrixMetricOptions[0] ?? "付费同期群");
    setMatrixGranularity(dashboardData.matrixGranularityOptions[0] ?? "按月同期群");
  }, [dashboardData.matrixGranularityOptions, dashboardData.matrixMetricOptions]);

  const curveData =
    paybackView === "renewal" ? dashboardData.renewalCurve : dashboardData.dailyCurve;
  const { visibleColumns, matrixRows } = usePaybackMatrixData(
    dashboardData.matrixColumns,
    dashboardData.matrixRows,
    horizon,
    matrixDisplay,
  );

  const pushFilterChange = (
    nextView: PaybackView,
    nextMetric: string,
    nextGranularity: string,
    nextDisplay: MatrixDisplay,
    nextHorizon: MatrixHorizon,
  ) => {
    onFilterChange?.(
      buildPaybackFilter(
        nextView,
        nextMetric,
        nextGranularity,
        nextDisplay,
        nextHorizon,
      ),
    );
  };

  return (
    <DashboardShell eyebrow="收入与回收分析" title="回本分析">
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
          <CardTitle className="text-xl font-semibold">回本曲线</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4 pt-5 sm:p-6">
          <div className="rounded-[28px] border border-border bg-card p-4 sm:p-5">
            <div className="relative h-[300px] w-full">
              <div className="absolute left-0 top-0 z-10 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span>{dashboardData.curveLegendLabel}</span>
              </div>
              <div className="absolute right-0 top-0 z-10">
                <Tabs
                  value={paybackView}
                  onValueChange={(value) => {
                    const next = value as PaybackView;
                    setPaybackView(next);
                    onPeriodChange?.(next);
                    pushFilterChange(
                      next,
                      matrixMetric,
                      matrixGranularity,
                      matrixDisplay,
                      horizon,
                    );
                  }}
                >
                  <TabsList className="rounded-full border border-border bg-background p-1">
                    <TabsTrigger
                      value="renewal"
                      className="rounded-full px-3 py-1.5 text-xs font-medium data-[state=active]:bg-foreground data-[state=active]:text-background"
                    >
                      按续订
                    </TabsTrigger>
                    <TabsTrigger
                      value="daily"
                      className="rounded-full px-3 py-1.5 text-xs font-medium data-[state=active]:bg-foreground data-[state=active]:text-background"
                    >
                      按天
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={curveData}
                  margin={{ top: 28, right: 10, left: -8, bottom: 18 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 8"
                    stroke={chartGridColor}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: chartAxisColor, fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    width={48}
                    domain={[0, 360]}
                    ticks={[0, 90, 180, 270, 360]}
                    tickFormatter={(value) => `¥${value}`}
                    tick={{ fill: chartAxisColor, fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fill: chartAxisColor, fontSize: 11 }}
                  />
                  <Tooltip content={<PaybackTooltip />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cumulativeLtv"
                    name={paybackChartConfig[0].label}
                    stroke={paybackChartConfig[0].color}
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="retentionRate"
                    name={paybackChartConfig[1].label}
                    stroke={paybackChartConfig[1].color}
                    strokeWidth={2}
                    strokeDasharray="4 6"
                    dot={false}
                    isAnimationActive={false}
                    activeDot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
              {paybackChartConfig.map((item, index) => (
                <div key={item.key} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      index === 0 && "bg-foreground",
                    )}
                    style={index === 0 ? undefined : { backgroundColor: item.color }}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dashboardData.statCards.map((card) => (
              <Card
                key={card.label}
                className="rounded-[24px] border border-border bg-card shadow-none"
              >
                <CardContent className="space-y-3 p-5">
                  <div className="text-sm text-muted-foreground">{card.label}</div>
                  <div className="text-3xl font-semibold tracking-tight">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-panel overflow-hidden">
        <CardHeader className="gap-4 border-b border-border/60 pb-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <CardTitle className="text-xl font-semibold">同期群回本矩阵</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={matrixMetric}
                onValueChange={(value) => {
                  setMatrixMetric(value);
                  pushFilterChange(
                    paybackView,
                    value,
                    matrixGranularity,
                    matrixDisplay,
                    horizon,
                  );
                }}
              >
                <SelectTrigger className="h-9 w-[132px] rounded-full border-border bg-background text-xs font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dashboardData.matrixMetricOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={matrixBreakdown} onValueChange={setMatrixBreakdown}>
                <SelectTrigger className="h-9 w-[118px] rounded-full border-border bg-background text-xs font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="人均 LTV">人均 LTV</SelectItem>
                  <SelectItem value="累计 LTV">累计 LTV</SelectItem>
                  <SelectItem value="净利润">净利润</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={matrixGranularity}
                onValueChange={(value) => {
                  setMatrixGranularity(value);
                  pushFilterChange(
                    paybackView,
                    matrixMetric,
                    value,
                    matrixDisplay,
                    horizon,
                  );
                }}
              >
                <SelectTrigger className="h-9 w-[132px] rounded-full border-border bg-background text-xs font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dashboardData.matrixGranularityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ToggleGroup
                type="single"
                value={matrixDisplay}
                onValueChange={(value) => {
                  if (!value) return;
                  const next = value as MatrixDisplay;
                  setMatrixDisplay(next);
                  pushFilterChange(
                    paybackView,
                    matrixMetric,
                    matrixGranularity,
                    next,
                    horizon,
                  );
                }}
              >
                <ToggleGroupItem
                  value="absolute"
                  className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  绝对
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="relative"
                  className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  相对
                </ToggleGroupItem>
              </ToggleGroup>
              <ToggleGroup
                type="single"
                value={horizon}
                onValueChange={(value) => {
                  if (!value) return;
                  const next = value as MatrixHorizon;
                  setHorizon(next);
                  pushFilterChange(
                    paybackView,
                    matrixMetric,
                    matrixGranularity,
                    matrixDisplay,
                    next,
                  );
                }}
              >
                <ToggleGroupItem
                  value="6"
                  className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  6期
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="12"
                  className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  12期
                </ToggleGroupItem>
              </ToggleGroup>
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
        <CardContent className="space-y-6 p-4 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dashboardData.matrixSummary.map((item) => (
              <Card
                key={item.label}
                className="rounded-[24px] border border-border bg-card shadow-none"
              >
                <CardContent className="space-y-3 p-5">
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="text-2xl font-semibold tracking-tight">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.hint}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="overflow-x-auto rounded-[24px] border border-border bg-card p-2">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[120px]">同期群</TableHead>
                  <TableHead className="text-right">人数</TableHead>
                  {visibleColumns.map((column) => (
                    <TableHead key={column} className="text-center">
                      {column}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">累计收入</TableHead>
                  <TableHead className="text-right">均值 LTV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrixRows.map((row) => (
                  <TableRow key={row.cohort} className="hover:bg-transparent">
                    <TableCell className="font-medium">{row.cohort}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {row.users}
                    </TableCell>
                    {row.values.map((value, index) => (
                      <TableCell key={`${row.cohort}-${index}`} className="p-2">
                        <div
                          className={cn(
                            "rounded-xl px-3 py-2 text-center text-sm font-semibold",
                            getMatrixCellClass(value, matrixDisplay),
                          )}
                        >
                          {matrixDisplay === "relative"
                            ? formatPercent(value)
                            : formatCurrency(value)}
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-right font-medium">
                      {row.totalRevenue}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {row.averageLtv}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
