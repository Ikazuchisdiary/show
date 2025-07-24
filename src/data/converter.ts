// Convert existing gameData to TypeScript format
import { Card, CardData } from '../core/models/Card'
import { Music, MusicData } from '../core/models/Music'
import { Effect } from '../core/models/Effect'

// Import the original data
// @ts-ignore
import gameDataJS from '../../cardData.js'

// Type assertion for the imported data
const gameData = gameDataJS as any

// Convert effects with proper typing
function convertEffects(effects: any[]): Effect[] {
  return effects.map(effect => {
    if (effect.type === 'conditional') {
      return {
        ...effect,
        then: convertEffects(effect.then),
        else: effect.else ? convertEffects(effect.else) : undefined
      }
    }
    return effect
  })
}

// Convert card data
export function convertCardData(): CardData {
  const cards: CardData = {}
  
  for (const [key, cardData] of Object.entries(gameData.cards)) {
    const card = cardData as any
    cards[key] = {
      name: card.name,
      displayName: card.displayName,
      character: card.character,
      shortCode: card.shortCode,
      apCost: card.apCost,
      stats: card.stats,
      centerCharacteristic: card.centerCharacteristic ? {
        name: card.centerCharacteristic.name,
        effects: convertEffects(card.centerCharacteristic.effects)
      } : undefined,
      centerSkill: card.centerSkill ? {
        when: card.centerSkill.when,
        effects: convertEffects(card.centerSkill.effects)
      } : undefined,
      effects: convertEffects(card.effects)
    }
  }
  
  return cards
}

// Convert music data
export function convertMusicData(): MusicData {
  const music: MusicData = {}
  
  for (const [key, musicData] of Object.entries(gameData.music)) {
    const track = musicData as any
    music[key] = {
      name: track.name,
      phases: track.phases,
      centerCharacter: track.centerCharacter,
      attribute: track.attribute
    }
  }
  
  return music
}

// Export converted data
export const cardData = convertCardData()
export const musicData = convertMusicData()