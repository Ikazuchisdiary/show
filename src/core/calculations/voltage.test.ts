import { describe, it, expect } from 'vitest'
import { getVoltageLevel, getVoltageMultiplier } from './voltage'
import { Music } from '../models/Music'

describe('Voltage Calculations', () => {
  const mockMusic: Music = {
    name: 'Test Music',
    phases: [10, 5, 10], // beforeFever: 10, duringFever: 5, afterFever: 10
    attribute: 'smile',
  }

  describe('getVoltageLevel', () => {
    it('should return 0 for voltage < 10', () => {
      expect(getVoltageLevel(5, 0, mockMusic)).toBe(0)
      expect(getVoltageLevel(9, 0, mockMusic)).toBe(0)
    })

    it('should calculate correct level for voltage < 1900', () => {
      expect(getVoltageLevel(10, 0, mockMusic)).toBe(1)
      expect(getVoltageLevel(30, 0, mockMusic)).toBe(2)
      expect(getVoltageLevel(100, 0, mockMusic)).toBe(4)
      expect(getVoltageLevel(550, 0, mockMusic)).toBe(10)
      expect(getVoltageLevel(1899, 0, mockMusic)).toBe(18)
    })

    it('should calculate correct level for voltage >= 1900', () => {
      expect(getVoltageLevel(1900, 0, mockMusic)).toBe(19)
      expect(getVoltageLevel(2100, 0, mockMusic)).toBe(20)
      expect(getVoltageLevel(2300, 0, mockMusic)).toBe(21)
      expect(getVoltageLevel(3900, 0, mockMusic)).toBe(29)
    })

    it('should double level during fever', () => {
      // Turn 10-14 is fever phase
      expect(getVoltageLevel(100, 10, mockMusic)).toBe(8) // 4 * 2
      expect(getVoltageLevel(550, 12, mockMusic)).toBe(20) // 10 * 2
      expect(getVoltageLevel(1900, 14, mockMusic)).toBe(38) // 19 * 2
    })

    it('should not double level outside fever', () => {
      // Before fever
      expect(getVoltageLevel(100, 0, mockMusic)).toBe(4)
      expect(getVoltageLevel(100, 9, mockMusic)).toBe(4)

      // After fever
      expect(getVoltageLevel(100, 15, mockMusic)).toBe(4)
      expect(getVoltageLevel(100, 24, mockMusic)).toBe(4)
    })

    it('should handle null music', () => {
      expect(getVoltageLevel(100, 10, null)).toBe(4)
      expect(getVoltageLevel(1900, 10, null)).toBe(19)
    })
  })

  describe('getVoltageMultiplier', () => {
    it('should calculate correct multiplier', () => {
      expect(getVoltageMultiplier(0)).toBe(1.0)
      expect(getVoltageMultiplier(10)).toBe(2.0)
      expect(getVoltageMultiplier(20)).toBe(3.0)
      expect(getVoltageMultiplier(15)).toBe(2.5)
    })
  })
})
