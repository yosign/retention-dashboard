"use client";

import { useMemo, useState, useEffect } from "react";
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

function formatPercent(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

function getHeatmapStrength(value: number, display: MatrixDisplay) {
  const normalizedValue = display === "relative" ? value / 100 : value / 460;
  // 渐变范围：5%（极淡）到 60%（深色），与参考图热力图层次匹配
  return Math.max(5, Math.min(60, Math.round(normalizedValue * 60)));
}

function buildPaybackFilter(
  paybackView: PaybackView,
  matrixMetric: string,
  matrixGranularity: string,
  matrixDisplay: MatrixDisplay,
  horizon: MatrixHorizon,
): FilterState {
  return { paybackView, matrixMetric, matrixGranularity, matrixDisplay, horizon };
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
    <div className="rounded-xl border border-border bg-popover p-4 text-sm">
      <div className="mb-3 font-medium text-popover-foreground">{label}</div>
      <div className="space-y-2">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <div className="font-medium text-foreground">
              {item.name?.includes("留存") ? formatPercent(Number(item.value ?? 0)) : formatCurrency(Number(item.value ?? 0))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaybackDashboard({
  data,
  onFilterChange,
  onExport,
  onPeriodChange,
}: PaybackPageProps) {
  const dashboardData = data ?? defaultPaybackData;
  const [paybackView, setPaybackView] = useState<PaybackView>("renewal");
  const [matrixMetric, setMatrixMetric] = useState(dashboardData.matrixMetricOptions[0] ?? "付费同期群");
  const [matrixBreakdown, setMatrixBreakdown] = useState("人均 LTV");
  const [matrixGranularity, setMatrixGranularity] = useState(dashboardData.matrixGranularityOptions[0] ?? "按月同期群");
  const [matrixDisplay, setMatrixDisplay] = useState<MatrixDisplay>("absolute");
  const [horizon, setHorizon] = useState<MatrixHorizon>("6");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const curveData = paybackView === "renewal" ? dashboardData.renewalCurve : dashboardData.dailyCurve;
  const { visibleColumns, matrixRows } = usePaybackMatrixData(
    dashboardData.matrixColumns,
    dashboardData.matrixRows,
    horizon,
    matrixDisplay,
  );

  const infoCards = useMemo(() => dashboardData.matrixSummary, [dashboardData.matrixSummary]);

  const pushFilterChange = (
    nextView: PaybackView,
    nextMetric: string,
    nextGranularity: string,
    nextDisplay: MatrixDisplay,
    nextHorizon: MatrixHorizon,
  ) => {
    onFilterChange?.(
      buildPaybackFilter(nextView, nextMetric, nextGranularity, nextDisplay, nextHorizon),
    );
  };

  return (
    <DashboardShell eyebrow="收入与回收分析" title="回本分析">
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-4">
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

      <Card className="rounded-2xl bg-card">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-semibold">回本曲线</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-5 pt-0">
          <div className="rounded-2xl border border-border bg-background p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="text-sm text-muted-foreground">{dashboardData.curveLegendLabel}</div>
              <Tabs
                value={paybackView}
                onValueChange={(value) => {
                  const next = value as PaybackView;
                  setPaybackView(next);
                  onPeriodChange?.(next);
                  pushFilterChange(next, matrixMetric, matrixGranularity, matrixDisplay, horizon);
                }}
              >
                <TabsList className="h-10 rounded-none border-b border-border bg-transparent p-0">
                  <TabsTrigger
                    value="renewal"
                    className="h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 text-sm font-medium text-muted-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                  >
                    按续订
                  </TabsTrigger>
                  <TabsTrigger
                    value="daily"
                    className="h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 text-sm font-medium text-muted-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                  >
                    按天
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="h-[320px]">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={curveData} margin={{ top: 8, right: 8, left: -14, bottom: 14 }}>
                    <CartesianGrid stroke={chartGridColor} vertical={false} />
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
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                      isAnimationActive={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="retentionRate"
                      name={paybackChartConfig[1].label}
                      stroke={paybackChartConfig[1].color}
                      strokeWidth={1.8}
                      strokeDasharray="4 6"
                      dot={false}
                      activeDot={{ r: 4 }}
                      isAnimationActive={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              {paybackChartConfig.map((series) => (
                <div key={series.key} className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ backgroundColor: series.color }} />
                  <span>{series.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-4">
              {dashboardData.statCards.map((card) => (
                <Card key={card.label} className="rounded-xl bg-card">
                  <CardContent className="space-y-2 p-5">
                    <div className="text-sm text-muted-foreground">{card.label}</div>
                    <div className="text-3xl font-semibold tracking-tight">{card.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-card">
        <CardHeader className="space-y-5 p-5 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-base font-semibold">同期群回本矩阵</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={matrixMetric}
                onValueChange={(value) => {
                  setMatrixMetric(value);
                  pushFilterChange(paybackView, value, matrixGranularity, matrixDisplay, horizon);
                }}
              >
                <SelectTrigger className="h-10 w-[132px] rounded-xl border-border bg-background text-sm">
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
                <SelectTrigger className="h-10 w-[112px] rounded-xl border-border bg-background text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="人均 LTV">人均 LTV</SelectItem>
                  <SelectItem value="累计 LTV">累计 LTV</SelectItem>
                  <SelectItem value="净收入">净收入</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={matrixGranularity}
                onValueChange={(value) => {
                  setMatrixGranularity(value);
                  pushFilterChange(paybackView, matrixMetric, value, matrixDisplay, horizon);
                }}
              >
                <SelectTrigger className="h-10 w-[132px] rounded-xl border-border bg-background text-sm">
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
                  pushFilterChange(paybackView, matrixMetric, matrixGranularity, next, horizon);
                }}
                className="gap-0 rounded-xl border border-border bg-background p-1"
              >
                <ToggleGroupItem
                  value="absolute"
                  className="rounded-xl px-3 text-sm data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  #绝对
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="relative"
                  className="rounded-xl px-3 text-sm data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  %相对
                </ToggleGroupItem>
              </ToggleGroup>

              <ToggleGroup
                type="single"
                value={horizon}
                onValueChange={(value) => {
                  if (!value) return;
                  const next = value as MatrixHorizon;
                  setHorizon(next);
                  pushFilterChange(paybackView, matrixMetric, matrixGranularity, matrixDisplay, next);
                }}
                className="gap-0 rounded-xl border border-border bg-background p-1"
              >
                <ToggleGroupItem
                  value="6"
                  className="rounded-xl px-3 text-sm data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  6期
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="12"
                  className="rounded-xl px-3 text-sm data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  12期
                </ToggleGroupItem>
              </ToggleGroup>

              <Button variant="outline" className="h-10 rounded-xl border-border px-4 text-sm" onClick={() => onExport?.()}>
                <Download className="size-4" />
                导出 CSV
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5 pt-0">
          <div className="grid gap-4 xl:grid-cols-4">
            {infoCards.map((item) => (
              <Card key={item.label} className="rounded-xl bg-card">
                <CardContent className="space-y-2 p-5">
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="text-2xl font-semibold tracking-tight">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.hint}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-background p-3">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[110px]">同期群</TableHead>
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
                    <TableCell className="text-right text-muted-foreground">{row.users}</TableCell>
                    {row.values.map((value, index) => (
                      <TableCell key={`${row.cohort}-${index}`} className="p-2">
                        <div
                          className={cn("rounded-xl px-3 py-2 text-center text-sm font-semibold")}
                          style={{
                            backgroundColor: `color-mix(in srgb, hsl(var(--foreground)) ${getHeatmapStrength(value, matrixDisplay)}%, transparent)`,
                            color:
                              getHeatmapStrength(value, matrixDisplay) > 40
                                ? "hsl(var(--background))"
                                : "hsl(var(--foreground))",
                          }}
                        >
                          {matrixDisplay === "relative" ? formatPercent(value) : formatCurrency(value)}
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-right font-medium">{row.totalRevenue}</TableCell>
                    <TableCell className="text-right font-medium">{row.averageLtv}</TableCell>
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
