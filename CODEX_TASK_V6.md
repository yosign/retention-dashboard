# CODEX TASK V6 — 精准修复 + 自验证循环

你有完整的文件读写权限和命令执行权限。**必须循环直到所有检查项全部通过才能停止。**

---

## 背景

这是一个 Next.js 14 + shadcn/ui + Recharts 的 Retention Dashboard 项目。
参考设计图在：`C:\Users\Lenovo\.openclaw\workspace\retention-dashboard\ref-retention.jpg`

---

## 需要修复的问题（3个）

### 问题1：Tab 位置错误

**现状**：Tab（续订率 / 续订预测期 / 首付→Pn / 续订曲线）在工具栏下面独立成一行，和卡片标题分开。

**目标**：Tab 在 "续订阶段曲线" 卡片的 CardHeader 里，**与标题文字同行，靠右对齐**。

参考图布局：
```
┌────────────────────────────────────────────────────────────────┐
│  续订阶段曲线    [续订率] [续订预测期] [首付→Pn] [续订曲线]        │ ← 同一行
├────────────────────────────────────────────────────────────────┤
│  [最近3个月][最近6个月][最近12个月]  [按订阅周期▼]  [%相对][#绝对]  │ ← 工具栏
│                                                                │
│  （图表区域）                                                   │
└────────────────────────────────────────────────────────────────┘
```

**修改文件**：`components/dashboard/retention-dashboard.tsx`

修改方式：
1. 在 CardHeader 的第一行放一个 `flex justify-between` 的 div
2. 左边是 `<CardTitle>续订阶段曲线</CardTitle>`
3. 右边是 Tab 按钮组（普通 button，不用 shadcn Tabs 组件）
4. 图表区域内只保留内容，不要重复出现 Tab

```tsx
<CardHeader className="space-y-4 p-5 pb-0">
  <div className="flex items-center justify-between">
    <CardTitle className="text-base font-semibold">续订阶段曲线</CardTitle>
    <div className="flex gap-1">
      {dashboardData.viewTabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={cn(
            "px-3 py-1 text-sm rounded-lg transition-colors",
            activeTab === tab.value
              ? "text-foreground font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
  {/* 工具栏 */}
  <div className="flex flex-wrap items-center gap-2">
    ...工具栏内容不变...
  </div>
</CardHeader>
```

---

### 问题2：蓝色描边/Focus Ring

**现状**：点击任何按钮或选择器后，出现蓝色描边（focus ring）。

**目标**：所有 focus ring 统一为黑色，或不显示。

**修改文件**：`app/globals.css`

在 `@layer base` 里确保：
```css
--ring: 0 0% 9%;   /* 深黑色，不是蓝色 */
```

并在全局样式里：
```css
*:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 2px hsl(var(--foreground)) !important;
}
```

---

### 问题3：P2续订率 KPI 卡黑底

**现状**：P2续订率卡片是白底，和其他卡一样。

**目标**：P2续订率卡片是黑底白字（highlight 状态）。

**修改文件**：`components/dashboard/metric-card.tsx`

确保 highlight prop 生效时，用内联 style 强制黑底（不依赖 Tailwind token）：
```tsx
<article
  style={highlight ? { backgroundColor: "#18181b", color: "#fafafa" } : undefined}
  className={cn(
    "rounded-2xl border px-5 py-4 shadow-none",
    highlight ? "border-transparent" : "border-border bg-card"
  )}
>
```

---

## 自验证循环（必须执行，不能跳过）

### Step 1: 启动 dev server（后台）
```powershell
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run","dev" -WorkingDirectory "C:\Users\Lenovo\.openclaw\workspace\retention-dashboard-v2"
Start-Sleep -Seconds 10
```

### Step 2: 检查 dev server 端口
```powershell
netstat -ano | findstr "LISTENING" | findstr ":300"
```
记录实际端口（3000 或 3001 等）。

### Step 3: 截图
```powershell
$env:SCREENSHOT_BASE_URL = "http://localhost:<实际端口>"
cd "C:\Users\Lenovo\.openclaw\workspace\retention-dashboard-v2"
node screenshot.mjs
```

### Step 4: 对比截图和参考图
截图：`retention-v5.png`
参考图：`C:\Users\Lenovo\.openclaw\workspace\retention-dashboard\ref-retention.jpg`

**必须逐项检查（7项全部通过才算完成）：**
- [ ] Tab 在卡片标题行右侧（与"续订阶段曲线"同行）
- [ ] 没有蓝色 focus ring（点击按钮后无蓝色描边）
- [ ] P2续订率 KPI 卡是黑底白字
- [ ] 月付折线是蓝色
- [ ] KPI 卡片等宽（4张）
- [ ] 热力图（payback矩阵）有渐变层次
- [ ] 整体圆角统一（rounded-xl 或 rounded-2xl）

### Step 5: 如果有未通过的项
继续修改对应文件，然后回到 Step 3。

### Step 6: 全部通过后
```powershell
cd "C:\Users\Lenovo\.openclaw\workspace\retention-dashboard-v2"
git add -A
git commit -m "fix: tab position + blue ring + P2 highlight [v6]"
git push origin main
```
输出：`DONE: all 7 checks passed`

---

## 关键约束
- **不要**重写整个文件，只做最小改动
- **不要**改变 screenshot.mjs 的截图文件名
- **不要**自己判断截图"应该"通过而跳过验证
- **必须**真正打开参考图和截图对比，不能依赖假设
- **必须**循环直到通过，不能提前停止
