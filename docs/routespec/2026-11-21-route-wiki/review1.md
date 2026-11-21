# 评审报告 review1

结论：修复 Important 后可合入。未发现 Critical 级逻辑断裂；3 项 Important 集中在技能交接面的字段清单与条件分支缺口；7 项 Minor 为轻度命名错配与量词歧义。

## Critical

无。

## Important

1. **run-spec 派发"三件套"缺第④项"已知事实"，与 code-reviewer 的四项输入约定不一致**
   - 位置：`skills/run-spec/SKILL.md` 第 95-98 行；`agents/code-reviewer.md` 第 3、12-21 行
   - 问题：code-reviewer 要求四项输入（①需求画像②改动范围③验证状态④已知事实，缺项先补齐再派发）；run-spec 派发清单仅三件套，按其执行的每次派发都会触发 code-reviewer 缺项中断。
   - 最小整改方向：派发清单补"已知事实（无则写「无」）"，三件套改四件套。

2. **修复任务经需求澄清后无分流出出口，存在绕过 route-debug 的偏差路径**
   - 位置：`skills/route-lookup/SKILL.md` 第 19-20、43、48-53、54-58 行
   - 问题：第 9 步把修复任务列为澄清适用对象，但唯一的澄清后出口第 10 步四个分支全为执行任务语境，无修复任务分支（route-debug 下游只在澄清前的第 7 步给出）；套用第 10 步清单即绕过 route-debug，与核心原则冲突。分析任务澄清后同样无对应分支。
   - 最小整改方向：第 10 步补修复任务 → route-debug 分支（及分析任务 → 直接作答分支）。

3. **调试摘要移交要素清单三处不一致，"复现用例"在下游无显式承接**
   - 位置：`skills/spec/SKILL.md` 第 25 行（五项）；`skills/run-spec/SKILL.md` 第 33 行（四项）；`skills/route-debug/SKILL.md` 第 45、91、94-113 行（输出格式无"复现用例"命名字段）
   - 问题：同一交接面要素清单存在 5/5/4 三个版本；route-debug 要求复现用例供 run-spec 实现后验证，但输出模板无显式字段、run-spec 读取清单未列。
   - 最小整改方向：三处统一为同一要素清单（均含复现用例），route-debug 输出格式升格为命名字段。

## Minor

1. 覆盖状态 `missing` 定义（wiki 存在但无相关页面）与 AGENTS.md 用法（wiki 不存在亦记 missing）错配——`AGENTS.md` 第 10 行。
2. 路由页打开数量预算两种读法（"最多 2 个"与"顺链再开一页"是否计入上限未消歧）——`skills/route-lookup/SKILL.md` 第 14、28、31 行。
3. route-sync 收集信息源为裸 `git diff`，缺"或改动文件清单"双轨（run-spec / code-reviewer 均为双轨）——`skills/route-sync/SKILL.md` 第 78 行。
4. code-reviewer 将 `docs/integration/` 括注为三类，与 route-sync 六类收录范围不一致——`agents/code-reviewer.md` 第 65 行。
5. "先读契约"约束面例举四项未含隐式约定/术语定义且未标注非穷尽——`skills/route-lookup/SKILL.md` 第 30 行、`skills/spec/SKILL.md` 第 19 行。
6. route-debug 内部判断清单固定指向 run-spec，未覆盖移交 spec 的第三档——`skills/route-debug/SKILL.md` 第 83-92 行。
7. route-sync 判定枚举中英混用（`yes`/`no`/`uncertain` vs 是/否/不确定），run-spec 单文件内并存两套——`skills/run-spec/SKILL.md` 第 47、152、184 行。

## 待确认项裁决（主线程）

- Minor-3 口径：设计约束为"不对工程 git 属性做限制或提示"；`git diff` 属功能性行为引用而非属性限制，但统一为双轨口径（"实际改动文件（或 `git diff`）"）顺带修复；"常规 git 流程"为既有功能性表述，保留。
- Minor-5 口径：四项为例举而非穷尽，隐式约定类同样触发先读——加"等"修复。

## 处置

- Important 1-3：当轮修复。
- Minor 1-7：当轮修复（均为低成本且明确）。
- 无 Critical，不触发二轮增量审查。
