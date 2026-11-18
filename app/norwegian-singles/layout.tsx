import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Norwegian Singles · 阈下训练计划计算器",
  description:
    "根据最近比赛成绩与每周训练时间，生成挪威式单次阈下训练计划：配速区间、周课表、心率护栏与训练负荷估算。",
}

export default function NorwegianSinglesLayout({
  children,
}: {
  children: ReactNode
}) {
  return <div className="ns-app">{children}</div>
}
