# CODEX TASK V5 — 精准修复 + 自验证循环

## 你的任务
修复 retention dashboard 的两个核心问题，修完后**自己截图和设计稿对比**，直到通过才停。

---

## 问题1：Tab 位置错误

### 现状
Tab（续订率 / 续订预测期 / 首付→Pn / 续订曲线）目前位于图表区内部独立一行，和工具栏分离。

### 目标
Tab 应该在 **"续订阶段曲线" 卡片的 CardHeader 里，与标题同行，靠右对齐**。

参考图布局层次（从上到下）：
```
┌─────────────────────────────────────────────────────────────┐
│ 续订阶段曲线               [续订率] 续订预测期 首付→Pn 续订曲线 │  ← 标题+Tab同行
│ ─────────────────────────────────────────────────────────── │
│ [最近3个月][最近6个月][最近12个月]  [按订阅周期▼]  [%相对][#绝对]  同时显示  包含试用  导出CSV │  ← 工具栏一行
│                                                              │
│  （图表内容区）                                              │
└─────────────────────────────────────────────────────────────┘
```

### 修改方案
在 `components/dashboard/retention-dashboard.tsx` 的 CardHeader 里：
1. 把 `<CardTitle>续订阶段曲线</CardTitle>` 和 Tab 放在同一个 flex row
2. Tab 靠右（`ml-auto`）
3. 从图表内部的 `<div className="rounded-2xl border...">` 里移除 `<Tabs>` + `<TabsList>`，但保留 `<TabsContent>` 内容（根据 `activeTab` 条件渲染即可）

```tsx
// CardHeader 内
<CardHeader className="p-5 pb-0">
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
              ? "text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
  // 工具栏 ...
</CardHeader>
```

---

## 问题2：蓝色 focus ring / 描边

### 现状
页面上有蓝色 outline/ring，出现在：
- ToggleGroupItem 被点击后的 focus 状态
- SelectTrigger focus 状态
- Button focus 状态
- 任何 shadcn 组件默认的 `focus-visible:ring-ring/50`（ring 颜色是蓝色）

### 目标
所有 focus ring / outline 统一改为黑色（或完全去掉）。

### 修改方案
在 `app/globals.css` 的 `:root` 里：
```css
--ring: 0 0% 10%;  /* 改为接近黑色 */
```

同时检查所有组件的 `focus-visible:ring-*` class，确保没有硬编码蓝色。

---

## 自验证流程（必须执行）

修完代码后，**必须**按以下步骤验证：

### Step 1: Build
```powershell
npm run build
```
必须 0 error 才继续。

### Step 2: 截图
Dev server 在 http://localhost:3000（或其他端口，先检查）
```powershell
$env:SCREENSHOT_BASE_URL="http://localhost:3000"
node screenshot.mjs
```

### Step 3: 对比 (必须自己判断)
截图文件：`retention-v5.png`
参考图：`C:\Users\Lenovo\.openclaw\workspace\retention-dashboard\ref-retention.jpg`

**对比检查清单（每项都要通过）：**
- [ ] Tab 在卡片右上角，与"续订阶段曲线"标题同行
- [ ] Tab 下面紧跟工具栏（时间段按钮 + 筛选器）
- [ ] 没有蓝色描边/focus ring（任何地方）
- [ ] P2续订率 KPI 卡是黑底白字
- [ ] 月付折线是蓝色
- [ ] 热力图有渐变层次（浅→深）
- [ ] 圆角统一（rounded-xl 或 rounded-2xl）

### Step 4: 如果还有问题
继续修，重复 Step 1-3，直到**所有 7 项全部通过**。

### Step 5: 完成后
```powershell
git add -A
git commit -m "fix: tab position in card header + remove blue focus ring"
git push origin main
```
然后输出：`DONE: all 7 checks passed`

---

## 关键文件
- `components/dashboard/retention-dashboard.tsx` — 主要修改文件
- `components/dashboard/payback-dashboard.tsx` — 检查是否也有蓝色 ring
- `app/globals.css` — 修改 --ring 颜色
- `screenshot.mjs` — 截图脚本（不要改截图文件名）
- 参考图：`C:\Users\Lenovo\.openclaw\workspace\retention-dashboard\ref-retention.jpg`

## 禁止
- 不要删除或重写整个文件（只做最小改动）
- 不要改 screenshot.mjs 的文件名（retention-v5.png / payback-v5.png / forecast-v2.png）
- 不要自行决定跳过验证步骤
