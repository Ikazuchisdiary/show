// @ts-ignore
import gameDataRaw from './gameData.js'
import { Card, CardData } from '../core/models/Card'
import { Music, MusicData } from '../core/models/Music'

interface GameDataRaw {
  cards: Record<string, any>
  music: Record<string, any>
}

const gameData = gameDataRaw as GameDataRaw

// Export typed data
export const cardData: CardData = gameData.cards as CardData
export const musicData: MusicData = gameData.music as MusicData

// Helper functions to get data
export function getCard(cardId: string): Card | undefined {
  return cardData[cardId]
}

export function getMusic(musicId: string): Music | undefined {
  return musicData[musicId]
}

export function getAllCards(): Card[] {
  return Object.values(cardData)
}

export function getAllMusic(): Music[] {
  return Object.values(musicData)
}

export function getCardsByCharacter(character: string): Card[] {
  return Object.values(cardData).filter(card => card.character === character)
}