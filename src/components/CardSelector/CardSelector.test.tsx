import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CardSelector } from './CardSelector'
import { useGameStore } from '../../stores/gameStore'
import { getAllCards } from '../../data'

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
    } as any)
    
    // Mock card data
    vi.mocked(getAllCards).mockReturnValue([
      {
        name: 'Test Card 1',
        displayName: 'Test Card Display 1',
        character: 'Test Character',
        shortCode: '[TC1]',
        apCost: 20,
        stats: { smile: 5000, pure: 4000, cool: 3000 },
        effects: [],
      },
    ])
  })

  describe('rendering', () => {
    it('should render all card slots', () => {
      render(<CardSelector index={0} />)
      
      // Should render card selector
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should show empty state for unselected cards', () => {
      render(<CardSelector index={0} />)
      
      // Should show "カードを選択" text
      expect(screen.getByText('カードを選択')).toBeInTheDocument()
    })
  })
})