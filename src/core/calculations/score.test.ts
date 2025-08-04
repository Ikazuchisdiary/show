import { describe, it, expect } from 'vitest'
import { calculateScore, calculateSkillInvocationMultiplier } from './score'

describe('Score Calculations', () => {
  describe('calculateScore', () => {
    it('should calculate basic score correctly', () => {
      const score = calculateScore(
        1.0, // baseMultiplier
        10000, // appeal
        0, // scoreBoost
        0, // voltageLevel
        1.0, // learningCorrection
      )
      expect(score).toBe(10000)
    })

    it('should apply score boost correctly', () => {
      const score = calculateScore(
        1.0, // baseMultiplier
        10000, // appeal
        0.5, // scoreBoost (50%)
        0, // voltageLevel
        1.0, // learningCorrection
      )
      expect(score).toBe(15000)
    })

    it('should apply voltage multiplier correctly', () => {
      const score = calculateScore(
        1.0, // baseMultiplier
        10000, // appeal
        0, // scoreBoost
        10, // voltageLevel (100% boost)
        1.0, // learningCorrection
      )
      expect(score).toBe(20000)
    })

    it('should apply all multipliers correctly', () => {
      const score = calculateScore(
        2.0, // baseMultiplier
        10000, // appeal
        0.5, // scoreBoost (50%)
        10, // voltageLevel (100% boost)
        1.2, // learningCorrection
      )
      // 10000 * 2.0 * 1.5 * 2.0 * 1.2 = 72000
      expect(score).toBe(72000)
    })

    it('should floor the result', () => {
      const score = calculateScore(
        1.0, // baseMultiplier
        10001, // appeal
        0.111, // scoreBoost
        0, // voltageLevel
        1.0, // learningCorrection
      )
      // 10001 * 1.111 = 11111.111...
      expect(score).toBe(11111)
    })
  })

  describe('calculateSkillInvocationMultiplier', () => {
    it('should calculate skill invocation multiplier correctly', () => {
      expect(calculateSkillInvocationMultiplier(1.0, 0)).toBe(1.0)
      expect(calculateSkillInvocationMultiplier(2.0, 0)).toBe(2.0)
      expect(calculateSkillInvocationMultiplier(1.0, 0.5)).toBe(1.5)
      expect(calculateSkillInvocationMultiplier(2.0, 0.5)).toBe(3.0)
      expect(calculateSkillInvocationMultiplier(3.0, 1.0)).toBe(6.0)
    })
  })
})
