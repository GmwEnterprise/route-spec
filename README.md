# RouteSpec

面向中大型项目的、以**功能路由图**为核心的 AI 编码工作流技能套件。

RouteSpec 的差异化价值不是"又一套开发方法论"，而是一份**跨会话持续维护的"功能 → 应先读哪些文件"路由图**。技能工作流服务于这份路由图的构建与养护，而非反过来。

## 安装

通过 [skills](https://github.com/obra/skills) 安装到任意项目：

```bash
npx skills add https://github.com/GmwEnterprise/route-spec
```

安装后技能由各 agent 按其 `description` 自动匹配触发——**无需钩子注入系统提示词**。

### 可选：强化为强制入口

若希望 agent 在编码类任务中一定先查路由图，可在项目或全局的系统提示词里加一句：

> 编码类任务请优先加载 `route-lookup`，再按其指引选择后续技能。

这是可选项，不是必需步骤。

## 技能一览

| 技能 | 作用 |
|---|---|
| `route-lookup` | 查询功能路由图，定位与当前任务相关的入口/核心/测试文件，并判定覆盖状态与下一步。 |
| `route-sync` | 养护路由图：首次创建、日常同步、审计、主动补全（harvest）、轻量 drift 自检。 |
| `route-debug` | 借助路由图做系统化根因定位的调试工作流（先定位根因，再移交修复）。 |
| `spec` | 中大型/范围不清任务的方向确认与可执行拆解（单一可选产物 `spec.md`）。 |
| `exec-plan` | 执行变更，以"验证门（跑命令读新鲜输出）"为唯一硬性完成依据。 |

## 工作流

- 小而明确的修改 → `route-lookup` → `exec-plan`
- bug / 测试失败 / 异常行为 → `route-lookup` → `route-debug` →（局部修复 `exec-plan`；范围不清或广则 `spec` → `exec-plan`）
- 中大型或范围不清 → `route-lookup` → `spec` → `exec-plan`
- 功能变更完成后 → `route-sync`

路由图不存在时，`route-lookup` 会建议用 `route-sync` 的"首次创建"模式建立。

## 设计取向

- **路由图是产品**：查询/同步是核心，方案/执行是按需触发的手段。
- **按需触发**：技能靠 description 自匹配触发，无强制加载顺序。
- **给所有 loop 写停止条件**：评审默认 1 轮、仅 Critical 进 2 轮；修复上限默认 3 轮。
- **模型感知**：自验证（第 5 代及以上）模型上关闭冗余自评层，只保留验证门。
- **单一契约**：技能契约仅由 `skills/*/SKILL.md` 定义，无插件、无系统提示词注入钩子。

## 路由图位置

默认 `docs/routespec/feature-routes.md`；中大项目可用目录模式 `docs/routespec/feature-routes/`。
