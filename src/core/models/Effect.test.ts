import { describe, it, expect } from 'vitest'
import { Effect, ConditionalEffect, RemoveAfterUseEffect } from './Effect'

describe('Effect Model', () => {
  describe('Basic Effects', () => {
    it('should create a score gain effect', () => {
      const effect: Effect = {
        type: 'scoreGain',
        value: 1000,
      }

      expect(effect.type).toBe('scoreGain')
      expect(effect.value).toBe(1000)
    })

    it('should create a voltage boost effect', () => {
      const effect: Effect = {
        type: 'voltageBoost',
        value: 50,
      }

      expect(effect.type).toBe('voltageBoost')
      expect(effect.value).toBe(50)
    })

    it('should create an appeal boost effect', () => {
      const effect: Effect = {
        type: 'appealBoost',
        value: 0.15,
        target: 'all',
      }

      expect(effect.type).toBe('appealBoost')
      expect(effect.value).toBe(0.15)
      expect(effect.target).toBe('all')
    })
  })

  describe('Conditional Effects', () => {
    it('should create a conditional effect', () => {
      const effect: ConditionalEffect = {
        type: 'conditional',
        condition: 'voltage >= 1000',
        then: [
          {
            type: 'scoreGain',
            value: 3000,
          },
        ],
        else: [
          {
            type: 'scoreGain',
            value: 1000,
          },
        ],
      }

      expect(effect.type).toBe('conditional')
      expect(effect.condition).toBe('voltage >= 1000')
      expect(effect.then).toHaveLength(1)
      expect(effect.else).toHaveLength(1)
    })
  })

  describe('Remove After Use Effects', () => {
    it('should create a remove after use effect', () => {
      const effect: RemoveAfterUseEffect = {
        type: 'removeAfterUse',
        condition: 'turn > 5',
      }

      expect(effect.type).toBe('removeAfterUse')
      expect(effect.condition).toBe('turn > 5')
    })
  })
})
