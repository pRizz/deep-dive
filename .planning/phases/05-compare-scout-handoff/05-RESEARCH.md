# Phase 5: Compare + Scout Handoff - Research

**Researched:** 2026-01-29  
**Domain:** Image comparison UX + Docker Scout handoff in Docker Desktop extension  
**Confidence:** MEDIUM

## Summary

Phase 5 builds on persisted analysis history to enable side-by-side comparisons and a handoff into Docker Scout. The backend already stores full Dive JSON per run (`vm/history`) and exposes history endpoints in `vm/main.go`; the UI can load full `HistoryEntry` records via `/history/:id`. There is no compare model or compare UI yet, and no Scout handoff UI or availability checks.

For comparison, the most direct approach is UI-side: fetch two `HistoryEntry` payloads, compute deltas using existing summary metrics and normalized file trees, and present a compare view. For Scout handoff, the Docker Desktop extension API supports `ddClient.host.openExternal()` for launching the Scout dashboard in a browser, but Scout requires Docker account sign-in and enablement; therefore the UI needs a “Scout available?” gate or a clear fallback when Scout isn’t configured.

**Primary recommendation:** Implement UI-side compare using two history entries and normalized Dive file trees, and provide a Scout handoff button that uses `ddClient.host.openExternal()` with a clear “requires Docker login/Scout enablement” constraint.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Go | 1.19 | Backend service | Current backend runtime in `vm/go.mod`. |
| Echo | v3.3.10+incompatible | HTTP API | Existing API server in `vm/main.go`. |
| React | 18.2.0 | UI framework | Current UI stack in `ui/package.json`. |
| MUI | 5.6.1 | UI components | Current UI component system. |
| `@docker/extension-api-client` | 0.3.0 | Extension host API | Required for `ddClient.host.openExternal()`. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@docker/docker-mui-theme` | `<0.1.0` | Docker Desktop theme | Use for any new compare/Scout UI surfaces. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| UI-side compare | Backend `/compare` endpoint | Backend diff adds API surface; UI-only compare reuses existing data but may need client-side computation. |
| External Scout dashboard handoff | In-extension Scout data | Deep integration requires auth + Scout APIs; handoff is lower effort and aligns with “when available.” |

**Installation:**  
No new dependencies required for compare or Scout handoff.

## Architecture Patterns

### Recommended Project Structure
```
ui/src/
├── analysis.tsx      # single-run detail view (existing)
├── history.tsx       # history list (existing)
├── compare.tsx       # new compare view
├── models.ts         # add compare models
└── utils.ts          # reuse normalizeDiveFileTrees
vm/
└── history/          # source of persisted runs
```

### Pattern 1: Compare via history entries (UI-side)
**What:** Fetch two `HistoryEntry` records from `/history/:id` and compute deltas in the UI.  
**When to use:** Comparing two completed runs stored in history.  
**Example (proposed flow):**
```
GET /history/:idA -> HistoryEntry
GET /history/:idB -> HistoryEntry
compare(entryA.result, entryB.result)
```

### Pattern 2: Delta metrics from summary + layers
**What:** Use `HistoryMetadata.summary` for top-level deltas and compare layers by `digestId` (or `id` fallback).  
**When to use:** Rendering comparison cards and layer diff tables.  
**Notes:** `normalizeDiveFileTrees()` already handles Dive JSON variants and should back any file-tree comparisons.

### Pattern 3: Scout handoff using Host API
**What:** Use Docker Desktop host API to open Scout Dashboard externally.  
**When to use:** User clicks “Open in Scout” and the UI should hand off.  
**Example:**
```
ddClient.host.openExternal("https://scout.docker.com/");
```

### Anti-Patterns to Avoid
- **Comparing raw tree structures:** Dive JSON is inconsistent; use `normalizeDiveFileTrees()` to normalize before diffing.  
- **Assuming Scout is configured:** Scout requires Docker sign-in and enablement; surface this constraint in UI.  
- **Comparing by layer index only:** Layer ordering can change across builds; prefer `digestId` when available.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| External link handling | `window.open` hacks | `ddClient.host.openExternal()` | Official extension API, supports Desktop context. |
| Dive file tree normalization | Custom parsing per field | `normalizeDiveFileTrees()` | Handles multiple Dive JSON shapes already. |
| History storage | New compare-specific store | Existing `vm/history` store | Keeps comparison grounded in persisted results. |

**Key insight:** Compare should reuse persisted Dive results; avoid creating new storage formats.

## Common Pitfalls

### Pitfall 1: Comparison unavailable for latest run
**What goes wrong:** UI compares a live run that hasn’t been persisted yet.  
**Why it happens:** Compare flow expects history IDs, but live analysis uses job IDs.  
**How to avoid:** Require selection from history list or wait until history save completes.  
**Warning signs:** Compare button enabled before history entry exists.

### Pitfall 2: Incorrect layer diffs
**What goes wrong:** Layer deltas appear incorrect or mismatched.  
**Why it happens:** Comparing by layer index rather than stable ID/digest.  
**How to avoid:** Use `digestId` (or `id`) for matching layers; fall back to index only when IDs are missing.  
**Warning signs:** Layers “move” between builds but show as added/removed incorrectly.

### Pitfall 3: Scout handoff fails silently
**What goes wrong:** Clicking “Open in Scout” does nothing.  
**Why it happens:** No Desktop host API usage or invalid URL protocol.  
**How to avoid:** Use `ddClient.host.openExternal()` with `https://` URLs and provide a clear error state.  
**Warning signs:** No browser opens; console errors about invalid protocol.

## Code Examples

### Normalize Dive file trees before comparison
```typescript
// Source: ui/src/utils.ts (repo)
export function normalizeDiveFileTrees(dive: DiveResponse): NormalizedFileTree {
  const aggregateCandidates = [
    dive.fileTree,
    dive.filetree,
    dive.tree,
    dive.fileSystem,
    dive.files,
    dive.root,
  ];
  const aggregate = normalizeFileTreeNodes(
    aggregateCandidates.find((candidate) => Boolean(candidate))
  );
  const layers = (dive.layer ?? []).map((layer) => {
    const layerRecord = layer as unknown as Record<string, unknown>;
    const layerCandidates = [
      layerRecord.fileTree,
      layerRecord.filetree,
      layerRecord.tree,
      layerRecord.diffTree,
      layerRecord.changes,
      layerRecord.fileSystem,
      layerRecord.files,
      layerRecord.root,
    ];
    return {
      layerId: layer.id,
      layerIndex: layer.index,
      command: layer.command,
      tree: normalizeFileTreeNodes(
        layerCandidates.find((candidate) => Boolean(candidate))
      ),
    };
  });
  return { aggregate, layers };
}
```

### Open Scout in the system browser
```typescript
// Source: https://docs.docker.com/reference/api/extensions-sdk/Host/
ddClient.host.openExternal("https://docker.com");
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single-run analysis view | Compare view with deltas | Phase 5 | Enables regression checks between tags. |
| Manual navigation to Scout | In-app Scout handoff | Phase 5 | Makes Scout discoverable without deep integration. |

**Deprecated/outdated:**
- Ad-hoc manual compares via screenshots or external spreadsheets.

## Open Questions

1. **Compare scope (summary vs deep diff)**
   - What we know: History contains full Dive JSON and a summary.  
   - What's unclear: Whether to compare only summary metrics or also per-layer/file trees.  
   - Recommendation: Start with summary + layer deltas; add file-tree diff only if needed.

2. **Scout availability detection**
   - What we know: Scout requires Docker sign-in and enablement.  
   - What's unclear: How to detect availability from the extension.  
   - Recommendation: Add UI guardrails (copy + disabled state) and consider a lightweight backend check if an official API exists.

3. **Handoff destination**
   - What we know: Scout dashboard is at `https://scout.docker.com/`.  
   - What's unclear: Whether a Docker Desktop in-app Scout view should be targeted instead.  
   - Recommendation: Start with external dashboard; revisit if Desktop provides a stable deep link.

## Sources

### Primary (HIGH confidence)
- https://docs.docker.com/reference/api/extensions-sdk/Host/ — `ddClient.host.openExternal` API and constraints  
- https://docs.docker.com/scout/quickstart/ — Scout sign-in and enablement steps

### Secondary (MEDIUM confidence)
- Internal repo context: `vm/history/*`, `vm/main.go`, `ui/src/models.ts`, `ui/src/utils.ts`, `ui/src/history.tsx`, `ui/src/analysis.tsx`, `ui/src/App.tsx`

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - versions read from `vm/go.mod` and `ui/package.json`.  
- Architecture: MEDIUM - based on current API surface and UI patterns.  
- Pitfalls: MEDIUM - derived from current flow constraints and API expectations.

**Research date:** 2026-01-29  
**Valid until:** 2026-02-28
