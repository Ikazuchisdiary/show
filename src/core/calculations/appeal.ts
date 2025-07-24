import { Card, CardStats } from '../models/Card'
import { MusicAttribute } from '../models/Music'
import { CENTER_ATTRIBUTE_BONUS } from './constants'
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
  const { cards, musicAttribute, centerCard } = options
  
  // Calculate total appeal for each attribute
  let totalSmile = 0
  let totalPure = 0
  let totalCool = 0
  
  // Sum up base stats from all cards
  for (const card of cards) {
    if (card && card.stats) {
      totalSmile += card.stats.smile
      totalPure += card.stats.pure
      totalCool += card.stats.cool
    }
  }
  
  // Apply center characteristic boosts
  if (options.centerCharacteristic) {
    for (const effect of options.centerCharacteristic.effects) {
      if (effect.type === 'appealBoost') {
        // Apply appeal boost to matching cards
        for (const card of cards) {
          if (card && shouldApplyBoost(card, effect.target)) {
            const boostMultiplier = effect.value
            totalSmile += card.stats.smile * (boostMultiplier - 1)
            totalPure += card.stats.pure * (boostMultiplier - 1)
            totalCool += card.stats.cool * (boostMultiplier - 1)
          }
        }
      }
    }
  }
  
  // Apply center attribute bonus (14%)
  if (centerCard && musicAttribute) {
    const centerAttribute = getCardAttribute(centerCard)
    if (centerAttribute === musicAttribute) {
      switch (musicAttribute) {
        case 'smile':
          totalSmile *= 1 + CENTER_ATTRIBUTE_BONUS
          break
        case 'pure':
          totalPure *= 1 + CENTER_ATTRIBUTE_BONUS
          break
        case 'cool':
          totalCool *= 1 + CENTER_ATTRIBUTE_BONUS
          break
      }
    }
  }
  
  // Determine final appeal value
  let appeal: number
  if (musicAttribute) {
    switch (musicAttribute) {
      case 'smile':
        appeal = totalSmile
        break
      case 'pure':
        appeal = totalPure
        break
      case 'cool':
        appeal = totalCool
        break
      default:
        appeal = Math.max(totalSmile, totalPure, totalCool)
    }
  } else {
    appeal = Math.max(totalSmile, totalPure, totalCool)
  }
  
  return Math.floor(appeal)
}

/**
 * Determine a card's primary attribute based on its stats
 */
function getCardAttribute(card: Card): MusicAttribute | null {
  const { smile, pure, cool } = card.stats
  
  if (smile >= pure && smile >= cool) return 'smile'
  if (pure >= smile && pure >= cool) return 'pure'
  if (cool >= smile && cool >= pure) return 'cool'
  
  return null
}

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
  if (target === 'スリーズブーケ' && ['乙宗梢', '日野下花帆', '百生吟子'].includes(card.character)) {
    return true
  }
  if (target === 'DOLLCHESTRA' && ['夕霧綴理', '村野さやか', '徒町小鈴'].includes(card.character)) {
    return true
  }
  if (target === 'みらくらぱーく！' && ['藤島慈', '大沢瑠璃乃', '安養寺姫芽'].includes(card.character)) {
    return true
  }
  
  return false
}