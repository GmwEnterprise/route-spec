---
name: route-sync
description: 同步、废弃、归档或审计功能路由图。适用于功能新增、删除、行为变化、重构、关键 bug 修复后检查并更新功能路由图，以及用户要求检查路由图是否过期或进行审计时触发。
---

# Route Sync

让功能路由图与当前代码保持一致。只有确认路由信息发生变化时才修改文档。

## 核心原则

- 功能路由图不是完整代码索引，只记录下次修改功能时最值得先读的位置。
- 实际代码变更优先于计划文档。
- 无法确认的字段标记为 `uncertain`，不得编造。
- 保持已有格式，不为统一样式而重写整个路由图。
- 默认只修改 RouteSpec 文档，不修改业务代码。

## 何时需要检查

以下情况必须检查 route-sync：

- 新增、删除或替换功能。
- 修改用户入口、外部入口、API、CLI、IPC、事件或平台回调。
- 修改功能行为、核心流程、关键数据流或集成点。
- 重构目录结构、模块边界或主要代码入口。
- 修复关键 bug 并改变对功能的理解。
- 关键测试入口新增、删除、迁移或重命名。

以下情况通常只需说明无需修改：格式化、注释、普通文案、日志、小范围内部实现优化、非关键测试调整。

## 功能卡片字段

优先维护这些字段：

- `Feature Name`
- `Status`: `active` / `experimental` / `deprecated` / `removed` / `uncertain`
- `Type`
- `Summary`
- `User / External Entry`
- `Primary Code Entry`
- `Core Logic`
- `Tests / Verification`
- `Recent Changes`

适用时维护这些字段：

- `Flow / Orchestration`
- `State / Data`
- `Integration Points`
- `Configuration`
- `Platform Specific`
- `Observability / Debugging`
- `Related Features`
- `Notes`

## 工作流

1. 读取功能路由图：默认 `docs/routespec/feature-routes.md` 或 `docs/routespec/feature-routes/`。
2. 收集本次任务信息：实际变更文件、`git diff`、测试结果、执行摘要、`plan.md`、`design.md`、用户说明。
3. 判断是否需要修改：
   - 不需要：输出原因，不改文件。
   - 需要：更新已有功能卡片，或新增功能卡片。
   - 不确定：标记 `uncertain`，只写已确认信息。
4. 处理废弃或移除功能：
   - 功能仍在但不推荐使用：标记 `deprecated`。
   - 功能已删除或被替代：标记 `removed`，记录移除原因、日期、原入口和替代功能；未知项填 `uncertain`。
   - 只有用户明确要求整理归档时，才移动到 `feature-routes-archive.md`。
5. 追加 `Recent Changes`，格式建议为 `yyyy-MM-dd-{taskName}: 简要说明`。
6. 输出同步摘要。

## 新增功能卡片模板

```md
## {Feature Name}

Status: active | experimental | deprecated | removed | uncertain

Type:
- ui-feature | api-feature | cli-feature | background-job | library-feature | integration | platform-feature | infrastructure | other

Summary: ...

User / External Entry: ...

Primary Code Entry: ...

Core Logic: ...

Tests / Verification: ...

Recent Changes: yyyy-MM-dd-{taskName}: ...

Notes: ...
```

## 输出格式

```md
# Route Sync Summary

## 结果
- 已更新 / 无需更新 / 部分更新 / uncertain

## 新增功能路由
- 无 / ...

## 修改功能路由
- 无 / ...

## 废弃或移除
- 无 / ...

## 文件位置变化
- 无 / ...

## 未确认内容
- 无 / ...

## 后续建议
- 无 / 建议人工确认 / 建议再次执行 route-sync 审计模式 ...
```

## 审计模式

当用户要求检查路由图是否过期时，先做轻量审计。逐条检查功能卡片：

1. `Primary Code Entry` 和 `Core Logic` 中引用的文件是否存在。
2. `User / External Entry` 描述的入口是否仍与代码匹配。
3. 是否存在已删除或被迁移但未在路由图中反映的功能。

全部通过则输出"无需更新"；发现问题后按本技能正常流程更新。不需要单独进入复杂审计流程，除非用户明确要求全面审计。
