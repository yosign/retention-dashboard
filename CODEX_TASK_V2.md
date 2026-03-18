# Codex Task V2: 新增收入预测页面

## 任务：新增 /forecast 页面

参考图：`C:/Users/Lenovo/.openclaw/workspace/retention-dashboard/ref-forecast.jpg`

### 页面结构（从上到下）

#### 1. 页面标题区
- 大标题：`收入预测`
- 副标题：`基于趋势和同期群数据预测未来收入与订阅数变化`

#### 2. KPI 卡片区（4等宽卡片，一行）
| 卡片 | 标签 | 值 | 描述 | 特殊样式 |
|------|------|-----|------|---------|
| 1 | 当前 MRR | $507,151.00 | 当前月经常性收入 | 普通 |
| 2 | 预测下月 | $521,858.00 | 基于趋势外推 | 带绿色 -1.5% 标签 |
| 3 | 预测下季度 | $556,345.00 | 基于当前增长率推算 | 普通 |
| 4 | 月增长率 | -1.5% | 近期平均月环比 | 普通 |

#### 3. 收入预测图表卡片
- 标题：`收入预测`
- X轴：月份（1月~12月 为实际数据，之后为预测）
- Y轴：金额（$385k ~ $605k）
- 两条线：
  - 实际 MRR（蓝绿色实线 + 面积填充）：1月~11月
  - 预测 MRR（金黄色虚线）：11月往后延伸到次年6月
- 图例：底部居中，`● 实际 MRR` `● 预测 MRR`
- 实际与预测的分界线在约11月~12月处

#### 4. 订阅数预测图表卡片
- 标题：`订阅数预测`
- X轴：同上（1月~次年6月）
- Y轴：数量（6.0k ~ 12.0k）
- 两条线：
  - 实际订阅数（青绿色实线 + 面积填充）：1月~11月
  - 预测订阅数（青绿色虚线）：11月往后
- 图例：底部居中，`● 实际订阅数` `● 预测订阅数`

#### 5. 交叉验证区
- 标题：`交叉验证`
- 4个导航卡片（一行，等宽，带图标）：
  | 图标 | 标题 | 描述 |
  |------|------|------|
  | 📊 | 回本分析 | 查看同期群 LTV 曲线和回本周期 |
  | 📈 | 同期群分析 | 按同期群维度追踪老入和拓群 |
  | 📉 | MRR 流动 | 看新增、扩张、收缩和流失结构 |
  | $ | 收入分析 | 看收入结构和续费变化 |

#### 6. 底部验证数据（3列）
| 标签 | 值 | 描述 |
|------|-----|------|
| 趋势外推预测 | $521,858.00 | 基于历史增长率线性外推 |
| 同期群 LTV 推算 | $311,040.00 | 整体 LTV × 活跃订阅数 / 12 |
| 偏差 | -40.4% | 两种预测方法的差距 |

---

### 技术要求

1. **路由**：新建 `app/forecast/page.tsx`，只做装配
2. **组件**：`components/forecast-dashboard.tsx`
3. **数据**：在 `lib/dashboard-data.ts` 中添加 `defaultForecastData`
4. **类型**：在 `src/types/dashboard.ts` 中添加 forecast 相关类型
5. **导航**：在首页 `app/page.tsx` 添加 `/forecast` 链接
6. **shadcn 组件**：复用 Card, Badge, Tabs 等已有组件
7. **CSS variables**：不硬编码颜色，使用 design tokens
8. **图表**：使用 recharts，实际数据用 Area + Line，预测用虚线 Line

### 图表数据（mock）

收入预测（12个月实际 + 7个月预测）：
```
实际: [385, 390, 400, 410, 415, 430, 445, 465, 475, 470, 460, null, null, null, null, null, null, null]
预测: [null, null, null, null, null, null, null, null, null, null, 460, 475, 505, 520, 535, 550, 565, 580]
```
（单位：千美元）

订阅数预测：
```
实际: [7.4, 7.5, 7.6, 7.8, 8.0, 8.2, 8.5, 8.8, 9.0, 9.2, 9.3, null, null, null, null, null, null, null]
预测: [null, null, null, null, null, null, null, null, null, null, 9.3, 9.5, 9.8, 10.0, 10.2, 10.5, 10.8, 11.2]
```
（单位：千）

---

### 验证

1. `npm run build` 通过
2. 启动 dev server，访问 /forecast 页面正常
3. 截图保存为 `forecast-v1.png`
4. 与参考图 `ref-forecast.jpg` 对比

### 完成后

```bash
git add -A && git commit -m "feat: add forecast page"
openclaw system event --text "Done: forecast page added" --mode now
```
