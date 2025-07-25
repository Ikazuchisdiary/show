// Additional types for data files
export interface ComboCounts {
  normal: number
  hard: number
  expert: number
  master: number
}

export interface CenterSkill {
  when: 'beforeFirstTurn' | 'beforeFeverStart' | 'afterLastTurn'
  effects: import('../core/models/Effect').Effect[]
}

export interface LevelValues {
  values: number[] // 14 values for levels 1-14
}
