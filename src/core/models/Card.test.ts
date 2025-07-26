import { describe, it, expect } from 'vitest'
import type { Card, CenterCard, FormationCard, CharacterType } from './Card'

describe('Card models', () => {
  describe('Card type', () => {
    it('should have required properties', () => {
      const card: Card = {
        name: 'Test Card',
        shortCode: '[TC]',
        characterName: 'Test Character',
        type: '歌',
        appeal: 10000,
      }
      
      expect(card.name).toBe('Test Card')
      expect(card.shortCode).toBe('[TC]')
      expect(card.characterName).toBe('Test Character')
      expect(card.type).toBe('歌')
      expect(card.appeal).toBe(10000)
    })

    it('should accept all character types', () => {
      const types: CharacterType[] = ['歌', '舞', '巧']
      
      types.forEach(type => {
        const card: Card = {
          name: 'Test',
          shortCode: '[T]',
          characterName: 'Test',
          type,
          appeal: 5000,
        }
        
        expect(card.type).toBe(type)
      })
    })
  })

  describe('CenterCard type', () => {
    it('should extend Card with center bonus', () => {
      const centerCard: CenterCard = {
        name: 'Center Card',
        shortCode: '[CC]',
        characterName: 'Center Character',
        type: '歌',
        appeal: 12000,
        centerBonus: {
          boost: 0.15,
          characteristic: '歌',
        },
      }
      
      expect(centerCard.centerBonus).toBeDefined()
      expect(centerCard.centerBonus.boost).toBe(0.15)
      expect(centerCard.centerBonus.characteristic).toBe('歌')
    })

    it('should optionally have center skill', () => {
      const centerWithSkill: CenterCard = {
        name: 'Skilled Center',
        shortCode: '[SC]',
        characterName: 'Skilled Character',
        type: '舞',
        appeal: 11000,
        centerBonus: {
          boost: 0.12,
          characteristic: '舞',
        },
        centerSkill: {
          level: 5,
          effects: [
            {
              type: 'scoreGain',
              value: 1500,
            },
          ],
        },
      }
      
      expect(centerWithSkill.centerSkill).toBeDefined()
      expect(centerWithSkill.centerSkill?.level).toBe(5)
      expect(centerWithSkill.centerSkill?.effects).toHaveLength(1)
    })

    it('should accept different center bonus values', () => {
      const bonusValues = [0.09, 0.12, 0.15, 0.18]
      
      bonusValues.forEach(boost => {
        const card: CenterCard = {
          name: 'Test',
          shortCode: '[T]',
          characterName: 'Test',
          type: '巧',
          appeal: 10000,
          centerBonus: {
            boost,
            characteristic: '巧',
          },
        }
        
        expect(card.centerBonus.boost).toBe(boost)
      })
    })
  })

  describe('FormationCard type', () => {
    it('should extend Card with skill', () => {
      const formationCard: FormationCard = {
        name: 'Formation Card',
        shortCode: '[FC]',
        characterName: 'Formation Character',
        type: '巧',
        appeal: 9000,
        skill: {
          level: 7,
          effects: [
            {
              type: 'scoreGain',
              value: 2000,
            },
            {
              type: 'voltageGain',
              value: 100,
            },
          ],
        },
      }
      
      expect(formationCard.skill).toBeDefined()
      expect(formationCard.skill.level).toBe(7)
      expect(formationCard.skill.effects).toHaveLength(2)
    })

    it('should optionally have AP cost', () => {
      const cardWithAP: FormationCard = {
        name: 'AP Card',
        shortCode: '[AP]',
        characterName: 'AP Character',
        type: '歌',
        appeal: 8500,
        skill: {
          level: 10,
          ap: 30,
          effects: [
            {
              type: 'scoreBoost',
              value: 0.5,
              duration: 3,
            },
          ],
        },
      }
      
      expect(cardWithAP.skill.ap).toBe(30)
    })

    it('should handle skill levels from 1 to 14', () => {
      for (let level = 1; level <= 14; level++) {
        const card: FormationCard = {
          name: `Level ${level} Card`,
          shortCode: `[L${level}]`,
          characterName: 'Test',
          type: '舞',
          appeal: 7000 + level * 100,
          skill: {
            level,
            effects: [],
          },
        }
        
        expect(card.skill.level).toBe(level)
      }
    })

    it('should support complex skill effects', () => {
      const complexCard: FormationCard = {
        name: 'Complex Card',
        shortCode: '[CX]',
        characterName: 'Complex Character',
        type: '歌',
        appeal: 9500,
        skill: {
          level: 8,
          ap: 25,
          effects: [
            {
              type: 'conditional',
              condition: {
                type: 'voltage',
                threshold: 1000,
                comparison: 'gte',
              },
              successEffects: [
                {
                  type: 'scoreGain',
                  value: 5000,
                },
                {
                  type: 'voltageBoost',
                  value: 0.3,
                  duration: 2,
                },
              ],
              failureEffects: [
                {
                  type: 'voltageGain',
                  value: 200,
                },
              ],
            },
            {
              type: 'skipTurn',
              value: 1,
            },
          ],
        },
      }
      
      expect(complexCard.skill.effects).toHaveLength(2)
      
      const conditionalEffect = complexCard.skill.effects[0]
      if (conditionalEffect.type === 'conditional') {
        expect(conditionalEffect.condition.type).toBe('voltage')
        expect(conditionalEffect.condition.threshold).toBe(1000)
        expect(conditionalEffect.successEffects).toHaveLength(2)
        expect(conditionalEffect.failureEffects).toHaveLength(1)
      }
    })
  })

  describe('type safety', () => {
    it('should enforce correct effect types', () => {
      const card: FormationCard = {
        name: 'Type Safe Card',
        shortCode: '[TS]',
        characterName: 'Type Safe',
        type: '舞',
        appeal: 8000,
        skill: {
          level: 5,
          effects: [
            { type: 'scoreGain', value: 1000 },
            { type: 'voltageGain', value: 50 },
            { type: 'scoreBoost', value: 0.2, duration: 2 },
            { type: 'voltageBoost', value: 0.1, duration: 3 },
            { type: 'apGain', value: 10 },
            { type: 'apReduction', value: 5 },
            { type: 'skipTurn', value: 1 },
          ],
        },
      }
      
      // All effect types should be valid
      card.skill.effects.forEach(effect => {
        expect([
          'scoreGain',
          'voltageGain',
          'scoreBoost',
          'voltageBoost',
          'apGain',
          'apReduction',
          'skipTurn',
          'conditional',
        ]).toContain(effect.type)
      })
    })

    it('should enforce condition types', () => {
      const conditions = [
        { type: 'voltage', threshold: 500, comparison: 'gte' },
        { type: 'voltage', threshold: 1000, comparison: 'lt' },
        { type: 'turn', threshold: 10, comparison: 'eq' },
        { type: 'phase', value: 'fever' },
        { type: 'phase', value: 'beforeFever' },
        { type: 'phase', value: 'afterFever' },
      ] as const
      
      conditions.forEach(condition => {
        const card: FormationCard = {
          name: 'Conditional',
          shortCode: '[C]',
          characterName: 'Test',
          type: '巧',
          appeal: 7500,
          skill: {
            level: 6,
            effects: [
              {
                type: 'conditional',
                condition: condition as any,
                successEffects: [],
                failureEffects: [],
              },
            ],
          },
        }
        
        const effect = card.skill.effects[0]
        if (effect.type === 'conditional') {
          expect(effect.condition).toBeDefined()
        }
      })
    })
  })
})