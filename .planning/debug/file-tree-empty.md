---
status: fixing
trigger: "Investigate why file tree shows empty ('No file tree data available') for analyzed images"
created: 2026-01-29T00:00:00Z
updated: 2026-01-29T00:00:00Z
---

## Current Focus

hypothesis: File tree data is nested under `image` object instead of top-level DiveResponse, or Dive uses a key not in the candidate list
test: Check if dive.image contains file tree data, and verify normalization function searches image object
expecting: Find that file tree is under image.tree or image.fileTree, which normalization doesn't check
next_action: Update normalizeDiveFileTrees to also check dive.image for file tree data

## Symptoms

expected: File tree should display file structure from analyzed images
actual: Shows "No file tree data available" message
errors: None - just empty display
reproduction: Analyze any image, view file tree section
started: Unknown - investigating current state

## Eliminated

## Evidence

- timestamp: 2026-01-29T00:00:00Z
  checked: ui/src/utils.ts normalizeDiveFileTrees function
  found: Function searches for aggregate tree in: fileTree, filetree, tree, fileSystem, files, root (top-level only)
  implication: If Dive stores file tree under image object, normalization will miss it

- timestamp: 2026-01-29T00:00:00Z
  checked: ui/src/utils.ts normalizeDiveFileTrees function for layers
  found: Function searches layer tree in: fileTree, filetree, tree, diffTree, changes, fileSystem, files, root
  implication: Layer search looks comprehensive, but aggregate might be under image

- timestamp: 2026-01-29T00:00:00Z
  checked: Backend storage (vm/history/types.go)
  found: Entry.Result is stored as json.RawMessage - raw Dive JSON is preserved
  implication: Backend is not modifying the structure, so issue is in frontend normalization

- timestamp: 2026-01-29T00:00:00Z
  checked: Backend endpoint (vm/main.go getHistoryEntry)
  found: Returns entire Entry object with metadata and result (raw JSON)
  implication: Frontend receives raw Dive JSON, needs to parse it correctly

- timestamp: 2026-01-29T00:00:00Z
  checked: ui/src/utils.ts - how dive.image is used
  found: dive.image is accessed for sizeBytes, inefficientBytes, efficiencyScore, fileReference
  implication: dive.image is a valid object that could contain file tree data, but normalization doesn't check it

- timestamp: 2026-01-29T00:00:00Z
  checked: vm/main.go runDive function
  found: Dive is invoked with `--json` flag: `dive --source {source} {target} --json {tempPath}`
  implication: JSON output should include all Dive data including file tree, but structure may vary

- timestamp: 2026-01-29T00:00:00Z
  checked: ui/src/App.tsx openHistoryEntry function
  found: HistoryEntry.result is directly assigned to dive: `dive: entry.result`
  implication: Data flow is correct - raw Dive JSON is passed to normalization function

## Resolution

root_cause: normalizeDiveFileTrees only checks top-level DiveResponse keys for aggregate file tree, but Dive may store the aggregate tree nested under the `image` object (e.g., `image.tree` or `image.fileTree`). The function doesn't check `dive.image` for file tree data.

fix: Updated normalizeDiveFileTrees to also check `dive.image` object for file tree keys (fileTree, filetree, tree, fileSystem, files, root) in addition to top-level keys.

verification: Need to test with actual Dive JSON output to confirm file tree appears. The fix adds image-level checks which should catch cases where Dive nests the aggregate tree under image.

files_changed: 
- ui/src/utils.ts: Updated normalizeDiveFileTrees to check dive.image for file tree data
