// Skill level multipliers for Lv.1 to Lv.14
export const SKILL_LEVEL_MULTIPLIERS = [
  1.0,  // Lv.1
  1.1,  // Lv.2
  1.2,  // Lv.3
  1.3,  // Lv.4
  1.4,  // Lv.5
  1.5,  // Lv.6
  1.6,  // Lv.7
  1.7,  // Lv.8
  1.8,  // Lv.9
  2.0,  // Lv.10
  2.2,  // Lv.11
  2.4,  // Lv.12
  2.7,  // Lv.13
  3.0   // Lv.14
] as const

// Voltage level thresholds
export const VOLTAGE_THRESHOLDS = [
  0, 10, 30, 60, 100, 150, 210, 280, 360, 450,
  550, 660, 780, 910, 1050, 1200, 1360, 1530, 1710, 1900
] as const

// Constants for AP calculation
export const AP_CONSTANTS = {
  MENTAL_FACTOR: 0.04685,
  BASE_AP: 60,
  BASE_COMBO: 49,
  COMBO_MULTIPLIER: 1.5,
  BASE_VALUE: 59,
  AP_GAIN_MULTIPLIER: 1.5
} as const

// Center bonus
export const CENTER_ATTRIBUTE_BONUS = 0.14