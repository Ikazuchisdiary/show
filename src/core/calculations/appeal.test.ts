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
    effects: []
  })
  
  describe('calculateAppealValue', () => {
    it('should sum up card stats correctly', () => {
      const cards: (Card | null)[] = [
        createCard(1000, 2000, 3000, 'Character1'),
        createCard(2000, 1000, 1000, 'Character2'),
        createCard(3000, 3000, 2000, 'Character3'),
        null,
        null,
        null
      ]
      
      const appeal = calculateAppealValue({ cards })
      // Should use the highest value (cool: 6000)
      expect(appeal).toBe(6000)
    })
    
    it('should apply music attribute selection', () => {
      const cards: (Card | null)[] = [
        createCard(5000, 3000, 2000, 'Character1'),
        createCard(1000, 4000, 5000, 'Character2'),
        null, null, null, null
      ]
      
      const smileAppeal = calculateAppealValue({ cards, musicAttribute: 'smile' })
      expect(smileAppeal).toBe(6000)
      
      const pureAppeal = calculateAppealValue({ cards, musicAttribute: 'pure' })
      expect(pureAppeal).toBe(7000)
      
      const coolAppeal = calculateAppealValue({ cards, musicAttribute: 'cool' })
      expect(coolAppeal).toBe(7000)
    })
    
    it('should apply center attribute bonus', () => {
      const centerCard = createCard(5000, 1000, 1000, 'Center')
      const cards: (Card | null)[] = [
        centerCard,
        createCard(5000, 1000, 1000, 'Other'),
        null, null, null, null
      ]
      
      const appeal = calculateAppealValue({ 
        cards, 
        musicAttribute: 'smile',
        centerCard 
      })
      
      // 10000 * 1.14 = 11400
      expect(appeal).toBe(11400)
    })
    
    it('should apply center characteristic appeal boost', () => {
      const cards: (Card | null)[] = [
        createCard(1000, 1000, 1000, '乙宗梢'),
        createCard(1000, 1000, 1000, '藤島慈'),
        createCard(1000, 1000, 1000, '夕霧綴理'),
        createCard(1000, 1000, 1000, '日野下花帆'),
        null, null
      ]
      
      const centerCharacteristic = {
        name: 'Test Center',
        effects: [{
          type: 'appealBoost' as const,
          value: 2.0, // 200%
          target: '102期'
        }]
      }
      
      const appeal = calculateAppealValue({ 
        cards,
        musicAttribute: 'smile',
        centerCharacteristic
      })
      
      // 102期 (3 cards) get 200% = 3000 * 2 = 6000
      // 103期 (1 card) stays at 1000
      // Total: 6000 + 1000 = 7000
      expect(appeal).toBe(7000)
    })
    
    it('should handle all group targets correctly', () => {
      const cards: (Card | null)[] = [
        createCard(1000, 0, 0, '乙宗梢'),        // スリーズブーケ
        createCard(1000, 0, 0, '日野下花帆'),    // スリーズブーケ
        createCard(1000, 0, 0, '百生吟子'),      // スリーズブーケ
        createCard(1000, 0, 0, '夕霧綴理'),      // DOLLCHESTRA
        createCard(1000, 0, 0, '村野さやか'),    // DOLLCHESTRA
        createCard(1000, 0, 0, '徒町小鈴'),      // DOLLCHESTRA
      ]
      
      const centerCharacteristic = {
        name: 'Test Center',
        effects: [{
          type: 'appealBoost' as const,
          value: 1.5, // 150%
          target: 'スリーズブーケ'
        }]
      }
      
      const appeal = calculateAppealValue({ 
        cards,
        musicAttribute: 'smile',
        centerCharacteristic
      })
      
      // スリーズブーケ: 3000 * 1.5 = 4500
      // DOLLCHESTRA: 3000 (no boost)
      // Total: 4500 + 3000 = 7500
      expect(appeal).toBe(7500)
    })
    
    it('should floor the final result', () => {
      const cards: (Card | null)[] = [
        createCard(1111, 0, 0, 'Character1'),
        createCard(1111, 0, 0, 'Character2'),
        null, null, null, null
      ]
      
      const appeal = calculateAppealValue({ 
        cards,
        musicAttribute: 'smile',
      })
      
      expect(appeal).toBe(2222)
    })
  })
})