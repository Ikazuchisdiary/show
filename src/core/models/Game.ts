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
  logs?: string[] // v1形式の詳細ログ
}

export interface CardActivationLog {
  turn: number
  cardName: string
  cardIndex: number
  apCost: number
  isCenterSkill: boolean
  scoreBefore: number
  scoreBoostBefore: number[]
  scoreBoostCountBefore: number
  voltagePtBefore: number
  scoreGain: number
  scoreBoostAfter: number[]
  scoreBoostCountAfter: number
  voltagePtAfter: number
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
  scoreBoost: number[]
  scoreBoostCount: number
  voltageBoost: number[]
  voltageBoostCount: number
  skillInvocationBoost: number
  centerSkillMultiplier: number
  learningCorrection: number

  // Game resources
  mental: number
  baseAP?: number
  apAcquired: number
  apConsumed: number

  // Card management
  removedCards: Set<string>

  // Turn tracking
  turnResults: TurnResult[]
  cardTurnCounts: number[]
  totalCardUses: number[]
  cardActivationLog: CardActivationLog[]

  // Phase info
  phases: GamePhase[]
  currentPhase: GamePhase | null
}

export interface APShortageResult {
  score: number
  voltage: number
  voltageLevel: number
  apSaved: number
  realAPConsumption: number
  excludedActivations: Array<{
    turn: number
    cardName: string
    apCost: number
  }>
  turnResults: TurnResult[]
}

export interface SimulationOptions {
  cards: (Card | null)[]
  cardSkillLevels: number[]
  centerSkillLevels?: number[]
  customSkillValues?: Record<string, Record<string, number>>
  customCenterSkillValues?: Record<string, Record<string, number>>
  centerActivations?: boolean[]
  music: Music
  musicAttribute?: string
  centerCharacter?: string
  initialMental?: number
  comboCount?: number
  baseAP?: number
}
