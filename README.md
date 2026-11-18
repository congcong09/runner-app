# Pacelith · 跑步计划实验室

一个 Next.js 16 App Router 应用，把三种训练体系放在同一个视觉系统里：

- `/` 方法库首页：比较体系、进入计算器、数据接入入口
- `/daniels` 丹尼尔斯 VDOT：E / M / T / I / R 五类配速、8–16 周计划
- `/hanson` 汉森马拉松：16 周全马 / 12 周半马、6 天/周、3 次 SOS、长距离封顶
- `/norwegian-singles` 挪威单阈值：阈下配速、周课表、心率护栏、TSS/CTL
- `/login` 本地演示登录：不接后端，只验证账户态与数据接入入口

所有计算都在浏览器本地完成，输入保存在 `localStorage`。

## 开发

```bash
pnpm install
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 校验

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## 结构

```
app/
  layout.tsx               根布局：metadata、字体、全站主题入口
  globals.css              全站主题令牌 + 品牌色 + 方法点缀色 + 工具类
  favicon.ico              浏览器 favicon（Pacelith，16/32/48/64）
  icon.svg                 现代浏览器 SVG favicon
  apple-icon.png           iOS 主屏图标（180px）
  page.tsx                 首页
  daniels/                 丹尼尔斯页（lib/ + components/ + calculator）
  hanson/                  汉森页（lib/ + components/ + calculator）
  norwegian-singles/       挪威单阈值页
  login/                   本地演示登录页
components/
  site-header.tsx          全站导航 + 本地账户状态
  site-footer.tsx          全站页脚
  brand-mark.tsx           Pacelith 品牌图形（Pace Path）
  method-hero.tsx          三种方法共用的 hero
  stat-grid.tsx            共用统计卡
  ui/                      shadcn/ui 风格基础组件
lib/
  methods.ts               方法元数据、数据平台占位
  race.ts                  比赛距离、Riegel 换算
  format.ts                配速/时长格式化
  auth.ts                  本地演示账户（localStorage）
```

主题统一提升到 `app/globals.css` 的 `:root`；各训练体系只通过 `data-method` 设置
`--method-accent` / `--method-soft` 做局部点缀，不再维护各自的主题作用域。

## 说明

配速由公开公式估算，不构成医疗建议。接入 Strava / Garmin / COROS 等平台仍在规划中，
当前登录页不会发起任何网络请求。
