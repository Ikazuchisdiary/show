import { describe, it, expect } from 'vitest'
import type {
  Effect,
  ScoreGainEffect,
  VoltageGainEffect,
  ScoreBoostEffect,
  VoltageBoostEffect,
  APGainEffect,
  APReductionEffect,
  SkipTurnEffect,
  ConditionalEffect,
  Condition,
} from './Effect'

describe('Effect models', () => {
  describe('ScoreGainEffect', () => {
    it('should have correct structure', () => {
      const effect: ScoreGainEffect = {
        type: 'scoreGain',
        value: 1500,
      }
      
      expect(effect.type).toBe('scoreGain')
      expect(effect.value).toBe(1500)
    })

    it('should accept different values', () => {
      const values = [100, 500, 1000, 2500, 5000, 10000]
      
      values.forEach(value => {
        const effect: ScoreGainEffect = {
          type: 'scoreGain',
          value,
        }
        expect(effect.value).toBe(value)
      })
    })
  })

  describe('VoltageGainEffect', () => {
    it('should have correct structure', () => {
      const effect: VoltageGainEffect = {
        type: 'voltageGain',
        value: 75,
      }
      
      expect(effect.type).toBe('voltageGain')
      expect(effect.value).toBe(75)
    })
  })

  describe('ScoreBoostEffect', () => {
    it('should have duration property', () => {
      const effect: ScoreBoostEffect = {
        type: 'scoreBoost',
        value: 0.3,
        duration: 3,
      }
      
      expect(effect.type).toBe('scoreBoost')
      expect(effect.value).toBe(0.3)
      expect(effect.duration).toBe(3)
    })

    it('should accept decimal boost values', () => {
      const boosts = [0.1, 0.2, 0.3, 0.5, 0.75, 1.0]
      
      boosts.forEach(value => {
        const effect: ScoreBoostEffect = {
          type: 'scoreBoost',
          value,
          duration: 2,
        }
        expect(effect.value).toBe(value)
      })
    })
  })

  describe('VoltageBoostEffect', () => {
    it('should have duration property', () => {
      const effect: VoltageBoostEffect = {
        type: 'voltageBoost',
        value: 0.2,
        duration: 4,
      }
      
      expect(effect.type).toBe('voltageBoost')
      expect(effect.value).toBe(0.2)
      expect(effect.duration).toBe(4)
    })
  })

  describe('APGainEffect', () => {
    it('should have correct structure', () => {
      const effect: APGainEffect = {
        type: 'apGain',
        value: 15,
      }
      
      expect(effect.type).toBe('apGain')
      expect(effect.value).toBe(15)
    })
  })

  describe('APReductionEffect', () => {
    it('should have correct structure', () => {
      const effect: APReductionEffect = {
        type: 'apReduction',
        value: 10,
      }
      
      expect(effect.type).toBe('apReduction')
      expect(effect.value).toBe(10)
    })
  })

  describe('SkipTurnEffect', () => {
    it('should have correct structure', () => {
      const effect: SkipTurnEffect = {
        type: 'skipTurn',
        value: 1,
      }
      
      expect(effect.type).toBe('skipTurn')
      expect(effect.value).toBe(1)
    })

    it('should handle multiple turn skips', () => {
      const effect: SkipTurnEffect = {
        type: 'skipTurn',
        value: 2,
      }
      
      expect(effect.value).toBe(2)
    })
  })

  describe('ConditionalEffect', () => {
    it('should have voltage condition', () => {
      const effect: ConditionalEffect = {
        type: 'conditional',
        condition: {
          type: 'voltage',
          threshold: 1000,
          comparison: 'gte',
        },
        successEffects: [
          { type: 'scoreGain', value: 3000 },
        ],
        failureEffects: [
          { type: 'scoreGain', value: 1000 },
        ],
      }
      
      expect(effect.type).toBe('conditional')
      expect(effect.condition.type).toBe('voltage')
      if (effect.condition.type === 'voltage') {
        expect(effect.condition.threshold).toBe(1000)
        expect(effect.condition.comparison).toBe('gte')
      }
    })

    it('should have turn condition', () => {
      const effect: ConditionalEffect = {
        type: 'conditional',
        condition: {
          type: 'turn',
          threshold: 15,
          comparison: 'lt',
        },
        successEffects: [
          { type: 'voltageGain', value: 100 },
        ],
        failureEffects: [],
      }
      
      expect(effect.condition.type).toBe('turn')
      if (effect.condition.type === 'turn') {
        expect(effect.condition.threshold).toBe(15)
        expect(effect.condition.comparison).toBe('lt')
      }
    })

    it('should have phase condition', () => {
      const phases: Array<'beforeFever' | 'fever' | 'afterFever'> = [
        'beforeFever',
        'fever',
        'afterFever',
      ]
      
      phases.forEach(phase => {
        const effect: ConditionalEffect = {
          type: 'conditional',
          condition: {
            type: 'phase',
            value: phase,
          },
          successEffects: [
            { type: 'scoreBoost', value: 0.5, duration: 2 },
          ],
          failureEffects: [
            { type: 'voltageBoost', value: 0.2, duration: 2 },
          ],
        }
        
        expect(effect.condition.type).toBe('phase')
        if (effect.condition.type === 'phase') {
          expect(effect.condition.value).toBe(phase)
        }
      })
    })

    it('should support all comparison operators', () => {
      const comparisons: Array<'gte' | 'gt' | 'lte' | 'lt' | 'eq'> = [
        'gte',
        'gt',
        'lte',
        'lt',
        'eq',
      ]
      
      comparisons.forEach(comparison => {
        const effect: ConditionalEffect = {
          type: 'conditional',
          condition: {
            type: 'voltage',
            threshold: 500,
            comparison,
          },
          successEffects: [],
          failureEffects: [],
        }
        
        if (effect.condition.type === 'voltage') {
          expect(effect.condition.comparison).toBe(comparison)
        }
      })
    })

    it('should allow nested effects', () => {
      const effect: ConditionalEffect = {
        type: 'conditional',
        condition: {
          type: 'phase',
          value: 'fever',
        },
        successEffects: [
          { type: 'scoreGain', value: 2000 },
          { type: 'voltageGain', value: 150 },
          { type: 'scoreBoost', value: 0.3, duration: 3 },
          { type: 'apGain', value: 20 },
        ],
        failureEffects: [
          { type: 'scoreGain', value: 1000 },
          { type: 'voltageGain', value: 50 },
        ],
      }
      
      expect(effect.successEffects).toHaveLength(4)
      expect(effect.failureEffects).toHaveLength(2)
    })

    it('should allow empty failure effects', () => {
      const effect: ConditionalEffect = {
        type: 'conditional',
        condition: {
          type: 'voltage',
          threshold: 2000,
          comparison: 'gte',
        },
        successEffects: [
          { type: 'scoreGain', value: 5000 },
        ],
        failureEffects: [],
      }
      
      expect(effect.failureEffects).toHaveLength(0)
    })
  })

  describe('Effect union type', () => {
    it('should accept all effect types', () => {
      const effects: Effect[] = [
        { type: 'scoreGain', value: 1000 },
        { type: 'voltageGain', value: 50 },
        { type: 'scoreBoost', value: 0.2, duration: 2 },
        { type: 'voltageBoost', value: 0.1, duration: 3 },
        { type: 'apGain', value: 10 },
        { type: 'apReduction', value: 5 },
        { type: 'skipTurn', value: 1 },
        {
          type: 'conditional',
          condition: { type: 'phase', value: 'fever' },
          successEffects: [],
          failureEffects: [],
        },
      ]
      
      effects.forEach(effect => {
        expect(effect.type).toBeDefined()
      })
    })
  })

  describe('Condition types', () => {
    it('should validate voltage conditions', () => {
      const condition: Condition = {
        type: 'voltage',
        threshold: 750,
        comparison: 'gte',
      }
      
      expect(condition.type).toBe('voltage')
      if (condition.type === 'voltage') {
        expect(condition.threshold).toBe(750)
        expect(condition.comparison).toBe('gte')
      }
    })

    it('should validate turn conditions', () => {
      const condition: Condition = {
        type: 'turn',
        threshold: 20,
        comparison: 'eq',
      }
      
      expect(condition.type).toBe('turn')
      if (condition.type === 'turn') {
        expect(condition.threshold).toBe(20)
        expect(condition.comparison).toBe('eq')
      }
    })

    it('should validate phase conditions', () => {
      const condition: Condition = {
        type: 'phase',
        value: 'afterFever',
      }
      
      expect(condition.type).toBe('phase')
      if (condition.type === 'phase') {
        expect(condition.value).toBe('afterFever')
      }
    })
  })
})