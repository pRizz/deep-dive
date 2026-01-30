---
phase: 06-long-running-task-progress-ux
plan: 01
subsystem: ui
tags: [go, echo, react, typescript, dive, progress]

# Dependency graph
requires:
  - phase: 02-01
    provides: async job lifecycle with status polling
provides:
  - Real-time progress messages during Dive analysis
  - Enhanced UI progress indicators with detailed stage messages
  - Backend progress capture from Dive CLI stderr/stdout
affects: [ui, analysis-ux]

# Tech tracking
tech-stack:
  added: []
  patterns: [real-time progress parsing, stderr/stdout stream capture, job message updates]

key-files:
  created: []
  modified:
    - vm/main.go
    - ui/src/App.tsx

key-decisions:
  - "Parse progress messages from both stderr and stdout streams for comprehensive coverage"
  - "Use string matching for progress patterns to handle Dive output format variations"

patterns-established:
  - "Progress messages updated via jobStore.Update during analysis execution"
  - "UI displays jobMessage prominently when available, falls back to status text"

# Metrics
duration: 8m
completed: 2026-01-30
---

# Phase 6 Plan 1: Long Running Task Progress UX Summary

**Real-time progress message capture from Dive CLI output with enhanced UI display of analysis stages**

## Performance

- **Duration:** 8m
- **Started:** 2026-01-30T03:08:56Z
- **Completed:** 2026-01-30T03:16:45Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Backend captures Dive CLI progress output from stderr and stdout streams in real-time
- Progress messages parsed and updated in job status during analysis execution
- UI displays detailed progress messages (e.g., "Pulling image...", "Analyzing layers...") prominently above progress bars
- Progress updates appear in real-time via existing polling mechanism

## Task Commits

Each task was committed atomically:

1. **Task 1: Capture Dive CLI progress output and update job messages** - `aee581b` (feat)
2. **Task 2: Enhance UI progress indicators with detailed messages** - `4814e12` (feat)

**Plan metadata:** Pending

_Note: TDD tasks may have multiple commits (test → feat → refactor)_

## Files Created/Modified

- `vm/main.go` - Modified runDive to capture stderr/stdout separately, added parseProgressMessage function, updated job messages in real-time
- `ui/src/App.tsx` - Enhanced ImageCard and ArchiveAnalyzer to display jobMessage prominently when available

## Decisions Made

- Parse progress messages from both stderr and stdout streams to ensure comprehensive coverage of Dive output
- Use string matching for common progress patterns (fetching, analyzing, calculating, etc.) to handle Dive output format variations
- Display progress messages with body2 Typography variant above LinearProgress bar for better visibility
- Fall back to status text when message is empty to maintain backward compatibility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Progress message infrastructure ready for future enhancements
- Real-time progress updates working via existing polling mechanism
- No blockers

---
*Phase: 06-long-running-task-progress-ux*
*Completed: 2026-01-30*
