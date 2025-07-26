import { describe, it, expect } from 'vitest'
import { GameSimulator } from './GameSimulator'
import { Card } from '../models/Card'
import { Music } from '../models/Music'

describe('GameSimulator', () => {
  const createCard = (name: string, apCost: number, effects: any[] = []): Card => ({
    name,
    displayName: name,
    character: 'Test Character',
    shortCode: '[TC]',
    apCost,
    stats: {
      smile: 5000,
      pure: 4000,
      cool: 3000,
    },
    effects,
  })

  const createMusic = (): Music => ({
    name: 'Test Music',
    displayName: 'Test Music Display',
    phases: [10, 5, 10],
    centerCharacter: 'Test Character',
    difficulty: {
      normal: { combo: 100, appeal: 5000 },
      hard: { combo: 150, appeal: 7500 },
      expert: { combo: 200, appeal: 10000 },
      master: { combo: 250, appeal: 12500 },
    },
  })

  describe('constructor', () => {
    it('should initialize with correct parameters', () => {
      const music = createMusic()
      const cards = [createCard('Card 1', 20), createCard('Card 2', 25)]
      
      const simulator = new GameSimulator({
        music,
        cards,
        cardSkillLevels: [14, 14],
        centerSkillLevels: [14, 14],
        initialMental: 100,
        difficulty: 'master',
        learningCorrection: 1.5,
      })

      expect(simulator).toBeDefined()
    })
  })

  describe('simulate', () => {
    it('should complete simulation and return results', () => {
      const music = createMusic()
      const cards = [
        createCard('Card 1', 20, [{ type: 'scoreGain', value: 1000 }]),
        createCard('Card 2', 25, [{ type: 'scoreGain', value: 2000 }]),
      ]
      
      const simulator = new GameSimulator({
        music,
        cards,
        cardSkillLevels: [14, 14],
        centerSkillLevels: [14, 14],
        initialMental: 100,
        difficulty: 'master',
        learningCorrection: 1.5,
      })

      const result = simulator.simulate()

      expect(result).toBeDefined()
      expect(result.finalScore).toBeGreaterThan(0)
      expect(result.turns).toHaveLength(25) // 10 + 5 + 10
      expect(result.apBalance).toBeDefined()
      expect(result.appealValue).toBeGreaterThan(0)
    })

    it('should handle empty cards', () => {
      const music = createMusic()
      
      const simulator = new GameSimulator({
        music,
        cards: [],
        cardSkillLevels: [],
        centerSkillLevels: [],
        initialMental: 100,
        difficulty: 'master',
        learningCorrection: 1.5,
      })

      const result = simulator.simulate()

      expect(result).toBeDefined()
      expect(result.finalScore).toBe(0)
    })
  })
})