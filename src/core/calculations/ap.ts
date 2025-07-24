import { AP_CONSTANTS } from './constants'

/**
 * Calculate base AP based on combo count and initial mental
 */
export function calculateBaseAP(comboCount: number, initialMental: number): number {
  // 実際のコンボ数 = 切り捨て(コンボ数 - (1-初期メンタル) / 0.04685)
  const actualComboCount = Math.floor(
    comboCount - (1 - initialMental / 100) / AP_CONSTANTS.MENTAL_FACTOR
  )
  
  // 1コンボ当たりAP = 小数点以下第4位切り上げ(60/コンボ数)
  const apPerCombo = Math.ceil((AP_CONSTANTS.BASE_AP / comboCount) * 10000) / 10000
  
  // 基礎AP = (59 + 1.5 * (実際のコンボ数 - 49)) * 1コンボ当たりAP
  const baseAP = (
    AP_CONSTANTS.BASE_VALUE + 
    AP_CONSTANTS.COMBO_MULTIPLIER * (actualComboCount - AP_CONSTANTS.BASE_COMBO)
  ) * apPerCombo
  
  // Round to 2 decimal places
  return Math.round(baseAP * 100) / 100
}

/**
 * Calculate AP gain with multiplier
 */
export function calculateAPGain(baseAP: number): number {
  return Math.round(baseAP * AP_CONSTANTS.AP_GAIN_MULTIPLIER * 100) / 100
}