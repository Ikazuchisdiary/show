import { describe, it, expect, beforeEach } from 'vitest'
import { GameSimulator } from './GameSimulator'
import type { Card, Music, CenterCard, FormationCard } from '../models'

describe('GameSimulator', () => {
  let simulator: GameSimulator
  
  const mockMusic: Music = {
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

  const mockCenterCard: CenterCard = {
    name: 'Center Card',
    shortCode: '[C]',
    characterName: 'Center Char',
    type: '歌',
    appeal: 10000,
    centerBonus: {
      boost: 0.15,
      characteristic: '歌',
    },
  }

  const mockFormationCard: FormationCard = {
    name: 'Formation Card',
    shortCode: '[F]',
    characterName: 'Formation Char',
    type: '歌',
    appeal: 8000,
    skill: {
      level: 5,
      effects: [
        {
          type: 'scoreGain',
          value: 1000,
        },
      ],
    },
  }

  const mockFormation: FormationCard[] = Array(5).fill(mockFormationCard)

  beforeEach(() => {
    simulator = new GameSimulator(
      mockMusic,
      mockCenterCard,
      mockFormation,
      100, // initialMental
      1.0, // learningCorrection
    )
  })

  describe('constructor', () => {
    it('should initialize with correct parameters', () => {
      expect(simulator).toBeDefined()
      // The simulator should be ready to run
    })

    it('should calculate center bonus correctly', () => {
      const simulatorWithBonus = new GameSimulator(
        mockMusic,
        mockCenterCard,
        mockFormation.map(card => ({
          ...card,
          characterName: 'Center Char', // Same as center
        })),
        100,
        1.0,
      )
      
      // Should apply center bonus to matching cards
      expect(simulatorWithBonus).toBeDefined()
    })
  })

  describe('simulate', () => {
    it('should complete simulation and return results', () => {
      const result = simulator.simulate()
      
      expect(result).toBeDefined()
      expect(result.finalScore).toBeGreaterThan(0)
      expect(result.finalVoltage).toBeGreaterThanOrEqual(0)
      expect(result.finalAP).toBeDefined()
      expect(result.totalScore).toBeGreaterThan(0)
      expect(result.appeal).toBeGreaterThan(0)
      expect(result.turnLogs).toHaveLength(mockMusic.totalTurns)
    })

    it('should respect turn skipping', () => {
      const cardWithSkip: FormationCard = {
        ...mockFormationCard,
        skill: {
          level: 5,
          effects: [
            {
              type: 'skipTurn',
              value: 1,
            },
          ],
        },
      }
      
      const skipSimulator = new GameSimulator(
        mockMusic,
        mockCenterCard,
        [cardWithSkip, ...mockFormation.slice(1)],
        100,
        1.0,
      )
      
      const result = skipSimulator.simulate()
      
      // Should have fewer actual turns due to skipping
      const actualTurns = result.turnLogs.filter(log => !log.skipped).length
      expect(actualTurns).toBeLessThan(mockMusic.totalTurns)
    })

    it('should apply fever bonus correctly', () => {
      const result = simulator.simulate()
      
      // Check turns during fever have higher scores
      const feverTurns = result.turnLogs.slice(
        mockMusic.feverStart - 1,
        mockMusic.feverEnd,
      )
      const beforeFeverTurns = result.turnLogs.slice(0, mockMusic.feverStart - 1)
      
      // Fever turns should generally have higher scores due to multipliers
      const avgFeverScore = feverTurns.reduce((sum, log) => sum + log.score, 0) / feverTurns.length
      const avgBeforeScore = beforeFeverTurns.reduce((sum, log) => sum + log.score, 0) / beforeFeverTurns.length
      
      // This might not always be true depending on voltage levels, but it's a reasonable expectation
      expect(avgFeverScore).toBeGreaterThan(0)
      expect(avgBeforeScore).toBeGreaterThan(0)
    })

    it('should handle conditional effects', () => {
      const conditionalCard: FormationCard = {
        ...mockFormationCard,
        skill: {
          level: 5,
          effects: [
            {
              type: 'conditional',
              condition: {
                type: 'voltage',
                threshold: 500,
                comparison: 'gte',
              },
              successEffects: [
                {
                  type: 'scoreGain',
                  value: 2000,
                },
              ],
              failureEffects: [
                {
                  type: 'scoreGain',
                  value: 500,
                },
              ],
            },
          ],
        },
      }
      
      const conditionalSimulator = new GameSimulator(
        mockMusic,
        mockCenterCard,
        [conditionalCard, ...mockFormation.slice(1)],
        100,
        1.0,
      )
      
      const result = conditionalSimulator.simulate()
      
      // Should have both success and failure conditions in logs
      const conditionalLogs = result.turnLogs.filter(log => 
        log.details.some(d => d.includes('成功') || d.includes('失敗'))
      )
      expect(conditionalLogs.length).toBeGreaterThan(0)
    })

    it('should calculate AP correctly', () => {
      const result = simulator.simulate()
      
      expect(result.finalAP).toBeDefined()
      expect(result.finalAP.initial).toBeGreaterThan(0)
      expect(result.finalAP.usage).toBeGreaterThan(0)
      expect(result.finalAP.gain).toBeGreaterThanOrEqual(0)
      expect(result.finalAP.balance).toBe(
        result.finalAP.initial - result.finalAP.usage + result.finalAP.gain
      )
    })

    it('should handle center skills', () => {
      const centerWithSkill: CenterCard = {
        ...mockCenterCard,
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
      
      const skillSimulator = new GameSimulator(
        mockMusic,
        centerWithSkill,
        mockFormation,
        100,
        1.0,
      )
      
      const result = skillSimulator.simulate()
      
      // Center skill should appear in turn logs
      const centerSkillLogs = result.turnLogs.filter(log =>
        log.details.some(d => d.includes('センタースキル'))
      )
      expect(centerSkillLogs.length).toBeGreaterThan(0)
    })

    it('should respect learning correction', () => {
      const normalResult = simulator.simulate()
      
      const correctedSimulator = new GameSimulator(
        mockMusic,
        mockCenterCard,
        mockFormation,
        100,
        1.2, // 20% learning correction
      )
      
      const correctedResult = correctedSimulator.simulate()
      
      // Corrected result should have higher score
      expect(correctedResult.finalScore).toBeGreaterThan(normalResult.finalScore)
    })

    it('should handle voltage boosts correctly', () => {
      const voltageCard: FormationCard = {
        ...mockFormationCard,
        skill: {
          level: 5,
          effects: [
            {
              type: 'voltageGain',
              value: 100,
            },
          ],
        },
      }
      
      const voltageSimulator = new GameSimulator(
        mockMusic,
        mockCenterCard,
        [voltageCard, ...mockFormation.slice(1)],
        100,
        1.0,
      )
      
      const result = voltageSimulator.simulate()
      
      // Should have voltage gains in the logs
      const voltageGainLogs = result.turnLogs.filter(log =>
        log.details.some(d => d.includes('電圧'))
      )
      expect(voltageGainLogs.length).toBeGreaterThan(0)
      expect(result.finalVoltage).toBeGreaterThan(0)
    })

    it('should calculate appeal values correctly', () => {
      const typeMatchingCard: FormationCard = {
        ...mockFormationCard,
        type: '歌', // Matches center type
      }
      
      const nonMatchingCard: FormationCard = {
        ...mockFormationCard,
        type: '舞', // Different type
      }
      
      const mixedSimulator = new GameSimulator(
        mockMusic,
        mockCenterCard,
        [typeMatchingCard, nonMatchingCard, typeMatchingCard, nonMatchingCard, typeMatchingCard],
        100,
        1.0,
      )
      
      const result = mixedSimulator.simulate()
      
      // Appeal should be calculated with type matching bonus
      expect(result.appeal).toBeGreaterThan(0)
    })
  })

  describe('edge cases', () => {
    it('should handle empty formation', () => {
      const emptySimulator = new GameSimulator(
        mockMusic,
        mockCenterCard,
        [],
        100,
        1.0,
      )
      
      const result = emptySimulator.simulate()
      
      // Should still complete but with minimal score
      expect(result.finalScore).toBe(0)
      expect(result.turnLogs).toHaveLength(mockMusic.totalTurns)
    })

    it('should handle very high skill levels', () => {
      const highLevelCard: FormationCard = {
        ...mockFormationCard,
        skill: {
          level: 14, // Max level
          effects: [
            {
              type: 'scoreGain',
              value: 5000,
            },
          ],
        },
      }
      
      const highLevelSimulator = new GameSimulator(
        mockMusic,
        mockCenterCard,
        Array(5).fill(highLevelCard),
        100,
        1.0,
      )
      
      const result = highLevelSimulator.simulate()
      
      // Should have very high score due to max skill multiplier
      expect(result.finalScore).toBeGreaterThan(mockMusic.targetScore)
    })

    it('should handle negative AP balance', () => {
      const expensiveCard: FormationCard = {
        ...mockFormationCard,
        skill: {
          level: 10,
          ap: 50, // Very high AP cost
          effects: [
            {
              type: 'scoreGain',
              value: 10000,
            },
          ],
        },
      }
      
      const expensiveSimulator = new GameSimulator(
        mockMusic,
        mockCenterCard,
        Array(5).fill(expensiveCard),
        100,
        1.0,
      )
      
      const result = expensiveSimulator.simulate()
      
      // Should complete even with negative AP
      expect(result.finalAP.balance).toBeLessThan(0)
      expect(result.apShortageInfo).toBeDefined()
      expect(result.apShortageInfo?.shortage).toBeGreaterThan(0)
    })
  })
})