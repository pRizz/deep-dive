---
phase: 05-compare-scout-handoff
plan: 01
subsystem: ui
tags: [react, mui, compare, docker-scout]

# Dependency graph
requires:
  - phase: 04-history-export-ci-gates
    provides: Persisted history entries and summary metrics
provides:
  - compare selection flow in history list
  - compare view with summary and layer deltas
  - Docker Scout handoff with fallback messaging
affects: [phase-6-long-running-progress, compare-ux]

# Tech tracking
tech-stack:
  added: []
  patterns: [UI-side compare via history entries, layer matching by digest/id]

key-files:
  created: [ui/src/compare.tsx]
  modified: [ui/src/history.tsx, ui/src/App.tsx, ui/src/models.ts, ui/src/utils.ts]

key-decisions:
  - "UI-side comparison using history entries to avoid new backend endpoints"

patterns-established:
  - "Compare flow uses baseline/target selection with disabled action until both set"

# Metrics
duration: 5m
completed: 2026-01-29
---

# Phase 5: Compare + Scout Handoff Summary

**History compare flow with baseline/target selection, summary + layer deltas, and Scout handoff fallback**

## Performance

- **Duration:** 5m
- **Started:** 2026-01-29T17:40:18Z
- **Completed:** 2026-01-29T17:45:10Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Added compare models and delta helpers for summary and layers
- Implemented history selection flow and compare view rendering deltas
- Added Docker Scout handoff with disabled fallback messaging

## Task Commits

Each task was committed atomically:

1. **Task 1: Add compare models and delta helpers** - `2d9f829` (feat)
2. **Task 2: Add history selection flow and compare view** - `9090f09` (feat)
3. **Task 3: Add Docker Scout handoff with graceful fallback** - `0871581` (feat)

**Plan metadata:** (docs commit with summary + state updates)

## Files Created/Modified
- `ui/src/compare.tsx` - Compare view for summary and layer deltas
- `ui/src/history.tsx` - Baseline/target selection UI in history list
- `ui/src/App.tsx` - Compare navigation wiring and selection state
- `ui/src/models.ts` - Compare-related models and delta shapes
- `ui/src/utils.ts` - Summary delta and layer matching helpers

## Decisions Made
- Used UI-side comparison with history entries to avoid adding new backend endpoints.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Manual UI verification in Docker Desktop not run in this environment.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Compare flow implemented and build passes.
- Manual verification in Docker Desktop should be completed before Phase 6.

---
*Phase: 05-compare-scout-handoff*
*Completed: 2026-01-29*
