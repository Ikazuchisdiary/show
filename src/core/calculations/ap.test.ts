import { describe, it, expect } from 'vitest'
import { calculateBaseAP, calculateAPGain } from './ap'

describe('AP Calculations', () => {
  describe('calculateBaseAP', () => {
    it('should calculate base AP with 100% initial mental', () => {
      const result = calculateBaseAP(100, 100)
      expect(result).toBeCloseTo(81.3, 2)
    })

    it('should calculate base AP with 50% initial mental', () => {
      const result = calculateBaseAP(100, 50)
      expect(result).toBeCloseTo(71.4, 2)
    })

    it('should calculate base AP with different combo counts', () => {
      const result1 = calculateBaseAP(50, 100)
      const result2 = calculateBaseAP(150, 100)

      expect(result1).toBeCloseTo(72.6, 2)
      expect(result2).toBeCloseTo(84.2, 2)
    })

    it('should handle edge cases', () => {
      const result = calculateBaseAP(200, 0)
      expect(result).toBeGreaterThan(0)
    })
  })

  describe('calculateAPGain', () => {
    it('should apply 1.5x multiplier', () => {
      const baseAP = 100
      const result = calculateAPGain(baseAP)
      expect(result).toBe(150)
    })

    it('should round to 2 decimal places', () => {
      const baseAP = 66.666
      const result = calculateAPGain(baseAP)
      expect(result).toBe(100)
    })
  })
})
