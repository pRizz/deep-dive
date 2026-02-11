---
name: native-multi-arch-publish
description: "Eliminate emulation bottlenecks by splitting platform builds onto native runners and merging manifests by digest."
---

# Publish Multi-Arch Images with Native Platform Builds

## Use this when
A single multi-platform build is slow because one or more architectures are built under emulation instead of native runners.

## How to use
Eliminate emulation bottlenecks by splitting platform builds onto native runners and merging manifests by digest. Lower publish wall-clock time through parallel native platform builds, reduced cache export overhead, and preserved attestations.

### Required inputs
1. Current GitHub Actions publish workflow YAML and any caller workflow(s)
2. Target platform list (for example linux/amd64, linux/arm64, linux/arm/v7, linux/ppc64le, linux/s390x)
3. Available runner types per platform (GitHub-hosted, self-hosted labels, and any constraints)
4. Target image names and registries (for example Docker Hub and/or GHCR)
5. Current tag/version strategy and required workflow outputs
6. Current cache settings, baseline timings, and any security/scout requirements

### Steps
1. Document the current bottleneck and identify where emulated platforms dominate build time
2. Design a DAG with a build-test gate, a matrix of per-platform build jobs, and a merge-and-publish job
3. Implement a platform matrix with an explicit platform-to-runner mapping so each target platform routes to a native runner when available
4. Use push-by-digest in each platform job, upload digests as artifacts, and merge all digests into final multi-arch manifests per registry
5. Split cache scopes per platform for registry and GHA caches, and tune cache export mode (for example mode=min) to remove avoidable export overhead
6. Preserve SBOM/provenance generation on each platform build and include verification steps for manifests, attestations, scout, and overall wall-clock improvement
7. Define fallback behavior for platforms without native runners (for example keep emulation for only those platforms and document the expected tradeoff)

### Constraints
1. Do not use emulation for platforms that have native runner capacity available
2. Keep the build-test gate as a prerequisite for publish jobs
3. Preserve existing release tags and required workflow-call outputs unless explicitly instructed otherwise
4. Keep security/scout checks non-blocking or blocking exactly as defined by current policy and call out any behavior changes
5. Call out platform-specific limitations (runner availability, unsupported tooling, or architecture-specific build caveats)

### Expected output
1. Section: Baseline bottleneck summary
2. Section: Platform-to-runner mapping and proposed job graph
3. Section: Workflow YAML patch (platform jobs, cache settings, digest artifacts, merge job)
4. Section: Verification checklist and expected timing deltas
