---
name: route-lookup
description: Query the feature route map to locate related features, entry files, core code, and tests. Triggered when users ask to code, modify, add, or delete features, or ask questions about code, risks, implementation logic, review feedback, or diagnostic direction. Must be loaded first for all tasks that require code location.
---

# Route Lookup

Query the feature route map based on the user's current task to quickly identify which files should be read first.

## Core Principles

- The feature route map takes priority over full repository search.
- The feature route map is not a complete index or feature knowledge base; it only answers "which files should be read first when a user mentions a specific feature."
- When the route map exists but has no match, appears outdated, or has insufficient coverage, targeted code scanning is allowed but must be marked as temporary results.
- Features or file assignments that cannot be confirmed are marked as `uncertain`.
- When the user is only asking about code questions, risks, implementation logic, review feedback, or diagnostics, lookup is solely for locating priority files; it must not default to entering code modification, design, or execution plan workflows.

## Workflow

1. Read the feature route map: `docs/routespec/feature-routes.md` or `docs/routespec/feature-routes/`.
   - In directory mode, first read the feature index in `docs/routespec/feature-routes/README.md` or `docs/routespec/feature-routes/index.md`, then read the specific matched route files.
   - In directory mode, only when the index is missing, has no match, or appears outdated should you read potentially relevant feature files in the directory; if still unable to confirm, proceed with targeted scanning.
2. In single-file mode, first read the `Module Index`, then locate related modules based on the feature, module, entry, or file mentioned by the user; then match feature location entries within the module.
3. In directory mode, first read the module-to-file mapping in the index; if the index lists specific features, prioritize using the feature mapping to locate files; then read the matched module or feature files.
4. When matching feature location entries, prioritize matching module name, feature name, description, entry, core, tests, and notes.
5. Determine route map coverage status:
   - `sufficient`: Can locate main entries and core code; test locations are recorded if they exist.
   - `partial`: Can locate some information, but key location information is missing or appears outdated.
   - `missing`: Feature route map exists but has no related entries.
6. If the feature route map does not exist and the current task requires code location, the `route-init` skill must be loaded first to complete initial setup; after initialization, return to this skill to continue lookup, marking coverage status as `partial`.
7. Only perform targeted scanning when coverage is `partial` or `missing`, prioritizing source code, entry points, configuration, and test directories; exclude dependencies, build artifacts, caches, and generated code.
8. Determine task intent:
   - Analysis task: The user is only asking about code questions, risks, implementation logic, review feedback, or diagnostics. After lookup, read priority files and answer directly; do not load `design` or `exec-plan`.
   - Execution task: The user explicitly requests coding, modifying, adding, deleting, fixing, refactoring, adding tests, or committing changes. Continue to determine whether it involves functional changes.
   - When uncertain, treat as an analysis task — first share findings and recommendations; do not proactively modify code.
9. For execution tasks, continue to determine whether functional changes are involved:
   - Small, clear modifications (e.g., fixing typos, adjusting formatting, updating dependency versions, or localized feature/bug behavior changes that are already located and low-risk) → proceed to `exec-plan` for direct execution.
   - Large-scale changes not involving functional changes (e.g., code refactoring, performance optimization, tech stack/framework replacement) → need to load the `design` skill.
   - Medium-to-large, unclear scope, or functional changes requiring solution confirmation (adding, modifying, deleting feature behavior) → need to load the `design` skill.
   - When uncertain, treat as needing to load the `design` skill.
10. Route map linkage:
    - When coverage status is `partial` or `missing`, check `route-sync` after task completion; only update the route map when the current task confirms changes to feature entries, core implementations, or critical test entry points.
    - For tasks like typos, formatting, pure documentation, or dependency upgrades that do not produce usable feature location entries, `route-sync` can be determined as `no`, but the reason must be explained.

## Internal Decision Checklist

After lookup is complete, the model should internally clarify the following judgments to determine next steps:

- Matched related modules / features and their sources (route map / temporary scan / uncertain)
- Files that should be read first and the reasons
- Potentially relevant files or files that may need modification, with source markers
- Route map coverage status: `sufficient` / `partial` / `missing`
- Task intent: `analysis` / `execution` / `uncertain`
- Whether subsequent route-sync is needed: `yes` / `no` / `uncertain`
- Whether functional changes are involved: `yes` / `no` / `uncertain`
- Recommended next skill: `none` / `design` / `exec-plan` / `route-sync` / `route-init`

Do not expand scanning scope for the sake of completeness.

## Standard Output Format

After lookup is complete, if subsequent skills need to read this skill's results, output or record in the following format:

```md
# Route Lookup Result

## Matched Modules
- Module name (source: route-map / scan / uncertain): match reason

## Matched Features
- Feature name (source: route-map / scan / uncertain): match reason

## Priority Files
- `path/to/file` (source: route-map / scan / uncertain): reason for priority reading

## Potential Relevant Or Change Files
- `path/to/file` (source: route-map / scan / uncertain): relevance or potential modification reason

## Coverage
- Status: sufficient / partial / missing
- Temporary scan used: yes / no

## Task Classification
- Intent: analysis / execution / uncertain
- Functional change: yes / no / uncertain
- Need route-sync: yes / no / uncertain
- Next skill: none / design / exec-plan / route-sync / route-init
```

## First-time Initialization

When the route map does not exist and the current task requires code location, the `route-init` skill must be loaded to complete initial setup. After initialization is complete, continue the lookup process of this skill and mark the coverage status as `partial`. When the route map exists but has no related entries, do not execute `route-init`; instead, perform targeted scanning with `missing` coverage status and check `route-sync` after the task is completed.
