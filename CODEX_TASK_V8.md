# CODEX TASK V8

参考图：`C:\Users\Lenovo\.openclaw\workspace\retention-dashboard\ref-retention.jpg`
截图脚本：`node screenshot.mjs` → 生成 retention-v5.png
Dev server：先检查端口 `netstat -ano | findstr "LISTENING" | findstr ":300"` 再决定是否启动

---

## 核心问题（对比参考图）

### 问题1：工具栏时间段按钮选中态不显示

参考图：`最近12个月` = **纯黑背景 + 白字**，其他按钮透明边框
现状：按钮选中后没有明显黑色背景，看起来和非选中一样

修改文件：`components/dashboard/retention-dashboard.tsx`

找到时间段按钮渲染处（`range === option.value`），确保选中态是：
```tsx
className={cn(
  "h-10 rounded-xl px-3 text-sm transition-colors",
  range === option.value
    ? "bg-foreground text-background"
    : "border border-border bg-background hover:bg-muted"
)}
```

同时**删除** `style` 属性（如果还存在），只用 className。

### 问题2：Tab 下划线高亮不显示 / 颜色不对

参考图：Tab 激活态 = 文字变黑 + **底部有一条深色实线下划线**
现状：下划线可能显示为蓝色，或者没有显示

修改文件：`components/dashboard/retention-dashboard.tsx`

找到 Tab 按钮渲染处，确保：
```tsx
className={cn(
  "pb-2 text-sm transition-colors",
  activeTab === tab.value
    ? "border-b-2 border-foreground font-medium text-foreground"
    : "text-muted-foreground hover:text-foreground"
)}
```

父容器加 `border-b border-border`（灰色底部边框），Tab 按钮叠在上面用 `border-b-2 border-foreground` 覆盖。

### 问题3：全局蓝色 focus ring 残留

检查 `app/globals.css`，确认 `*:focus` 和 `*:focus-visible` 都有：
```css
*:focus,
*:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
```

同时检查有无 `--ring` 相关的 CSS 变量被 Tailwind 的 `ring` 工具类触发。在所有 button 上确认没有 `ring-*` 类名。

---

## 验证步骤

1. `npm run build` → 0 error
2. 启动 dev server（检查端口，未启动则 `npm run dev &`）
3. `node screenshot.mjs` → 生成 retention-v5.png
4. 对比 retention-v5.png 和参考图，确认：
   - [ ] 时间段按钮选中态：纯黑背景+白字
   - [ ] Tab 激活态：深色下划线，无蓝色
   - [ ] 无任何蓝色 focus ring
5. `git add -A && git commit -m "fix: toolbar active state and tab underline v8" && git push origin main`
6. 输出 `DONE`
