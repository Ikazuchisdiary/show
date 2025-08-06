import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useGameStore } from './gameStore'
import { cardData, musicData } from '../data/index'

describe('gameStore optimization - simplified integration tests', () => {
  beforeEach(() => {
    // Mock window functions
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'confirm').mockImplementation(() => false)
    
    // Reset store
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
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic optimization functionality', () => {
    it('should run optimization without errors when cards and music are selected', () => {
      const store = useGameStore.getState()
      
      // Set up a simple formation
      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setCard(2, cardData.ladybugKosuzu)
      store.setMusic(musicData.sparkly_spot)

      // Run optimization
      store.optimizeFormation()

      // Should complete without errors
      expect(store.isOptimizing).toBe(false)
    })

    it('should not run optimization without music', () => {
      const store = useGameStore.getState()
      
      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      // No music set

      store.optimizeFormation()

      // Should exit early
      expect(store.isOptimizing).toBe(false)
      expect(store.optimizationResult).toBeNull()
    })

    it('should show alert for single card', () => {
      const store = useGameStore.getState()
      const alertSpy = vi.spyOn(window, 'alert')
      
      store.setCard(0, cardData.gingaKozu)
      store.setMusic(musicData.sparkly_spot)

      store.optimizeFormation()

      expect(alertSpy).toHaveBeenCalledWith('最適化するには2枚以上のカードが必要です。')
    })
  })

  describe('Fixed position functionality', () => {
    it('should allow toggling fixed positions', () => {
      const store = useGameStore.getState()
      
      expect(store.fixedPositions.has(0)).toBe(false)
      
      store.toggleFixedPosition(0)
      expect(useGameStore.getState().fixedPositions.has(0)).toBe(true)
      
      store.toggleFixedPosition(0)
      expect(useGameStore.getState().fixedPositions.has(0)).toBe(false)
    })

    it('should show alert when all cards are fixed', () => {
      const store = useGameStore.getState()
      const alertSpy = vi.spyOn(window, 'alert')
      
      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setMusic(musicData.sparkly_spot)
      
      // Fix all cards
      store.toggleFixedPosition(0)
      store.toggleFixedPosition(1)

      store.optimizeFormation()

      expect(alertSpy).toHaveBeenCalledWith('固定されていないカードが1枚以下のため、最適化できません。')
    })

    it('should clear fixed position when card is removed', () => {
      const store = useGameStore.getState()
      
      store.setCard(0, cardData.gingaKozu)
      store.toggleFixedPosition(0)
      expect(useGameStore.getState().fixedPositions.has(0)).toBe(true)
      
      store.setCard(0, null)
      expect(useGameStore.getState().fixedPositions.has(0)).toBe(false)
    })
  })

  describe('Skill level preservation', () => {
    it('should maintain skill levels when setting cards', () => {
      const store = useGameStore.getState()
      
      store.setCard(0, cardData.gingaKozu)
      store.setCardSkillLevel(0, 10)
      
      expect(useGameStore.getState().cardSkillLevels[0]).toBe(10)
    })

    it('should maintain custom skill values', () => {
      const store = useGameStore.getState()
      
      store.setCard(0, cardData.gingaKozu)
      store.setCustomSkillValue(0, 'test_effect', 123)
      
      expect(useGameStore.getState().customSkillValues[0]).toEqual({ test_effect: 123 })
    })
  })

  describe('Performance checks', () => {
    it('should handle 6 cards without timeout', () => {
      const store = useGameStore.getState()
      
      // Fill all slots
      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setCard(2, cardData.ladybugKosuzu)
      store.setCard(3, cardData.bokuKaho)
      store.setCard(4, cardData.primoTsuzuri)
      store.setCard(5, cardData.fantasyCerise)
      store.setMusic(musicData.sparkly_spot)

      const startTime = performance.now()
      store.optimizeFormation()
      const endTime = performance.now()

      // Should complete quickly (under 2 seconds)
      expect(endTime - startTime).toBeLessThan(2000)
      expect(store.isOptimizing).toBe(false)
    })
  })
})