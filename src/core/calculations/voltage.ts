import { VOLTAGE_THRESHOLDS } from './constants'
import { Music } from '../models/Music'

/**
 * Calculate voltage level based on voltage points and current game state
 */
export function getVoltageLevel(
  voltagePt: number,
  turn: number,
  music: Music | null
): number {
  // Calculate sub-voltage level
  let subLevel = 0
  
  if (voltagePt < 10) {
    subLevel = 0
  } else if (voltagePt < 1900) {
    // Find the appropriate level from thresholds
    for (let i = VOLTAGE_THRESHOLDS.length - 1; i >= 0; i--) {
      if (voltagePt >= VOLTAGE_THRESHOLDS[i]) {
        subLevel = i
        break
      }
    }
  } else {
    // Above 1900, every 200 points = 1 level
    subLevel = 19 + Math.floor((voltagePt - 1900) / 200)
  }
  
  // Check if in fever phase
  if (music && music.phases.length >= 2) {
    const feverStart = music.phases[0]
    const feverDuration = music.phases[1]
    const feverEnd = feverStart + feverDuration
    
    if (turn >= feverStart && turn < feverEnd) {
      // Double voltage level during fever
      return subLevel * 2
    }
  }
  
  return subLevel
}

/**
 * Calculate voltage multiplier for score calculation
 */
export function getVoltageMultiplier(voltageLevel: number): number {
  return 1 + voltageLevel / 10
}