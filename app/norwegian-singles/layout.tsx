import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "挪威单阈值 · 阈下训练计划",
  description:
    "根据最近比赛成绩与每周训练时间，生成挪威式单次阈下训练计划：配速区间、周课表、心率护栏与训练负荷估算。",
}

export default function NorwegianSinglesLayout({
  children,
}: {
  children: ReactNode
}) {
  return <div data-method="norwegian-singles">{children}</div>
}
