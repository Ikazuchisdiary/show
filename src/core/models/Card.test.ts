import { describe, it, expect } from 'vitest'
import { Card } from './Card'

describe('Card Model', () => {
  it('should create a card with all properties', () => {
    const card: Card = {
      name: 'Test Card',
      displayName: 'Test Card Display',
      character: 'Test Character',
      shortCode: '[TC]',
      apCost: 20,
      stats: {
        smile: 5000,
        pure: 4000,
        cool: 3000,
        mental: 100,
      },
      effects: [
        {
          type: 'scoreGain',
          value: 1000,
        },
      ],
    }

    expect(card.name).toBe('Test Card')
    expect(card.displayName).toBe('Test Card Display')
    expect(card.character).toBe('Test Character')
    expect(card.shortCode).toBe('[TC]')
    expect(card.apCost).toBe(20)
    expect(card.stats.smile).toBe(5000)
    expect(card.stats.pure).toBe(4000)
    expect(card.stats.cool).toBe(3000)
    expect(card.effects).toHaveLength(1)
    expect(card.effects[0].type).toBe('scoreGain')
  })

  it('should handle optional properties', () => {
    const card: Card = {
      name: 'Center Card',
      displayName: 'Center Card Display',
      character: 'Center Character',
      shortCode: '[CC]',
      apCost: 0,
      stats: {
        smile: 6000,
        pure: 5000,
        cool: 4000,
        mental: 100,
      },
      effects: [],
      centerCharacteristic: {
        name: 'スマイル',
        effects: [
          {
            type: 'appealBoost',
            value: 0.15,
            target: 'all',
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
    }

    expect(card.centerCharacteristic).toBeDefined()
    expect(card.centerCharacteristic!.name).toBe('スマイル')
    expect(card.centerSkill).toBeDefined()
    expect(card.centerSkill!.when).toBe('beforeFirstTurn')
  })
})