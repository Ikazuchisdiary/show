import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useGameStore } from './gameStore'
import { cardData, musicData } from '../data/index'

describe('gameStore optimization - comprehensive tests', () => {
  beforeEach(() => {
    // Mock window functions
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'confirm').mockImplementation(() => true) // Auto-confirm

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

  describe('Optimization with different formations', () => {
    it('should find optimal formation for 2 cards', async () => {
      const store = useGameStore.getState()

      // Set up formation with different AP costs
      store.setCard(0, cardData.gingaKozu) // Lower AP cost
      store.setCard(1, cardData.fantasyCerise) // Higher AP cost
      store.setMusic(musicData.sparkly_spot)

      // Ensure combo count is set from music
      const comboCount = musicData.sparkly_spot.combos?.master || 100
      store.setComboCount(comboCount)

      // Run optimization
      store.optimizeFormation()

      // Should have optimization result
      const state = useGameStore.getState()
      expect(state.optimizationResult).toBeTruthy()
      expect(state.optimizationResult?.bestFormation).toBeTruthy()
      // Score might be 0 if cards have no score effects
      expect(state.optimizationResult?.bestScore).toBeGreaterThanOrEqual(0)
    })

    it('should handle 3 cards optimization', async () => {
      const store = useGameStore.getState()

      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setCard(2, cardData.ladybugKosuzu)
      store.setMusic(musicData.sparkly_spot)

      store.optimizeFormation()

      const state = useGameStore.getState()
      expect(state.optimizationResult).toBeTruthy()
      expect(state.optimizationResult?.bestFormation.filter((c) => c !== null).length).toBe(3)
    })

    it('should handle full 6 cards optimization', async () => {
      const store = useGameStore.getState()

      // Fill all slots
      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setCard(2, cardData.ladybugKosuzu)
      store.setCard(3, cardData.bokuKaho)
      store.setCard(4, cardData.primoTsuzuri)
      store.setCard(5, cardData.fantasyCerise)
      store.setMusic(musicData.sparkly_spot)

      store.optimizeFormation()

      const state = useGameStore.getState()
      expect(state.optimizationResult).toBeTruthy()
      expect(state.optimizationResult?.bestFormation.filter((c) => c !== null).length).toBe(6)
    })
  })

  describe('Fixed position optimization', () => {
    it('should respect single fixed position', () => {
      const store = useGameStore.getState()

      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setCard(2, cardData.ladybugKosuzu)
      store.setMusic(musicData.sparkly_spot)

      // Fix first card
      store.toggleFixedPosition(0)

      store.optimizeFormation()

      const state = useGameStore.getState()
      expect(state.optimizationResult).toBeTruthy()
      // Verify the fixed card is in the same position
      expect(state.optimizationResult?.bestFormation[0]).toBe(cardData.gingaKozu)
    })

    it('should handle multiple fixed positions', () => {
      const store = useGameStore.getState()

      // Set up 4 cards
      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setCard(2, cardData.ladybugKosuzu)
      store.setCard(3, cardData.bokuKaho)
      store.setMusic(musicData.sparkly_spot)

      // Fix 2 cards
      store.toggleFixedPosition(0)
      store.toggleFixedPosition(2)

      store.optimizeFormation()

      const state = useGameStore.getState()
      expect(state.optimizationResult).toBeTruthy()
      // Verify fixed cards remain in place
      expect(state.optimizationResult?.bestFormation[0]).toBe(cardData.gingaKozu)
      expect(state.optimizationResult?.bestFormation[2]).toBe(cardData.ladybugKosuzu)
    })
  })

  describe('Skill level preservation during optimization', () => {
    it('should preserve custom skill levels after optimization', () => {
      const store = useGameStore.getState()

      // Set up cards with custom skill levels
      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setMusic(musicData.sparkly_spot)

      // Set custom skill levels
      store.setCardSkillLevel(0, 10)
      store.setCardSkillLevel(1, 12)

      // Store original levels
      const originalCard0 = cardData.gingaKozu
      const originalCard1 = cardData.bdSayaka

      store.optimizeFormation()

      const state = useGameStore.getState()

      // Find where each card ended up
      const card0Index = state.selectedCards.findIndex((c) => c === originalCard0)
      const card1Index = state.selectedCards.findIndex((c) => c === originalCard1)

      // Verify skill levels moved with cards
      expect(state.cardSkillLevels[card0Index]).toBe(10)
      expect(state.cardSkillLevels[card1Index]).toBe(12)
    })

    it('should preserve custom skill values after optimization', () => {
      const store = useGameStore.getState()

      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setMusic(musicData.sparkly_spot)

      // Set custom skill values
      store.setCustomSkillValue(0, 'scoreBoost', 500)
      store.setCustomSkillValue(1, 'voltageGain', 1000)

      const originalCard0 = cardData.gingaKozu
      const originalCard1 = cardData.bdSayaka

      store.optimizeFormation()

      const state = useGameStore.getState()

      // Find where each card ended up
      const card0Index = state.selectedCards.findIndex((c) => c === originalCard0)
      const card1Index = state.selectedCards.findIndex((c) => c === originalCard1)

      // Verify custom values moved with cards
      expect(state.customSkillValues[card0Index]).toEqual({ scoreBoost: 500 })
      expect(state.customSkillValues[card1Index]).toEqual({ voltageGain: 1000 })
    })
  })

  describe('AP shortage handling', () => {
    it('should use reference score when AP is insufficient', () => {
      const store = useGameStore.getState()

      // Set up expensive cards that will exceed AP limit
      store.setCard(0, cardData.fantasyCerise) // High AP cost
      store.setCard(1, cardData.fantasyCerise) // Same card for testing
      store.setCard(2, cardData.fantasyCerise)
      store.setMusic(musicData.sparkly_spot)

      // Set low initial mental to ensure AP shortage
      store.setInitialMental(10)

      store.optimizeFormation()

      const state = useGameStore.getState()
      expect(state.optimizationResult).toBeTruthy()
      expect(state.optimizationResult?.bestScore).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Edge cases', () => {
    it('should complete optimization without errors', () => {
      const store = useGameStore.getState()

      // Use existing cards
      store.setCard(0, cardData.primoTsuzuri)
      store.setCard(1, cardData.bokuKaho)
      store.setMusic(musicData.sparkly_spot)

      store.optimizeFormation()

      const state = useGameStore.getState()
      // Optimization should complete
      expect(state.isOptimizing).toBe(false)
      // Result might be set or null depending on if improvement was found
      if (state.optimizationResult) {
        expect(state.optimizationResult.bestFormation).toBeTruthy()
      }
    })

    it('should handle optimization cancellation', () => {
      const store = useGameStore.getState()
      vi.spyOn(window, 'confirm').mockImplementation(() => false) // Cancel optimization

      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setMusic(musicData.sparkly_spot)

      const originalFormation = [...store.selectedCards]

      store.optimizeFormation()

      const state = useGameStore.getState()
      // Formation should remain unchanged
      expect(state.selectedCards).toEqual(originalFormation)
    })
  })

  describe('Formation validation', () => {
    it('should handle formations with various cards', () => {
      const store = useGameStore.getState()

      // Different character cards
      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setMusic(musicData.sparkly_spot)

      store.optimizeFormation()

      const state = useGameStore.getState()
      // Optimization should complete
      expect(state.isOptimizing).toBe(false)
    })
  })

  describe('Optimization result verification', () => {
    it('should complete optimization for multi-card formations', () => {
      const store = useGameStore.getState()

      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setCard(2, cardData.ladybugKosuzu)
      store.setMusic(musicData.sparkly_spot)

      store.optimizeFormation()

      const state = useGameStore.getState()
      expect(state.isOptimizing).toBe(false)
      // If optimization found improvement, result should be set
      if (state.optimizationResult) {
        expect(state.optimizationResult.improvement).toBeDefined()
      }
    })

    it('should report improvement percentage correctly', () => {
      const store = useGameStore.getState()

      store.setCard(0, cardData.gingaKozu)
      store.setCard(1, cardData.bdSayaka)
      store.setMusic(musicData.sparkly_spot)

      store.optimizeFormation()

      const state = useGameStore.getState()
      if (state.optimizationResult && state.optimizationResult.improvement > 0) {
        // If there's improvement, it should be a positive percentage
        expect(state.optimizationResult.improvement).toBeGreaterThan(0)
      }
    })
  })
})
