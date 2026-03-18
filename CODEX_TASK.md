# Codex Task: Visual Fix + shadcn/ui Best Practices Refactor

## 背景
项目已部署到 Vercel，但截图对比参考图有差异，同时代码未完全遵循 shadcn/ui 最佳实践。
本次任务分两步：先按 shadcn 最佳实践重构基础结构，再逐一修复视觉细节。

---

## 第一步：shadcn/ui 最佳实践修复

### 1.1 检查 components.json，确保配置正确
```bash
cat components.json
```
不要擅自更换 style、icon library、base color、导入别名和 Tailwind 路径。

### 1.2 目录结构规范
严格遵守以下职责边界：
- `/components/ui/` — 只放 shadcn 基础组件（不包含业务逻辑）
- `/components/dashboard/` — 业务通用组件（DashboardShell, MetricCard 等）
- `/app/retention/` 和 `/app/payback/` — 页面只做装配，不写 UI 逻辑
- `/lib/dashboard-data.ts` — 数据和类型
- `/lib/hooks/` — 自定义 hooks（如 useChartData）

### 1.3 主题使用 CSS variables
- 禁止在组件里硬编码颜色（如 `#000000`、`text-black`）
- 必须使用 `bg-background`、`text-foreground`、`border-border` 等 design token
- 黑色高亮卡片使用 `bg-foreground text-background`（自动适配主题）
- 图表颜色定义在 `lib/dashboard-data.ts` 的 chartConfig 中，用 `hsl(var(--chart-1))` 格式

### 1.4 优先复用现有 shadcn 组件
检查并使用已有组件，缺少时用 `npx shadcn@latest add <component>`：
- KPI 卡片 → `Card, CardHeader, CardContent`
- 切换按钮 → `ToggleGroup, ToggleGroupItem`
- Tab 切换 → `Tabs, TabsList, TabsTrigger`
- 数据表格 → `Table, TableHeader, TableRow, TableCell`
- 下拉选择 → `Select, SelectTrigger, SelectContent, SelectItem`
- 开关 → `Switch`
- 徽章 → `Badge`

---

## 第二步：Retention 页面视觉修复

### 2.1 KPI 卡片等宽
- 4张卡片必须等宽：`grid grid-cols-4 gap-4`
- P2卡片用 `bg-foreground text-background`（黑底白字）
- 所有卡片加边框：`border border-border`
- 百分比格式：去掉小数点，显示 `72%` 而非 `72.0%`

### 2.2 Tab 命名修正
- Tab 1: `续订率`（默认选中，黑色填充激活态）
- Tab 2: `续订预测期`
- Tab 3: `首付 → Pn`
- Tab 4: `续订曲线`
- 激活态样式：`data-[state=active]:bg-foreground data-[state=active]:text-background`

### 2.3 工具栏布局
按以下顺序单行排列：时间段选择 → 订阅周期（月付/年付/季付/全部）→ 百分比/绝对值切换 → "同时显示" → "包含试用"开关 → 导出CSV

### 2.4 数据表格
- 加标题：`分段数据表`
- 完整显示 5 行：整体 / 月付 / 年付 / 季付 / 试用矫正
- 使用 shadcn Table 组件

### 2.5 阶段卡片样式
- 每个卡片加 `border border-border rounded-lg`
- 百分比右对齐，加粗

---

## 第三步：Payback 页面视觉修复

### 3.1 KPI 卡片加边框
同 Retention，4卡片等宽 + 加 border

### 3.2 回本曲线图例
- "P1→P12 累计LTV" 标签移到图表内部左上角
- "按续订/按天" 切换按钮移到卡片右上角内部

### 3.3 同期群矩阵按钮文字
- `绝对`（不加 # 前缀）
- `相对`（不加 % 前缀）
- `6期` / `12期`

### 3.4 信息卡片标题统一
| 位置 | 文案 |
|------|------|
| 左上 | 最近 Cohort |
| 左下 | 追踪窗口 |
| 右上 | 观察口径 |
| 右下 | 主指标 |

### 3.5 回本曲线下方统计卡片文案
| 位置 | 文案 |
|------|------|
| 第1卡 | 按续订维度整体 LTV |
| 第2卡 | 按日累计收入 |
| 第3卡 | 留存窗口内 LTV |
| 第4卡 | 回收完成周期 |

---

## 截图验证流程

每修复一个模块后运行：
```bash
node screenshot.mjs
```
生成截图后与参考图对比，确认修复正确。

参考图位置：
- `C:/Users/Lenovo/.openclaw/workspace/retention-dashboard/ref-retention.jpg`
- `C:/Users/Lenovo/.openclaw/workspace/retention-dashboard/ref-payback.jpg`

---

## 完成标准
1. 截图与参考图在布局/颜色/组件细节上高度吻合
2. 所有 UI 组件复用 shadcn/ui，无重复造轮子
3. 无硬编码颜色，全部使用 CSS variables
4. 目录结构符合规范
5. `npm run build` 通过

完成后保存最终截图为 `retention-v4.png` 和 `payback-v4.png`，并报告完成。
