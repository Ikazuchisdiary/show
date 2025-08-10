export type MusicAttribute = 'smile' | 'pure' | 'cool'

export interface MusicCombos {
  normal?: number
  hard?: number
  expert?: number
  master?: number
}

export interface Music {
  id?: string // For custom music identification (v1 compatible)
  name: string
  displayName?: string // For custom music display names
  description?: string
  centerCharacter?: string
  attribute?: MusicAttribute
  phases: number[] // [beforeFever, duringFever, afterFever]
  baseFeverAppeal?: number
  baseFeverAppealLv10?: number
  combos?: MusicCombos
  comboCount?: number // Total combo count for simplified data
}

export interface MusicData {
  [key: string]: Music
}

export interface CustomMusic extends Music {
  id?: string
}
