"use client";

import Link from "next/link";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  chartAxisColor,
  chartCursorColor,
  chartGridColor,
  defaultForecastData,
  forecastRevenueChartConfig,
  forecastSubscriberChartConfig,
} from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import type {
  ForecastChartPoint,
  ForecastPageProps,
  ForecastValidationLink,
} from "@/src/types/dashboard";

function formatUsdThousands(value: number) {
  return `$${value}k`;
}

function formatSubscribersThousands(value: number) {
  return `${value.toFixed(1)}k`;
}

function ForecastTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
  valueFormatter: (value: number) => string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const visibleItems = payload.filter((item) => typeof item.value === "number");

  if (!visibleItems.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-popover/95 p-4 shadow-xl backdrop-blur">
      <div className="mb-3 text-sm font-semibold text-popover-foreground">{label}</div>
      <div className="space-y-2 text-sm">
        {visibleItems.map((item) => (
          <div
            key={item.name}
            className="flex min-w-44 items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <div className="font-medium text-foreground">
              {valueFormatter(Number(item.value))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderLegend(
  value: ReadonlyArray<{ color?: string; value?: string }> | undefined,
  dottedKeys: string[],
) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
      {value.map((item) => (
        <div key={item.value} className="flex items-center gap-2">
          <span
            className={cn(
              "inline-block size-2 rounded-full",
              item.value && dottedKeys.includes(item.value) && "opacity-90",
            )}
            style={{ backgroundColor: item.color }}
          />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function getValidationIcon(icon: ForecastValidationLink["icon"]) {
  switch (icon) {
    case "bar-chart":
      return BarChart3;
    case "trend-up":
      return TrendingUp;
    case "trend-down":
      return TrendingDown;
    case "currency":
      return DollarSign;
  }
}

function ForecastChartCard({
  title,
  data,
  actualKey,
  forecastKey,
  config,
  yDomain,
  yTicks,
  valueFormatter,
}: {
  title: string;
  data: ForecastChartPoint[];
  actualKey: "actualRevenue" | "actualSubscribers";
  forecastKey: "forecastRevenue" | "forecastSubscribers";
  config: typeof forecastRevenueChartConfig;
  yDomain: [number, number];
  yTicks: number[];
  valueFormatter: (value: number) => string;
}) {
  return (
    <Card className="dashboard-panel overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-3 sm:p-6">
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 16, right: 12, left: -8, bottom: 12 }}>
              <defs>
                <linearGradient id={`${actualKey}-fill`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config[0].color} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={config[0].color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 8" stroke={chartGridColor} vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: chartAxisColor, fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={58}
                domain={yDomain}
                ticks={yTicks}
                tickFormatter={valueFormatter}
                tick={{ fill: chartAxisColor, fontSize: 11 }}
              />
              <Tooltip
                cursor={{ stroke: chartCursorColor, strokeDasharray: "4 6" }}
                content={<ForecastTooltip valueFormatter={valueFormatter} />}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                content={(props) => renderLegend(props.payload, [config[1].label])}
              />
              <ReferenceLine
                x="12月"
                stroke="color-mix(in oklab, hsl(var(--foreground)) 16%, transparent)"
                strokeDasharray="4 6"
              />
              <Area
                type="monotone"
                dataKey={actualKey}
                name={config[0].label}
                stroke="none"
                fill={`url(#${actualKey}-fill)`}
                legendType="none"
                isAnimationActive={false}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey={actualKey}
                name={config[0].label}
                stroke={config[0].color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey={forecastKey}
                name={config[1].label}
                stroke={config[1].color}
                strokeWidth={2.2}
                strokeDasharray="4 6"
                dot={false}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function ForecastDashboard({ data }: ForecastPageProps) {
  const dashboardData = data ?? defaultForecastData;

  return (
    <DashboardShell
      eyebrow="收入与订阅预测"
      title="收入预测"
      description="基于趋势和同期群数据预测未来收入与订阅数变化"
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardData.summaryMetrics.map((metric) => (
          <div key={metric.label} className="relative">
            <MetricCard label={metric.label} value={metric.value} hint={metric.hint} />
            {metric.badge ? (
              <Badge
                className={cn(
                  "absolute right-5 top-5 rounded-full border border-transparent px-2.5 py-1 text-xs font-medium shadow-none",
                  metric.badgeTone === "positive"
                    ? "text-foreground"
                    : "bg-muted text-muted-foreground",
                )}
                style={
                  metric.badgeTone === "positive"
                    ? {
                        backgroundColor:
                          "color-mix(in oklab, var(--chart-1) 18%, var(--card))",
                        color: "var(--chart-7)",
                      }
                    : undefined
                }
              >
                {metric.badge}
              </Badge>
            ) : null}
          </div>
        ))}
      </section>

      <ForecastChartCard
        title="收入预测"
        data={dashboardData.chart}
        actualKey="actualRevenue"
        forecastKey="forecastRevenue"
        config={forecastRevenueChartConfig}
        yDomain={[385, 605]}
        yTicks={[385, 440, 495, 550, 605]}
        valueFormatter={formatUsdThousands}
      />

      <ForecastChartCard
        title="订阅数预测"
        data={dashboardData.chart}
        actualKey="actualSubscribers"
        forecastKey="forecastSubscribers"
        config={forecastSubscriberChartConfig}
        yDomain={[6, 12]}
        yTicks={[6, 7.5, 9, 10.5, 12]}
        valueFormatter={formatSubscribersThousands}
      />

      <Card className="dashboard-panel overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">交叉验证</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4 pt-2 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dashboardData.validationLinks.map((item) => {
              const Icon = getValidationIcon(item.icon);

              return (
                <Link key={item.title} href={item.href}>
                  <Card className="h-full rounded-[24px] border border-border bg-card transition-colors hover:bg-accent/40">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-muted text-foreground">
                        <Icon className="size-5" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-base font-semibold">{item.title}</div>
                        <div className="text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {dashboardData.validationMetrics.map((metric) => (
              <Card
                key={metric.label}
                className="rounded-[24px] border border-border bg-card shadow-none"
              >
                <CardContent className="space-y-3 p-5">
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                  <div className="text-3xl font-semibold tracking-tight">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.hint}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
