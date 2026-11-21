# 方案：route-wiki

## 目标

- 路由文档采用 llm-wiki 形态的指针网络：用户以业务场景、架构场景或代码场景的任意词汇提问，模型以最少 token 代价直接命中核心代码与核心契约文档（常态定位 = 读 1 次索引 + 1-2 个路由页，约 1-2KB）
- 契约文档成为 RouteSpec 工作流的一等成员，路径定为 git 工程 `docs/integration/`
- 防冗余、防过时以可机械判定的 lint 自检落地，阻断路由文档膨胀复发

## 范围

- 内：route-lookup 与 route-sync 重写；spec / exec-plan / code-reviewer 的契约接入；迁移指南重写；README / AGENTS / package.json 同步
- 外：route-debug 工作流、任务档案机制、多工程工作区（不恢复）、业务代码本身

## 假设

- 路由 wiki 与契约文档均随工程入 git 管理
- 单工程规模下索引单文件可承载（数百页以内）

## 当前行为

- 路由图为「README 入口 → 业务域文件」两级结构，分层限定业务维度，架构/技术词汇无锚点
- 条目字段无硬容量约束，"备注尽量一条"为软约束；route-sync 只增不减，无修剪与合并机制
- 契约文档不在工作流内：位置、收录边界、生命周期均无定义
- 横向任务只能连读多个域文件，读图成本高于定位收益

## 目标行为

### 文档分层（四个真相源）

| 层 | 位置 | 职责 |
|---|---|---|
| 代码 | 源码 | 实现真相：所有"怎么实现"以代码为准 |
| 路由 wiki | `docs/routespec/wiki/` | 定位真相：指针网络，只指路不存知识 |
| 契约文档 | `docs/integration/` | 约束真相：代码不可推导的定义与约定 |
| 任务档案 | `docs/routespec/yyyy-MM-dd-{spec_name}/` | 过程记录（维持既有机制） |

### 路由 wiki 结构

- `index.md`：唯一查询入口，单文件不分片；每页恰一行（`[[页面名]] —— 一句话；关键词`），按「业务功能 / 技术机制」两组分节
- `{page}.md`：路由页，kebab-case 命名；正文 ≤ 12 行；字段白名单：别名 / 说明（一句话）/ 核心（1-3 个起步阅读点）/ 契约（0-n 个 `docs/integration/` 引用）/ 相关（≤ 4 个 `[[]]` 链接）
- `log.md`：append-only 单行日志，仅记 miss / sync / lint 三类条目，grep 友好
- 页面两类锚点：功能页承接业务场景词汇，机制页承接架构/技术场景词汇——机制页即横向任务的天然锚点
- 页面不设覆盖、last-updated 等扩展字段：健康度由 log 与 lint 承担，减少簿记

### 查询流程（route-lookup）

1. 读 `index.md` 单文件
2. 语义匹配页面名、一句话与关键词：业务词汇、架构词汇、代码标识符均可命中
3. 命中：开 1-2 个页面 → 按核心文件起步读代码；任务触及页面契约字段时按引用读契约文档
4. 未命中或不确定：有针对性扫描（既有规则不变），确认定位后在 log 记 miss 条目（含 resolved 指向）
5. miss 回填：任务完成后把 resolved 词汇补进对应页面别名，命中率随使用复利上升
6. 覆盖状态判定、任务意图分类、需求澄清、下游分流：维持既有设计

### 养护流程（route-sync 四模式）

- 首次创建：扫描建 index 与当前任务相关页面，不追求覆盖
- 日常同步：更新优先、新概念才建页；同步 index 与 log；执行页面硬预算
- 自检（lint）：
  - 防过时：① `核心` 路径存在性（改名/移动/删除）② `契约` 引用的 `docs/integration/` 文件存在性 ③ 近期 diff 大量触碰某核心文件而对应页面未同步的条目复核
  - 防冗余：④ 页面预算违规（超行数、白名单外字段、段落式正文）⑤ 索引一致性（每页恰一行、无行无页）⑥ 孤儿页（不在索引）⑦ 重复页（别名或核心高度重叠 → 合并）⑧ 未回填 miss（log 中 resolved 条目未进任何页面别名）⑨ 孤儿契约（`docs/integration/` 下文件无任何页面、AGENTS.md 或 README 引用）
- 迁移：见迁移指南

### 契约文档（`docs/integration/`）

- 收录范围：
  1. 跨端协议契约：帧/事件/字段语义、时序、错误码——多端一致实现的外部承诺
  2. 接口契约：对外 API 兼容性承诺、版本与废弃策略
  3. 数据契约：落库字段语义、时间/编码规范、迁移与兼容约束
  4. 架构边界：模块职责边界、依赖方向、禁改区
  5. 隐式约定：代码不可见的默认行为、魔法值含义、环境与启动依赖
  6. 术语定义：业务词汇与代码概念的对应，兼作路由页别名来源
- 排除：实现描述（代码为准）、单端内部逻辑、代码可直读的结构、通用工程常识
- 写作规则：条款化编号；只写"是什么 / 必须遵守什么"，不写"怎么实现"；标注生效范围（涉及端/模块）；同一契约唯一权威文档，他处引用不复制
- 生命周期：spec 阶段判定契约影响（新增 / 修改 / 遵守）；变更顺序为先契约后代码；契约与代码不一致时不得静默偏移——改代码回归契约或显式修订契约，由用户裁决

### 工作流接入

- spec：`RouteSync` 小节扩展为 RouteSync 与契约影响判定；设计约束须引用在案契约
- exec-plan：读上下文含任务涉及契约；复查阶段一增契约一致性检查；改动不违反在案契约
- code-reviewer：跨端与文档清单的契约比对明确指向 `docs/integration/`；输入约定增列契约文档路径

## 实现方向

1. route-sync 重写为四模式 + lint 清单 + 契约维护职责
2. route-lookup 重写查询流程（index → 页 → 代码、miss 回填）
3. 迁移指南重写：feature-routes → wiki 收缩式收割——提取页面名、核心、可提炼别名建页；散文正文弃；确有契约价值的段落改写为条款式并入 `docs/integration/`
4. spec 接入契约影响判定
5. exec-plan 与 code-reviewer 接入契约
6. README / AGENTS / package.json 同步
7. 技能正文一律绝对陈述当前状态，不写版本对照

## 设计约束

- 不恢复多工程工作区模式
- 路由页与契约文档均禁止实现描述；两者互相引用不复制
- index 单入口不分片；页/行预算为硬门，lint 可机械判定
- 工作流不对工程的 git 属性做任何限制或提示

## 受影响文件

- `skills/route-lookup/SKILL.md`（重写）
- `skills/route-sync/SKILL.md`（重写）
- `skills/route-sync/references/migration.md`（重写）
- `skills/spec/SKILL.md`（契约影响接入）
- `skills/exec-plan/SKILL.md`（契约读写与复查接入）
- `agents/code-reviewer.md`（契约输入）
- `README.md`、`AGENTS.md`、`package.json`（同步）

## 风险

- 写侧失控复发：页面硬预算 + lint 硬门阻断，验收含 lint 演示
- 别名冷启动不足：miss 回填 + 术语契约兼作别名源
- 契约文档沦为第二百科：收录边界 + 条款式写作 + 孤儿契约检查
- 迁移期新旧并存：分批迁移 + 旧结构回退读取（维持既有回退模式）

## 测试策略

- 全文一致性审读：路径引用、技能衔接、输出格式无矛盾；无改动性描述（以 `audit-prompt.md` 自检）
- 迁移规则桌面推演：以 xiao-an-docgen 现有条目纸面试算收缩式收割可执行，不改动该工程；业务工程的路由收敛由使用方在技能组更新后自行执行，不在本任务范围

## 验证与评审计划

- T1-T6：全文审读 + audit-prompt 一致性审查；纯提示词重构不启用 code-reviewer
- 桌面试算：迁移规则对最小工程条目可执行

## 验收标准

- 任意角度词汇（业务场景 / 架构场景 / 代码场景）经 index 一次读取命中页面，再开 ≤ 2 个页面即拿到核心文件与契约引用
- lint 可检出 9 项清单全部条目
- 契约闭环成立：spec 判定 → exec-plan 遵守 → reviewer 比对 → 冲突不静默
- 技能正文全部为绝对陈述

## 任务

- [x] T1：route-sync 重写（四模式 + lint + 契约维护）
  - 文件：`skills/route-sync/SKILL.md`
  - 改动：wiki 结构定义、四模式、lint 清单、契约维护职责
  - 验证：与 route-lookup 结构定义一致
- [x] T2：route-lookup 重写（查询流程 + miss 回填）
  - 文件：`skills/route-lookup/SKILL.md`
  - 改动：index 读取、语义匹配、miss 记录与回填
  - 验证：与 T1 共享 wiki 结构定义
- [x] T3：迁移指南重写（收缩式收割）
  - 文件：`skills/route-sync/references/migration.md`
  - 改动：feature-routes 与遗留单文件 → wiki 的收割规则、契约价值段落分流
  - 验证：对 xiao-an-docgen 试算可执行
- [x] T4：spec 契约影响接入
  - 文件：`skills/spec/SKILL.md`
  - 改动：RouteSync 小节扩展、设计约束引用在案契约
  - 验证：契约判定路径与 route-sync 一致
- [x] T5：exec-plan 与 code-reviewer 契约接入
  - 文件：`skills/exec-plan/SKILL.md`、`agents/code-reviewer.md`
  - 改动：契约读写、复查清单、评审输入
  - 验证：与 T4 契约流程闭合
- [x] T6：README / AGENTS / package.json 同步
  - 文件：`README.md`、`AGENTS.md`、`package.json`
  - 改动：结构说明、技能一览、描述
  - 验证：与技能正文一致

## 任务关系

- 强相关：T1 + T2（共享 wiki 结构定义）
- 弱相关：T3（依赖 T1）、T4 + T5（共享契约流程）
- 独立：T6
- 冲突风险：无

## RouteSync

- 需要 route-sync：否（本仓库为技能源码，无业务路由 wiki）
- 契约影响：不适用（本仓库无 `docs/integration/`）
