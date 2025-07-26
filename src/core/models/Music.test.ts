import { describe, it, expect } from 'vitest'
import { Music, CustomMusic } from './Music'

describe('Music Model', () => {
  describe('Music', () => {
    it('should create a music object with all properties', () => {
      const music: Music = {
        name: 'Test Music',
        displayName: 'Test Music Display',
        phases: [10, 10, 10],
        centerCharacter: 'Test Character',
        difficulty: {
          normal: { combo: 100, appeal: 5000 },
          hard: { combo: 150, appeal: 7500 },
          expert: { combo: 200, appeal: 10000 },
          master: { combo: 250, appeal: 12500 },
        },
      }

      expect(music.name).toBe('Test Music')
      expect(music.displayName).toBe('Test Music Display')
      expect(music.phases).toEqual([10, 10, 10])
      expect(music.centerCharacter).toBe('Test Character')
      expect(music.difficulty.normal.combo).toBe(100)
      expect(music.difficulty.master.appeal).toBe(12500)
    })

    it('should handle null center character', () => {
      const music: Music = {
        name: 'Test Music',
        displayName: 'Test Music Display',
        phases: [15, 8, 12],
        centerCharacter: null,
        difficulty: {
          normal: { combo: 120, appeal: 6000 },
          hard: { combo: 180, appeal: 9000 },
          expert: { combo: 240, appeal: 12000 },
          master: { combo: 300, appeal: 15000 },
        },
      }

      expect(music.centerCharacter).toBeNull()
    })
  })

  describe('CustomMusic', () => {
    it('should create a custom music object', () => {
      const customMusic: CustomMusic = {
        id: 'custom_123',
        name: 'Custom Music',
        displayName: 'Custom Music Display',
        phases: [10, 5, 10],
        centerCharacter: 'Custom Character',
        difficulty: {
          normal: { combo: 100, appeal: 5000 },
          hard: { combo: 150, appeal: 7500 },
          expert: { combo: 200, appeal: 10000 },
          master: { combo: 250, appeal: 12500 },
        },
      }

      expect(customMusic.id).toBe('custom_123')
      expect(customMusic.name).toBe('Custom Music')
      expect(customMusic.phases).toEqual([10, 5, 10])
    })
  })
})