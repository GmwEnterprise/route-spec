# 安装 RouteSpec 插件

## 前置条件

- 已安装 [OpenCode](https://opencode.ai)

## 安装

在 `opencode.json`（全局或项目级）的 `plugin` 数组中添加：

```json
{
  "plugin": ["route-spec@git+https://github.com/GmwEnterprise/route-spec.git"]
}
```

重启 OpenCode 即可。插件会自动安装并注册所有技能。

## 验证

向 agent 提问："列出可用的 route-spec 技能"

或使用 skill 工具加载：`route-lookup`

## 使用

编码任务必须先加载 `route-lookup`，再按其指引选择后续流程：

- 小型明确修改 → `exec-plan`
- 中大型或范围不清 → `design` → `plan` → `exec-plan`
- 功能变更完成后 → `route-sync`

## 更新

每次启动 OpenCode 时自动从远程仓库拉取最新版本。

锁定特定版本：

```json
{
  "plugin": ["route-spec@git+https://github.com/GmwEnterprise/route-spec.git#v1.0.0"]
}
```

## 从旧的 `npx skills add` 方式迁移

```bash
rm -rf ~/.config/opencode/skills/route-spec
# 或移除项目级符号链接
rm -rf .opencode/skills/route-spec
```

然后在 `opencode.json` 中按上述方式配置 `plugin` 即可。
