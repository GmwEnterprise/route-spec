## 简介

RouteSpec 是面向个人开发者与团队的 AI 编码工作流技能套件，支持多代码库工作区，核心价值有二：

- 通过**功能路由图**快速定位功能点对应的核心源码文件
- 按任务规模选择合适的工作流，产出方案文档、执行计划或轻量执行备注

## 本仓库约定

本仓库是技能源码仓库，不建立业务功能路由图。route-lookup 在本仓库的覆盖状态按 `missing` 记录即可，不触发 route-sync 首次创建；任务的 RouteSync 判定为否。

## 在其它项目使用

1. `npx skills add https://github.com/GmwEnterprise/route-spec`，技能按描述自动匹配触发
2. （可选）多代码库工作区：在工作区规则（AGENTS.md、CLAUDE.md 等）中声明本工作区为多代码库共同开发并列明库清单，无库清单按单工程处理；RouteSpec 按各库独立管理路由图与任务目录，任务涉及多个库时经工作区根 `docs/routespec/yyyy-MM-dd-{spec_name}/collaboration.md` 关联（开发者个人、不挂 git），单库任务不建该文件；跨工程协同约束、声明、契约沉淀到各库 `docs/routespec/cross-repo/` 主题文档，只写本库承担部分并以文本引用对端库对应文档，随本库提交。
