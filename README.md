# RouteSpec

以**功能路由图**为核心的 AI 编码工作流技能套件，面向个人开发者与团队，支持多代码库工作区。路由图回答"改某个功能前应先读哪些文件"，跨会话持续维护；技能工作流服务于它的构建与养护，而非反过来。安装后各技能由 agent 按 `description` 自动匹配触发。

## 安装与更新

通过 [skills CLI](https://vercel-labs-skills.mintlify.app) 安装：

```bash
npx skills add https://github.com/GmwEnterprise/route-spec
```

升级：

```bash
npx skills update    # 更新全部已安装技能
npx skills update -g # 更新全局安装的技能
```

升级后，既有的 `docs/routespec/feature-routes.md` 单文件路由图仍会被读取（覆盖状态标 `partial`），并在下一次 route-sync 时按迁移指南分批迁移。

## 技能

| 技能 | 作用 |
|---|---|
| `route-lookup` | 查询功能路由图，定位与当前任务相关的核心源码文件，并判定覆盖状态与下一步。 |
| `route-sync` | 养护路由图：首次创建、日常同步、审计、主动补全（harvest）、轻量 drift 自检、遗留结构迁移。 |
| `route-debug` | 借助路由图做系统化根因定位的调试工作流（先定位根因，再移交修复）。 |
| `spec` | 中大型/范围不清任务的方向确认与可执行拆解（单一可选产物 `spec.md`）。 |
| `exec-plan` | 执行变更，以"验证门（跑命令读新鲜输出）"为唯一硬性完成依据。 |

## 工作流

- 小而明确的修改 → `route-lookup` → `exec-plan`
- bug / 测试失败 / 异常行为 → `route-lookup` → `route-debug` →（局部修复 `exec-plan`；范围不清或广则 `spec` → `exec-plan`）
- 中大型或范围不清 → `route-lookup` → `spec` → `exec-plan`
- 功能变更完成后 → `route-sync`

路由图不存在时，`route-lookup` 会建议用 `route-sync` 的"首次创建"模式建立。提交由开发者惯用的提交流程完成，提交信息记录任务目录位置。

## 路由图

- 统一位于 `docs/routespec/feature-routes/`，`README.md` 是唯一必读入口；小工程条目内联在 README，中大型工程 README 只做"业务域 → 路由文件"索引。
- 分层始终以业务、功能为维度，不按技术分层或目录结构组织。
- 条目只标注核心源码文件（1-2 个）。

## 跨工程工作区

在工作区规则（AGENTS.md、CLAUDE.md 等）中声明本工作区为多代码库共同开发并列明库清单后（无库清单的声明、仅见于使用说明或文档引用的措辞均不生效，按单工程处理）：

- 路由图与任务目录相对各代码库根独立管理。
- 单库任务按单工程流程处理：只在该库建立任务目录，不建工作区协作文件。
- 跨库任务统一 `spec_name` 与日期，各库各自建立 `docs/routespec/yyyy-MM-dd-{spec_name}/`；工作区根建立 `docs/routespec/yyyy-MM-dd-{spec_name}/collaboration.md` 记录总体要求并关联各库任务目录，不纳入版本管理（工作区根有 git 仓库时加入忽略）。
- 跨工程协同约束、声明、契约沉淀到各库 `docs/routespec/cross-repo/` 主题文档：只写本库承担部分，以文本引用对端库对应文档；纳入版本管理、随本库提交。工作区协作文件是开发者个人的任务级关联，协同文档是团队共享的持久契约。
- 提交在各库内分别进行，提交信息记录本库任务目录位置。
