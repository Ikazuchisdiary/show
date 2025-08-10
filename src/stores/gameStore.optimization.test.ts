import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useGameStore } from './gameStore'
import { Card } from '../core/models/Card'
import { Music } from '../core/models/Music'

describe('gameStore optimization', () => {
  const mockCards: Card[] = [
    {
      name: 'Card A',
      displayName: 'Card A',
      character: 'Character A',
      shortCode: 'CA',
      apCost: 10,
      stats: { smile: 1000, pure: 1000, cool: 1000, mental: 100 },
      effects: [],
    },
    {
      name: 'Card B',
      displayName: 'Card B',
      character: 'Character B',
      shortCode: 'CB',
      apCost: 10,
      stats: { smile: 2000, pure: 2000, cool: 2000, mental: 100 },
      effects: [],
    },
    {
      name: 'Card C',
      displayName: 'Card C',
      character: 'Character C',
      shortCode: 'CC',
      apCost: 10,
      stats: { smile: 3000, pure: 3000, cool: 3000, mental: 100 },
      effects: [],
    },
  ]

  const mockMusic: Music = {
    name: 'Test Music',
    phases: [10, 5, 5],
    centerCharacter: 'Character A',
    attribute: 'smile',
    combos: {
      normal: 100,
      hard: 200,
      expert: 300,
      master: 400,
    },
  }

  beforeEach(() => {
    // Reset store state
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
      isOptimizing: false,
      optimizationResult: null,
      fixedPositions: new Set(),
    })

    // Clear all mocks
    vi.clearAllMocks()
  })

  describe('toggleFixedPosition', () => {
    it('should toggle fixed position for a card index', () => {
      const store = useGameStore.getState()

      // Initially no fixed positions
      expect(store.fixedPositions.has(0)).toBe(false)

      // Toggle on
      store.toggleFixedPosition(0)
      expect(useGameStore.getState().fixedPositions.has(0)).toBe(true)

      // Toggle off
      store.toggleFixedPosition(0)
      expect(useGameStore.getState().fixedPositions.has(0)).toBe(false)
    })

    it('should handle multiple fixed positions', () => {
      const store = useGameStore.getState()

      store.toggleFixedPosition(0)
      store.toggleFixedPosition(2)
      store.toggleFixedPosition(4)

      const fixedPositions = useGameStore.getState().fixedPositions
      expect(fixedPositions.has(0)).toBe(true)
      expect(fixedPositions.has(1)).toBe(false)
      expect(fixedPositions.has(2)).toBe(true)
      expect(fixedPositions.has(3)).toBe(false)
      expect(fixedPositions.has(4)).toBe(true)
    })
  })

  describe('clearFixedPositions', () => {
    it('should clear all fixed positions', () => {
      const store = useGameStore.getState()

      // Set some fixed positions
      store.toggleFixedPosition(0)
      store.toggleFixedPosition(2)
      store.toggleFixedPosition(4)
      expect(useGameStore.getState().fixedPositions.size).toBe(3)

      // Clear all
      store.clearFixedPositions()
      expect(useGameStore.getState().fixedPositions.size).toBe(0)
    })
  })

  describe('setCard with fixed positions', () => {
    it('should remove fixed position when card is set to null', () => {
      const store = useGameStore.getState()
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
          mental: 100,
        },
        effects: [],
      }

      // Set card and fix position
      store.setCard(0, card)
      store.toggleFixedPosition(0)
      expect(useGameStore.getState().fixedPositions.has(0)).toBe(true)

      // Remove card
      store.setCard(0, null)
      expect(useGameStore.getState().fixedPositions.has(0)).toBe(false)
    })

    it('should keep fixed position when changing card', () => {
      const store = useGameStore.getState()

      // Set card and fix position
      store.setCard(0, mockCards[0])
      store.toggleFixedPosition(0)
      expect(useGameStore.getState().fixedPositions.has(0)).toBe(true)

      // Change to different card
      store.setCard(0, mockCards[1])
      // Fixed position should remain (based on current implementation)
      expect(useGameStore.getState().fixedPositions.has(0)).toBe(true)
    })
  })

  describe('optimizeFormation basic checks', () => {
    it('should require music to be selected', () => {
      const store = useGameStore.getState()

      store.setCard(0, mockCards[0])
      store.setCard(1, mockCards[1])
      // No music selected

      store.optimizeFormation()

      // Should exit early without changing state
      expect(useGameStore.getState().isOptimizing).toBe(false)
      expect(useGameStore.getState().optimizationResult).toBeNull()
    })

    it('should require at least one card', () => {
      const store = useGameStore.getState()

      // No cards selected
      store.setMusic(mockMusic)

      store.optimizeFormation()

      // Should exit early
      expect(useGameStore.getState().isOptimizing).toBe(false)
    })

    it('should handle single card case', () => {
      const store = useGameStore.getState()
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      // Set only one card
      store.setCard(0, mockCards[0])
      store.setMusic(mockMusic)

      store.optimizeFormation()

      // Should show alert
      expect(alertSpy).toHaveBeenCalledWith('最適化するには2枚以上のカードが必要です。')
      expect(useGameStore.getState().isOptimizing).toBe(false)

      alertSpy.mockRestore()
    })

    it('should handle all cards fixed case', () => {
      const store = useGameStore.getState()
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      // Set up 2 cards, both fixed
      store.setCard(0, mockCards[0])
      store.setCard(1, mockCards[1])
      store.setMusic(mockMusic)

      // Fix all positions
      store.toggleFixedPosition(0)
      store.toggleFixedPosition(1)

      store.optimizeFormation()

      // Should show alert about fixed cards
      expect(alertSpy).toHaveBeenCalledWith(
        '固定されていないカードが1枚以下のため、最適化できません。',
      )

      alertSpy.mockRestore()
    })
  })
})
