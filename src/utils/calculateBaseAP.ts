/**
 * Calculate base AP based on combo count and initial mental
 * Formula from v1:
 * - 実際のコンボ数 = floor(コンボ数 - (1 - メンタル/100) / 0.04685)
 * - 1コンボ当たりAP = ceil(60/コンボ数 * 10000) / 10000
 * - 基礎AP = (59 + 1.5 * (実際のコンボ数 - 49)) * 1コンボ当たりAP
 */
export function calculateBaseAP(comboCount: number, initialMental: number): number {
  if (!comboCount || comboCount <= 0) return 0

  // Calculate actual combo count
  const actualComboCount = Math.floor(comboCount - (1 - initialMental / 100) / 0.04685)

  // Calculate AP per combo (round up at 4th decimal place)
  const apPerCombo = Math.ceil((60 / comboCount) * 10000) / 10000

  // Calculate base AP
  const baseAP = (59 + 1.5 * (actualComboCount - 49)) * apPerCombo

  // Round to 2 decimal places
  return Math.round(baseAP * 100) / 100
}
