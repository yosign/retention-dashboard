"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  chartAxisColor,
  chartCursorColor,
  chartGridColor,
  defaultForecastData,
  forecastRevenueChartConfig,
  forecastSubscriberChartConfig,
} from "@/lib/dashboard-data";
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
    <div className="rounded-xl border border-border bg-popover p-4 text-sm">
      <div className="mb-3 font-medium text-popover-foreground">{label}</div>
      <div className="space-y-2">
        {visibleItems.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <div className="font-medium text-foreground">{valueFormatter(Number(item.value))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderLegend(value: ReadonlyArray<{ color?: string; value?: string }> | undefined) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
      {value.map((item) => (
        <div key={item.value} className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
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
  isMounted,
}: {
  title: string;
  data: ForecastChartPoint[];
  actualKey: "actualRevenue" | "actualSubscribers";
  forecastKey: "forecastRevenue" | "forecastSubscribers";
  config: typeof forecastRevenueChartConfig;
  yDomain: [number, number];
  yTicks: number[];
  valueFormatter: (value: number) => string;
  isMounted: boolean;
}) {
  return (
    <Card className="rounded-2xl bg-card">
      <CardHeader className="p-5 pb-0">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-3">
        <div className="h-[340px]">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: -14, bottom: 12 }}>
                <defs>
                  <linearGradient id={`${actualKey}-fill`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={config[0].color} stopOpacity={0.14} />
                    <stop offset="100%" stopColor={config[0].color} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id={`${forecastKey}-fill`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={config[1].color} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={config[1].color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartGridColor} vertical={false} />
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
                  content={(props) => renderLegend(props.payload)}
                />
                <Area
                  type="monotone"
                  dataKey={actualKey}
                  name={config[0].label}
                  stroke="none"
                  fill={`url(#${actualKey}-fill)`}
                  legendType="none"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey={forecastKey}
                  name={config[1].label}
                  stroke="none"
                  fill={`url(#${forecastKey}-fill)`}
                  legendType="none"
                  isAnimationActive={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey={actualKey}
                  name={config[0].label}
                  stroke={config[0].color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey={forecastKey}
                  name={config[1].label}
                  stroke={config[1].color}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function ForecastDashboard({ data }: ForecastPageProps) {
  const dashboardData = data ?? defaultForecastData;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <DashboardShell
      title="收入预测"
      description="基于留存曲线和近期收入变化，对未来收入与订阅规模进行预测。"
    >
      <section className="rounded-2xl border border-border bg-card">
        <div className="grid gap-0 divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
          {dashboardData.summaryMetrics.map((metric) => (
            <div key={metric.label} className="space-y-2 p-5">
              <div className="text-sm text-muted-foreground">{metric.label}</div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-semibold tracking-tight">{metric.value}</div>
                {metric.badge ? (
                  <span className="text-sm font-medium text-destructive">{metric.badge}</span>
                ) : null}
              </div>
              <div className="text-sm text-muted-foreground">{metric.hint}</div>
            </div>
          ))}
        </div>
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
        isMounted={isMounted}
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
        isMounted={isMounted}
      />

      <Card className="rounded-2xl bg-card">
        <CardContent className="space-y-5 p-5">
          <div className="flex flex-col gap-4 border border-border rounded-xl p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-base font-semibold">交叉验证</div>
              <div className="flex flex-wrap items-center gap-6">
                {dashboardData.validationLinks.map((item) => {
                  const Icon = getValidationIcon(item.icon);

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {dashboardData.validationMetrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-border bg-background p-5">
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight">{metric.value}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{metric.hint}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
