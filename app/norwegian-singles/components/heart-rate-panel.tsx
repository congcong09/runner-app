import { HeartPulse, Info } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Plan } from "../lib/training"

const SCALE_MIN = 100

function HrBand({ plan }: { plan: Plan }) {
  const scaleMax = Math.max(plan.hr.maxHr + 12, 200)
  const pct = (bpm: number) =>
    ((bpm - SCALE_MIN) / (scaleMax - SCALE_MIN)) * 100
  const { easyCap, qualityLow, qualityHigh } = plan.hr

  return (
    <div>
      <div className="bg-secondary relative h-10 w-full overflow-hidden rounded-md">
        <div
          className="bg-easy/25 absolute inset-y-0 left-0"
          style={{ width: `${pct(easyCap)}%` }}
        />
        <div
          className="bg-quality/20 absolute inset-y-0"
          style={{
            left: `${pct(qualityLow)}%`,
            width: `${pct(qualityHigh) - pct(qualityLow)}%`,
          }}
        />
        <div
          className="bg-foreground/50 absolute inset-y-0 w-px"
          style={{ left: `${pct(easyCap)}%` }}
        />
        <div
          className="bg-quality absolute inset-y-0 w-0.5"
          style={{ left: `${pct(qualityHigh)}%` }}
        />
      </div>
      <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
        <span className="flex items-center gap-1.5">
          <span className="bg-easy/40 size-2 rounded-sm" />
          轻松区 ≤ {easyCap}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-quality/40 size-2 rounded-sm" />
          质量课 {qualityLow}–{qualityHigh}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-secondary size-2 rounded-sm" />
          高于 LTHR
        </span>
        <span className="ml-auto tabular">{scaleMax} 次/分</span>
      </div>
    </div>
  )
}

export function HeartRatePanel({ plan }: { plan: Plan }) {
  return (
    <div className="space-y-4">
      <Card className="gap-0 py-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <HeartPulse className="text-quality size-4" />
            心率护栏
          </CardTitle>
          <CardDescription className="text-xs">
            配速和心率一起用；没有乳酸仪也能把强度压在阈下。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-5 py-5">
          <HrBand plan={plan} />

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="text-muted-foreground text-[11px]">轻松跑上限</div>
              <div className="mt-1 text-xl font-semibold tabular">
                {plan.hr.easyCap}
                <span className="text-muted-foreground ml-1 text-xs font-normal">
                  次/分
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-[11px]">
                实测最大心率的约 70%，是上限而非目标
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-muted-foreground flex items-center justify-between text-[11px]">
                质量课心率区间
                <Badge variant={plan.hr.lthrEstimated ? "muted" : "quality"} className="text-[10px]">
                  {plan.hr.lthrEstimated ? "估算" : "实测"}
                </Badge>
              </div>
              <div className="mt-1 text-xl font-semibold tabular">
                {plan.hr.qualityLow}–{plan.hr.qualityHigh}
              </div>
              <p className="text-muted-foreground mt-1 text-[11px]">
                早组低于 LTHR 10–15 跳，后组从下方接近
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-muted-foreground text-[11px]">LTHR</div>
              <div className="mt-1 text-xl font-semibold tabular">
                {plan.hr.lthr}
              </div>
              <p className="text-muted-foreground mt-1 text-[11px]">
                {plan.hr.lthrEstimated
                  ? "按 0.9 × 最大心率估算；有实测值请填入"
                  : "来自你填写的实测值"}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3 text-[12px] leading-relaxed">
            <p>
              <span className="font-medium">怎么估 LTHR</span>：热身后独自全力跑 30 分钟、配速均匀，取最后 20 分钟的平均心率。胸带比腕表更少误差。
            </p>
            <p>
              <span className="font-medium">心率有滞后与漂移</span>：不要为了“追上”目标心率而加速；反复超过 LTHR 的重复组说明配速需要降低。
            </p>
            <p>
              <span className="font-medium">高温下</span>即使强度稳定心率也会漂移，这时看呼吸和主观用力感，必要时缩短或放弃这次课。
            </p>
            <p className="text-muted-foreground flex items-start gap-2">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              心率区间只是估计；不同手表、训练体系的区间编号并不统一，“3 区”这样的标签不足以设定强度。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
