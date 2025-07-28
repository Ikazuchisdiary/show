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
      mental: 100,
    },
    effects,
  })

  const createMusic = (): Music => ({
    name: 'Test Music',
    displayName: 'Test Music Display',
    phases: [10, 5, 10],
    centerCharacter: 'Test Character',
    combos: {
      normal: 100,
      hard: 150,
      expert: 200,
      master: 250,
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
      })

      const result = simulator.simulate()

      expect(result).toBeDefined()
      expect(result.totalScore).toBeGreaterThan(0)
      expect(result.turnResults).toHaveLength(25) // 10 + 5 + 10
      expect(result.apAcquired).toBeDefined()
      expect(result.apConsumed).toBeDefined()
    })

    it('should handle empty cards', () => {
      const music = createMusic()
      
      const simulator = new GameSimulator({
        music,
        cards: [],
        cardSkillLevels: [],
        centerSkillLevels: [],
        initialMental: 100,
      })

      const result = simulator.simulate()

      expect(result).toBeDefined()
      expect(result.totalScore).toBe(0)
    })
  })
})