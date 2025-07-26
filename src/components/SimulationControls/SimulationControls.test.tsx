import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SimulationControls } from './SimulationControls'
import { useGameStore } from '@stores/gameStore'
import { useMusicStore } from '@stores/musicStore'
import type { Music } from '@core/models'

// Mock stores
vi.mock('@stores/gameStore', () => ({
  useGameStore: vi.fn(),
}))

vi.mock('@stores/musicStore', () => ({
  useMusicStore: vi.fn(),
}))

// Mock GameSimulator
vi.mock('@core/simulation/GameSimulator', () => ({
  GameSimulator: vi.fn().mockImplementation(() => ({
    simulate: vi.fn().mockReturnValue({
      finalScore: 150000,
      finalVoltage: 1500,
      finalAP: {
        initial: 100,
        usage: 80,
        gain: 30,
        balance: 50,
      },
      totalScore: 160000,
      appeal: 50000,
      turnLogs: Array(30).fill({
        turn: 1,
        cardName: 'Test Card',
        score: 5000,
        voltage: 50,
        details: ['Test detail'],
        skipped: false,
      }),
      apShortageInfo: null,
    }),
  })),
}))

describe('SimulationControls', () => {
  const mockMusic: Music = {
    id: 'test-music',
    name: 'Test Music',
    difficulty: 'expert',
    startBonus: 3000,
    feverStart: 10,
    feverEnd: 20,
    totalTurns: 30,
    targetScore: 100000,
    comboBonus: 0.1,
    actualComboCount: 100,
  }

  const mockCenterCard = {
    name: 'Center Card',
    shortCode: '[C]',
    characterName: 'Center Character',
    type: '歌' as const,
    appeal: 10000,
    centerBonus: {
      boost: 0.15,
      characteristic: '歌' as const,
    },
  }

  const mockFormationCard = {
    name: 'Formation Card',
    shortCode: '[F]',
    characterName: 'Formation Character',
    type: '歌' as const,
    appeal: 8000,
    skill: {
      level: 5,
      effects: [{
        type: 'scoreGain' as const,
        value: 1000,
      }],
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    vi.mocked(useGameStore).mockReturnValue({
      centerCard: mockCenterCard,
      formationCards: [mockFormationCard, mockFormationCard, mockFormationCard, mockFormationCard, mockFormationCard],
      centerSkillLevel: 5,
    } as any)
    
    vi.mocked(useMusicStore).mockReturnValue({
      getSelectedMusic: () => mockMusic,
      initialMental: 100,
      learningCorrection: 1.0,
    } as any)
  })

  describe('rendering', () => {
    it('should render simulate button', () => {
      render(<SimulationControls />)
      
      expect(screen.getByText('シミュレート')).toBeInTheDocument()
    })

    it('should be disabled when no music selected', () => {
      vi.mocked(useMusicStore).mockReturnValue({
        getSelectedMusic: () => null,
        initialMental: 100,
        learningCorrection: 1.0,
      } as any)
      
      render(<SimulationControls />)
      
      const button = screen.getByText('シミュレート')
      expect(button).toBeDisabled()
    })

    it('should be disabled when no center card', () => {
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: null,
        formationCards: [mockFormationCard, mockFormationCard, mockFormationCard, mockFormationCard, mockFormationCard],
        centerSkillLevel: 5,
      } as any)
      
      render(<SimulationControls />)
      
      const button = screen.getByText('シミュレート')
      expect(button).toBeDisabled()
    })

    it('should be enabled when music and center card are selected', () => {
      render(<SimulationControls />)
      
      const button = screen.getByText('シミュレート')
      expect(button).not.toBeDisabled()
    })
  })

  describe('simulation', () => {
    it('should run simulation when clicking button', async () => {
      const user = userEvent.setup()
      render(<SimulationControls />)
      
      const button = screen.getByText('シミュレート')
      await user.click(button)
      
      // Should show results
      await waitFor(() => {
        expect(screen.getByText(/最終スコア/)).toBeInTheDocument()
      })
    })

    it('should display simulation results', async () => {
      const user = userEvent.setup()
      render(<SimulationControls />)
      
      const button = screen.getByText('シミュレート')
      await user.click(button)
      
      await waitFor(() => {
        // Score display
        expect(screen.getByText(/最終スコア/)).toBeInTheDocument()
        expect(screen.getByText(/150,000/)).toBeInTheDocument()
        
        // Total score
        expect(screen.getByText(/スタートボーナス込み/)).toBeInTheDocument()
        expect(screen.getByText(/160,000/)).toBeInTheDocument()
        
        // Target achievement
        expect(screen.getByText(/目標達成率/)).toBeInTheDocument()
        expect(screen.getByText(/150\.0%/)).toBeInTheDocument()
      })
    })

    it('should show AP balance', async () => {
      const user = userEvent.setup()
      render(<SimulationControls />)
      
      const button = screen.getByText('シミュレート')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText(/AP残高/)).toBeInTheDocument()
        expect(screen.getByText(/50/)).toBeInTheDocument()
      })
    })

    it('should show appeal value', async () => {
      const user = userEvent.setup()
      render(<SimulationControls />)
      
      const button = screen.getByText('シミュレート')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText(/アピール値/)).toBeInTheDocument()
        expect(screen.getByText(/50,000/)).toBeInTheDocument()
      })
    })

    it('should handle AP shortage', async () => {
      const { GameSimulator } = await import('@core/simulation/GameSimulator')
      vi.mocked(GameSimulator).mockImplementation(() => ({
        simulate: vi.fn().mockReturnValue({
          finalScore: 100000,
          finalVoltage: 1000,
          finalAP: {
            initial: 100,
            usage: 150,
            gain: 20,
            balance: -30,
          },
          totalScore: 103000,
          appeal: 45000,
          turnLogs: [],
          apShortageInfo: {
            shortage: 30,
            referenceScore: 130000,
          },
        }),
      }) as any)
      
      const user = userEvent.setup()
      render(<SimulationControls />)
      
      const button = screen.getByText('シミュレート')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText(/AP不足/)).toBeInTheDocument()
        expect(screen.getByText(/参考スコア/)).toBeInTheDocument()
        expect(screen.getByText(/130,000/)).toBeInTheDocument()
      })
    })
  })

  describe('detailed log', () => {
    it('should toggle detailed log', async () => {
      const user = userEvent.setup()
      render(<SimulationControls />)
      
      // Run simulation
      const simulateButton = screen.getByText('シミュレート')
      await user.click(simulateButton)
      
      // Toggle detailed log
      await waitFor(() => {
        const toggleButton = screen.getByText('詳細ログを表示')
        expect(toggleButton).toBeInTheDocument()
      })
      
      const toggleButton = screen.getByText('詳細ログを表示')
      await user.click(toggleButton)
      
      // Should show log
      expect(screen.getByText('詳細ログを隠す')).toBeInTheDocument()
      expect(screen.getByText(/ターン/)).toBeInTheDocument()
    })

    it('should display turn logs', async () => {
      const { GameSimulator } = await import('@core/simulation/GameSimulator')
      vi.mocked(GameSimulator).mockImplementation(() => ({
        simulate: vi.fn().mockReturnValue({
          finalScore: 150000,
          finalVoltage: 1500,
          finalAP: {
            initial: 100,
            usage: 80,
            gain: 30,
            balance: 50,
          },
          totalScore: 160000,
          appeal: 50000,
          turnLogs: [
            {
              turn: 1,
              cardName: 'Card 1',
              score: 5000,
              voltage: 50,
              details: ['スコア獲得: 1000', '電圧獲得: 50'],
              skipped: false,
            },
            {
              turn: 2,
              cardName: 'Card 2',
              score: 0,
              voltage: 0,
              details: ['ターンスキップ'],
              skipped: true,
            },
          ],
          apShortageInfo: null,
        }),
      }) as any)
      
      const user = userEvent.setup()
      render(<SimulationControls />)
      
      // Run simulation
      const simulateButton = screen.getByText('シミュレート')
      await user.click(simulateButton)
      
      // Show detailed log
      await waitFor(() => {
        const toggleButton = screen.getByText('詳細ログを表示')
        expect(toggleButton).toBeInTheDocument()
      })
      
      const toggleButton = screen.getByText('詳細ログを表示')
      await user.click(toggleButton)
      
      // Check log content
      expect(screen.getByText(/ターン 1/)).toBeInTheDocument()
      expect(screen.getByText('Card 1')).toBeInTheDocument()
      expect(screen.getByText(/5,000/)).toBeInTheDocument()
      expect(screen.getByText(/スコア獲得: 1000/)).toBeInTheDocument()
      
      expect(screen.getByText(/ターン 2/)).toBeInTheDocument()
      expect(screen.getByText('Card 2')).toBeInTheDocument()
      expect(screen.getByText(/ターンスキップ/)).toBeInTheDocument()
    })
  })

  describe('share functionality', () => {
    it('should show share button after simulation', async () => {
      const user = userEvent.setup()
      render(<SimulationControls />)
      
      const button = screen.getByText('シミュレート')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText('結果を共有')).toBeInTheDocument()
      })
    })

    it('should generate share URL', async () => {
      const user = userEvent.setup()
      render(<SimulationControls />)
      
      // Run simulation
      const simulateButton = screen.getByText('シミュレート')
      await user.click(simulateButton)
      
      // Click share
      await waitFor(() => {
        const shareButton = screen.getByText('結果を共有')
        expect(shareButton).toBeInTheDocument()
      })
      
      const shareButton = screen.getByText('結果を共有')
      await user.click(shareButton)
      
      // Should show share URL
      await waitFor(() => {
        expect(screen.getByText(/共有URLが生成されました/)).toBeInTheDocument()
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty formation', () => {
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: mockCenterCard,
        formationCards: [null, null, null, null, null],
        centerSkillLevel: 5,
      } as any)
      
      render(<SimulationControls />)
      
      // Should still be enabled with just center card
      const button = screen.getByText('シミュレート')
      expect(button).not.toBeDisabled()
    })

    it('should handle partial formation', async () => {
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: mockCenterCard,
        formationCards: [mockFormationCard, null, mockFormationCard, null, null],
        centerSkillLevel: 5,
      } as any)
      
      const user = userEvent.setup()
      render(<SimulationControls />)
      
      const button = screen.getByText('シミュレート')
      await user.click(button)
      
      // Should complete simulation
      await waitFor(() => {
        expect(screen.getByText(/最終スコア/)).toBeInTheDocument()
      })
    })

    it('should handle custom music', () => {
      const customMusic: Music = {
        id: 'custom_1',
        name: 'Custom Music',
        difficulty: 'expert',
        startBonus: 5000,
        feverStart: 15,
        feverEnd: 25,
        totalTurns: 40,
        targetScore: 200000,
        comboBonus: 0.15,
        actualComboCount: 150,
      }
      
      vi.mocked(useMusicStore).mockReturnValue({
        getSelectedMusic: () => customMusic,
        initialMental: 100,
        learningCorrection: 1.0,
      } as any)
      
      render(<SimulationControls />)
      
      const button = screen.getByText('シミュレート')
      expect(button).not.toBeDisabled()
    })
  })
})