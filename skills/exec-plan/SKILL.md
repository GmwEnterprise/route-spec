---
name: exec-plan
description: Execute plan.md or implement small, located changes within the RouteSpec workflow. Load when route-lookup, plan, or design suggests entering the coding phase.
---

# Exec Plan

Execute `plan.md`, or directly implement code modifications for small, clear tasks.

## Core Principles

- Prioritize making the minimal correct change.
- When a plan exists, follow the plan; for small tasks without a plan, form a brief internal execution note first, and briefly describe it to the user if necessary.
- Only pause for blocking issues; non-blocking uncertainties are recorded as Assumptions and execution continues.
- Modifications must be verified after completion; when verification is not possible, explain the reason.
- After adding, deleting, or changing feature behavior, refactoring, or fixing critical bugs, must determine whether the change affects feature entries, core implementations, or critical test entry points; only proceed with `route-sync` when changes are confirmed.
- Sub-agents must be used for all plan-based execution; even when tasks must be executed serially with no parallelizable groups, delegate implementation to sub-agents whenever the plan involves extensive code changes. The main thread must not implement code directly for plan-based execution — it only divides, dispatches, reviews, and integrates.
- The main thread is responsible for sub-agent task division, integration, final judgment, and user delivery.
- After implementation is complete, a task review must be performed to prioritize finding omissions, regression risks, and verification gaps.
- For anything other than small, localized, low-risk changes, a dedicated review sub-agent must be launched after completing medium-to-large changes; the main thread is responsible for reviewing the audit conclusions and handling confirmed issues.

## Workflow

1. Read context:
    - When a task directory exists, read `design.md`, `plan.md`, and the latest `plan-fix{n}.md`.
    - `plan-fix{n}.md` is determined as latest by the highest number; before execution, check unfinished items in `plan.md` and all `plan-fix*.md` — actual execution follows the latest fix plan and unclosed issues.
    - For small direct changes, read the `route-lookup` results and related code.
2. Read task relationships in `plan.md`; for small tasks without `plan.md`, execute on the main thread by default unless complexity is discovered that requires splitting.
3. When executing a `plan.md`, sub-agents are required — formulate sub-agent task groupings based on task relatedness; even serial-only execution must use sub-agents for implementation. Only small tasks without a plan may execute directly on the main thread.
4. Output or maintain a brief task list covering only the modifications and verifications to be done this time; small tasks default to internal maintenance unless the user needs it or the task risk warrants explanation.
5. Execute code modifications, maintaining original style without opportunistic refactoring.
6. Run related verification: prioritize tests, type checking, lint, or the minimal commands that can prove the changes are correct.
7. Perform task review: check against `design.md`, `plan.md`, actual diff, and verification results for omissions, risks, and test gaps.
8. Check results:
    - Pass: proceed to completion summary.
    - Clear bug or omission: fix directly and verify again.
    - Still unresolved after multiple rounds: if a task directory exists, write to `unresolved-issues.md`; for small tasks without a task directory, explain the blocking reason in the summary.
9. Determine route-sync: `yes` / `no` / `uncertain`. If feature entries, core implementations, or critical test entry points are confirmed to have changed, proceed to load `route-sync` to complete the sync check; if `no`, explain the reason why sync is not needed.

## Sub-agent Execution Rules

First, determine whether sub-agents are required:

- Sub-agents are required for all plan-based execution, regardless of whether tasks can be parallelized. Even when all tasks must run serially (e.g., shared files, sequential dependencies), implementation must be delegated to sub-agents — the main thread only divides, dispatches, reviews results, and integrates.
- Sub-agents are strongly preferred for complex or extensive code changes even without a formal `plan.md`.
- Sub-agents may be skipped only for small, localized, single-file, low-risk tasks without a plan.

Then determine grouping and execution order based on task relatedness:

- Strongly related tasks should be combined for the same sub-agent to avoid context fragmentation; when combined tasks must run serially due to file conflicts or dependencies, the sub-agent executes them sequentially in the correct order.
- Weakly related tasks can be combined by file scope, feature chain, or verification entry point to reduce the number of sub-agents and integration cost.
- Complex tasks with no direct relation and independently verifiable should be prioritized for splitting to different sub-agents for parallel execution.
- Tasks with conflict risk must not edit the same file in parallel; assign them to a single sub-agent for serial execution, and the main thread reviews the diff afterward.
- Exploration, implementation, test supplementation, and review can be split, but implementation and testing of the same behavior chain should usually be combined unless test boundaries are completely independent.

Sub-agent tasks must include clear input files, modification scope, prohibited areas, expected output, and verification method. Sub-agents can only be responsible for exploration, localized implementation, test supplementation, verification, or review suggestions; the main thread must review their results, handle integration conflicts, run final verification, and bear final delivery responsibility.

## Small Task Execution Note

```md
# Brief Execution Note

## Objective
- ...

## Modification Scope
- ...

## Verification Method
- ...

## Execution Strategy
- Sub-agent usage: required (plan-based) / default none (small, no plan)
- Task grouping: none / ...

## RouteSync
- Need route-sync: yes / no / uncertain
```

## Task Review

A review must be conducted after implementation and verification, with review priorities as follows:

1. Requirement coverage: Whether each task in `plan.md` is completed, and whether incomplete items have clear reasons.
2. Behavioral risks: Whether unplanned behavior changes, boundary omissions, compatibility issues, or error handling gaps have been introduced.
3. Code scope: Whether unrelated files were modified, whether opportunistic refactoring occurred, whether the user's existing unrelated changes were touched.
4. Verification adequacy: Whether tests, type checking, lint, or manual verification cover the current risks; whether reasons for inability to verify are credible.
5. Route map impact: Whether changes involve feature entries, core implementations, or critical test entry points that require `route-sync`.

For anything other than small, localized, low-risk changes, a dedicated review sub-agent must be launched after completing medium-to-large changes. The review sub-agent is only responsible for discovering issues and risks, not for directly modifying files; the main thread must review its conclusions, fix confirmed issues directly and verify again, and record non-blocking risks in the summary or fix plan.

When the review discovers confirmed issues, prioritize fixing them directly and verifying again; only generate `plan-fix{n}.md` when there are plan omissions, unmet acceptance criteria, clear regression risks, or test gaps requiring separate tracking.

## Scope Escalation

When it is discovered during execution that the change scope significantly exceeds expectations (e.g., involving new modules, new architecture, cross-file behavior changes):

1. Pause current execution.
2. Explain the escalation reason to the user: originally expected impact scope vs. actually discovered impact scope.
3. Recommend loading the `design` skill first to confirm the solution, then loading the `plan` skill to generate `plan.md` before continuing.

Small scope fluctuations (modifying 1-2 more files, adding minor boundary handling) do not require escalation — execute directly and explain.

## Fix Plan Rules

- Only generate `plan-fix{n}.md` when a `plan.md` exists and plan omissions, unmet acceptance criteria, clear regression risks, or test gaps are discovered.
- `plan-fix{n}.md` must reference stable task IDs from `plan.md`; new fix tasks can continue using stable IDs like `F1`, `F2`, etc.
- Small tasks typically do not generate fix plans — fix directly and explain in the summary.
- Fix limit defaults to 3 rounds. The user can override the default by "relaxing the fix limit" or specifying a specific number. When a task directory exists, it must be recorded in `unresolved-issues.md`; for small tasks without a task directory, record in the summary.

## Completion Checklist

Before completion, confirm:

- Tasks in the plan or execution note are completed, or incomplete reasons are clearly listed.
- When a task directory exists, task completion status in `plan.md` or the latest `plan-fix{n}.md` has been maintained.
- Sub-agent usage has been determined based on complexity, task grouping based on relatedness is complete, and all sub-agent results have been reviewed.
- Task review is complete; for medium-to-large changes, a dedicated review sub-agent has been launched and its conclusions reviewed. Issues found in the review have been fixed or recorded.
- Related verification has been run, or the reason for not running it has been explained.
- Whether route-sync is needed for this change has been determined; if `yes` or `uncertain`, `route-sync` has been loaded to complete the sync check.
- If route-sync was executed, the final summary must include the actual sync results and modified route map files; if unable to complete, explain the failure reason or unconfirmed content.
- No unrelated files were modified, and the user's existing changes were not reverted.

## Output Format

```md
# Execution Summary

## Result
- Complete / Partially complete / Not complete

## Changed Files
- `path/to/file`: modification description

## Verification
- Command: ...
- Result: passed / failed / not run (reason)

## Execution Strategy
- Sub-agent usage: required for plan execution / not used (small task, no plan)
- Task grouping: none / ...
- Review results: ...

## Task Review
- Conclusion: passed / issues found and fixed / remaining issues
- Concerns: ...

## RouteSync
- Need route-sync: yes / no / uncertain
- Affected features: ...
- Sync result: not executed / updated / no update needed / partial / uncertain / failed (reason)
- Route map files: none / `docs/routespec/...`

## Remaining Issues
- None / ...
```
