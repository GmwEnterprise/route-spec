---
name: design-plan
description: 需求澄清、轻量设计和执行计划生成。适用于需求不清、中大型任务或需要生成 design.md / plan.md 的场景。
---

# Design Plan

把需求转成可执行方案。小任务只做轻量确认；中大型任务生成 `design.md` 和 `plan.md`。

## 核心原则

- 只追问阻塞性问题；非阻塞不确定点写入 Assumptions 后继续。
- 文档服务当前任务，不为未来扩展预留复杂设计。
- 所有文件和影响范围必须基于用户需求、功能路由图和代码事实。
- 小任务默认不生成重文档，除非用户要求。

## 任务分级

- `small`：需求明确、影响文件少、无架构变化。输出轻量执行说明，可直接进入 `exec-plan`。
- `medium`：多文件、完整功能链路或有行为变化。生成 `design.md` 和 `plan.md`。
- `large`：跨模块、架构调整、数据迁移、安全风险。生成完整文档，并等待用户确认后执行。

## 工作流

1. 读取 `route-lookup` 技能的输出结果（功能定位、路由图覆盖状态、任务规模初判），结合相关功能路由图和必要代码上下文开展工作。本技能依赖 `route-lookup` 的结果，如尚未执行 route-lookup，应先加载该技能。
2. 判断需求是否存在 Blocking Questions。
3. 如有阻塞问题，一次性列出并等待用户回答；非阻塞问题写入 Assumptions。
4. 输出需求确认摘要。
5. 根据任务规模决定输出：
   - 小任务：输出轻量执行说明（格式参考 `exec-plan` 技能的「小任务执行说明」），不强制写文件。
   - 中大型任务：写入任务目录，默认 `docs/routespec/yyyy-MM-dd-{taskName}/`。
6. 生成设计和执行计划后，说明是否需要用户确认。

## 需求确认摘要

```md
# Requirement Summary

## Goal
- ...

## Scope
- In: ...
- Out: ...

## Assumptions
- 无 / ...

## Quick Checks
- 初步验收要点（详细 Acceptance Criteria 见 design.md）

## Blocking Questions
- 无 / ...
```

## design.md 精简格式

```md
# Design: {taskName}

## Goal
- ...

## Non-goals
- ...

## Current Behavior
- ...

## Proposed Behavior
- ...

## Affected Files
- `path/to/file`：影响说明

## Risks
- 无 / ...

## Test Strategy
- ...

## RouteSpec Impact
- Need route-sync: yes / no / uncertain
- Affected routes: ...

## Acceptance Criteria
- ...
```

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

`plan.md` 是交接给 `exec-plan` 技能的输入文件。

## 结束条件

- 阻塞问题已解决，或明确等待用户回答。
- 小任务已有足够执行说明。
- 中大型任务已生成 `design.md` 和 `plan.md`。
- 下一步明确指向 `exec-plan` 或等待用户确认。
