import { Card } from '../models/Card'
import { MusicAttribute } from '../models/Music'
import { CenterCharacteristic } from '../models/Effect'

interface AppealCalculationOptions {
  cards: (Card | null)[]
  musicAttribute?: MusicAttribute | null
  centerCard?: Card | null
  centerCharacteristic?: CenterCharacteristic | null
}

/**
 * Calculate total appeal value based on cards and music attribute
 */
export function calculateAppealValue(options: AppealCalculationOptions): number {
  const { cards, musicAttribute } = options

  // Calculate total appeal for each attribute
  let totalSmile = 0
  let totalPure = 0
  let totalCool = 0

  // Calculate appeal for each card with center characteristic boosts
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    if (card && card.stats) {
      // Calculate boost multiplier for this card
      let boostMultiplier = 1.0

      if (options.centerCharacteristic) {
        for (const effect of options.centerCharacteristic.effects) {
          if (effect.type === 'appealBoost' && shouldApplyBoost(card, effect.target)) {
            // v1 adds the boost value to the multiplier (not sets it)
            boostMultiplier += effect.value
          }
        }
      }

      // Apply boost and ceil per card (v1 behavior)
      const boostedSmile = Math.ceil(card.stats.smile * boostMultiplier)
      const boostedPure = Math.ceil(card.stats.pure * boostMultiplier)
      const boostedCool = Math.ceil(card.stats.cool * boostMultiplier)

      totalSmile += boostedSmile
      totalPure += boostedPure
      totalCool += boostedCool
    }
  }

  // Calculate final appeal based on music attribute
  let finalAppeal: number
  let mainAttr = 0
  let otherAttr = 0

  if (musicAttribute === 'smile') {
    // Smile is matching attribute (100%), others are 10%
    mainAttr = totalSmile
    otherAttr = (totalPure + totalCool) * 0.1
    finalAppeal = mainAttr + otherAttr
  } else if (musicAttribute === 'pure') {
    // Pure is matching attribute (100%), others are 10%
    mainAttr = totalPure
    otherAttr = (totalSmile + totalCool) * 0.1
    finalAppeal = mainAttr + otherAttr
  } else if (musicAttribute === 'cool') {
    // Cool is matching attribute (100%), others are 10%
    mainAttr = totalCool
    otherAttr = (totalSmile + totalPure) * 0.1
    finalAppeal = mainAttr + otherAttr
  } else {
    // No music attribute, all are 10%
    finalAppeal = (totalSmile + totalPure + totalCool) * 0.1
  }

  // Round up the final appeal
  return Math.ceil(finalAppeal)
}

// /**
//  * Determine a card's primary attribute based on its stats
//  */
// function getCardAttribute(card: Card): MusicAttribute | null {
//   const { smile, pure, cool } = card.stats
//
//   if (smile >= pure && smile >= cool) return 'smile'
//   if (pure >= smile && pure >= cool) return 'pure'
//   if (cool >= smile && cool >= pure) return 'cool'
//
//   return null
// }

/**
 * Check if appeal boost should be applied to a card
 */
function shouldApplyBoost(card: Card, target: string): boolean {
  if (target === 'all') return true
  if (target === card.character) return true

  // Group checks
  if (target === '102期' && ['乙宗梢', '藤島慈', '夕霧綴理'].includes(card.character)) {
    return true
  }
  if (target === '103期' && ['日野下花帆', '村野さやか', '大沢瑠璃乃'].includes(card.character)) {
    return true
  }
  if (target === '104期' && ['百生吟子', '徒町小鈴', '安養寺姫芽'].includes(card.character)) {
    return true
  }
  if (
    target === 'スリーズブーケ' &&
    ['乙宗梢', '日野下花帆', '百生吟子'].includes(card.character)
  ) {
    return true
  }
  if (target === 'DOLLCHESTRA' && ['夕霧綴理', '村野さやか', '徒町小鈴'].includes(card.character)) {
    return true
  }
  if (
    target === 'みらくらぱーく！' &&
    ['藤島慈', '大沢瑠璃乃', '安養寺姫芽'].includes(card.character)
  ) {
    return true
  }

  return false
}
