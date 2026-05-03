---
name: design
description: 需求澄清、范围确认，以及方案设计。适用于需求不清、中大型任务、或需要先确认方案的场景。
---

# Design

把需求转成明确的设计方案，不生成执行计划。

## 核心原则

- 只追问阻塞性问题；阻塞问题必须依次提问，每次只问一个问题，并给出 2-3 个参考选项；非阻塞不确定点写入 Assumptions 后继续。
- 设计只回答目标、范围、行为差异、实现方向、风险和验收标准。
- 所有文件和影响范围必须基于用户需求、功能路由图和代码事实。
- 不拆解详细编码任务，不维护任务勾选列表，不默认生成 `plan.md`。

## 工作流

1. 读取 `route-lookup` 技能的输出结果，结合相关功能定位条目和必要代码上下文开展工作。本技能依赖 `route-lookup` 的结果，如尚未执行 route-lookup，应先加载该技能。
   - 记录关键文件来源：`route-map` / `scan` / `uncertain`，用于后续计划和执行判断定位可信度。
2. 判断需求是否存在 Blocking Questions。
3. 如有阻塞问题，按优先级依次提问：每次只提出一个最关键问题，并给出 2-3 个参考选项；用户回答后再判断是否需要继续问下一个阻塞问题。
4. 确认任务目标、范围内事项和非目标。
5. 对比当前行为和目标行为，给出推荐实现方向。
6. 说明可能影响的关键文件、风险、验收标准和验证方向。
7. 用户只要求方案时，停止在设计产物；用户决定实现时，再进入 `plan` 或 `exec-plan`。

## 阻塞问题提问格式

```md
需要先确认一个问题：{问题}

参考选项：
- A. ...
- B. ...
- C. ...（可选）
```

如选项无法覆盖用户意图，允许用户直接补充自定义答案。不得一次性抛出多个阻塞问题。

## design.md 精简格式

```md
# Design: {taskName}

## Goal
- ...

## Scope
- In: ...
- Out: ...

## Assumptions
- 无 / ...

## Current Behavior
- ...

## Proposed Behavior
- ...

## Implementation Direction
- ...

## Affected Files
- `path/to/file`（source: route-map / scan / uncertain）：影响说明

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

## 输出要求

- 需求确认过程中如果发现本次编码任务实际上属于小型任务时，可以直接在回复中输出设计摘要，不强制写文件。
- 中大型任务或用户要求 `design.md` 时，写入 `docs/routespec/yyyy-MM-dd-{taskName}/design.md`。
- 任务目录命名中，日期使用当天日期；`taskName` 使用简短 kebab-case，中文任务名转成稳定英文或拼音摘要；如目录已存在，追加 `-2`、`-3` 等序号。
- 完成 `design.md` 写入后，提示用户下一步将加载 `plan` 来生成计划任务文档。

## 结束条件

- 阻塞问题已解决，或正在等待用户回答当前唯一阻塞问题。
- 已明确目标、范围、非目标和推荐实现方向。
- 已说明关键文件、风险、验收标准和验证方向。
- 下一步明确指向 `plan` 或等待用户确认。
