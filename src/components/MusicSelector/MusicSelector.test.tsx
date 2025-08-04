import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MusicSelector } from './MusicSelector'
import { useGameStore } from '../../stores/gameStore'
import { useMusicStore } from '../../stores/musicStore'
import { getAllMusic } from '../../data'

// Mock stores and data
vi.mock('../../stores/gameStore')
vi.mock('../../stores/musicStore')
vi.mock('../../data')

describe('MusicSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock game store
    vi.mocked(useGameStore).mockReturnValue({
      selectedMusic: null,
      initialMental: 100,
      learningCorrection: 1.5,
      selectedDifficulty: 'master',
      setMusic: vi.fn(),
      setInitialMental: vi.fn(),
      setLearningCorrection: vi.fn(),
      setDifficulty: vi.fn(),
      setCenterCharacter: vi.fn(),
      setComboCount: vi.fn(),
    } as ReturnType<typeof useGameStore>)

    // Mock music store
    vi.mocked(useMusicStore).mockReturnValue({
      customMusicList: {},
      loadCustomMusic: vi.fn(),
      addCustomMusic: vi.fn(),
      updateCustomMusic: vi.fn(),
      deleteCustomMusic: vi.fn(),
      generateCustomMusicId: vi.fn(() => 'custom_123'),
    } as ReturnType<typeof useMusicStore>)

    // Mock music data
    vi.mocked(getAllMusic).mockReturnValue([
      {
        name: 'Test Music 1',
        displayName: 'Test Music Display 1',
        phases: [10, 10, 10],
        centerCharacter: 'Test Character',
      },
    ])
  })

  describe('rendering', () => {
    it('should render music dropdown', () => {
      render(<MusicSelector />)

      // Should render music selector
      expect(screen.getByText('楽曲選択:')).toBeInTheDocument()
    })

    it('should render initial mental input', () => {
      render(<MusicSelector />)

      // Should render initial mental input
      expect(screen.getByText('初期メンタル (%)')).toBeInTheDocument()
    })
  })
})
