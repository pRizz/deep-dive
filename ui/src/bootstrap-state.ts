export type BootstrapFailurePhase = 'dive_missing' | 'backend_unavailable';

export function classifyBootstrapFailure(message?: string): BootstrapFailurePhase {
  if (!message) {
    return 'backend_unavailable';
  }

  const normalized = message.toLowerCase();
  if (normalized.includes('dive is not found') || normalized.includes('dive is not available')) {
    return 'dive_missing';
  }

  return 'backend_unavailable';
}
