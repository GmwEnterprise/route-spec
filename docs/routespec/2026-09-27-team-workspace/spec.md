# 方案：team-workspace

## 目标
- 全面优化 RouteSpec,适配团队与多代码库(跨工程)工作区

## 范围
- 内：5 项需求——路由图结构优化、README 统一入口、提交衔接、跨工程支持、route-sync 迁移指南
- 外：route-debug 工作流本身、插件机制、通用提交技能本身

## 假设
- 无

## 实现方向
1. **路由图结构**：统一目录形态 `docs/routespec/feature-routes/`,README.md 为唯一必读入口；小工程条目全部内联在 README,中大型工程 README 只做"业务域 → 路由文件"索引；分层始终以业务/功能为维度(域 → 子域 → 功能)，域文件过大才拆子文件；条目收敛为"描述 + 核心(核心源码文件)+ 可选备注"，测试入口并入备注
2. **读图入口**：route-lookup / route-sync 均直接读 `docs/routespec/feature-routes/README.md`,一次读对；旧 `feature-routes.md` 单文件仅作回退读取(标 partial、建议迁移)
3. **提交衔接**：存在任务目录时，提交信息 footer 记录 `Spec: docs/routespec/yyyy-MM-dd-{spec_name}`；规则收敛于 spec 技能，提交由开发者惯用的提交流程完成
4. **跨工程**：工作区规则声明多代码库共同开发时,各库独立管理自己的路由图与任务目录;跨库任务统一 spec_name,各库各自 `docs/routespec/yyyy-MM-dd-{spec_name}/`,工作区根 `docs/routespec/yyyy-MM-dd-{spec_name}/collaboration.md` 记录总体要求并关联各库 spec 路径(不提交,开发者自行管理);各库 spec 可含"跨库联动"小节
5. **迁移指南**：route-sync 正文加一行指引,细节写 `skills/route-sync/references/migration.md`;按需分批迁移,不强制一次性全量

## 受影响文件
- `skills/route-lookup/SKILL.md`(来源:仓库结构):读图入口统一、多库感知
- `skills/route-sync/SKILL.md`(来源:仓库结构):结构定义、首次创建规则、drift 自检、迁移指引
- `skills/route-sync/references/migration.md`(来源:新建)
- `skills/spec/SKILL.md`(来源:仓库结构):跨工程小节、spec 格式扩展
- `skills/exec-plan/SKILL.md`(来源:仓库结构):多库任务工作区、提交衔接
- `README.md`、`AGENTS.md`、`package.json`(来源:仓库结构):一览、说明、版本

## 风险
- 技能正文误写"新版/旧版"式改动性描述——仅迁移 ref 内允许版本对照
- 多库与单库流程交织导致指令歧义——跨工程作为独立小节,默认流程保持单库

## 测试策略
- 全文一致性检查:路径引用、技能衔接、输出格式无矛盾;无改动性描述

## 验收标准
- 5 项需求全部落地且各技能内部一致
- route-lookup 首步只读一个固定路径即可完成定位
- 提交衔接、跨工程、迁移指南可用

## 任务
- [x] T1:route-sync 重写结构定义 + 首次创建 + drift 自检 + 迁移一行;新建 references/migration.md
  - 文件:skills/route-sync/SKILL.md、skills/route-sync/references/migration.md
  - 改动:结构模板、条目字段、统一入口、迁移指引
  - 验证:全文审读
- [x] T2:route-lookup 读图入口统一 + 多库感知
  - 文件:skills/route-lookup/SKILL.md
  - 改动:工作流程 1-4 步重写、新增跨工程判定
  - 验证:与 route-sync 结构定义一致
- [x] T3:spec 跨工程支持
  - 文件:skills/spec/SKILL.md
  - 改动:跨工程小节、spec.md 格式加跨库联动、collaboration.md 规则
  - 验证:与 route-lookup/route-sync 路径一致
- [x] T4:exec-plan 多库任务工作区 + 提交衔接
  - 文件:skills/exec-plan/SKILL.md
  - 改动:任务工作区多库规则、完成清单与提交衔接
  - 验证:全文审读
- [x] T5:提交衔接规则收敛到 spec
  - 文件:skills/spec/SKILL.md
  - 改动:提交信息记录任务目录位置(Spec footer)的规则
  - 验证:与任务目录规则一致
- [x] T6:README.md / AGENTS.md / package.json 同步
  - 文件:README.md、AGENTS.md、package.json
  - 改动:技能一览、路由图位置、跨工程说明、版本号
  - 验证:与技能正文一致

## 任务关系
- 强相关:T1 + T2(共享结构定义)
- 弱相关:T3 + T4(共享跨工程路径规则)
- 独立:T5、T6
- 冲突风险:无

## RouteSync
- 需要 route-sync:否(本仓库为技能源码,无业务功能路由图)
