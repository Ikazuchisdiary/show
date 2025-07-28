import { describe, it, expect, vi } from 'vitest'

// Mock the gameData import with test data
vi.mock('../../cardData.js', () => ({
  default: {
    cards: {
      testCard1: {
        name: 'Test Card 1',
        displayName: 'Test Card Display 1',
        character: 'Test Character',
        shortCode: '[TC1]',
        apCost: 20,
        stats: {
          smile: 5000,
          pure: 4000,
          cool: 3000,
        },
        effects: [
          {
            type: 'scoreGain',
            value: 1000,
          },
        ],
      },
      centerCard1: {
        name: 'Center Card 1',
        displayName: 'Center Card Display 1',
        character: 'Center Character',
        shortCode: '[CC1]',
        apCost: 0,
        stats: {
          smile: 6000,
          pure: 5000,
          cool: 4000,
        },
        centerCharacteristic: {
          name: 'スマイル',
          effects: [
            {
              type: 'appealBoost',
              value: 0.15,
            },
          ],
        },
        centerSkill: {
          when: 'beforeFirstTurn',
          effects: [
            {
              type: 'scoreGain',
              value: 5000,
            },
          ],
        },
        effects: [],
      },
    },
    music: {
      testMusic1: {
        name: 'Test Music 1',
        displayName: 'Test Music Display 1',
        phases: [10, 10, 10],
        centerCharacter: 'Test Character',
        difficulty: {
          normal: { combo: 100, appeal: 5000 },
          hard: { combo: 150, appeal: 7500 },
          expert: { combo: 200, appeal: 10000 },
          master: { combo: 250, appeal: 12500 },
        },
      },
      testMusic2: {
        name: 'Test Music 2',
        displayName: 'Test Music Display 2',
        phases: [15, 10, 15],
        centerCharacter: null,
        difficulty: {
          normal: { combo: 120, appeal: 6000 },
          hard: { combo: 180, appeal: 9000 },
          expert: { combo: 240, appeal: 12000 },
          master: { combo: 300, appeal: 15000 },
        },
      },
    },
  },
}))

// Import after mocking
const { convertCardData, convertMusicData, cardData, musicData } = await import('./converter')

describe('data converter', () => {
  describe('convertCardData', () => {
    it('should convert card data structure', () => {
      const converted = convertCardData()
      
      expect(converted).toBeDefined()
      expect(converted.testCard1).toBeDefined()
      expect(converted.centerCard1).toBeDefined()
    })

    it('should convert card properties correctly', () => {
      const converted = convertCardData()
      const card = converted.testCard1
      
      expect(card.name).toBe('Test Card 1')
      expect(card.displayName).toBe('Test Card Display 1')
      expect(card.character).toBe('Test Character')
      expect(card.shortCode).toBe('[TC1]')
      expect(card.apCost).toBe(20)
    })

    it('should convert card stats', () => {
      const converted = convertCardData()
      const card = converted.testCard1
      
      expect(card.stats).toEqual({
        smile: 5000,
        pure: 4000,
        cool: 3000,
      })
    })

    it('should convert effects directly', () => {
      const converted = convertCardData()
      const card = converted.testCard1
      
      expect(card.effects).toBeDefined()
      expect(card.effects).toHaveLength(1)
      expect(card.effects[0]).toEqual({
        type: 'scoreGain',
        value: 1000,
      })
    })

    it('should convert center characteristics', () => {
      const converted = convertCardData()
      const centerCard = converted.centerCard1
      
      expect(centerCard.centerCharacteristic).toBeDefined()
      expect(centerCard.centerCharacteristic!.name).toBe('スマイル')
      expect(centerCard.centerCharacteristic!.effects).toHaveLength(1)
      expect(centerCard.centerCharacteristic!.effects[0]).toEqual({
        type: 'appealBoost',
        value: 0.15,
      })
    })

    it('should convert center skills', () => {
      const converted = convertCardData()
      const centerCard = converted.centerCard1
      
      expect(centerCard.centerSkill).toBeDefined()
      expect(centerCard.centerSkill!.when).toBe('beforeFirstTurn')
      expect(centerCard.centerSkill!.effects).toHaveLength(1)
      expect(centerCard.centerSkill!.effects[0]).toEqual({
        type: 'scoreGain',
        value: 5000,
      })
    })
  })

  describe('convertMusicData', () => {
    it('should convert music data structure', () => {
      const converted = convertMusicData()
      
      expect(converted).toBeDefined()
      expect(converted.testMusic1).toBeDefined()
      expect(converted.testMusic2).toBeDefined()
    })

    it('should convert music properties', () => {
      const converted = convertMusicData()
      const music = converted.testMusic1
      
      expect(music.name).toBe('Test Music 1')
      expect(music.displayName).toBe('Test Music Display 1')
      expect(music.phases).toEqual([10, 10, 10])
      expect(music.centerCharacter).toBe('Test Character')
      // Music data structure doesn't have difficulty property in v2
    })

    it('should handle null center character', () => {
      const converted = convertMusicData()
      const music = converted.testMusic2
      
      expect(music.name).toBe('Test Music 2')
      expect(music.phases).toEqual([15, 10, 15])
      expect(music.centerCharacter).toBeNull()
    })
  })

  describe('exported data', () => {
    it('should export converted card data', () => {
      expect(cardData).toBeDefined()
      expect(cardData.testCard1).toBeDefined()
      expect(cardData.centerCard1).toBeDefined()
    })

    it('should export converted music data', () => {
      expect(musicData).toBeDefined()
      expect(musicData.testMusic1).toBeDefined()
      expect(musicData.testMusic2).toBeDefined()
    })
  })

  describe('effect conversion', () => {
    it('should handle conditional effects', () => {
      // Re-mock with conditional effects
      vi.doMock('../../cardData.js', () => ({
        default: {
          cards: {
            conditionalCard: {
              name: 'Conditional Card',
              displayName: 'Conditional Card',
              character: 'Test',
              shortCode: '[COND]',
              apCost: 25,
              stats: { smile: 5000, pure: 5000, cool: 5000 },
              effects: [
                {
                  type: 'conditional',
                  condition: {
                    type: 'voltage',
                    threshold: 1000,
                    comparison: 'gte',
                  },
                  then: [
                    { type: 'scoreGain', value: 3000 },
                  ],
                  else: [
                    { type: 'scoreGain', value: 1000 },
                  ],
                },
              ],
            },
          },
          music: {},
        },
      }))

      // Re-import to get new mocked data
      return import('./converter').then((module) => {
        const converted = module.convertCardData()
        const card = converted.conditionalCard
        
        expect(card.effects[0].type).toBe('conditional')
        const conditionalEffect = card.effects[0] as any
        expect(conditionalEffect.condition).toBeDefined()
        expect(conditionalEffect.then).toHaveLength(1)
        expect(conditionalEffect.else).toHaveLength(1)
      })
    })
  })
})