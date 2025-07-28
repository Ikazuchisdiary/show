import { describe, it, expect } from 'vitest'
import { formatSkillValue } from './skillValueRounding'

describe('skillValueRounding', () => {
  describe('formatSkillValue', () => {
    it('should format integer values without decimals', () => {
      expect(formatSkillValue(100)).toBe('100')
      expect(formatSkillValue(1000)).toBe('1000')
      expect(formatSkillValue(999)).toBe('999')
      expect(formatSkillValue(0)).toBe('0')
    })

    it('should truncate decimal values to 4 places without rounding', () => {
      expect(formatSkillValue(100.12345)).toBe('100.1234')
      expect(formatSkillValue(100.99999)).toBe('100.9999')
      expect(formatSkillValue(0.12345678)).toBe('0.1234')
    })

    it('should remove trailing zeros from decimals', () => {
      expect(formatSkillValue(100.1000)).toBe('100.1')
      expect(formatSkillValue(100.1200)).toBe('100.12')
      expect(formatSkillValue(100.0000)).toBe('100')
      expect(formatSkillValue(0.0100)).toBe('0.01')
    })

    it('should handle edge cases', () => {
      expect(formatSkillValue(0.0001)).toBe('0.0001')
      expect(formatSkillValue(0.00001)).toBe('0')
      expect(formatSkillValue(999999.9999)).toBe('999999.9999')
    })

    it('should handle negative values', () => {
      expect(formatSkillValue(-100)).toBe('-100')
      expect(formatSkillValue(-100.1234)).toBe('-100.1234')
      expect(formatSkillValue(-0.0001)).toBe('-0.0001')
    })

    it('should handle very small decimals', () => {
      expect(formatSkillValue(0.0000999)).toBe('0')
      expect(formatSkillValue(0.0001999)).toBe('0.0001')
    })

    it('should match v1 behavior for specific test cases', () => {
      // Test cases from v1 implementation
      expect(formatSkillValue(166.66666666666666)).toBe('166.6666')
      expect(formatSkillValue(833.3333333333334)).toBe('833.3333')
      expect(formatSkillValue(1666.6666666666667)).toBe('1666.6666')
      expect(formatSkillValue(2500)).toBe('2500')
    })
  })
})