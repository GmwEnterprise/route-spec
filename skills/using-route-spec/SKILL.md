---
name: using-route-spec
description: RouteSpec 引导技能。编码任务必须先加载 route-lookup，再按其指引选择后续流程。
---

# RouteSpec 工作流引导

RouteSpec 是一套 AI 编码工作流技能组，通过功能路由图快速定位代码，按任务规模选择合适的执行流程。

## 核心规则

**编码任务必须先加载 `route-lookup`，再按其指引选择后续流程。**

## 工作流总览

1. **route-lookup** — 查询功能路由图，定位相关代码（所有编码任务必经入口）
2. **route-init** — 首次创建功能路由图（路由图不存在时由 route-lookup 自动触发）
3. **design** — 需求澄清与方案设计（中大型任务或范围不清时）
4. **plan** — 生成执行计划（design 确认后）
5. **exec-plan** — 执行计划或直接实施小型改动
6. **route-sync** — 同步功能路由图（功能变更完成后）

## 流转规则

- 小型明确修改（typo、格式、依赖升级等）→ route-lookup → exec-plan
- 中大型或范围不清的任务 → route-lookup → design → plan → exec-plan
- 功能变更完成后 → route-sync
