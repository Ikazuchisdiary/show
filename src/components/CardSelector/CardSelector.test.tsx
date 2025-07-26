import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardSelector } from './CardSelector'
import { useGameStore } from '@stores/gameStore'
import type { FormationCard, CenterCard } from '@core/models'

// Mock the game store
vi.mock('@stores/gameStore', () => ({
  useGameStore: vi.fn(),
}))

describe('CardSelector', () => {
  const mockSetCenterCard = vi.fn()
  const mockSetFormationCard = vi.fn()
  const mockSwapFormationCards = vi.fn()

  const mockCenterCard: CenterCard = {
    name: 'Center Card',
    shortCode: '[C]',
    characterName: 'Center Character',
    type: '歌',
    appeal: 10000,
    centerBonus: {
      boost: 0.15,
      characteristic: '歌',
    },
  }

  const mockFormationCard: FormationCard = {
    name: 'Formation Card',
    shortCode: '[F]',
    characterName: 'Formation Character',
    type: '歌',
    appeal: 8000,
    skill: {
      level: 5,
      effects: [{
        type: 'scoreGain',
        value: 1000,
      }],
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mock implementation
    vi.mocked(useGameStore).mockReturnValue({
      centerCard: null,
      formationCards: [null, null, null, null, null],
      setCenterCard: mockSetCenterCard,
      setFormationCard: mockSetFormationCard,
      swapFormationCards: mockSwapFormationCards,
    } as any)
  })

  describe('rendering', () => {
    it('should render all card slots', () => {
      render(<CardSelector />)
      
      // Should have 1 center slot + 5 formation slots
      expect(screen.getByText('センター')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should show empty state for unselected cards', () => {
      render(<CardSelector />)
      
      const emptySlots = screen.getAllByText('カードを選択')
      expect(emptySlots).toHaveLength(6) // 1 center + 5 formation
    })

    it('should display selected cards', () => {
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: mockCenterCard,
        formationCards: [mockFormationCard, null, null, null, null],
        setCenterCard: mockSetCenterCard,
        setFormationCard: mockSetFormationCard,
        swapFormationCards: mockSwapFormationCards,
      } as any)
      
      render(<CardSelector />)
      
      expect(screen.getByText('Center Card')).toBeInTheDocument()
      expect(screen.getByText('Formation Card')).toBeInTheDocument()
    })

    it('should highlight center character in formation', () => {
      const centerMatchingCard = {
        ...mockFormationCard,
        characterName: 'Center Character', // Same as center
      }
      
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: mockCenterCard,
        formationCards: [centerMatchingCard, null, null, null, null],
        setCenterCard: mockSetCenterCard,
        setFormationCard: mockSetFormationCard,
        swapFormationCards: mockSwapFormationCards,
      } as any)
      
      render(<CardSelector />)
      
      // Check for center highlight class
      const formationCard = screen.getByText('Formation Card').closest('.card')
      expect(formationCard).toHaveClass('center-highlight')
    })
  })

  describe('card selection', () => {
    it('should open selector modal when clicking empty slot', async () => {
      const user = userEvent.setup()
      render(<CardSelector />)
      
      const emptySlot = screen.getAllByText('カードを選択')[0]
      await user.click(emptySlot)
      
      // Modal should be open
      await waitFor(() => {
        expect(screen.getByPlaceholderText('カード名で検索')).toBeInTheDocument()
      })
    })

    it('should filter cards by search term', async () => {
      const user = userEvent.setup()
      render(<CardSelector />)
      
      // Open selector
      const emptySlot = screen.getAllByText('カードを選択')[0]
      await user.click(emptySlot)
      
      // Type search term
      const searchInput = screen.getByPlaceholderText('カード名で検索')
      await user.type(searchInput, '姫芽')
      
      // Should show filtered results
      await waitFor(() => {
        const cards = screen.getAllByRole('button', { name: /姫芽/ })
        expect(cards.length).toBeGreaterThan(0)
      })
    })

    it('should group cards by character', async () => {
      const user = userEvent.setup()
      render(<CardSelector />)
      
      // Open selector
      const emptySlot = screen.getAllByText('カードを選択')[0]
      await user.click(emptySlot)
      
      // Should show character groups
      await waitFor(() => {
        expect(screen.getByText('102期')).toBeInTheDocument()
        expect(screen.getByText('103期')).toBeInTheDocument()
        expect(screen.getByText('104期')).toBeInTheDocument()
      })
    })

    it('should call setCenterCard when selecting center card', async () => {
      const user = userEvent.setup()
      render(<CardSelector />)
      
      // Open center selector
      const centerSlot = screen.getByText('センター').parentElement
      await user.click(centerSlot!)
      
      // Wait for cards to load and click first one
      await waitFor(() => {
        const cards = screen.getAllByRole('button', { name: /カード/ })
        expect(cards.length).toBeGreaterThan(0)
      })
      
      const firstCard = screen.getAllByRole('button', { name: /カード/ })[0]
      await user.click(firstCard)
      
      expect(mockSetCenterCard).toHaveBeenCalled()
    })

    it('should call setFormationCard when selecting formation card', async () => {
      const user = userEvent.setup()
      render(<CardSelector />)
      
      // Open formation selector for slot 1
      const formationSlot = screen.getByText('1').parentElement
      await user.click(formationSlot!)
      
      // Wait for cards to load and click first one
      await waitFor(() => {
        const cards = screen.getAllByRole('button', { name: /カード/ })
        expect(cards.length).toBeGreaterThan(0)
      })
      
      const firstCard = screen.getAllByRole('button', { name: /カード/ })[0]
      await user.click(firstCard)
      
      expect(mockSetFormationCard).toHaveBeenCalledWith(0, expect.any(Object))
    })
  })

  describe('skill parameter editing', () => {
    it('should show skill parameters for cards with skills', () => {
      const cardWithSkill: FormationCard = {
        ...mockFormationCard,
        skill: {
          level: 5,
          effects: [{
            type: 'scoreGain',
            value: 1000,
          }],
        },
      }
      
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: null,
        formationCards: [cardWithSkill, null, null, null, null],
        setCenterCard: mockSetCenterCard,
        setFormationCard: mockSetFormationCard,
        swapFormationCards: mockSwapFormationCards,
      } as any)
      
      render(<CardSelector />)
      
      expect(screen.getByText('スコア獲得')).toBeInTheDocument()
      expect(screen.getByText('1000')).toBeInTheDocument()
    })

    it('should allow editing skill values', async () => {
      const user = userEvent.setup()
      const cardWithSkill: FormationCard = {
        ...mockFormationCard,
        skill: {
          level: 5,
          effects: [{
            type: 'scoreGain',
            value: 1000,
          }],
        },
      }
      
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: null,
        formationCards: [cardWithSkill, null, null, null, null],
        setCenterCard: mockSetCenterCard,
        setFormationCard: mockSetFormationCard,
        swapFormationCards: mockSwapFormationCards,
      } as any)
      
      render(<CardSelector />)
      
      // Click to edit
      const skillValue = screen.getByText('1000')
      await user.click(skillValue)
      
      // Should show input
      const input = screen.getByDisplayValue('1000')
      expect(input).toBeInTheDocument()
      
      // Change value
      await user.clear(input)
      await user.type(input, '2000')
      await user.keyboard('{Enter}')
      
      // Should call setFormationCard with updated value
      expect(mockSetFormationCard).toHaveBeenCalledWith(0, expect.objectContaining({
        skill: expect.objectContaining({
          effects: expect.arrayContaining([
            expect.objectContaining({
              type: 'scoreGain',
              value: 2000,
            })
          ])
        })
      }))
    })

    it('should display conditional effects properly', () => {
      const cardWithConditional: FormationCard = {
        ...mockFormationCard,
        skill: {
          level: 5,
          effects: [{
            type: 'conditional',
            condition: {
              type: 'voltage',
              threshold: 500,
              comparison: 'gte',
            },
            successEffects: [{
              type: 'scoreGain',
              value: 2000,
            }],
            failureEffects: [{
              type: 'scoreGain',
              value: 500,
            }],
          }],
        },
      }
      
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: null,
        formationCards: [cardWithConditional, null, null, null, null],
        setCenterCard: mockSetCenterCard,
        setFormationCard: mockSetFormationCard,
        swapFormationCards: mockSwapFormationCards,
      } as any)
      
      render(<CardSelector />)
      
      expect(screen.getByText('電圧が500以上')).toBeInTheDocument()
      expect(screen.getByText('成功時')).toBeInTheDocument()
      expect(screen.getByText('失敗時')).toBeInTheDocument()
    })
  })

  describe('drag and drop', () => {
    it('should handle drag start and end', () => {
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: null,
        formationCards: [mockFormationCard, mockFormationCard, null, null, null],
        setCenterCard: mockSetCenterCard,
        setFormationCard: mockSetFormationCard,
        swapFormationCards: mockSwapFormationCards,
      } as any)
      
      render(<CardSelector />)
      
      const firstCard = screen.getByText('1').parentElement!
      const secondCard = screen.getByText('2').parentElement!
      
      // Start drag
      fireEvent.dragStart(firstCard, {
        dataTransfer: {
          setData: vi.fn(),
          effectAllowed: 'move',
        },
      })
      
      // Drag over second card
      fireEvent.dragOver(secondCard, {
        preventDefault: vi.fn(),
        dataTransfer: {
          dropEffect: 'move',
        },
      })
      
      // Drop on second card
      fireEvent.drop(secondCard, {
        preventDefault: vi.fn(),
        dataTransfer: {
          getData: () => '0',
        },
      })
      
      expect(mockSwapFormationCards).toHaveBeenCalledWith(0, 1)
    })

    it('should show drop indicator during drag over', () => {
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: null,
        formationCards: [mockFormationCard, null, null, null, null],
        setCenterCard: mockSetCenterCard,
        setFormationCard: mockSetFormationCard,
        swapFormationCards: mockSwapFormationCards,
      } as any)
      
      render(<CardSelector />)
      
      const firstCard = screen.getByText('1').parentElement!
      const secondCard = screen.getByText('2').parentElement!
      
      // Start drag
      fireEvent.dragStart(firstCard)
      
      // Drag over second card
      fireEvent.dragOver(secondCard)
      
      // Should show drop indicator
      expect(secondCard).toHaveClass('drag-over')
      
      // Drag leave
      fireEvent.dragLeave(secondCard)
      
      // Should remove drop indicator
      expect(secondCard).not.toHaveClass('drag-over')
    })
  })

  describe('card deletion', () => {
    it('should show delete button on selected cards', () => {
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: mockCenterCard,
        formationCards: [mockFormationCard, null, null, null, null],
        setCenterCard: mockSetCenterCard,
        setFormationCard: mockSetFormationCard,
        swapFormationCards: mockSwapFormationCards,
      } as any)
      
      render(<CardSelector />)
      
      const deleteButtons = screen.getAllByRole('button', { name: /削除|×/ })
      expect(deleteButtons.length).toBeGreaterThan(0)
    })

    it('should call setCenterCard(null) when deleting center card', async () => {
      const user = userEvent.setup()
      
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: mockCenterCard,
        formationCards: [null, null, null, null, null],
        setCenterCard: mockSetCenterCard,
        setFormationCard: mockSetFormationCard,
        swapFormationCards: mockSwapFormationCards,
      } as any)
      
      render(<CardSelector />)
      
      const deleteButton = screen.getAllByRole('button', { name: /削除|×/ })[0]
      await user.click(deleteButton)
      
      expect(mockSetCenterCard).toHaveBeenCalledWith(null)
    })

    it('should call setFormationCard(index, null) when deleting formation card', async () => {
      const user = userEvent.setup()
      
      vi.mocked(useGameStore).mockReturnValue({
        centerCard: null,
        formationCards: [mockFormationCard, null, null, null, null],
        setCenterCard: mockSetCenterCard,
        setFormationCard: mockSetFormationCard,
        swapFormationCards: mockSwapFormationCards,
      } as any)
      
      render(<CardSelector />)
      
      const deleteButton = screen.getAllByRole('button', { name: /削除|×/ })[0]
      await user.click(deleteButton)
      
      expect(mockSetFormationCard).toHaveBeenCalledWith(0, null)
    })
  })
})