# Pacelith · Logo 审查稿

> 状态：**01 Pace Path 已应用**到网站页头/页脚与 favicon；02 / 03 保留为备选方向。审查稿本身仍在 `logo-review/` 中。

## 名称变更

应用原名 `Stride Lab` 在公开检索中发现同名跑步零售/训练品牌、同名跑步 App 和多个软件公司，已改为生造词 **`Pacelith`**。

公开初筛的三个低冲突候选：

| 候选 | 初筛结果 | 域名状态（2026-11-18） |
|---|---|---|
| **Pacelith** | 未发现同名跑步产品/软件；仅有一个 1998 年钢铁行业旧文档中的近似拼写 | `.com/.cn/.app/.io/.run/.co` 未查到注册记录 |
| **Stridenaut** | 未发现同名产品/商标 | 同上 |
| **Stridelio** | 未发现同名产品/商标 | 同上 |

最终选择 `Pacelith`：更短、与 `Pace Path` 图形呼应，且 `.com/.cn` 均可注册。  
详细初筛记录见 [NAME-CLEARANCE.md](./NAME-CLEARANCE.md)。这不是正式商标检索结论；正式申请前仍需按目标国家与类别做官方检索。

## 先看这一张

[`logo-concepts.png`](./logo-concepts.png) 是三款方案的对比图，包含浅色/深色横向组合与图标缩放检查。

## 已应用到项目

- 页头 / 页脚图形：[`components/brand-mark.tsx`](../components/brand-mark.tsx)
- 浏览器 favicon：[`app/favicon.ico`](../app/favicon.ico)
- 现代浏览器 SVG 图标：[`app/icon.svg`](../app/icon.svg)
- iOS 主屏图标：[`app/apple-icon.png`](../app/apple-icon.png)
- favicon 尺寸预览：[`favicon-preview.png`](./favicon-preview.png)

favicon 使用了针对 16px 优化的三阶路径版本；页头/页脚保留完整的五阶 Pace Path，避免小尺寸下糊成一团。

## 三款方向

| # | 名称 | 图形 | 关键词 |
|---|---|---|---|
| 01 | **Pace Path / 节奏路径** | 一条上升的阶梯线，右上角是当前节点 | 进步、数据、计划；**推荐方向** |
| 02 | **Split Ring / 分段环** | 带缺口的环 + 起点圆点 | 圈速、分段、节奏 |
| 03 | **Ribbon S / 缎带 S** | 连续折线构成 S 形缎带 | 字母识别、流动、个性 |

三款共用同一套字标与配色，所以可以直接比较“哪个图形更像 Pacelith”，而不是被不同字体干扰。

## 文件

```
logo-review/
  logo-concepts.png                 总览图（先看这个）
  favicon-preview.png               16/32/48/64/128px 图标预览
  header-preview.png                页头应用效果（浅色）
  header-preview-dark.png           页头应用效果（深色）
  NAME-CLEARANCE.md                 名称初筛记录
  preview.html                      可编辑的审查页
  concept-1-pace-path.svg           01 浅色横向组合
  concept-1-pace-path-dark.svg      01 深色横向组合
  concept-1-icon.svg                01 图标
  concept-1-icon-dark.svg           01 深色图标
  concept-2-*.svg                   02 对应文件
  concept-3-*.svg                   03 对应文件
```

SVG 都是矢量文件，可无损放大。

## 配色

| 名称 | 色值 | 用途 |
|---|---|---|
| Navy | `#0B2545` | 主色、图标底、字标 |
| Teal | `#0E9F94` | LAB 字标、辅助强调 |
| Mint | `#2DD4BF` | 深色底上的节点/圆点 |
| Slate | `#64748B` | 副标题与说明文字 |
| Off-white | `#F8FAFC` | 深色背景上的反白图标底 |

## 字体说明

目前字标使用系统无衬线字体（Helvetica Neue / Arial / sans-serif）渲染，方便快速审查。
正式定稿前建议二选一：

1. 将字标转为轮廓路径（最稳妥，不依赖字体文件）；
2. 换成明确开源授权的字体（例如 SIL OFL 的 Geist / Inter），并保留授权说明。

## 关于原创与侵权

- 图形是用基础几何重新绘制的原创概念，**没有使用任何第三方图标库、品牌标志、照片或付费字体文件**。
- 没有模仿常见的跑步品牌符号（例如单一 V 形、三条平行杠、圆形箭头等已高度饱和的图形语言）。
- 三款方案都是“圆角方块 + 单一路径 + 节点圆点”的同一设计系统，差异在于路径结构。
- **名称也需要单独检索**：`PACELITH` 作为文字商标、公司名或域名是否可注册/使用，需要做商标与域名检索；本稿只处理图形与视觉方向。
- **三款图形的检索重点不同**：
  - 01 Pace Path：阶梯/路径类图形较通用，重点检索“阶梯 + 圆角方块”的组合；
  - 02 Split Ring：圆环/缺口类图形在运动手表与圈速应用中较多，注意同类目近似；
  - 03 Ribbon S：字母型标志的近似风险通常更高，定稿前建议优先做 S 字母商标检索。
- 正式商用前，建议由商标代理人做一次近似检索；如果发现冲突，可以保留字标、只替换图形，或继续调整路径。
- 本文不是法律意见；最终可注册性以专业检索和商标局审查为准。

## 下一步

1. 如需微调，可继续做单色版、反白版、App icon 和社交头像；
2. 页头/页脚与 favicon 已使用 01 Pace Path；
3. 02 Split Ring / 03 Ribbon S 仍保留，方便后续换方向。
