import { describe, it, expect } from 'vitest'
import type { Music } from './Music'

describe('Music model', () => {
  describe('Music type', () => {
    it('should have all required properties', () => {
      const music: Music = {
        id: 'test-music',
        name: 'Test Music',
        difficulty: 'expert',
        startBonus: 3000,
        feverStart: 10,
        feverEnd: 20,
        totalTurns: 30,
        targetScore: 100000,
        comboBonus: 0.1,
        actualComboCount: 100,
      }
      
      expect(music.id).toBe('test-music')
      expect(music.name).toBe('Test Music')
      expect(music.difficulty).toBe('expert')
      expect(music.startBonus).toBe(3000)
      expect(music.feverStart).toBe(10)
      expect(music.feverEnd).toBe(20)
      expect(music.totalTurns).toBe(30)
      expect(music.targetScore).toBe(100000)
      expect(music.comboBonus).toBe(0.1)
      expect(music.actualComboCount).toBe(100)
    })

    it('should accept all difficulty levels', () => {
      const difficulties: Array<'easy' | 'normal' | 'hard' | 'expert' | 'master'> = [
        'easy',
        'normal',
        'hard',
        'expert',
        'master',
      ]
      
      difficulties.forEach(difficulty => {
        const music: Music = {
          id: `${difficulty}-music`,
          name: `${difficulty} Music`,
          difficulty,
          startBonus: 2000,
          feverStart: 8,
          feverEnd: 16,
          totalTurns: 25,
          targetScore: 80000,
          comboBonus: 0.08,
          actualComboCount: 80,
        }
        
        expect(music.difficulty).toBe(difficulty)
      })
    })

    it('should handle different fever configurations', () => {
      // Early fever
      const earlyFever: Music = {
        id: 'early-fever',
        name: 'Early Fever Music',
        difficulty: 'hard',
        startBonus: 2500,
        feverStart: 5,
        feverEnd: 15,
        totalTurns: 30,
        targetScore: 90000,
        comboBonus: 0.09,
        actualComboCount: 90,
      }
      
      expect(earlyFever.feverStart).toBe(5)
      expect(earlyFever.feverEnd).toBe(15)
      expect(earlyFever.feverEnd - earlyFever.feverStart).toBe(10)
      
      // Late fever
      const lateFever: Music = {
        id: 'late-fever',
        name: 'Late Fever Music',
        difficulty: 'expert',
        startBonus: 3500,
        feverStart: 20,
        feverEnd: 30,
        totalTurns: 35,
        targetScore: 120000,
        comboBonus: 0.12,
        actualComboCount: 110,
      }
      
      expect(lateFever.feverStart).toBe(20)
      expect(lateFever.feverEnd).toBe(30)
      
      // Long fever
      const longFever: Music = {
        id: 'long-fever',
        name: 'Long Fever Music',
        difficulty: 'master',
        startBonus: 4000,
        feverStart: 10,
        feverEnd: 30,
        totalTurns: 40,
        targetScore: 150000,
        comboBonus: 0.15,
        actualComboCount: 130,
      }
      
      expect(longFever.feverEnd - longFever.feverStart).toBe(20)
    })

    it('should handle various start bonuses', () => {
      const bonuses = [1000, 2000, 3000, 4000, 5000]
      
      bonuses.forEach(startBonus => {
        const music: Music = {
          id: `bonus-${startBonus}`,
          name: `${startBonus} Bonus Music`,
          difficulty: 'normal',
          startBonus,
          feverStart: 10,
          feverEnd: 20,
          totalTurns: 30,
          targetScore: 50000 + startBonus * 10,
          comboBonus: 0.1,
          actualComboCount: 100,
        }
        
        expect(music.startBonus).toBe(startBonus)
      })
    })

    it('should handle different combo configurations', () => {
      // Low combo count
      const lowCombo: Music = {
        id: 'low-combo',
        name: 'Low Combo Music',
        difficulty: 'easy',
        startBonus: 1500,
        feverStart: 8,
        feverEnd: 12,
        totalTurns: 20,
        targetScore: 50000,
        comboBonus: 0.05,
        actualComboCount: 50,
      }
      
      expect(lowCombo.comboBonus).toBe(0.05)
      expect(lowCombo.actualComboCount).toBe(50)
      
      // High combo count
      const highCombo: Music = {
        id: 'high-combo',
        name: 'High Combo Music',
        difficulty: 'master',
        startBonus: 5000,
        feverStart: 15,
        feverEnd: 35,
        totalTurns: 50,
        targetScore: 200000,
        comboBonus: 0.2,
        actualComboCount: 200,
      }
      
      expect(highCombo.comboBonus).toBe(0.2)
      expect(highCombo.actualComboCount).toBe(200)
    })

    it('should handle different target scores', () => {
      const targets = [50000, 75000, 100000, 150000, 200000, 300000]
      
      targets.forEach(targetScore => {
        const music: Music = {
          id: `target-${targetScore}`,
          name: `Target ${targetScore} Music`,
          difficulty: 'expert',
          startBonus: Math.floor(targetScore * 0.03),
          feverStart: 10,
          feverEnd: 20,
          totalTurns: 30,
          targetScore,
          comboBonus: 0.1,
          actualComboCount: 100,
        }
        
        expect(music.targetScore).toBe(targetScore)
      })
    })

    it('should validate fever timing constraints', () => {
      const music: Music = {
        id: 'valid-music',
        name: 'Valid Music',
        difficulty: 'normal',
        startBonus: 2000,
        feverStart: 10,
        feverEnd: 20,
        totalTurns: 30,
        targetScore: 80000,
        comboBonus: 0.08,
        actualComboCount: 80,
      }
      
      // Fever should start before it ends
      expect(music.feverStart).toBeLessThan(music.feverEnd)
      
      // Fever should end before or at total turns
      expect(music.feverEnd).toBeLessThanOrEqual(music.totalTurns)
      
      // Fever start should be positive
      expect(music.feverStart).toBeGreaterThan(0)
    })

    it('should handle custom music IDs', () => {
      const customMusic: Music = {
        id: 'custom_1234567890',
        name: 'Custom User Music',
        difficulty: 'expert',
        startBonus: 3500,
        feverStart: 12,
        feverEnd: 22,
        totalTurns: 35,
        targetScore: 110000,
        comboBonus: 0.11,
        actualComboCount: 105,
      }
      
      expect(customMusic.id).toMatch(/^custom_/)
      expect(customMusic.id).toBe('custom_1234567890')
    })

    it('should handle decimal combo bonus values', () => {
      const music: Music = {
        id: 'decimal-combo',
        name: 'Decimal Combo Music',
        difficulty: 'hard',
        startBonus: 2750,
        feverStart: 11,
        feverEnd: 21,
        totalTurns: 32,
        targetScore: 95000,
        comboBonus: 0.095,
        actualComboCount: 95,
      }
      
      expect(music.comboBonus).toBe(0.095)
      expect(music.comboBonus).toBeGreaterThan(0)
      expect(music.comboBonus).toBeLessThan(1)
    })
  })

  describe('Music calculations', () => {
    it('should calculate fever duration', () => {
      const music: Music = {
        id: 'fever-calc',
        name: 'Fever Calculation',
        difficulty: 'expert',
        startBonus: 3000,
        feverStart: 10,
        feverEnd: 25,
        totalTurns: 40,
        targetScore: 100000,
        comboBonus: 0.1,
        actualComboCount: 100,
      }
      
      const feverDuration = music.feverEnd - music.feverStart
      expect(feverDuration).toBe(15)
    })

    it('should calculate turns before fever', () => {
      const music: Music = {
        id: 'before-fever',
        name: 'Before Fever Calc',
        difficulty: 'normal',
        startBonus: 2000,
        feverStart: 12,
        feverEnd: 20,
        totalTurns: 30,
        targetScore: 70000,
        comboBonus: 0.07,
        actualComboCount: 70,
      }
      
      const turnsBeforeFever = music.feverStart - 1
      expect(turnsBeforeFever).toBe(11)
    })

    it('should calculate turns after fever', () => {
      const music: Music = {
        id: 'after-fever',
        name: 'After Fever Calc',
        difficulty: 'hard',
        startBonus: 2500,
        feverStart: 10,
        feverEnd: 20,
        totalTurns: 35,
        targetScore: 85000,
        comboBonus: 0.085,
        actualComboCount: 85,
      }
      
      const turnsAfterFever = music.totalTurns - music.feverEnd
      expect(turnsAfterFever).toBe(15)
    })
  })
})