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

/**
 * Format skill value for display
 * - Integers: no decimals
 * - Decimals: up to 4 places, trailing zeros removed
 */
export function formatSkillValue(value: number): string {
  // Check if it's an integer
  if (Number.isInteger(value)) {
    return value.toString()
  }
  
  // For decimals, truncate to 4 places without rounding
  const truncated = Math.floor(value * 10000) / 10000
  
  // Convert to string and remove trailing zeros
  const str = truncated.toFixed(4)
  return str.replace(/\.?0+$/, '')
}
