## 简介

RouteSpec 是面向个人开发者与团队的 AI 编码工作流技能套件，核心价值有二：

- 通过**路由 wiki**以任意角度词汇快速定位核心源码文件与契约文档
- 按任务规模选择合适的工作流，产出方案文档、执行计划或轻量执行备注

## 本仓库约定

本仓库是技能源码仓库，不建立业务路由 wiki。route-lookup 在本仓库按 wiki 不存在处理，覆盖状态记 `missing`，不触发 route-sync 首次创建；任务的 RouteSync 判定为否。

## 在其它项目使用

1. `npx skills add https://github.com/GmwEnterprise/route-spec`，技能按描述自动匹配触发
