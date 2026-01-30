# Phase 7: Local Development Instructions - Context

**Gathered:** 2026-01-30  
**Status:** Ready for planning

<domain>
## Phase Boundary

Add clear README instructions for local development and loading the extension in
Docker Desktop. This phase only documents the workflow; it does not change code
or tooling behavior.

</domain>

<decisions>
## Implementation Decisions

### Prerequisites and requirements
- Prereq version minimums (Docker Desktop, Node, Go) need research.
- Dive CLI is not required locally; it is packaged inside the extension VM.
- Docker Desktop extensions must be enabled.
- No OS-specific instructions.

### Local development flow
- Use `just` commands as the primary path.
- Document the fast dev loop as primary: `just ui-dev` + `docker extension dev ui-source ...`.
- Include build/install steps via `just` commands.
- No extra lint/build guidance beyond pre-commit rules.

### Docker Desktop loading details
- Include commands for initial install and updates using `just install-development-extension`
  and `just reinstall-development-extension`.
- Use a consistent local image tag `deep-dive:dev` (matches justfile).
- Mention the Vite dev server runs on `http://localhost:5173`.
- Include `docker extension dev ui-source deep-dive:dev http://localhost:5173`.
- Optional: mention `docker extension dev debug deep-dive:dev`.

### Troubleshooting
- Include brief guidance for stale installs/caches (reinstall/update commands).
- Mention full path requirement for docker-archive analyses.
- Keep troubleshooting as a short narrative, not a long checklist.

### Claude's Discretion
- Exact wording and section ordering.
- Whether to include optional debug command in the main flow or a tip.

</decisions>

<specifics>
## Specific Ideas

- Emphasize that Dive CLI is bundled in the extension VM (not a local dependency).
- Show local dev UI on port `5173`.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 07-local-development-instructions*  
*Context gathered: 2026-01-30*
