# Norwegian Singles · 阈下训练计划计算器

路由：`/norwegian-singles`

依据社区指南《Norwegian Singles — An Approach To Running》实现：输入最近一场比赛成绩与每周可训练时间，
生成挪威式「单次」阈下训练计划（配速区间、周课表、心率护栏、TSS/CTL 估算、八周进阶节奏）。

## 结构

```
app/norwegian-singles/
  layout.tsx        路由级 metadata + <div className="ns-app"> 主题作用域
  page.tsx          服务端页面，渲染客户端计算器
  calculator.tsx    "use client" 根组件：表单状态、localStorage、URL 同步、导出
  styles.css        主题令牌（.ns-app 作用域）+ tabular / hero-grid 工具类
  components/       业务组件（hero、input-panel、week-plan、pace-panel…）
  components/ui/    shadcn/ui 组件（button、card、select、tabs、table、slider…）
  lib/training.ts   全部计算逻辑（纯函数，无 React 依赖）
```

## 几个约定

- **样式入口**：`styles.css` 里的 `@theme inline` / `@utility` 必须由 Tailwind 入口编译，
  因此它在 `app/globals.css` 顶部以 `@import "./norwegian-singles/styles.css"` 引入，
  路由 layout 不再单独 import。所有变量都挂在 `.ns-app` 下，不会影响站点其他页面。
- **客户端边界**：`page.tsx` 是服务端组件，只负责渲染 `calculator.tsx`；后者带 `"use client"`，
  其余组件由它引入，因此不需要重复声明。
- **水合安全**：表单初始值固定为 `DEFAULT_FORM`，`localStorage` 与 `?tab=` 都在 `useEffect` 里读取，
  避免服务端渲染与客户端首帧不一致。
- **校验**：成绩需能解析成时间，且换算配速在 2:00–10:00/km 之间，否则判定为无效输入并保留上一次有效计划。
- **URL**：标签页写入 `?tab=week|paces|hr|load|method`，可直接分享。
- **本地数据**：表单存在 `localStorage` 的 `ns-planner-form-v1`，不上传任何数据。

## 添加更多 shadcn 组件

```bash
npx shadcn@latest add dialog
```

把输出目录指向 `app/norwegian-singles/components/ui`（或在生成后移动到该目录），
并保持 `components.json` 里的别名与 `tsconfig.json` 的 `@/*` 一致。

## 自检

计算逻辑可直接在 Node 中跑（Node ≥ 22 支持 TS 直执行）：

```bash
node --experimental-strip-types app/norwegian-singles/lib/training.ts   # 仅做导入检查
```
