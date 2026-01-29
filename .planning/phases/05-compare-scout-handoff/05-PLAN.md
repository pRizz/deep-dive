---
phase: 05-compare-scout-handoff
plan: 01
type: execute
wave: 1
depends_on: [04-01]
files_modified:
  - ui/src/history.tsx
  - ui/src/compare.tsx
  - ui/src/models.ts
  - ui/src/utils.ts
  - ui/src/App.tsx
autonomous: true

must_haves:
  truths:
    - "User can select two history entries and open a compare view"
    - "User can see metric deltas and layer changes between two runs"
    - "User can hand off to Docker Scout or see a clear fallback message"
  artifacts:
    - path: "ui/src/compare.tsx"
      provides: "Compare view rendering summary + layer deltas"
    - path: "ui/src/history.tsx"
      provides: "History selection flow for compare"
    - path: "ui/src/models.ts"
      provides: "Compare-related types"
    - path: "ui/src/utils.ts"
      provides: "Compare delta helpers and layer matching"
  key_links:
    - from: "ui/src/history.tsx"
      to: "ui/src/compare.tsx"
      via: "navigation/state with two history IDs"
      pattern: "compare.*(left|right)Id"
    - from: "ui/src/compare.tsx"
      to: "/history/:id"
      via: "fetch history entries"
      pattern: "fetch\\(.*/history/.*\\)"
    - from: "ui/src/compare.tsx"
      to: "ddClient.host.openExternal"
      via: "Scout handoff action"
      pattern: "openExternal\\(\"https://scout.docker.com/\""
---

<objective>
Deliver a compare flow that lets users pick two history entries, see metric and layer deltas, and optionally hand off to Docker Scout with a clear fallback when Scout is unavailable.

Purpose: Enable regression detection between image versions while connecting users to Scout for deeper insights.
Output: Compare UI, compare selection flow, and Scout handoff action.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/05-compare-scout-handoff/05-RESEARCH.md
@ui/src/history.tsx
@ui/src/analysis.tsx
@ui/src/App.tsx
@ui/src/models.ts
@ui/src/utils.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add compare models and delta helpers</name>
  <files>ui/src/models.ts, ui/src/utils.ts</files>
  <action>
    Define compare-related types in models (selection state, summary delta shape, layer delta shape) using existing HistoryEntry and summary models.
    Add helper functions in utils to compute summary deltas (size, wasted space, efficiency) and to align layers by digestId (fall back to id when digestId missing).
    Reuse normalizeDiveFileTrees for any file-tree normalization needed for future layer comparisons; do not add new dependencies.
  </action>
  <verify>Run `npm --prefix ui run build` to confirm TypeScript compiles.</verify>
  <done>Compare types exist and delta helpers return stable results even when fields are missing.</done>
</task>

<task type="auto">
  <name>Task 2: Add history selection flow and compare view</name>
  <files>ui/src/history.tsx, ui/src/compare.tsx, ui/src/App.tsx</files>
  <action>
    Extend history UI to support selecting two history entries for comparison, with clear baseline/target labeling and a disabled Compare action until two entries are chosen.
    Add a compare view component that loads both history entries via `/history/:id`, renders summary metric deltas, and shows a layer delta table using digestId/id matching.
    Wire App routing/state so the compare view receives the two history IDs and can navigate back to history.
    Use existing MUI and Docker theme patterns from the analysis and history views.
  </action>
  <verify>Open the extension UI, select two history entries, and confirm the compare view renders summary + layer deltas.</verify>
  <done>Users can select two history entries and see a compare screen with metrics and layer deltas.</done>
</task>

<task type="auto">
  <name>Task 3: Add Docker Scout handoff with graceful fallback</name>
  <files>ui/src/compare.tsx</files>
  <action>
    Add an "Open in Scout" action in the compare view that uses `ddClient.host.openExternal("https://scout.docker.com/")`.
    Provide a visible fallback state when the host API is unavailable or the call fails: disable the button and show a short message that Scout requires Docker sign-in and enablement.
    Ensure failures are surfaced to the user (toast or inline helper text), not silently ignored.
  </action>
  <verify>With host API available, clicking opens the Scout dashboard; otherwise the UI shows the fallback message.</verify>
  <done>Scout handoff is accessible with clear guidance when unavailable.</done>
</task>

</tasks>

<verification>
Confirm the compare flow works end-to-end: select two history entries, view deltas, and use Scout handoff or see the fallback message.
</verification>

<success_criteria>
1. User can compare two images/tags and see metric and layer deltas.
2. User can hand off to Docker Scout when available, or sees a clear fallback when not.
</success_criteria>

<output>
After completion, create `.planning/phases/05-compare-scout-handoff/05-SUMMARY.md`.
</output>
