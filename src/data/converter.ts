// Convert existing gameData to TypeScript format
import { CardData, CardStats } from '../core/models/Card'
import { MusicData } from '../core/models/Music'
import { Effect } from '../core/models/Effect'

// Import the original data
// @ts-expect-error - gameDataJS has dynamic structure
import gameDataJS from '../../cardData.js'

// Raw data types from JavaScript
interface RawGameData {
  cards: Record<string, unknown>
  music: Record<string, unknown>
}

// Type assertion for the imported data
const gameData = gameDataJS as RawGameData

// Convert effects with proper typing
function convertEffects(effects: unknown[]): Effect[] {
  return effects.map((effectRaw) => {
    const effect = effectRaw as Record<string, unknown>
    if (effect.type === 'conditional') {
      return {
        ...effect,
        then: convertEffects(effect.then as unknown[]),
        else: effect.else ? convertEffects(effect.else as unknown[]) : undefined,
      } as Effect
    }
    return effect as unknown as Effect
  })
}

// Convert card data
export function convertCardData(): CardData {
  const cards: CardData = {}

  for (const [key, cardData] of Object.entries(gameData.cards)) {
    const card = cardData as Record<string, unknown>
    cards[key] = {
      name: card.name as string,
      displayName: card.displayName as string,
      character: card.character as string,
      shortCode: card.shortCode as string,
      apCost: card.apCost as number,
      stats: card.stats as CardStats,
      centerCharacteristic: card.centerCharacteristic
        ? {
            name: (card.centerCharacteristic as Record<string, unknown>).name as string,
            effects: convertEffects(
              (card.centerCharacteristic as Record<string, unknown>).effects as unknown[],
            ),
          }
        : undefined,
      centerSkill: card.centerSkill
        ? {
            when: (card.centerSkill as Record<string, unknown>).when as
              | 'beforeFirstTurn'
              | 'beforeFeverStart'
              | 'afterLastTurn',
            effects: convertEffects(
              (card.centerSkill as Record<string, unknown>).effects as unknown[],
            ),
          }
        : undefined,
      effects: convertEffects(card.effects as unknown[]),
    }
  }

  return cards
}

// Convert music data
export function convertMusicData(): MusicData {
  const music: MusicData = {}

  for (const [key, musicData] of Object.entries(gameData.music)) {
    const track = musicData as Record<string, unknown>
    music[key] = {
      name: track.name as string,
      displayName: track.displayName as string,
      phases: track.phases as number[],
      centerCharacter: track.centerCharacter as string | undefined,
      attribute: track.attribute as 'smile' | 'pure' | 'cool' | undefined,
    }
  }

  return music
}

// Export converted data
export const cardData = convertCardData()
export const musicData = convertMusicData()
