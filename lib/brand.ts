/**
 * 全站品牌名称的唯一来源。
 * 早期名称因公开检索发现同名跑步零售/训练品牌与同名跑步 App，
 * 现改为生造词 Pacelith。若后续再次调整，只需改这里与 logo 字标。
 */
export const BRAND = {
  name: "Pacelith",
  wordmark: "PACELITH",
  wordmarkParts: ["PACE", "LITH"] as const,
  chinese: "跑步计划实验室",
  title: "Pacelith · 跑步计划实验室",
  domain: "pacelith.com",
  colors: {
    /** 主题色：深海军蓝，负责稳定、专业与高对比阅读。 */
    navy: "#0B2545",
    /** 强调色：只用于链接、激活态、图表与节点，不铺大面积背景。 */
    teal: "#0E9F94",
    /** 高亮色：极小面积，用于 logo 节点和关键数据。 */
    mint: "#2DD4BF",
    slate: "#64748B",
    surface: "#F8FAFC",
  },
} as const
