export const UNLOCK_CONFIG = {
  DEFAULT_DURATION_HOURS: 24,
  MIN_DURATION_HOURS: 24,
  MAX_DURATION_HOURS: 48,
  TOKEN_PRICE: 10,
};

export function getUnlockDurationNanoseconds(hours: number = UNLOCK_CONFIG.DEFAULT_DURATION_HOURS): bigint {
  return BigInt(hours * 60 * 60 * 1_000_000_000);
}
