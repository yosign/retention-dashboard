# CODEX TASK V9

参考图：`C:\Users\Lenovo\.openclaw\workspace\retention-dashboard\ref-retention.jpg`
修改文件：`components/dashboard/retention-dashboard.tsx`

---

## 必须达到的最终结构

```
<Card>
  <CardHeader className="flex flex-row items-center justify-between p-5 pb-4">
    <CardTitle>续订阶段曲线</CardTitle>
    <div> <!-- 工具栏：时间段按钮 + 下拉 + %相对/#绝对 + 同时显示 + 包含试用 + 导出CSV -->
    </div>
  </CardHeader>

  <CardContent className="p-5 pt-0">
    <div className="rounded-2xl border border-border bg-background p-5">
      <!-- Tab 行：%相对 / 按订阅周期 / 首付→Pn / 续订曲线 -->
      <div className="mb-3 flex gap-6">
        {tabs...}
      </div>
      <!-- 折线图 -->
      <div className="h-[320px]">
        ...
      </div>
    </div>
  </CardContent>
</Card>
```

## 修改说明

### 1. CardHeader 改为横向布局（标题左，工具栏右）

```tsx
<CardHeader className="flex flex-row items-center justify-between p-5 pb-4">
  <CardTitle className="text-base font-semibold">续订阶段曲线</CardTitle>
  <div className="flex flex-wrap items-center gap-2">
    {/* 时间段按钮、下拉、%相对/#绝对、同时显示、包含试用、导出CSV 全部放这里 */}
  </div>
</CardHeader>
```

### 2. CardContent 里只有图表内嵌卡片

```tsx
<CardContent className="p-5 pt-0">
  <div className="rounded-2xl border border-border bg-background p-5">
    {/* Tab 行 */}
    <div className="mb-3 flex flex-wrap items-center gap-6">
      {dashboardData.viewTabs.map(...)}
    </div>
    {/* 折线图 */}
    <div className="h-[320px]">
      ...
    </div>
  </div>
</CardContent>
```

### 3. 统一所有描边为 1px（border 不加粗细修饰词）

全文搜索以下内容并修正：
- `border-2`、`border-b-2` → 改为 `border`、`border-b`
- Tab 激活态：`border-b border-foreground font-medium text-foreground`（1px 下划线）
- 确保所有 button、card、input 的 border 都是默认 1px（`border border-border`）

---

## 验证步骤

1. `npm run build` → 0 error
2. 启动 dev server，检查端口：`netstat -ano | findstr "LISTENING" | findstr ":300"`
3. `node screenshot.mjs` → 生成 retention-v5.png
4. 肉眼对比 retention-v5.png 和参考图，确认：
   - [ ] 标题和工具栏在同一行（左右布局）
   - [ ] Tab 在图表内嵌卡片左上角
   - [ ] 折线图在 Tab 下方
   - [ ] 所有描边为 1px，无 2px 粗线
5. `git add -A && git commit -m "fix: toolbar in card header row, tabs inside chart card, 1px borders v9" && git push origin main`
6. 输出 `DONE`
