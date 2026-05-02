---
name: route-lookup
description: 查询功能路由图，定位相关功能、入口文件、核心逻辑和测试。当用户提出编码、修改、新增、删除功能等需求时触发。所有规模任务均需先加载。
---

# Route Lookup

根据用户当前任务查询功能路由图，快速定位应优先阅读和可能修改的代码。

## 核心原则

- 功能路由图优先于全仓库搜索。
- 功能路由图不是完整索引，只回答“下次改这个功能先看哪里”。
- 路由图缺失、过期或覆盖不足时，允许定向代码扫描，但必须标记为临时结果。
- 无法确认的功能或文件归属标记为 `uncertain`。

## 工作流

1. 读取功能路由图：`docs/routespec/feature-routes.md` 或 `docs/routespec/feature-routes/`。
2. 根据用户需求匹配功能卡片中的名称、摘要、用户入口、代码入口、核心逻辑、集成点和测试。
3. 判断路由图覆盖状态：
   - `sufficient`：能定位主要入口和修改范围。
   - `partial`：能定位部分信息，但关键字段缺失或疑似过期。
   - `missing`：没有功能路由图或无相关条目。
4. 仅在 `partial` 或 `missing` 时做定向扫描，优先源码、入口、配置和测试目录，排除依赖、构建产物、缓存和生成代码。
5. 给出任务规模初判：`small` / `medium` / `large`。
6. 联动指引：
   - 任务规模为 `small` 时，建议直接加载 `exec-plan` 技能。
   - 任务规模为 `medium` 或 `large` 时，建议下一步加载 `design-plan` 技能。
   - 路由图覆盖状态为 `partial` 或 `missing` 时，任务完成后应执行 `route-sync`。

## 内部决策清单

lookup 完成后，模型内部应明确以下判断，用于决定下一步行为：

- 匹配到的相关功能及来源（路由图 / 临时扫描 / uncertain）
- 应优先阅读的文件及原因
- 可能需要修改的文件及来源标记
- 路由图覆盖状态：`sufficient` / `partial` / `missing`
- 是否需要后续 route-sync：`yes` / `no` / `uncertain`
- 任务规模初判：`small` / `medium` / `large`
- 建议的下一步技能：`design-plan` / `exec-plan` / `route-sync`

不为追求完整而扩大扫描范围。

## 首次初始化

路由图不存在时，执行最小初始化：

1. 创建 `docs/routespec/feature-routes.md`，不创建额外配置文件。
2. 基于当前任务做定向代码扫描，只记录本次任务直接相关的功能，不做全仓库盘点。
3. 至少写入一个功能卡片；如无法确认功能名称或入口，字段标记为 `uncertain`。
4. 初始化后继续本技能的 lookup 流程，并将覆盖状态标记为 `partial`。

功能卡片字段和格式见 `route-sync` 技能的新增功能卡片模板。