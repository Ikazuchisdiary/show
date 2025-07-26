import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './gameStore'
import { Card } from '../core/models/Card'

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useGameStore.setState({
      selectedCards: Array(6).fill(null),
      cardSkillLevels: Array(6).fill(14),
      centerSkillLevels: Array(6).fill(14),
      customSkillValues: {},
      customCenterSkillValues: {},
      selectedMusic: null,
      selectedDifficulty: 'master',
      initialMental: 100,
      comboCount: 100,
      centerCharacter: null,
      learningCorrection: 1.5,
      customMusicList: {},
      simulationResult: null,
      isSimulating: false,
      isShareMode: false,
    })
  })

  describe('setCard', () => {
    it('should set card at specific index', () => {
      const card: Card = {
        name: 'Test Card',
        displayName: 'Test Card Display',
        character: 'Test Character',
        shortCode: '[TC]',
        apCost: 10,
        stats: {
          smile: 1000,
          pure: 2000,
          cool: 3000,
        },
        effects: [],
      }

      useGameStore.getState().setCard(0, card)
      
      expect(useGameStore.getState().selectedCards[0]).toEqual(card)
      expect(useGameStore.getState().selectedCards[1]).toBeNull()
    })

    it('should clear card when null is passed', () => {
      const card: Card = {
        name: 'Test Card',
        displayName: 'Test Card Display',
        character: 'Test Character',
        shortCode: '[TC]',
        apCost: 10,
        stats: {
          smile: 1000,
          pure: 2000,
          cool: 3000,
        },
        effects: [],
      }

      const store = useGameStore.getState()
      store.setCard(0, card)
      store.setCard(0, null)
      
      expect(useGameStore.getState().selectedCards[0]).toBeNull()
    })

    it('should handle out of bounds index gracefully', () => {
      const card: Card = {
        name: 'Test Card',
        displayName: 'Test Card Display',
        character: 'Test Character',
        shortCode: '[TC]',
        apCost: 10,
        stats: {
          smile: 1000,
          pure: 2000,
          cool: 3000,
        },
        effects: [],
      }

      const store = useGameStore.getState()
      
      // Should not throw
      expect(() => {
        store.setCard(10, card)
        store.setCard(-1, card)
      }).not.toThrow()
    })
  })

  describe('swapCards', () => {
    it('should swap two cards', () => {
      const card1: Card = {
        name: 'Card 1',
        displayName: 'Card 1 Display',
        character: 'Character 1',
        shortCode: '[C1]',
        apCost: 10,
        stats: {
          smile: 1000,
          pure: 2000,
          cool: 3000,
        },
        effects: [],
      }

      const card2: Card = {
        name: 'Card 2',
        displayName: 'Card 2 Display',
        character: 'Character 2',
        shortCode: '[C2]',
        apCost: 15,
        stats: {
          smile: 2000,
          pure: 3000,
          cool: 4000,
        },
        effects: [],
      }

      const store = useGameStore.getState()
      store.setCard(0, card1)
      store.setCard(3, card2)
      
      store.swapCards(0, 3)
      
      expect(useGameStore.getState().selectedCards[0]).toEqual(card2)
      expect(useGameStore.getState().selectedCards[3]).toEqual(card1)
    })

    it('should handle swapping with null cards', () => {
      const card1: Card = {
        name: 'Card 1',
        displayName: 'Card 1 Display',
        character: 'Character 1',
        shortCode: '[C1]',
        apCost: 10,
        stats: {
          smile: 1000,
          pure: 2000,
          cool: 3000,
        },
        effects: [],
      }

      const store = useGameStore.getState()
      store.setCard(1, card1)
      
      store.swapCards(1, 2)
      
      expect(useGameStore.getState().selectedCards[1]).toBeNull()
      expect(useGameStore.getState().selectedCards[2]).toEqual(card1)
    })
  })

  describe('clearFormation', () => {
    it('should clear all cards', () => {
      const card: Card = {
        name: 'Test Card',
        displayName: 'Test Card Display',
        character: 'Test Character',
        shortCode: '[TC]',
        apCost: 10,
        stats: {
          smile: 1000,
          pure: 2000,
          cool: 3000,
        },
        effects: [],
      }

      const store = useGameStore.getState()
      store.setCard(0, card)
      store.setCard(2, card)
      store.setCard(4, card)
      
      // Clear all cards
      store.selectedCards.forEach((_, i) => store.setCard(i, null))
      
      expect(useGameStore.getState().selectedCards).toEqual([null, null, null, null, null, null])
    })
  })

  describe('setCardSkillLevel', () => {
    it('should set card skill level', () => {
      useGameStore.getState().setCardSkillLevel(0, 10)
      expect(useGameStore.getState().cardSkillLevels[0]).toBe(10)
    })

    it('should clamp skill level between 1 and 14', () => {
      const store = useGameStore.getState()
      
      store.setCardSkillLevel(0, 0)
      expect(useGameStore.getState().cardSkillLevels[0]).toBe(1)
      
      store.setCardSkillLevel(0, 15)
      expect(useGameStore.getState().cardSkillLevels[0]).toBe(14)
      
      store.setCardSkillLevel(0, -5)
      expect(useGameStore.getState().cardSkillLevels[0]).toBe(1)
    })
  })

  describe('setCenterSkillLevel', () => {
    it('should set center skill level', () => {
      useGameStore.getState().setCenterSkillLevel(0, 10)
      expect(useGameStore.getState().centerSkillLevels[0]).toBe(10)
    })

    it('should clamp skill level between 1 and 14', () => {
      const store = useGameStore.getState()
      
      store.setCenterSkillLevel(0, 0)
      expect(useGameStore.getState().centerSkillLevels[0]).toBe(1)
      
      store.setCenterSkillLevel(0, 15)
      expect(useGameStore.getState().centerSkillLevels[0]).toBe(14)
      
      store.setCenterSkillLevel(0, -5)
      expect(useGameStore.getState().centerSkillLevels[0]).toBe(1)
    })
  })

  describe('share mode', () => {
    it('should toggle share mode', () => {
      const store = useGameStore.getState()
      
      expect(store.isShareMode).toBe(false)
      
      store.setShareMode(true)
      expect(useGameStore.getState().isShareMode).toBe(true)
      
      store.setShareMode(false)
      expect(useGameStore.getState().isShareMode).toBe(false)
    })
  })

  describe('persistence', () => {
    it('should persist custom music list', () => {
      const store = useGameStore.getState()
      
      const customMusic = {
        name: 'Custom Music',
        displayName: 'Custom Music Display',
        centerCharacter: 'Test Character',
        phases: [10, 5, 10],
        difficulty: {
          normal: { combo: 100, appeal: 5000 },
          hard: { combo: 150, appeal: 7500 },
          expert: { combo: 200, appeal: 10000 },
          master: { combo: 250, appeal: 12500 },
        },
      }
      
      store.saveCustomMusic('test-music', customMusic)
      
      // Get the persisted data from localStorage
      const persistedData = localStorage.getItem('sukushou-custom-music')
      expect(persistedData).toBeTruthy()
      
      const parsed = JSON.parse(persistedData!)
      expect(parsed['test-music']).toBeTruthy()
      expect(parsed['test-music'].name).toBe('Custom Music')
    })
  })
})