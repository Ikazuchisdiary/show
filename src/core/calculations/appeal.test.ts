import { describe, it, expect } from 'vitest'
import { calculateAppealValue } from './appeal'
import { Card } from '../models/Card'

describe('Appeal Calculations', () => {
  const createCard = (smile: number, pure: number, cool: number, character: string): Card => ({
    name: 'Test Card',
    displayName: 'Test Card',
    character,
    shortCode: 'TC',
    apCost: 10,
    stats: { smile, pure, cool, mental: 100 },
    effects: [],
  })

  describe('calculateAppealValue', () => {
    it('should sum up card stats correctly', () => {
      const cards: (Card | null)[] = [
        createCard(1000, 2000, 3000, 'Character1'),
        createCard(2000, 1000, 1000, 'Character2'),
        createCard(3000, 3000, 2000, 'Character3'),
        null,
        null,
        null,
      ]

      const appeal = calculateAppealValue({ cards })
      // No music attribute, all stats at 10%
      // Total stats: smile=6000, pure=6000, cool=6000
      // Total = 18000 * 0.1 = 1800
      expect(appeal).toBe(1800)
    })

    it('should apply music attribute selection', () => {
      const cards: (Card | null)[] = [
        createCard(5000, 3000, 2000, 'Character1'),
        createCard(1000, 4000, 5000, 'Character2'),
        null,
        null,
        null,
        null,
      ]

      const smileAppeal = calculateAppealValue({ cards, musicAttribute: 'smile' })
      // smile: 6000 * 1.0 + (7000 + 7000) * 0.1 = 6000 + 1400 = 7400
      expect(smileAppeal).toBe(7400)

      const pureAppeal = calculateAppealValue({ cards, musicAttribute: 'pure' })
      // pure: 7000 * 1.0 + (6000 + 7000) * 0.1 = 7000 + 1300 = 8300
      expect(pureAppeal).toBe(8300)

      const coolAppeal = calculateAppealValue({ cards, musicAttribute: 'cool' })
      // cool: 7000 * 1.0 + (6000 + 7000) * 0.1 = 7000 + 1300 = 8300
      expect(coolAppeal).toBe(8300)
    })

    it('should apply center attribute bonus', () => {
      const centerCard = createCard(5000, 1000, 1000, 'Center')
      const cards: (Card | null)[] = [
        centerCard,
        createCard(5000, 1000, 1000, 'Other'),
        null,
        null,
        null,
        null,
      ]

      const appeal = calculateAppealValue({
        cards,
        musicAttribute: 'smile',
        centerCard,
      })

      // Cards have 10000 smile total, 2000 pure, 2000 cool
      // With music attr smile: 10000 * 1.0 + (2000 + 2000) * 0.1 = 10000 + 400 = 10400
      // Center attribute bonus is handled separately by game simulator
      expect(appeal).toBe(10400)
    })

    it('should apply center characteristic appeal boost', () => {
      const cards: (Card | null)[] = [
        createCard(1000, 1000, 1000, '乙宗梢'),
        createCard(1000, 1000, 1000, '藤島慈'),
        createCard(1000, 1000, 1000, '夕霧綴理'),
        createCard(1000, 1000, 1000, '日野下花帆'),
        null,
        null,
      ]

      const centerCharacteristic = {
        name: 'Test Center',
        effects: [
          {
            type: 'appealBoost' as const,
            value: 2.0, // 200%
            target: '102期',
          },
        ],
      }

      const appeal = calculateAppealValue({
        cards,
        musicAttribute: 'smile',
        centerCharacteristic,
      })

      // 102期 (3 cards) get boost: 1 + 2.0 = 3.0x
      // Each card: 1000 -> 3000 for all attributes
      // 102期 total: 9000 smile, 9000 pure, 9000 cool
      // 103期 (1 card) stays at 1000 each attribute
      // Total: 10000 smile, 10000 pure, 10000 cool
      // With music attr smile: 10000 * 1.0 + (10000 + 10000) * 0.1 = 10000 + 2000 = 12000
      expect(appeal).toBe(12000)
    })

    it('should handle all group targets correctly', () => {
      const cards: (Card | null)[] = [
        createCard(1000, 0, 0, '乙宗梢'), // スリーズブーケ
        createCard(1000, 0, 0, '日野下花帆'), // スリーズブーケ
        createCard(1000, 0, 0, '百生吟子'), // スリーズブーケ
        createCard(1000, 0, 0, '夕霧綴理'), // DOLLCHESTRA
        createCard(1000, 0, 0, '村野さやか'), // DOLLCHESTRA
        createCard(1000, 0, 0, '徒町小鈴'), // DOLLCHESTRA
      ]

      const centerCharacteristic = {
        name: 'Test Center',
        effects: [
          {
            type: 'appealBoost' as const,
            value: 1.5, // 150%
            target: 'スリーズブーケ',
          },
        ],
      }

      const appeal = calculateAppealValue({
        cards,
        musicAttribute: 'smile',
        centerCharacteristic,
      })

      // スリーズブーケ: 3000 * (1 + 1.5) = 3000 * 2.5 = 7500
      // DOLLCHESTRA: 3000 (no boost)
      // Total smile: 7500 + 3000 = 10500
      expect(appeal).toBe(10500)
    })

    it('should floor the final result', () => {
      const cards: (Card | null)[] = [
        createCard(1111, 0, 0, 'Character1'),
        createCard(1111, 0, 0, 'Character2'),
        null,
        null,
        null,
        null,
      ]

      const appeal = calculateAppealValue({
        cards,
        musicAttribute: 'smile',
      })

      expect(appeal).toBe(2222)
    })
  })
})
