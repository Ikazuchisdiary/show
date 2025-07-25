// Effect types for cards
export type EffectType =
  | 'scoreBoost'
  | 'voltageBoost'
  | 'skillInvocationBoost'
  | 'conditional'
  | 'resetCardTurn'
  | 'skipTurn'
  | 'appealBoost'
  | 'apReduce'
  | 'centerSkill'
  | 'scoreGain'
  | 'voltageGain'
  | 'apGain'
  | 'mentalReduction'
  | 'mentalRecover'
  | 'voltagePenalty'
  | 'removeAfterUse'

export type ConditionType = 
  | 'count'
  | 'voltage'
  | 'phase'
  | 'mental'
  | 'attribute'
  | 'character'
  | 'group'

export interface BaseEffect {
  type: EffectType
  description?: string
}

export interface ScoreBoostEffect extends BaseEffect {
  type: 'scoreBoost'
  value: number
}

export interface VoltageBoostEffect extends BaseEffect {
  type: 'voltageBoost'
  value: number
}

export interface SkillInvocationBoostEffect extends BaseEffect {
  type: 'skillInvocationBoost'
  value: number
}

export interface ResetCardTurnEffect extends BaseEffect {
  type: 'resetCardTurn'
}

export interface SkipTurnEffect extends BaseEffect {
  type: 'skipTurn'
}

export interface AppealBoostEffect extends BaseEffect {
  type: 'appealBoost'
  value: number
  target: string // "all", "102期", character name, etc.
}

export interface ApReduceEffect extends BaseEffect {
  type: 'apReduce'
  value: number
  target: string
}

export interface ScoreGainEffect extends BaseEffect {
  type: 'scoreGain'
  value: number
  levelValues?: number[] // For center skills that have level-specific values
}

export interface VoltageGainEffect extends BaseEffect {
  type: 'voltageGain'
  value: number
}

export interface ApGainEffect extends BaseEffect {
  type: 'apGain'
  value: number
  levelValues?: number[]
}

export interface MentalReductionEffect extends BaseEffect {
  type: 'mentalReduction'
  value: number
}

export interface MentalRecoverEffect extends BaseEffect {
  type: 'mentalRecover'
  value: number
}

export interface VoltagePenaltyEffect extends BaseEffect {
  type: 'voltagePenalty'
  value: number
}

export interface RemoveAfterUseEffect extends BaseEffect {
  type: 'removeAfterUse'
  condition?: string
}

export interface CenterSkillEffect extends BaseEffect {
  type: 'centerSkill'
  timing: 'beforeFirstTurn' | 'beforeFeverStart' | 'afterLastTurn'
  effects: Effect[]
}

export interface ConditionalEffect extends BaseEffect {
  type: 'conditional'
  condition: string // Expression to evaluate
  then: Effect[]
  else?: Effect[]
}

export type Effect =
  | ScoreBoostEffect
  | VoltageBoostEffect
  | SkillInvocationBoostEffect
  | ResetCardTurnEffect
  | SkipTurnEffect
  | AppealBoostEffect
  | ApReduceEffect
  | ScoreGainEffect
  | VoltageGainEffect
  | ApGainEffect
  | MentalReductionEffect
  | MentalRecoverEffect
  | VoltagePenaltyEffect
  | RemoveAfterUseEffect
  | CenterSkillEffect
  | ConditionalEffect

export interface CenterCharacteristic {
  name: string
  effects: Effect[]
}

export interface CenterSkill {
  when: 'beforeFirstTurn' | 'beforeFeverStart' | 'afterLastTurn'
  effects: Effect[]
}