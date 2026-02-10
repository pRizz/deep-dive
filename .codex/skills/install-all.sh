#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_SOURCE_URL="https://raw.githubusercontent.com/pRizz/deep-dive/main/.codex/skills/install-all.sh"
SKILL_RAW_BASE_URL="https://raw.githubusercontent.com/pRizz/deep-dive/main/.codex/skills"
DEFAULT_INSTALL_ROOT="${HOME}/.codex/skills"
INSTALL_ROOT="${DEEP_DIVE_SKILLS_INSTALL_ROOT:-${DEFAULT_INSTALL_ROOT}}"

log_info() { printf "[deep-dive][info] %s\n" "$*"; }
log_warn() { printf "[deep-dive][warn] %s\n" "$*" >&2; }
log_error() { printf "[deep-dive][error] %s\n" "$*" >&2; }
die() { log_error "$*"; exit 1; }

require_cmd() {
  local cmd="$1"
  command -v "${cmd}" >/dev/null 2>&1 || die "Missing required command: ${cmd}. Install it and re-run this installer."
}

require_cmd curl
require_cmd mktemp
require_cmd cmp
require_cmd mkdir
require_cmd mv
require_cmd rm

[[ -n "${HOME:-}" ]] || die "HOME is not set. Set HOME or provide DEEP_DIVE_SKILLS_INSTALL_ROOT and re-run."
mkdir -p "${INSTALL_ROOT}" || die "Failed to create install root: ${INSTALL_ROOT}. Check permissions or choose another path via DEEP_DIVE_SKILLS_INSTALL_ROOT."

TMP_BASE="${TMPDIR:-/tmp}"
TEMP_DIR="$(mktemp -d "${TMP_BASE%/}/deep-dive-skills.XXXXXX")" || die "Failed to create temporary directory under ${TMP_BASE}."
cleanup() { rm -rf "${TEMP_DIR}"; }
trap cleanup EXIT

SKILLS=(
  "deep-dive-optimize-layer-caching|https://raw.githubusercontent.com/pRizz/deep-dive/main/.codex/skills/deep-dive-optimize-layer-caching/SKILL.md"
  "deep-dive-slim-base-image|https://raw.githubusercontent.com/pRizz/deep-dive/main/.codex/skills/deep-dive-slim-base-image/SKILL.md"
  "deep-dive-multi-stage-refactor|https://raw.githubusercontent.com/pRizz/deep-dive/main/.codex/skills/deep-dive-multi-stage-refactor/SKILL.md"
  "deep-dive-remove-build-artifacts|https://raw.githubusercontent.com/pRizz/deep-dive/main/.codex/skills/deep-dive-remove-build-artifacts/SKILL.md"
  "deep-dive-tune-dockerignore|https://raw.githubusercontent.com/pRizz/deep-dive/main/.codex/skills/deep-dive-tune-dockerignore/SKILL.md"
  "deep-dive-speed-up-deps|https://raw.githubusercontent.com/pRizz/deep-dive/main/.codex/skills/deep-dive-speed-up-deps/SKILL.md"
  "deep-dive-harden-runtime-image|https://raw.githubusercontent.com/pRizz/deep-dive/main/.codex/skills/deep-dive-harden-runtime-image/SKILL.md"
  "deep-dive-security-and-size-balance|https://raw.githubusercontent.com/pRizz/deep-dive/main/.codex/skills/deep-dive-security-and-size-balance/SKILL.md"
)

installed_count=0
updated_count=0
unchanged_count=0
failed_count=0

log_info "Starting Deep Dive global skill install."
log_info "Installer source: ${SCRIPT_SOURCE_URL}"
log_info "Skill raw base URL: ${SKILL_RAW_BASE_URL}"
log_info "Install root: ${INSTALL_ROOT}"
log_info "Temporary directory: ${TEMP_DIR}"
log_info "Skill count: ${#SKILLS[@]}"

for skill_entry in "${SKILLS[@]}"; do
  skill_slug="${skill_entry%%|*}"
  source_url="${skill_entry#*|}"
  target_dir="${INSTALL_ROOT}/${skill_slug}"
  target_file="${target_dir}/SKILL.md"
  temp_file="${TEMP_DIR}/${skill_slug}.md"
  had_existing=0
  [[ -f "${target_file}" ]] && had_existing=1

  log_info "Processing ${skill_slug}"
  log_info "  source: ${source_url}"
  log_info "  target: ${target_file}"

  if ! curl -fsSL "${source_url}" -o "${temp_file}"; then
    log_error "  result: failed to download. Check network access and verify the URL is reachable."
    failed_count=$((failed_count + 1))
    continue
  fi

  if (( had_existing == 1 )) && cmp -s "${target_file}" "${temp_file}"; then
    log_info "  result: unchanged (already up to date)"
    unchanged_count=$((unchanged_count + 1))
    continue
  fi

  if ! mkdir -p "${target_dir}"; then
    log_error "  result: failed to create target directory. Check permissions or set DEEP_DIVE_SKILLS_INSTALL_ROOT."
    failed_count=$((failed_count + 1))
    continue
  fi

  if ! mv "${temp_file}" "${target_file}"; then
    log_error "  result: failed to write target file. Check disk space and permissions, then re-run."
    failed_count=$((failed_count + 1))
    continue
  fi

  if (( had_existing == 1 )); then
    log_info "  result: updated"
    updated_count=$((updated_count + 1))
  else
    log_info "  result: installed"
    installed_count=$((installed_count + 1))
  fi
done

log_info "Install summary: installed=${installed_count}, updated=${updated_count}, unchanged=${unchanged_count}, failed=${failed_count}"
if (( failed_count > 0 )); then
  die "Completed with failures. Resolve the errors above and re-run the installer."
fi

log_info "All Deep Dive skills are installed in ${INSTALL_ROOT}."
log_warn "Restart Codex to pick up new skills."
