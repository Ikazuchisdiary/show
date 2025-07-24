export type MusicAttribute = 'smile' | 'pure' | 'cool'

export interface Music {
  name: string
  centerCharacter?: string
  attribute?: MusicAttribute
  phases: number[] // [beforeFever, duringFever, afterFever]
  baseFeverAppeal?: number
  baseFeverAppealLv10?: number
}

export interface MusicData {
  [key: string]: Music
}

export interface CustomMusic extends Music {
  customId: string
}