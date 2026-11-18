/** 三种训练体系的共享元数据，首页、页头与页脚都从这里读取。 */

export type MethodId = "daniels" | "hanson" | "norwegian-singles"

export interface MethodMeta {
  id: MethodId
  href: string
  index: string
  name: string
  en: string
  mark: string
  tagline: string
  description: string
  cadence: string
  core: string
  longRun: string
  bestFor: string
  facts: { label: string; value: string }[]
}

export const METHODS: MethodMeta[] = [
  {
    id: "daniels",
    href: "/daniels",
    index: "01",
    name: "丹尼尔斯",
    en: "Jack Daniels · VDOT",
    mark: "D",
    tagline: "用 VDOT 把比赛成绩拆成五类训练配速。",
    description:
      "以最近一场比赛推算 VDOT，得到 E / M / T / I / R 五类配速，再按目标距离排出以 T、I、R 为核心的质量周。",
    cadence: "每周 1–2 次质量课",
    core: "VDOT · E/M/T/I/R",
    longRun: "按周跑量比例",
    bestFor: "想给每一公里都找到明确理由的跑者",
    facts: [
      { label: "体能评分", value: "VDOT" },
      { label: "训练强度", value: "5 类配速" },
      { label: "典型周期", value: "8–16 周" },
    ],
  },
  {
    id: "hanson",
    href: "/hanson",
    index: "02",
    name: "汉森",
    en: "Hansons Marathon Method",
    mark: "H",
    tagline: "累积疲劳，把马拉松后半程跑成日常。",
    description:
      "每周 6 天、三次 SOS 课：速度/力量、节奏跑与长距离。长距离封顶 26 公里，用周中高频训练模拟比赛末段的疲劳。",
    cadence: "每周 6 天 · 3 次 SOS",
    core: "MP / Strength / Speed",
    longRun: "最长 26 公里",
    bestFor: "愿意高频训练、目标全马或半马的跑者",
    facts: [
      { label: "计划长度", value: "16 / 12 周" },
      { label: "长距离上限", value: "16 英里" },
      { label: "核心机制", value: "累积疲劳" },
    ],
  },
  {
    id: "norwegian-singles",
    href: "/norwegian-singles",
    index: "03",
    name: "挪威单阈值",
    en: "Norwegian Singles",
    mark: "N",
    tagline: "三次阈下质量课，其余全部轻松。",
    description:
      "把阈值训练压缩成业余跑者能长期承受的一周：三次受控的阈下质量课，用配速、心率与主观用力感三重护栏。",
    cadence: "每周 2–3 次质量课",
    core: "阈下配速 / LTHR",
    longRun: "轻松跑的 1.7 倍",
    bestFor: "时间有限、想稳定累积阈值训练的业余跑者",
    facts: [
      { label: "质量工作占比", value: "20–25%" },
      { label: "轻松跑上限", value: "≤ 70% HRmax" },
      { label: "乳酸仪", value: "可选" },
    ],
  },
]

export const METHOD_BY_ID = Object.fromEntries(
  METHODS.map((method) => [method.id, method]),
) as Record<MethodId, MethodMeta>

export interface DataPlatform {
  name: string
  description: string
  status: "planned" | "local"
}

/** 登录页展示的后续数据源；当前全部是占位，不会发起网络请求。 */
export const DATA_PLATFORMS: DataPlatform[] = [
  {
    name: "Strava",
    description: "活动、分段与历史比赛",
    status: "planned",
  },
  {
    name: "Garmin",
    description: "训练负荷、心率与配速",
    status: "planned",
  },
  {
    name: "COROS",
    description: "课表执行与恢复数据",
    status: "planned",
  },
  {
    name: "Apple 健康",
    description: "跑步记录与体能指标",
    status: "planned",
  },
]
