export type MusicAttribute = 'smile' | 'pure' | 'cool'

export interface MusicCombos {
  normal?: number
  hard?: number
  expert?: number
  master?: number
}

export interface Music {
  name: string
  centerCharacter?: string
  attribute?: MusicAttribute
  phases: number[] // [beforeFever, duringFever, afterFever]
  baseFeverAppeal?: number
  baseFeverAppealLv10?: number
  combos?: MusicCombos
}

export interface MusicData {
  [key: string]: Music
}

export interface CustomMusic extends Music {
  customId: string
}