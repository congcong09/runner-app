import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "汉森马拉松训练计划",
  description:
    "汉森马拉松/半马计划：每周 6 天、三次 SOS、长距离封顶 26 公里，用累积疲劳模拟比赛后半程。",
}

export default function HansonLayout({ children }: { children: ReactNode }) {
  return <div data-method="hanson">{children}</div>
}
