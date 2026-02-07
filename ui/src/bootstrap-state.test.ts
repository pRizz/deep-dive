import { describe, expect, it } from 'vitest';

import { classifyBootstrapFailure } from './bootstrap-state';

describe('classifyBootstrapFailure', () => {
  it('returns dive_missing for known dive-missing errors', () => {
    expect(classifyBootstrapFailure('Dive is not found in PATH')).toBe('dive_missing');
    expect(classifyBootstrapFailure('dive is not available in backend vm')).toBe('dive_missing');
  });

  it('returns backend_unavailable for unknown failures', () => {
    expect(classifyBootstrapFailure('connection refused')).toBe('backend_unavailable');
  });

  it('returns backend_unavailable when no message is provided', () => {
    expect(classifyBootstrapFailure()).toBe('backend_unavailable');
  });
});
