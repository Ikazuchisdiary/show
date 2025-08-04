import { Effect, CenterCharacteristic, CenterSkill } from './Effect'

export interface CardStats {
  smile: number
  pure: number
  cool: number
  mental: number
}

export interface Card {
  name: string
  displayName: string
  character: string
  shortCode: string
  apCost: number
  stats: CardStats
  centerCharacteristic?: CenterCharacteristic
  centerSkill?: CenterSkill
  effects: Effect[]
}

export interface GenericCard {
  name: string
  displayName: string
  character: string
  shortCode: string
  apCost: number
  stats: CardStats
  effects: Effect[]
}

export interface CardData {
  [key: string]: Card
}

export interface GenericCardData {
  [key: string]: GenericCard
}
