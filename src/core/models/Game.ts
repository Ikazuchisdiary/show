import { Card } from './Card'
import { Music } from './Music'

export interface GamePhase {
  name: 'beforeFever' | 'duringFever' | 'afterFever'
  startTurn: number
  endTurn: number
}

export interface TurnResult {
  turn: number
  cardIndex: number
  cardName: string
  cardCharacter: string
  appeal: number
  scoreGain: number
  voltageGain: number
  voltageLevel: number
  apUsed: number
  isSkipped: boolean
  multipliers: {
    base: number
    skill: number
    skillBoost: number
    voltage: number
    fever: number
    center: number
    total: number
  }
}

export interface GameState {
  // Core state
  cards: (Card | null)[]
  cardSkillLevels: number[]
  music: Music | null
  musicAttribute: string | null
  centerCharacter: string | null
  
  // Game progress
  currentTurn: number
  currentCardIndex: number
  totalScore: number
  totalVoltage: number
  
  // Multipliers and boosts
  scoreBoost: number
  voltageBoost: number
  skillInvocationBoost: number
  centerSkillMultiplier: number
  
  // Turn tracking
  turnResults: TurnResult[]
  cardTurnCounts: number[]
  totalCardUses: number[]
  
  // Phase info
  phases: GamePhase[]
  currentPhase: GamePhase | null
}

export interface SimulationOptions {
  cards: (Card | null)[]
  cardSkillLevels: number[]
  centerSkillLevels?: number[]
  customSkillValues?: Record<string, Record<string, number>>
  customCenterSkillValues?: Record<string, Record<string, number>>
  music: Music
  musicAttribute?: string
  centerCharacter?: string
  initialMental?: number
  comboCount?: number
}