---
name: using-route-spec
description: RouteSpec workflow guide. All coding tasks must load route-lookup first, then follow its guidance for subsequent steps.
---

# RouteSpec Workflow Guide

RouteSpec is a suite of AI coding workflow skills that quickly locate code through feature route maps and select appropriate execution flows based on task scale.

## Core Rule

**All coding tasks must load `route-lookup` first, then follow its guidance for subsequent steps.**

## Workflow Overview

1. **route-lookup** — Query the feature route map to locate relevant code (mandatory entry point for all coding tasks)
2. **route-init** — Create the feature route map for the first time (auto-triggered by route-lookup when the route map does not exist)
3. **design** — Requirement clarification and solution design (for medium-to-large tasks or unclear scope)
4. **plan** — Generate execution plan (after design is confirmed)
5. **exec-plan** — Execute the plan or directly implement small changes
6. **route-sync** — Sync the feature route map (after feature changes are completed)

## Flow Rules

- Small, clear changes (typos, formatting, dependency upgrades, etc.) → route-lookup → exec-plan
- Medium-to-large or unclear tasks → route-lookup → design → plan → exec-plan
- After feature changes are completed → route-sync
