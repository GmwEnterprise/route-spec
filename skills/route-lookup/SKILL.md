---
name: route-lookup
description: 查询功能路由图，定位相关功能、入口文件、核心代码和测试。当用户提出编码、修改、新增、删除功能等需求时触发。所有规模编码任务均需先加载。
---

# Route Lookup

根据用户当前任务查询功能路由图，快速定位应优先阅读的文件。

## 核心原则

- 功能路由图优先于全仓库搜索。
- 功能路由图不是完整索引或功能知识库，只回答“用户提到某个功能时应该优先读取哪些文件”。
- 路由图已有但无匹配、疑似过期或覆盖不足时，允许定向代码扫描，但必须标记为临时结果。
- 无法确认的功能或文件归属标记为 `uncertain`。

## 工作流

1. 读取功能路由图：`docs/routespec/feature-routes.md` 或 `docs/routespec/feature-routes/`。
   - 目录模式下优先读取 `docs/routespec/feature-routes/README.md` 或 `docs/routespec/feature-routes/index.md` 中的功能索引，再读取匹配到的具体功能文件。
   - 目录模式缺少索引、索引无匹配或索引疑似过期时，才读取目录下可能相关的功能文件；仍无法确认时再做定向扫描。
2. 根据用户提到的功能、模块、入口或文件，匹配功能定位条目中的功能名、说明、入口、核心代码、测试和备注。
3. 判断路由图覆盖状态：
   - `sufficient`：能定位主要入口、核心代码和测试位置。
   - `partial`：能定位部分信息，但关键定位信息缺失或疑似过期。
   - `missing`：已有功能路由图但无相关条目。
4. 如功能路由图不存在且当前任务需要代码定位，必须先加载 `route-init` 技能完成首次初始化；初始化后回到本技能继续 lookup，并将覆盖状态标记为 `partial`。
5. 仅在 `partial` 或 `missing` 时做定向扫描，优先源码、入口、配置和测试目录，排除依赖、构建产物、缓存和生成代码。
6. 判断是否涉及功能变更：
    * 小型明确修改（如修复 typo、调整格式、更新依赖版本，或已定位且低风险的局部功能/bug 行为变更），进入 `exec-plan` 直接执行。
    * 不涉及功能变更但规模较大（如代码重构、性能优化、技术栈/框架替换变更等任务），需要加载 `design` 技能。
    * 中大型、范围不清或需要方案确认的功能变更（新增、修改、删除功能行为）→ 需要加载 `design` 技能。
   * 无法确定时，视为需要加载 `design` 技能。
7. 路由图联动：
   - 覆盖状态为 `partial` 或 `missing` 时，任务完成后应执行 `route-sync`。
   - 任务为 typo、格式化、纯文档、依赖升级等不产生可用功能定位条目的场景，`route-sync` 可判定为 `no`，但必须说明原因。

## 内部决策清单

lookup 完成后，模型内部应明确以下判断，用于决定下一步行为：

- 匹配到的相关功能及来源（路由图 / 临时扫描 / uncertain）
- 应优先阅读的文件及原因
- 可能需要修改的文件及来源标记
- 路由图覆盖状态：`sufficient` / `partial` / `missing`
- 是否需要后续 route-sync：`yes` / `no` / `uncertain`
- 是否涉及功能变更：`yes` / `no` / `uncertain`
- 建议的下一步技能：`design` / `exec-plan` / `route-sync` / `route-init`

不为追求完整而扩大扫描范围。

## 标准输出格式

lookup 完成后，如后续技能需要读取本技能结果，按以下格式输出或记录：

```md
# Route Lookup Result

## Matched Features
- 功能名（source: route-map / scan / uncertain）：匹配原因

## Priority Files
- `path/to/file`（source: route-map / scan / uncertain）：优先阅读原因

## Potential Change Files
- `path/to/file`（source: route-map / scan / uncertain）：可能修改原因

## Coverage
- Status: sufficient / partial / missing
- Temporary scan used: yes / no

## Task Classification
- Functional change: yes / no / uncertain
- Need route-sync: yes / no / uncertain
- Next skill: design / exec-plan / route-sync / route-init
```

## 首次初始化

路由图不存在且当前任务需要代码定位时，必须加载 `route-init` 技能完成首次初始化。初始化完成后继续本技能的 lookup 流程，并将覆盖状态标记为 `partial`。已有路由图但无相关条目时，不执行 `route-init`，按 `missing` 覆盖状态进行定向扫描并在任务完成后检查 `route-sync`。
