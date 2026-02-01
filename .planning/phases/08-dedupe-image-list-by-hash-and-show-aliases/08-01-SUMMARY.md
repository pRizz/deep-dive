---
phase: 08-dedupe-image-list-by-hash-and-show-aliases
plan: 01
subsystem: ui
tags: [images, dedupe, aliases, react, typescript]

# Dependency graph
requires:
  - phase: 07-local-development-instructions
    provides: Updated contributor workflow documentation
provides:
  - Deduped image list by hash
  - Alias display in image cards
  - Filtering across primary names and aliases
affects: [ui, analysis-ux]

# Tech tracking
tech-stack:
  added: []
  patterns: [image grouping by hash, alias display]

key-files:
  created: []
  modified:
    - ui/src/App.tsx
    - ui/src/models.ts

key-decisions:
  - "Group images by full image ID and surface tag/digest aliases on each card."
  - "Prefer tag references as primary names when available."

patterns-established:
  - "Filter matches both primary name and aliases."

# Metrics
duration: 10m
completed: 2026-02-01
---

# Phase 8 Plan 1: Dedupe image list and show aliases Summary

**Images are now grouped by hash with alias lists shown on each card, keeping filters and sorting intact.**

## Performance

- **Duration:** 10m
- **Started:** 2026-02-01T20:50:02Z
- **Completed:** 2026-02-01T20:50:02Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Deduped the Docker image list by full image ID instead of tag/digest references
- Added alias support to the Image model and surfaced aliases on image cards
- Expanded filtering to match both primary names and aliases

## Task Commits

Each task was committed atomically:

1. **Task 1: Deduplicate images by hash and track aliases** - pending
2. **Task 2: Show aliases in image cards and keep filtering/sorting sane** - pending

**Plan metadata:** pending

## Files Created/Modified

- `ui/src/App.tsx` - Group images by hash, render aliases, and include alias-aware filtering
- `ui/src/models.ts` - Extend Image model with alias support

## Decisions Made

- Prefer tag references as the primary display name when available
- Hide duplicate cards by grouping tag/digest references under a single image hash

## Deviations from Plan

None - plan executed as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Image list display is now clearer with deduped cards and visible aliases
- No blockers identified

---
*Phase: 08-dedupe-image-list-by-hash-and-show-aliases*
*Completed: 2026-02-01*
