export interface FilterState {
  range?: string;
  subscriptionCycle?: string;
  displayMode?: string;
  includeTrial?: boolean;
  paybackView?: string;
  matrixMetric?: string;
  matrixGranularity?: string;
  matrixDisplay?: string;
  horizon?: string;
  [key: string]: string | boolean | undefined;
}

export interface SummaryMetric {
  label: string;
  value: string;
  hint: string;
  tone?: "default" | "highlight";
}

export interface ChartSeriesConfig {
  key: string;
  label: string;
  color: string;
}

export interface DashboardTabItem {
  value: string;
  label: string;
}

export interface RetentionCurvePoint {
  stage: string;
  overall: number;
  monthly: number;
  yearly: number;
  quarterly: number;
  overallUsers: number;
  monthlyUsers: number;
  yearlyUsers: number;
  quarterlyUsers: number;
  revenue: number;
}

export interface RetentionStageCard {
  stage: string;
  retention: number;
  activeUsers: number;
  revenue: string;
}

export interface RetentionSegmentRow {
  group: string;
  values: number[];
}

export interface RetentionData {
  summaryMetrics: SummaryMetric[];
  curve: RetentionCurvePoint[];
  stageCards: RetentionStageCard[];
  segmentColumns: string[];
  segmentRows: RetentionSegmentRow[];
  subscriptionCycles: string[];
  periodOptions: Array<{ value: string; label: string }>;
  viewTabs: DashboardTabItem[];
}

export interface RetentionPageProps {
  data?: RetentionData;
  onFilterChange?: (filter: FilterState) => void;
  onExport?: () => void;
  onPeriodChange?: (period: string) => void;
}

export interface PaybackCurvePoint {
  period: string;
  cumulativeLtv: number;
  retentionRate: number;
}

export interface PaybackStatCard {
  label: string;
  value: string;
}

export interface PaybackMatrixSummary {
  label: string;
  value: string;
  hint: string;
}

export interface PaybackMatrixRow {
  cohort: string;
  users: number;
  values: number[];
  totalRevenue: string;
  averageLtv: string;
}

export interface PaybackData {
  summaryMetrics: SummaryMetric[];
  renewalCurve: PaybackCurvePoint[];
  dailyCurve: PaybackCurvePoint[];
  statCards: PaybackStatCard[];
  matrixColumns: string[];
  matrixRows: PaybackMatrixRow[];
  matrixSummary: PaybackMatrixSummary[];
  matrixMetricOptions: string[];
  matrixGranularityOptions: string[];
  curveLegendLabel: string;
}

export interface PaybackPageProps {
  data?: PaybackData;
  onFilterChange?: (filter: FilterState) => void;
  onExport?: () => void;
  onPeriodChange?: (period: string) => void;
}

export interface ForecastSummaryMetric extends SummaryMetric {
  badge?: string;
  badgeTone?: "default" | "positive" | "negative";
}

export interface ForecastChartPoint {
  month: string;
  actualRevenue: number | null;
  forecastRevenue: number | null;
  actualSubscribers: number | null;
  forecastSubscribers: number | null;
}

export interface ForecastValidationLink {
  href: string;
  title: string;
  description: string;
  icon: "bar-chart" | "trend-up" | "trend-down" | "currency";
}

export interface ForecastValidationMetric {
  label: string;
  value: string;
  hint: string;
}

export interface ForecastData {
  summaryMetrics: ForecastSummaryMetric[];
  chart: ForecastChartPoint[];
  validationLinks: ForecastValidationLink[];
  validationMetrics: ForecastValidationMetric[];
}

export interface ForecastPageProps {
  data?: ForecastData;
}
