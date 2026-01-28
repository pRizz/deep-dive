# Phase 1: Platform + CI Baseline - Research

**Researched:** 2026-01-28
**Domain:** CI/CD baseline for Docker Desktop extension (Go + React/Vite UI)
**Confidence:** MEDIUM

## Summary

This research covers the standard tooling and workflows needed to build, test, and release a Docker Desktop extension with a Go backend and a React UI, focusing on GitHub Actions, Docker extension build/validate commands, Vite tooling, and versioning automation.

The core CI pattern is Linux-only builds that run Go tests/vet, UI lint/tests, and Docker extension image build plus `docker extension validate`. Docker Desktop E2E tests require macOS runners and are explicitly not in scope for this phase, so CI should focus on build/validation only.

Versioning and release automation should use Changesets for version/changelog updates (via `changesets/action` creating a version PR) and semantic-release for tagging and release automation. Official docs do not describe a native integration between Changesets and semantic-release, so the plan must include a deliberate handoff strategy to avoid conflicting version sources.

**Primary recommendation:** Use GitHub Actions on Linux to run Go tests/vet, UI lint/tests, Docker build + `docker extension validate`, and use Changesets action for version PRs with a semantic-release job that creates tags/releases based on the versioned files.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GitHub Actions | n/a | CI runner and workflow engine | First-party CI for GitHub repos |
| `actions/setup-go` | v6 | Install/caching Go toolchain in CI | Recommended by GitHub for Go workflows |
| `changesets/action` | v1 | Automated version PRs and release step | Official Changesets CI integration |
| `@changesets/cli` | latest | Changeset creation/versioning | Official Changesets toolchain |
| `semantic-release` | latest | Automated release tagging/notes | Standardized release automation |
| Docker CLI + Extensions CLI | Docker Desktop/CLI | Build/validate extension images | Official Docker extension workflow |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vite | v6+ | UI dev/build toolchain | CRA migration and modern dev server |
| React | 18+ | UI runtime | Required by modern MUI/Vite stacks |
| MUI | v5+ | UI components | Official migration guide and React 18 support |
| `just` | latest | Task runner replacing Makefile | Simpler, cross-platform command runner |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GitHub Actions | GitLab CI | Not aligned with repo hosting |
| Changesets | Changesets-only release | Conflicts with requirement to use semantic-release |
| semantic-release | semantic-release-only | Conflicts with requirement to use Changesets |

**Installation:**
```bash
npm install -D semantic-release @semantic-release/git @semantic-release/github @semantic-release/exec @changesets/cli
```

## Architecture Patterns

### Recommended Project Structure
```
.github/
└── workflows/
    ├── ci.yml         # build/test/validate on Linux
    └── release.yml    # version PR + tagging
justfile              # task runner replacement for Makefile
ui/                   # Vite React UI
vm/                   # Go backend
```

### Pattern 1: Linux CI build + validate
**What:** Build Docker extension image and validate metadata in Linux CI.
**When to use:** Every push/PR to ensure PLAT-01 without requiring Docker Desktop.
**Example:**
```bash
# Source: https://docs.docker.com/extensions/extensions-sdk/extensions/validate
docker build -t my/extension:ci .
docker extension validate my/extension:ci
```

### Pattern 2: Changesets version PR workflow
**What:** Use the Changesets GitHub Action to generate a version PR and optionally publish.
**When to use:** Release workflow for PLAT-02.
**Example:**
```yaml
# Source: https://github.com/changesets/action
- name: Create Release Pull Request
  uses: changesets/action@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Pattern 3: Go CI workflow with setup-go
**What:** Use `actions/setup-go` with version detection and caching.
**When to use:** PLAT-04 Go test/vet runs in CI.
**Example:**
```yaml
# Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-go
- uses: actions/setup-go@v5
  with:
    go-version: '1.21.x'
```

### Anti-Patterns to Avoid
- **Mac-only Docker Desktop CI:** Docker Desktop Action is macOS-only; use Linux for build/validate and skip E2E in this phase.
- **Two competing version sources:** Running semantic-release commit analysis and Changesets versioning together without a handoff causes conflicting version bumps.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Version PR automation | Custom script to bump versions/changelog | `changesets/action` | Handles version PR lifecycle |
| Go toolchain install/caching | Manual Go download/cache | `actions/setup-go` | Official, cached, version-aware |
| Extension validation | Custom schema validator | `docker extension validate` | Uses official schema |

**Key insight:** CI/release automation already has first-party tools; custom scripts are brittle and will diverge from standard workflows.

## Common Pitfalls

### Pitfall 1: Assuming Docker Desktop is available on Linux runners
**What goes wrong:** CI tries to run extension E2E tests requiring Docker Desktop.
**Why it happens:** Docker Desktop Action only supports macOS runners.
**How to avoid:** Limit Linux CI to `docker build` + `docker extension validate`.
**Warning signs:** CI fails on Linux with Docker Desktop startup errors.

### Pitfall 2: Vite Node version mismatch
**What goes wrong:** CI fails due to unsupported Node version.
**Why it happens:** Vite v6+ requires Node 20.19+ or 22.12+.
**How to avoid:** Pin Node version in CI and local tooling.
**Warning signs:** Vite CLI reports unsupported Node version.

### Pitfall 3: Semantic-release + Changesets version conflict
**What goes wrong:** Tags do not match `package.json` or changeset versions.
**Why it happens:** semantic-release computes version from commits while Changesets writes versions.
**How to avoid:** Define a single version authority and make the other tool consume it.
**Warning signs:** Tags mismatch or repeated version bumps in CI.

## Code Examples

Verified patterns from official sources:

### Validate extension metadata and image
```bash
# Source: https://docs.docker.com/extensions/extensions-sdk/extensions/validate
docker extension validate <name-of-your-extension>
docker extension validate /path/to/metadata.json
```

### Changesets automation flow
```bash
# Source: https://changesets-docs.vercel.app/en/automating-changesets
changeset status --since=main
changeset version
changeset publish
```

### Vite CLI basics
```bash
# Source: https://vite.dev/guide/
npm create vite@latest
npx vite
npx vite build
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CRA + webpack | Vite dev/build | Vite v6+ | Faster dev server and modern build pipeline |
| Manual version bumps | Changesets + release automation | Ongoing | Repeatable releases with version PRs |
| Makefile tasks | `just` task runner | Ongoing | Simpler, cross-platform task definitions |

**Deprecated/outdated:**
- Docker Desktop Action on Linux: not supported; macOS only for E2E tests.

## Open Questions

1. **Semantic-release + Changesets handoff**
   - What we know: Changesets owns versions/changelog; semantic-release owns tags/releases.
   - What's unclear: Exact integration path to avoid double versioning.
   - Recommendation: Decide whether semantic-release should read versions from files (no commit analysis) or only handle tagging/releases after the Changesets version PR merges.

2. **Target Go and Node versions**
   - What we know: setup-go supports `go-version-file`, Vite requires Node 20.19+ or 22.12+.
   - What's unclear: Which Go version is standard for this repo.
   - Recommendation: Align CI with `go.mod` (use `go-version-file: 'vm/go.mod'` if supported) and set Node to the Vite-required minimum.

## Sources

### Primary (HIGH confidence)
- https://docs.docker.com/extensions/extensions-sdk/extensions/validate - extension validation command
- https://docs.docker.com/extensions/extensions-sdk/dev/continuous-integration/ - CI limitations (macOS-only Desktop Action)
- https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-go - Go CI workflow
- https://github.com/actions/setup-go - setup-go usage and caching
- https://changesets-docs.vercel.app/en/automating-changesets - changesets automation flow
- https://github.com/changesets/action - Changesets GitHub Action
- https://semantic-release.gitbook.io/semantic-release/usage/configuration - semantic-release configuration
- https://vite.dev/guide/ - Vite getting started and Node requirement
- https://vite.dev/guide/migration - Vite Node support details
- https://mui.com/material-ui/migration/migration-v4/ - MUI v5 migration guide
- https://just.systems/man/en/ - just task runner overview

### Secondary (MEDIUM confidence)
- https://docs.docker.com/extensions/extensions-sdk/quickstart/ - extension build/install flow

### Tertiary (LOW confidence)
- No official integration docs for semantic-release + Changesets found; requires design decision.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - official docs for each component
- Architecture: MEDIUM - release integration requires a decision
- Pitfalls: HIGH - directly documented limitations and requirements

**Research date:** 2026-01-28
**Valid until:** 2026-02-27
