import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useMusicStore } from './musicStore'
import { useGameStore } from './gameStore'
import * as localStorageService from '../services/localStorageService'

// Mock localStorage service
vi.mock('../services/localStorageService', () => ({
  getCustomMusicList: vi.fn(() => ({})),
  saveCustomMusicList: vi.fn(),
  isShareMode: vi.fn(() => false),
  loadMusicState: vi.fn(() => null),
  saveMusicState: vi.fn(),
  saveCardSkillLevel: vi.fn(),
  loadCardSkillLevel: vi.fn(() => 14),
  saveCenterSkillLevel: vi.fn(),
  loadCenterSkillLevel: vi.fn(() => 14),
  loadAllCardSkillLevels: vi.fn(() => ({})),
  loadAllCenterSkillLevels: vi.fn(() => ({})),
}))

describe('musicStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useMusicStore.setState({
      customMusicList: {},
    })

    // Reset gameStore state for music-related tests
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

    // Clear all mocks
    vi.clearAllMocks()
  })

  describe('music selection (via gameStore)', () => {
    it('should select music', () => {
      const music = {
        name: 'Test Music',
        displayName: 'Test Music Display',
        centerCharacter: 'Test Character',
        phases: [10, 5, 10],
        difficulty: {
          normal: { combo: 100, appeal: 5000 },
          hard: { combo: 150, appeal: 7500 },
          expert: { combo: 200, appeal: 10000 },
          master: { combo: 250, appeal: 12500 },
        },
      }

      useGameStore.getState().setMusic(music)
      expect(useGameStore.getState().selectedMusic).toEqual(music)
    })

    it('should clear music selection', () => {
      const music = {
        name: 'Test Music',
        displayName: 'Test Music Display',
        centerCharacter: 'Test Character',
        phases: [10, 5, 10],
        difficulty: {
          normal: { combo: 100, appeal: 5000 },
          hard: { combo: 150, appeal: 7500 },
          expert: { combo: 200, appeal: 10000 },
          master: { combo: 250, appeal: 12500 },
        },
      }

      const store = useGameStore.getState()
      store.setMusic(music)
      store.setMusic(null)
      expect(useGameStore.getState().selectedMusic).toBeNull()
    })
  })

  describe('initial mental (via gameStore)', () => {
    it('should set initial mental', () => {
      useGameStore.getState().setInitialMental(75)
      expect(useGameStore.getState().initialMental).toBe(75)
    })

    it('should clamp initial mental between 0 and 100', () => {
      const store = useGameStore.getState()

      store.setInitialMental(150)
      expect(useGameStore.getState().initialMental).toBe(100)

      store.setInitialMental(-50)
      expect(useGameStore.getState().initialMental).toBe(0)
    })
  })

  describe('learning correction (via gameStore)', () => {
    it('should set learning correction', () => {
      useGameStore.getState().setLearningCorrection(1.2)
      expect(useGameStore.getState().learningCorrection).toBe(1.2)
    })

    it('should handle decimal precision', () => {
      useGameStore.getState().setLearningCorrection(1.123456)
      expect(useGameStore.getState().learningCorrection).toBe(1.123456)
    })
  })

  describe('custom music', () => {
    it('should add custom music', () => {
      const mockCustomMusic = {
        id: 'custom_123',
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

      useMusicStore.getState().addCustomMusic(mockCustomMusic)

      const customMusicList = useMusicStore.getState().customMusicList
      expect(Object.keys(customMusicList)).toHaveLength(1)
      expect(customMusicList['custom_123']).toEqual(mockCustomMusic)
      expect(localStorageService.saveCustomMusicList).toHaveBeenCalledWith(customMusicList)
    })

    it('should generate unique id for custom music', async () => {
      const id1 = useMusicStore.getState().generateCustomMusicId()
      // Wait 1ms to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 1))
      const id2 = useMusicStore.getState().generateCustomMusicId()

      expect(id1).toMatch(/^custom_\d+_\d+$/)
      expect(id2).toMatch(/^custom_\d+_\d+$/)
      expect(id1).not.toBe(id2)
    })

    it('should update existing custom music', () => {
      const mockCustomMusic = {
        id: 'custom_123',
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

      const store = useMusicStore.getState()
      store.addCustomMusic(mockCustomMusic)

      const updatedMusic = { ...mockCustomMusic, name: 'Updated Music' }
      store.updateCustomMusic('custom_123', updatedMusic)

      const customMusicList = useMusicStore.getState().customMusicList
      expect(Object.keys(customMusicList)).toHaveLength(1)
      expect(customMusicList['custom_123'].name).toBe('Updated Music')
    })

    it('should delete custom music', () => {
      const mockCustomMusic = {
        id: 'custom_123',
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

      const store = useMusicStore.getState()
      store.addCustomMusic(mockCustomMusic)

      // Get fresh state after adding
      let currentState = useMusicStore.getState()
      expect(Object.keys(currentState.customMusicList)).toHaveLength(1)

      store.deleteCustomMusic('custom_123')
      // Get fresh state after deleting
      currentState = useMusicStore.getState()
      expect(Object.keys(currentState.customMusicList)).toHaveLength(0)
      expect(localStorageService.saveCustomMusicList).toHaveBeenLastCalledWith({})
    })

    it('should not modify custom music in share mode', () => {
      vi.mocked(localStorageService.isShareMode).mockReturnValue(true)

      const mockCustomMusic = {
        id: 'custom_123',
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

      const store = useMusicStore.getState()
      store.addCustomMusic(mockCustomMusic)

      // Should not add music in share mode
      expect(Object.keys(store.customMusicList)).toHaveLength(0)
      expect(localStorageService.saveCustomMusicList).not.toHaveBeenCalled()
    })

    it('should load custom music from localStorage', () => {
      const savedMusic = {
        custom_456: {
          id: 'custom_456',
          name: 'Saved Music',
          displayName: 'Saved Music Display',
          centerCharacter: 'Saved Character',
          phases: [15, 8, 12],
          difficulty: {
            normal: { combo: 120, appeal: 6000 },
            hard: { combo: 180, appeal: 9000 },
            expert: { combo: 240, appeal: 12000 },
            master: { combo: 300, appeal: 15000 },
          },
        },
      }

      vi.mocked(localStorageService.getCustomMusicList).mockReturnValue(savedMusic)

      const store = useMusicStore.getState()
      store.loadCustomMusic()

      expect(useMusicStore.getState().customMusicList).toEqual(savedMusic)
    })
  })
})
