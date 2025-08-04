import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SimulationControls } from './SimulationControls'
import { useGameStore } from '../../stores/gameStore'
import { useSettingsStore } from '../../stores/settingsStore'

// Mock stores
vi.mock('../../stores/gameStore')
vi.mock('../../stores/settingsStore')

describe('SimulationControls', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock game store
    vi.mocked(useGameStore).mockReturnValue({
      selectedMusic: null,
      selectedCards: Array(6).fill(null),
      simulationResult: null,
      isSimulating: false,
      runSimulation: vi.fn(),
      clearSimulation: vi.fn(),
      generateShareUrl: vi.fn(() => 'https://example.com/share'),
    } as ReturnType<typeof useGameStore>)

    // Mock settings store
    vi.mocked(useSettingsStore).mockReturnValue({
      showDetailedLog: false,
      toggleDetailedLog: vi.fn(),
    } as ReturnType<typeof useSettingsStore>)
  })

  describe('rendering', () => {
    it('should render simulate button', () => {
      render(<SimulationControls />)

      // Should render simulate button
      expect(screen.getByText('スコア計算')).toBeInTheDocument()
    })

    it('should be disabled when no music selected', () => {
      render(<SimulationControls />)

      // Button should be disabled
      const button = screen.getByText('スコア計算')
      expect(button).toBeDisabled()
    })
  })
})
