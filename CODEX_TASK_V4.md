# Codex Task V4: 精准修复清单（基于截图对比）

不要重构，只修下列具体问题。修完截图验证，全部pass才算完成。

---

## Retention 页面修复

### R1. Tab 改下划线（当前是胶囊边框）
文件：`components/dashboard/retention-dashboard.tsx`

图表内部那排 Tab（续订率/续订预测期/首付→Pn/续订曲线）现在是胶囊边框样式。
改成下划线风格：
```tsx
<TabsList className="h-10 rounded-none border-b border-border bg-transparent p-0">
  <TabsTrigger
    value="..."
    className="h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 text-sm font-medium text-muted-foreground shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
  >
```

### R2. KPI 卡片等宽 + 高亮卡
- 外层用 `grid grid-cols-4 gap-4`（不是 md:grid-cols-2 xl:grid-cols-4，直接锁死4列）
- P2续订率卡片加 `bg-foreground text-background`，其余普通卡片
- MetricCard 的 article 元素去掉 `rounded-[24px]`，改用 `rounded-2xl`

### R3. 时间段改成按钮组
工具栏里的时间段选择，参考图是3个独立按钮：最近3个月 / 最近6个月 / 最近12个月。
改用 ToggleGroup：
```tsx
<ToggleGroup type="single" value={range} onValueChange={...} className="gap-1">
  {dashboardData.periodOptions.map(option => (
    <ToggleGroupItem
      key={option.value}
      value={option.value}
      className="h-10 rounded-xl border border-border px-3 text-sm data-[state=on]:bg-foreground data-[state=on]:text-background"
    >
      {option.label}
    </ToggleGroupItem>
  ))}
</ToggleGroup>
```

---

## Payback 页面修复

### P1. 回本周期卡片改为黑色高亮
`defaultPaybackData.summaryMetrics` 中，"回本周期"那个 metric 加 `tone: "highlight"`

### P2. 同期群矩阵按钮文案加前缀
- `绝对` → `#绝对`
- `相对` → `%相对`

### P3. 续订留存率曲线颜色不对
`paybackChartConfig` 中 `retentionRate` 的 color：
- 改为 `"hsl(var(--chart-2))"` （青绿色，对应参考图中的蓝色曲线）

### P4. 矩阵单元格高亮样式
同期群矩阵中，数值越高背景越深（类似热力图）。
当前是纯白背景，参考图有深色填充。
实现方案：根据数值用 inline style 设置背景色深浅：
```tsx
style={{
  backgroundColor: `color-mix(in srgb, hsl(var(--foreground)) ${Math.round(value * 0.3)}%, transparent)`,
  color: value > 0.6 ? 'hsl(var(--background))' : 'hsl(var(--foreground))'
}}
```

---

## 验证流程

修改完后：
1. 确认 dev server 在哪个端口：`netstat -ano | findstr :300` 找到 npm 进程的端口
2. 设置环境变量：`$env:SCREENSHOT_BASE_URL = "http://localhost:<PORT>"`
3. 截图：`node screenshot.mjs`
4. 检查文件大小，>100KB 才是有内容的截图

截图保存为 `retention-v5.png` 和 `payback-v5.png`（修改 screenshot.mjs 里的文件名）

## 完成条件
- Tab 是下划线（无胶囊边框）
- KPI 4等宽，正确高亮卡
- 时间段是按钮组
- Payback 续订留存率曲线是青绿色
- 矩阵单元格有热力图效果

完成后：
```bash
git add -A && git commit -m "fix: retention tab underline, kpi grid, payback chart colors, matrix heatmap"
vercel --prod
openclaw system event --text "Done: V4 fixes complete" --mode now
```
