import type { PaybackData, RetentionData } from "@/src/types/dashboard";

export const defaultRetentionData: RetentionData = {
  summaryMetrics: [
    {
      label: "试用 → 付费",
      value: "68.2%",
      hint: "新试用用户次月转化为主订阅的整体效率",
    },
    {
      label: "P2 续订率",
      value: "72.0%",
      hint: "留存的第一关键节点，影响年度续费预期",
      tone: "highlight",
    },
    {
      label: "P3 续订率",
      value: "51.8%",
      hint: "试了第二次续订之后，用户留存开始明显分化",
    },
    {
      label: "被动流失",
      value: "1.5%",
      hint: "订阅失败或支付失效导致的系统性流失",
    },
  ],
  subscriptionCycles: ["按订阅周期", "全部", "月付", "年付", "季付"],
  curve: [
    { stage: "首付", overall: 100, monthly: 100, yearly: 100, quarterly: 100, overallUsers: 10000, monthlyUsers: 5600, yearlyUsers: 2400, quarterlyUsers: 2000, revenue: 999900 },
    { stage: "P2", overall: 72, monthly: 67, yearly: 84, quarterly: 70, overallUsers: 7200, monthlyUsers: 3752, yearlyUsers: 2016, quarterlyUsers: 1400, revenue: 719900 },
    { stage: "P3", overall: 51.8, monthly: 43.2, yearly: 69.4, quarterly: 54.1, overallUsers: 5184, monthlyUsers: 2419, yearlyUsers: 1666, quarterlyUsers: 1082, revenue: 518300 },
    { stage: "P4", overall: 37.3, monthly: 28.8, yearly: 56.2, quarterly: 38.4, overallUsers: 3732, monthlyUsers: 1613, yearlyUsers: 1349, quarterlyUsers: 768, revenue: 373200 },
    { stage: "P5", overall: 26.9, monthly: 18.7, yearly: 46.8, quarterly: 28.2, overallUsers: 2687, monthlyUsers: 1047, yearlyUsers: 1123, quarterlyUsers: 564, revenue: 268700 },
    { stage: "P6", overall: 19.4, monthly: 12.5, yearly: 39.8, quarterly: 20.8, overallUsers: 1935, monthlyUsers: 700, yearlyUsers: 955, quarterlyUsers: 416, revenue: 193500 },
    { stage: "P7", overall: 13.9, monthly: 8.4, yearly: 34.1, quarterly: 15.3, overallUsers: 1393, monthlyUsers: 470, yearlyUsers: 818, quarterlyUsers: 306, revenue: 139300 },
    { stage: "P8", overall: 10, monthly: 5.3, yearly: 29.3, quarterly: 11.7, overallUsers: 1003, monthlyUsers: 297, yearlyUsers: 703, quarterlyUsers: 234, revenue: 100300 },
  ],
  stageCards: [
    { stage: "首付", retention: 100, activeUsers: 10000, revenue: "¥99.99" },
    { stage: "P2", retention: 72, activeUsers: 7200, revenue: "¥71.99" },
    { stage: "P3", retention: 51.8, activeUsers: 5184, revenue: "¥51.83" },
    { stage: "P4", retention: 37.3, activeUsers: 3732, revenue: "¥37.32" },
    { stage: "P5", retention: 26.9, activeUsers: 2687, revenue: "¥26.87" },
    { stage: "P6", retention: 19.4, activeUsers: 1935, revenue: "¥19.35" },
    { stage: "P7", retention: 13.9, activeUsers: 1393, revenue: "¥13.93" },
    { stage: "P8", retention: 10, activeUsers: 1003, revenue: "¥10.03" },
  ],
  segmentColumns: ["首付", "P2", "P3", "P4", "P5", "P6", "P7", "P8"],
  segmentRows: [
    { group: "整体", values: [100, 72, 51.8, 37.3, 26.9, 19.4, 13.9, 10] },
    { group: "月付", values: [100, 67, 43.2, 28.8, 18.7, 12.5, 8.4, 5.3] },
    { group: "年付", values: [100, 84, 69.4, 56.2, 46.8, 39.8, 34.1, 29.3] },
    { group: "季付", values: [100, 70, 54.1, 38.4, 28.2, 20.8, 15.3, 11.7] },
    { group: "试用转正", values: [68.2, 54.7, 41.1, 31.6, 24.3, 18.2, 13.4, 9.8] },
  ],
};

export const defaultPaybackData: PaybackData = {
  summaryMetrics: [
    { label: "整体 LTV", value: "¥350.18", hint: "覆盖所有付费周期 cohort 的累计收入贡献" },
    { label: "90 日 LTV", value: "¥3,645.00", hint: "第三个月内累计贡献，用于衡量初期效率" },
    { label: "回本周期", value: "21 天", hint: "投放回收完成于大盘层面", tone: "highlight" },
    { label: "LTV / CAC", value: "3.2", hint: "高于 3 通常意味着投放模型具备扩张空间" },
  ],
  renewalCurve: [
    { period: "P1", cumulativeLtv: 92, retentionRate: 100 },
    { period: "P2", cumulativeLtv: 176, retentionRate: 61 },
    { period: "P3", cumulativeLtv: 228, retentionRate: 42 },
    { period: "P4", cumulativeLtv: 264, retentionRate: 29 },
    { period: "P5", cumulativeLtv: 289, retentionRate: 19 },
    { period: "P6", cumulativeLtv: 307, retentionRate: 12.5 },
    { period: "P7", cumulativeLtv: 320, retentionRate: 8.2 },
    { period: "P8", cumulativeLtv: 330, retentionRate: 5.5 },
    { period: "P9", cumulativeLtv: 338, retentionRate: 3.7 },
    { period: "P10", cumulativeLtv: 344, retentionRate: 2.5 },
    { period: "P11", cumulativeLtv: 348, retentionRate: 1.6 },
    { period: "P12", cumulativeLtv: 350.18, retentionRate: 0.8 },
  ],
  dailyCurve: [
    { period: "D1", cumulativeLtv: 18, retentionRate: 100 },
    { period: "D7", cumulativeLtv: 52, retentionRate: 88 },
    { period: "D14", cumulativeLtv: 119, retentionRate: 72 },
    { period: "D21", cumulativeLtv: 182, retentionRate: 54 },
    { period: "D30", cumulativeLtv: 228, retentionRate: 41 },
    { period: "D45", cumulativeLtv: 274, retentionRate: 26 },
    { period: "D60", cumulativeLtv: 309, retentionRate: 17 },
    { period: "D75", cumulativeLtv: 333, retentionRate: 10 },
    { period: "D90", cumulativeLtv: 350.18, retentionRate: 6 },
  ],
  statCards: [
    { label: "按续订维度整体 LTV", value: "¥350.18" },
    { label: "按日累计收入", value: "¥747,179.00" },
    { label: "留存窗口内 LTV", value: "¥1,663.60" },
    { label: "回收完成周期", value: "18 个月" },
  ],
  matrixSummary: [
    { label: "最近 Cohort", value: "2024-10", hint: "当前观察下最新的第一批用户" },
    { label: "追踪窗口", value: "6 月 / 按续订维度", hint: "按已完成窗口展示成熟 cohort" },
    { label: "观察口径", value: "付费同期群", hint: "按注册月归档付费用户" },
    { label: "主指标", value: "人均 LTV", hint: "单 cohort 用户平均生命周期价值" },
  ],
  matrixMetricOptions: ["付费同期群", "人均 LTV", "净收入"],
  matrixGranularityOptions: ["按月同期群", "按周同期群", "按渠道同期群"],
  matrixColumns: ["P1", "P2", "P3", "P4", "P5", "P6"],
  matrixRows: [
    { cohort: "2024-12", users: 319, values: [111.12, 204.81, 280.54, 345.81, 405.39, 458.27], totalRevenue: "¥92,673.00", averageLtv: "¥1,476.43" },
    { cohort: "2024-11", users: 389, values: [102.59, 187.38, 259.47, 314.75, 362.13, 408.47], totalRevenue: "¥188,490.00", averageLtv: "¥1,656.91" },
    { cohort: "2024-10", users: 428, values: [97.26, 173.42, 248.91, 296.47, 338.15, 389.24], totalRevenue: "¥214,357.00", averageLtv: "¥1,707.38" },
    { cohort: "2024-09", users: 401, values: [92.84, 165.17, 232.66, 281.53, 327.4, 372.09], totalRevenue: "¥198,204.00", averageLtv: "¥1,541.88" },
    { cohort: "2024-08", users: 366, values: [88.39, 158.44, 219.93, 267.36, 309.55, 351.62], totalRevenue: "¥173,920.00", averageLtv: "¥1,482.21" },
  ],
};

