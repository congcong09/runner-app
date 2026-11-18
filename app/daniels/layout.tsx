import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "丹尼尔斯 VDOT 训练计划",
  description:
    "用最近比赛成绩计算 VDOT，生成 E / M / T / I / R 五类配速、周课表与 8–16 周进阶计划。",
}

export default function DanielsLayout({ children }: { children: ReactNode }) {
  return <div data-method="daniels">{children}</div>
}
