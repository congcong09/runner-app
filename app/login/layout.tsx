import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "登录 / 本地演示账户",
  description:
    "本地演示登录页：先验证账户状态与数据接入入口，暂不发送网络请求。",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
