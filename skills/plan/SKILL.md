---
name: plan
description: 基于已确认设计或明确需求生成执行计划。适用于需要单独生成 plan.md、设计已确认后准备实现的场景。
---

# Plan

把已确认的设计或明确需求转成可执行计划，不重新设计需求。

## 核心原则

- 只规划已确认范围内的修改，不扩展设计范围。
- 任务顺序必须服务于最小正确实现。
- 每个任务都应说明涉及文件和验证方式。
- 不重新讨论需求合理性，不重写 `design.md`。

## 工作流

1. 读取已确认的 `design.md`、用户明确需求、`route-lookup` 输出和必要代码上下文。
2. 确认输入是否足以制定计划；如缺少阻塞信息，一次性说明需要用户确认的点。
3. 按依赖顺序拆解执行任务。
4. 为每个任务列出文件范围、修改目标和完成后的验证方式。
5. 判断是否需要 `route-sync`，并写入计划。
6. 将计划写入任务目录的 `plan.md`，或在用户只需轻量计划时直接输出。

## plan.md 精简格式

```md
# Execution Plan: {taskName}

## Summary
- ...

## Tasks
- [ ] Task 1: ...
  - Files: ...
  - Change: ...
  - Verify: ...
  - Depends on: none / ...

## Verification
- Commands: ...
- Manual checks: ...

## RouteSync
- Need route-sync: yes / no / uncertain
- Expected updates: ...

## Risks
- 无 / ...
```

## 输出要求

- 默认写入与 `design.md` 相同任务目录下的 `plan.md`。
- 如果没有任务目录，默认使用 `docs/routespec/yyyy-MM-dd-{taskName}/plan.md`。
- `plan.md` 是交接给 `exec-plan` 技能的输入文件。
- 不修改功能路由图；只判断后续是否需要 `route-sync`。

## 结束条件

- 执行顺序已明确。
- 每个任务都有文件范围和验证方式。
- 已判断 route-sync 需求。
- 下一步明确指向 `exec-plan` 或等待用户确认。
