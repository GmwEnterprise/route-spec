# RouteSpec AI 编码工作流

RouteSpec 是一套面向个人开发者的 AI 编码工作流规范。核心目标：**用轻量规格约束任务执行，用功能路由图沉淀项目结构记忆**。

## 如何使用

1. `npx skills add https://github.com/GmwEnterprise/route-spec`
2. 系统提示词中添加一句："编码任务必须先加载 `route-lookup`，再按其指引选择后续流程"

## 工作流程

1. 新需求或修改代码前，优先加载 `route-lookup` 定位相关功能和代码。
2. 功能路由图不存在时，由 `route-lookup` 按首次初始化参考创建最小可用路由图。
3. 根据任务规模和用户目标选择只设计、只计划或直接执行。
4. 任务执行后，如涉及核心功能、入口文件、核心实现或关键测试入口变化，必须检查 `route-sync`。

## 任务规模分级

| 规模 | 特征 | 推荐流程 |
|------|------|----------|
| 小型 | 需求明确、影响文件少、无架构变化 | `route-lookup` → `exec-plan` → `route-sync` 检查 |
| 中型 | 多文件、完整功能链路、有行为变化 | `route-lookup` → `design` → `plan` → `exec-plan` → `route-sync` |
| 大型 | 跨模块、架构调整、数据迁移、安全风险 | `route-lookup` → `design` → 用户确认 → `plan` → `exec-plan` → `route-sync` |
| 只要方案 | 只需要确认范围、方向、风险和验收标准 | `route-lookup` → `design` |

无法确定规模时，按更高一级处理。用户可随时覆盖 AI 的规模判断。

## 技能总览

| 技能 | 目录 | 职责 | 何时加载 |
|------|------|------|----------|
| `route-lookup` | `skills/route-lookup/` | 查询功能路由图，定位相关功能、代码入口和测试 | 开始设计或编码前 |
| `design` | `skills/design/` | 需求澄清、范围确认和方案设计 | 需求不清、中大型任务、只需要 `design.md` 或需要先确认方案 |
| `plan` | `skills/plan/` | 基于已确认设计或明确需求生成执行计划 | 需要 `plan.md`、设计确认后准备实现 |
| `exec-plan` | `skills/exec-plan/` | 执行计划或直接完成小型明确改动 | 开始编码、实施改动、继续执行计划 |
| `route-sync` | `skills/route-sync/` | 同步、废弃、归档或轻量审计功能路由图 | 定位信息可能受影响时 |

## 推荐生命周期

### 小型明确改动

```text
route-lookup → exec-plan → route-sync 检查
```

### 只需要设计方案

```text
route-lookup → design
```

### 中型改动

```text
route-lookup → design → plan → exec-plan → route-sync
```

### 大型改动

```text
route-lookup → design → 用户确认 → plan → exec-plan → route-sync
```

### 路由图过期、功能废弃或功能删除

```text
route-sync
```

## 文档结构

```text
docs/routespec/
├── feature-routes.md          # 功能路由图，适合小型项目
├── feature-routes/            # 功能路由图目录，适合较大项目，可选
│   ├── index.md
│   └── {featureName}.md
├── feature-routes-archive.md  # 已移除功能归档，可选
└── yyyy-MM-dd-{taskName}/     # 任务目录
    ├── design.md              # 中大型任务的设计文档
    ├── plan.md                # 中大型任务的执行计划
    ├── plan-fix1.md           # 必要时生成的修复计划
    ├── plan-fix2.md
    ├── plan-fix3.md
    └── unresolved-issues.md   # 达到修复上限或存在阻塞时记录
```

## 功能路由图约定

功能路由图不是完整代码索引或功能知识库，只记录下次修改某个功能时最值得优先阅读的位置。字段定义和维护规则详见 `route-sync` 技能。

功能定位条目默认只保留功能名、说明、入口、核心代码、测试和必要备注。缺失字段可以省略；如果无法确认，标记为 `未知` 或 `uncertain`，不得编造。

## 总体原则

1. 只追问阻塞性问题，不无限提问。
2. 非阻塞性不确定点写入 Assumptions，基于合理默认值继续。
3. 小任务用轻量流程；中大型任务按需要分别生成设计和计划文档。
4. 每一份文档都服务当前任务，不为未来扩展制造流程负担。
5. 功能路由图与代码冲突时，以代码为准，并通过 `route-sync` 修正路由图。
6. 所有无法确认的信息标记为 `uncertain`，不得猜测或编造。
7. 涉及核心功能新增或删除、入口文件变化、核心实现迁移、关键测试入口变化后，必须检查是否需要 `route-sync`。
8. 默认只做当前需求需要的最小修改，不顺手重构无关内容。
