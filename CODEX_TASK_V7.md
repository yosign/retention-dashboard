# CODEX TASK V7

参考图：`C:\Users\Lenovo\.openclaw\workspace\retention-dashboard\ref-retention.jpg`
截图脚本：`node screenshot.mjs`（输出 retention-v5.png）
Dev server：先检查端口 `netstat -ano | findstr "LISTENING" | findstr ":300"`

---

## 修复3个问题

### 问题1：KPI卡布局
参考图中4个KPI卡的布局是 `grid-cols-4`，但 P2 续订率那张卡视觉上更突出（黑底），不是更宽。
**不需要改宽度，保持 4 等宽即可。**

### 问题2：Tab 位置
参考图中 Tab（续订率 / 续订预测期 / 首付→Pn / 续订曲线）的位置：
- 在工具栏的**上方**，紧贴图表区上边缘
- **不是**在卡片最顶部标题行旁边

正确布局：
```
┌──────────────────────────────────────────────────────┐
│ 续订阶段曲线                                          │  ← 卡片标题（独占一行）
├──────────────────────────────────────────────────────┤
│ [最近3个月][最近6个月][最近12个月] [订阅周期▼] [%相对][#绝对] 同时显示 包含试用 导出CSV │ ← 工具栏
├──────────────────────────────────────────────────────┤
│  [续订率] [续订预测期] [首付→Pn] [续订曲线]            │  ← Tab，在图表容器内部顶部
│  ─────────────────────────────────────────────────  │
│  （图表内容区）                                       │
└──────────────────────────────────────────────────────┘
```

修改方法（`components/dashboard/retention-dashboard.tsx`）：
1. CardTitle 行恢复为**独占一行**（移除 flex justify-between）
2. 右侧 Tab 按钮组从 CardHeader 移回图表容器内部的**顶部**
3. Tab 样式：无边框，纯文字，激活态加下划线或加粗

```tsx
// CardHeader：标题独占一行，工具栏在下方
<CardHeader className="space-y-4 p-5 pb-0">
  <CardTitle className="text-base font-semibold">续订阶段曲线</CardTitle>
  <div className="flex flex-wrap items-center gap-2">
    {/* 工具栏内容不变 */}
  </div>
</CardHeader>

// CardContent 里的图表容器：Tab 在顶部，下面是图表
<div className="rounded-2xl border border-border bg-background p-5">
  {/* Tab 行 */}
  <div className="flex gap-6 border-b border-border pb-3 mb-4">
    {dashboardData.viewTabs.map((tab) => (
      <button
        key={tab.value}
        onClick={() => setActiveTab(tab.value)}
        className={cn(
          "pb-1 text-sm transition-colors",
          activeTab === tab.value
            ? "border-b-2 border-foreground text-foreground font-medium"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
  {/* 图表 */}
  <div className="h-[320px]">
    ...
  </div>
</div>
```

### 问题3：工具栏时间段按钮激活态
参考图中"最近12个月"是**黑底白字**激活。当前实现激活态不明显。

检查 ToggleGroupItem 的 `data-[state=on]:bg-foreground data-[state=on]:text-background` 是否生效，如果不生效改用 button + 条件 className：
```tsx
<button
  onClick={() => { setRange(opt.value); ... }}
  className={cn(
    "h-10 rounded-xl px-3 text-sm transition-colors",
    range === opt.value
      ? "bg-foreground text-background"
      : "border border-border hover:bg-muted"
  )}
>
  {opt.label}
</button>
```

---

## 验证步骤（必须执行）

1. `npm run build` — 必须 0 error
2. 确认 dev server 端口，截图：`node screenshot.mjs`
3. 打开参考图和 retention-v5.png 对比，逐项检查：
   - [ ] Tab 在图表容器内部顶部（工具栏下面）
   - [ ] 工具栏激活时间段按钮是黑底白字
   - [ ] 卡片标题"续订阶段曲线"独占一行
4. 通过后 commit + push：`git add -A && git commit -m "fix: tab position in chart + toolbar active state [v7]" && git push origin main`
5. 输出：`DONE`
