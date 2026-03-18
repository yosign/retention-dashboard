# Codex Task V3: 完整重构 — 严格对齐设计图 + shadcn/ui 最佳实践

## 重要背景
之前的实现有严重问题，本次必须从根本上重构。参考图是最终标准，不达标不结束。

---

## 【第零步】先理解参考图风格

参考图风格特征（必须严格遵守）：
- **无蓝色**：整个页面不出现蓝色，包括 focus ring、border、outline
- **无硬编码颜色**：所有颜色用 CSS variables（`bg-background`、`text-foreground`、`border-border`等）
- **卡片无边框或极细边框**：不用蓝色描边，border 用 `border-border`（灰色）
- **统一圆角**：只用两种 —— `rounded-2xl`（大容器）和 `rounded-xl`（小卡片/按钮）。**禁止胶囊形 rounded-full 用于容器**
- **Tab 是下划线风格**：激活态是底部下划线，不是胶囊/填充背景
- **按钮统一**：小操作按钮用 `variant="outline"` 或 `variant="ghost"`，激活用 `bg-foreground text-background`
- **布局紧凑但有呼吸感**：卡片之间 `gap-4`，内边距 `p-5` 或 `p-6`

---

## 【第一步】确认项目基础配置（不要改动）

```bash
cat components.json
```

components.json 目前配置：
- style: radix-nova
- baseColor: neutral
- cssVariables: true
- iconLibrary: lucide
- aliases: components→@/components, ui→@/components/ui, hooks→@/hooks

**禁止修改这些配置，所有新增 UI 必须兼容当前 components.json。**

---

## 【第二步】检查并补全 shadcn 组件

先检查现有组件：
```bash
ls components/ui/
```

确认以下组件存在，缺少的用 `npx shadcn@latest add` 添加：
- tabs ✓（已有）
- card ✓（已有）
- button ✓（已有）
- select ✓（已有）
- switch ✓（已有）
- badge ✓（已有）
- table ✓（已有）
- toggle-group ✓（已有）

**业务组件只放 components/dashboard/，不要在 components/ 根目录放业务文件。**

---

## 【第三步】全局修复 —— 消灭蓝色和不统一圆角

在整个项目中搜索并修复：

### 3.1 消灭蓝色描边/focus ring
在 `app/globals.css` 中添加全局 focus 样式覆盖：
```css
/* 消灭默认蓝色 focus ring */
*:focus-visible {
  outline: 2px solid hsl(var(--foreground));
  outline-offset: 2px;
}
```

在所有组件中：
- 移除 `ring-blue-*`、`border-blue-*`、`focus:border-blue-*`
- Select、Button、Input 的 focus 状态改用 `focus-visible:ring-ring`（已在 shadcn 默认样式中，确保没有覆盖成蓝色）

### 3.2 统一圆角
搜索并替换：
- `rounded-[24px]` → `rounded-2xl`
- `rounded-[28px]` → `rounded-2xl`
- `rounded-full`（用于容器/卡片）→ `rounded-xl`
- `rounded-full`（用于按钮/badge）→ 保留，但确认不是容器

### 3.3 消灭硬编码颜色
搜索并替换：
- `bg-white` → `bg-background` 或 `bg-card`
- `border-black/10` → `border-border`
- `text-black` → `text-foreground`
- `bg-black` → `bg-foreground`
- `text-white` → `text-background`
- `stroke="rgba(17,17,17,0.08)"` → `stroke="hsl(var(--border))"`
- `color: "#456eb2"` → `color: "hsl(var(--chart-2))"`（等所有图表颜色）

在 `lib/dashboard-data.ts` 中，图表颜色改为：
```ts
const CHART_COLORS = {
  overall: "hsl(var(--foreground))",
  monthly: "hsl(var(--chart-1))",
  yearly: "hsl(var(--chart-2))",
  quarterly: "hsl(var(--chart-3))",
}
```

确认 `app/globals.css` 中定义了 `--chart-1` 到 `--chart-4`（如果没有就添加）。

---

## 【第四步】重构 Tab 导航（app/page.tsx）

当前 Tab 导航在 `app/page.tsx`。重构要求：

### 4.1 Tab 风格：下划线，不是胶囊
```tsx
<TabsList className="h-12 rounded-none border-b border-border bg-transparent p-0">
  <TabsTrigger
    value="retention"
    className="
      h-12 rounded-none border-b-2 border-transparent 
      bg-transparent px-6 font-medium text-muted-foreground shadow-none
      data-[state=active]:border-foreground 
      data-[state=active]:text-foreground 
      data-[state=active]:bg-transparent
      data-[state=active]:shadow-none
    "
  >
    留存分析
  </TabsTrigger>
  {/* 同样方式添加 回本分析 和 收入预测 */}
</TabsList>
```

### 4.2 Tab 和内容必须在同一个组件树里
```tsx
// app/page.tsx 结构
<Tabs defaultValue="retention">
  {/* 顶部 Tab 导航 */}
  <div className="border-b border-border">
    <div className="mx-auto max-w-screen-2xl px-6">
      <TabsList ...>
        <TabsTrigger value="retention">留存分析</TabsTrigger>
        <TabsTrigger value="payback">回本分析</TabsTrigger>
        <TabsTrigger value="forecast">收入预测</TabsTrigger>
      </TabsList>
    </div>
  </div>
  
  {/* 内容区 */}
  <TabsContent value="retention">
    <RetentionDashboard data={defaultRetentionData} />
  </TabsContent>
  <TabsContent value="payback">
    <PaybackDashboard data={defaultPaybackData} />
  </TabsContent>
  <TabsContent value="forecast">
    <ForecastDashboard data={defaultForecastData} />
  </TabsContent>
</Tabs>
```

---

## 【第五步】修复 Retention 页面（对照参考图）

参考图：`C:/Users/Lenovo/.openclaw/workspace/retention-dashboard/ref-retention.jpg`

### 5.1 KPI 卡片区
- 4卡片 `grid grid-cols-4 gap-4`，等宽
- 每个卡片：`<Card className="rounded-xl border border-border">` 
- P2卡片：`<Card className="rounded-xl bg-foreground text-background">`
- 卡片内数值不显示小数点：`72%` 而非 `72.0%`
- 卡片的描述文案严格按参考图

### 5.2 工具栏（参考图顺序）
单行排列（左→右）：
1. 时间段 Select（"最近 12 个月"）
2. 订阅周期 Select（"按订阅周期"）
3. `%相对 / #绝对` ToggleGroup
4. `同时显示` Button（ghost/outline）
5. `包含试用` Switch + label
6. `导出 CSV` Button（outline）

### 5.3 Tab（在图表上方）
- 4个 Tab，样式同第四步的下划线风格
- Tab 1（默认激活）：`续订率`
- Tab 2：`续订预测期`
- Tab 3：`首付 → Pn`
- Tab 4：`续订曲线`

### 5.4 图表
- 无 `#456eb2` 等硬编码颜色，改用 CSS var
- 图表容器：`rounded-2xl border border-border`，无 shadow
- Y轴从 0% 到 100%
- 图例位于图表下方居中

### 5.5 分段数据表
- 有标题"分段数据表"
- 完整5行：整体 / 月付 / 年付 / 季付 / 试用矫正
- 使用 shadcn Table 组件

---

## 【第六步】修复 Payback 页面（对照参考图）

参考图：`C:/Users/Lenovo/.openclaw/workspace/retention-dashboard/ref-payback.jpg`

### 6.1 KPI 卡片
- 同 Retention，4等宽，`border border-border rounded-xl`
- 无硬编码颜色

### 6.2 同期群矩阵按钮
- `绝对`（无 # 前缀），`相对`（无 % 前缀）
- `6期` / `12期`（无空格）
- 激活态：`bg-foreground text-background`

### 6.3 信息卡片文案
- 最近 Cohort / 追踪窗口 / 观察口径 / 主指标

### 6.4 回本曲线下方统计卡片
- 按续订维度整体 LTV / 按日累计收入 / 留存窗口内 LTV / 回收完成周期

---

## 【第七步】修复 Forecast 页面（对照参考图）

参考图：`C:/Users/Lenovo/.openclaw/workspace/retention-dashboard/ref-forecast.jpg`

### 7.1 KPI 卡片
- 用竖线分隔，**不是独立边框卡片**
- 实现方式：`grid grid-cols-4 divide-x divide-border` 或用 `border-r border-border`
- "-1.5%" 增长率显示为**红色文字**，无背景：`text-destructive` 或 `text-red-500`

### 7.2 图表
- 实线 + 面积填充（填充要非常淡，opacity 0.1~0.15）
- 预测部分用虚线：`strokeDasharray="5 5"`
- 图例只有2个（实际 + 预测），不要重复
- 面积填充用 CSS var 颜色

### 7.3 交叉验证区
- 标题"交叉验证"在左侧
- 4个导航项横排，图标+文字同行，**无独立卡片边框**
- 用 `border border-border rounded-xl p-4` 包裹整个交叉验证区

### 7.4 底部数据
- "差异"文案（不是"差距"）

---

## 【第八步】截图验证

完成后：
1. 启动 dev server（如果没在运行）：`npm run dev &`，等待 ready
2. 等5秒让服务器稳定
3. 运行截图：`node screenshot.mjs`
4. 对比截图和参考图，如果有明显差异，继续修改，然后重新截图

截图文件保存为：
- `retention-v4.png`（需要修改 screenshot.mjs 里的文件名）
- `payback-v4.png`
- `forecast-v2.png`

---

## 【第九步】build + commit + 部署

```bash
npm run build
git add -A
git commit -m "refactor: complete shadcn/ui best practices + visual alignment"
git push origin main
vercel --prod
openclaw system event --text "Done: full refactor complete, visual aligned" --mode now
```

---

## 完成标准（必须全部达到才算完成）

1. ✅ 页面无蓝色（包括 focus ring、border、outline）
2. ✅ 圆角统一（只用 rounded-xl 和 rounded-2xl）
3. ✅ 无硬编码颜色（无 #hex、无 bg-white、无 text-black）
4. ✅ Tab 是下划线风格，和内容在同一组件树
5. ✅ 三个页面与参考图在布局/颜色/文案/组件细节上高度吻合
6. ✅ `npm run build` 无报错
7. ✅ 截图和参考图对比，无明显肉眼可见差异
