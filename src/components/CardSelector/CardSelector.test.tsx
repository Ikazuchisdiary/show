import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CardSelector } from './CardSelector'
import { useGameStore } from '../../stores/gameStore'
import { getAllCards, getCardsByCharacter } from '../../data'

// Mock stores and data
vi.mock('../../stores/gameStore')
vi.mock('../../data')

describe('CardSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock store state
    vi.mocked(useGameStore).mockReturnValue({
      selectedCards: Array(6).fill(null),
      cardSkillLevels: Array(6).fill(14),
      centerSkillLevels: Array(6).fill(14),
      customSkillValues: {},
      customCenterSkillValues: {},
      centerCharacter: null,
      setCard: vi.fn(),
      setCardSkillLevel: vi.fn(),
      setCenterSkillLevel: vi.fn(),
      setCustomSkillValue: vi.fn(),
      clearCustomSkillValues: vi.fn(),
      setCustomCenterSkillValue: vi.fn(),
      clearCustomCenterSkillValues: vi.fn(),
      swapCards: vi.fn(),
      insertCard: vi.fn(),
    } as ReturnType<typeof useGameStore>)

    // Mock card data
    const mockCards = [
      {
        name: 'Test Card 1',
        displayName: 'Test Card Display 1',
        character: 'Test Character',
        shortCode: '[TC1]',
        apCost: 20,
        stats: { smile: 5000, pure: 4000, cool: 3000, mental: 100 },
        effects: [],
      },
    ]

    vi.mocked(getAllCards).mockReturnValue(mockCards)
    vi.mocked(getCardsByCharacter).mockImplementation((character) =>
      mockCards.filter((card) => card.character === character),
    )
  })

  describe('rendering', () => {
    it('should render all card slots', () => {
      render(<CardSelector index={0} />)

      // Should render card selector input
      expect(screen.getByPlaceholderText('カード名で検索...')).toBeInTheDocument()
    })

    it('should show empty state for unselected cards', () => {
      render(<CardSelector index={0} />)

      // Should show "未選択" text in dropdown
      expect(screen.getAllByText('未選択')).toHaveLength(2) // option and div
    })
  })
})
