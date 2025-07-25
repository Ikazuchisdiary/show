/**
 * Round skill value according to v1 rules
 * - Integer values: floor (truncate)
 * - Decimal values: truncate to 4 decimal places
 */
export function roundSkillValue(value: number, isPercentage: boolean): number {
  if (isPercentage) {
    // Round to avoid floating point errors, then truncate to 4 decimal places
    const rounded = Math.round(value * 10000) / 10000
    return Math.floor(rounded * 10000) / 10000
  } else {
    // For integer values, truncate
    return Math.floor(value)
  }
}
