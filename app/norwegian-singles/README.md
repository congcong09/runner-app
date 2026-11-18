# Norwegian Singles · 阈下训练计划计算器

路由：`/norwegian-singles`

依据社区指南《Norwegian Singles — An Approach To Running》实现：输入最近一场比赛成绩与每周可训练时间，
生成挪威式「单次」阈下训练计划（配速区间、周课表、心率护栏、TSS/CTL 估算、八周进阶节奏）。

## 结构

```
app/norwegian-singles/
  layout.tsx        路由级 metadata + data-method="norwegian-singles"
  page.tsx          服务端页面，渲染客户端计算器
  calculator.tsx    "use client" 根组件：表单状态、localStorage、URL 同步、导出
  components/       业务组件（hero、input-panel、week-plan、pace-panel…）
  lib/training.ts   全部计算逻辑（纯函数，无 React 依赖）
```

通用 UI、主题和格式化工具已经提升到：

```
components/ui/      shadcn/ui 组件
components/         全站页头/页脚/方法 hero/统计卡
app/globals.css     全站主题令牌
lib/race.ts         Riegel 换算
lib/format.ts       配速/时长格式化
```

## 几个约定

- **主题**：颜色 token 在 `app/globals.css` 的 `:root`；本页只通过
  `data-method="norwegian-singles"` 获得局部的 `--method-accent` / `--method-soft`。
- **客户端边界**：`page.tsx` 是服务端组件，只负责渲染 `calculator.tsx`；后者带 `"use client"`，
  其余组件由它引入，因此不需要重复声明。
- **水合安全**：`localStorage` 通过 `useSyncExternalStore` 读取；服务端/首帧用默认值，
  水合后自动切换，不会产生 mismatch。
- **校验**：成绩需能解析成时间，且换算配速在 2:00–10:00/km 之间，否则判定为无效输入并保留上一次有效计划。
- **URL**：标签页写入 `?tab=week|paces|hr|load|method`，可直接分享。
- **本地数据**：表单存在 `localStorage` 的 `ns-planner-form-v1`，不上传任何数据。

## 自检

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```
