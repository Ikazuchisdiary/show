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
        combos: {
          normal: 100,
          hard: 150,
          expert: 200,
          master: 250,
        },
      }

      expect(music.name).toBe('Test Music')
      expect(music.displayName).toBe('Test Music Display')
      expect(music.phases).toEqual([10, 10, 10])
      expect(music.centerCharacter).toBe('Test Character')
      expect(music.combos?.normal).toBe(100)
      expect(music.combos?.master).toBe(250)
    })

    it('should handle null center character', () => {
      const music: Music = {
        name: 'Test Music',
        displayName: 'Test Music Display',
        phases: [15, 8, 12],
        centerCharacter: undefined,
        combos: {
          normal: 120,
          hard: 180,
          expert: 240,
          master: 300,
        },
      }

      expect(music.centerCharacter).toBeUndefined()
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
        combos: {
          normal: 100,
          hard: 150,
          expert: 200,
          master: 250,
        },
      }

      expect(customMusic.id).toBe('custom_123')
      expect(customMusic.name).toBe('Custom Music')
      expect(customMusic.phases).toEqual([10, 5, 10])
    })
  })
})
