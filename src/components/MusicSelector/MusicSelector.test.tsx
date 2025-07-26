import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MusicSelector } from './MusicSelector'
import { useMusicStore } from '@stores/musicStore'
import type { Music } from '@core/models'

// Mock the music store
vi.mock('@stores/musicStore', () => ({
  useMusicStore: vi.fn(),
}))

describe('MusicSelector', () => {
  const mockSetSelectedMusicId = vi.fn()
  const mockSetInitialMental = vi.fn()
  const mockSetLearningCorrection = vi.fn()
  const mockAddCustomMusic = vi.fn()
  const mockUpdateCustomMusic = vi.fn()
  const mockDeleteCustomMusic = vi.fn()

  const mockDefaultMusic: Music[] = [
    {
      id: 'music1',
      name: 'Default Music 1',
      difficulty: 'expert',
      startBonus: 3000,
      feverStart: 10,
      feverEnd: 20,
      totalTurns: 30,
      targetScore: 100000,
      comboBonus: 0.1,
      actualComboCount: 100,
    },
    {
      id: 'music2',
      name: 'Default Music 2',
      difficulty: 'hard',
      startBonus: 2500,
      feverStart: 8,
      feverEnd: 18,
      totalTurns: 25,
      targetScore: 80000,
      comboBonus: 0.08,
      actualComboCount: 80,
    },
  ]

  const mockCustomMusic: Music = {
    id: 'custom_1',
    name: 'Custom Music',
    difficulty: 'expert',
    startBonus: 4000,
    feverStart: 12,
    feverEnd: 22,
    totalTurns: 35,
    targetScore: 120000,
    comboBonus: 0.12,
    actualComboCount: 110,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mock implementation
    vi.mocked(useMusicStore).mockReturnValue({
      selectedMusicId: null,
      initialMental: 100,
      learningCorrection: 1.0,
      customMusic: [],
      setSelectedMusicId: mockSetSelectedMusicId,
      setInitialMental: mockSetInitialMental,
      setLearningCorrection: mockSetLearningCorrection,
      addCustomMusic: mockAddCustomMusic,
      updateCustomMusic: mockUpdateCustomMusic,
      deleteCustomMusic: mockDeleteCustomMusic,
      getAllMusic: () => mockDefaultMusic,
      getSelectedMusic: () => null,
    } as any)
  })

  describe('rendering', () => {
    it('should render music dropdown', () => {
      render(<MusicSelector />)
      
      expect(screen.getByText('楽曲選択')).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should show placeholder when no music selected', () => {
      render(<MusicSelector />)
      
      expect(screen.getByRole('combobox')).toHaveValue('')
    })

    it('should show selected music', () => {
      vi.mocked(useMusicStore).mockReturnValue({
        selectedMusicId: 'music1',
        initialMental: 100,
        learningCorrection: 1.0,
        customMusic: [],
        setSelectedMusicId: mockSetSelectedMusicId,
        setInitialMental: mockSetInitialMental,
        setLearningCorrection: mockSetLearningCorrection,
        addCustomMusic: mockAddCustomMusic,
        updateCustomMusic: mockUpdateCustomMusic,
        deleteCustomMusic: mockDeleteCustomMusic,
        getAllMusic: () => mockDefaultMusic,
        getSelectedMusic: () => mockDefaultMusic[0],
      } as any)
      
      render(<MusicSelector />)
      
      expect(screen.getByRole('combobox')).toHaveValue('music1')
    })

    it('should display music info when selected', () => {
      vi.mocked(useMusicStore).mockReturnValue({
        selectedMusicId: 'music1',
        initialMental: 100,
        learningCorrection: 1.0,
        customMusic: [],
        setSelectedMusicId: mockSetSelectedMusicId,
        setInitialMental: mockSetInitialMental,
        setLearningCorrection: mockSetLearningCorrection,
        addCustomMusic: mockAddCustomMusic,
        updateCustomMusic: mockUpdateCustomMusic,
        deleteCustomMusic: mockDeleteCustomMusic,
        getAllMusic: () => mockDefaultMusic,
        getSelectedMusic: () => mockDefaultMusic[0],
      } as any)
      
      render(<MusicSelector />)
      
      // Should show music details
      expect(screen.getByText(/開始ボーナス:/)).toBeInTheDocument()
      expect(screen.getByText(/3000/)).toBeInTheDocument()
      expect(screen.getByText(/フィーバー:/)).toBeInTheDocument()
      expect(screen.getByText(/10〜20/)).toBeInTheDocument()
      expect(screen.getByText(/目標スコア:/)).toBeInTheDocument()
      expect(screen.getByText(/100,000/)).toBeInTheDocument()
    })
  })

  describe('music selection', () => {
    it('should call setSelectedMusicId when selecting music', async () => {
      const user = userEvent.setup()
      render(<MusicSelector />)
      
      const select = screen.getByRole('combobox')
      await user.selectOptions(select, 'music2')
      
      expect(mockSetSelectedMusicId).toHaveBeenCalledWith('music2')
    })

    it('should show custom music in dropdown', () => {
      vi.mocked(useMusicStore).mockReturnValue({
        selectedMusicId: null,
        initialMental: 100,
        learningCorrection: 1.0,
        customMusic: [mockCustomMusic],
        setSelectedMusicId: mockSetSelectedMusicId,
        setInitialMental: mockSetInitialMental,
        setLearningCorrection: mockSetLearningCorrection,
        addCustomMusic: mockAddCustomMusic,
        updateCustomMusic: mockUpdateCustomMusic,
        deleteCustomMusic: mockDeleteCustomMusic,
        getAllMusic: () => [...mockDefaultMusic, mockCustomMusic],
        getSelectedMusic: () => null,
      } as any)
      
      render(<MusicSelector />)
      
      const options = screen.getAllByRole('option')
      const customOption = options.find(opt => opt.textContent?.includes('Custom Music'))
      expect(customOption).toBeInTheDocument()
    })
  })

  describe('initial mental setting', () => {
    it('should render initial mental input', () => {
      render(<MusicSelector />)
      
      expect(screen.getByLabelText('初期メンタル')).toBeInTheDocument()
      expect(screen.getByDisplayValue('100')).toBeInTheDocument()
    })

    it('should call setInitialMental when changing value', async () => {
      const user = userEvent.setup()
      render(<MusicSelector />)
      
      const input = screen.getByLabelText('初期メンタル')
      await user.clear(input)
      await user.type(input, '80')
      
      await waitFor(() => {
        expect(mockSetInitialMental).toHaveBeenCalledWith(80)
      })
    })

    it('should show percentage display', () => {
      render(<MusicSelector />)
      
      expect(screen.getByText('100%')).toBeInTheDocument()
    })
  })

  describe('learning correction setting', () => {
    it('should render learning correction input', () => {
      render(<MusicSelector />)
      
      expect(screen.getByLabelText('ラーニング補正')).toBeInTheDocument()
      expect(screen.getByDisplayValue('1.00')).toBeInTheDocument()
    })

    it('should call setLearningCorrection when changing value', async () => {
      const user = userEvent.setup()
      render(<MusicSelector />)
      
      const input = screen.getByLabelText('ラーニング補正')
      await user.clear(input)
      await user.type(input, '1.50')
      
      await waitFor(() => {
        expect(mockSetLearningCorrection).toHaveBeenCalledWith(1.5)
      })
    })

    it('should format value to 2 decimal places', async () => {
      const user = userEvent.setup()
      
      vi.mocked(useMusicStore).mockReturnValue({
        selectedMusicId: null,
        initialMental: 100,
        learningCorrection: 1.23,
        customMusic: [],
        setSelectedMusicId: mockSetSelectedMusicId,
        setInitialMental: mockSetInitialMental,
        setLearningCorrection: mockSetLearningCorrection,
        addCustomMusic: mockAddCustomMusic,
        updateCustomMusic: mockUpdateCustomMusic,
        deleteCustomMusic: mockDeleteCustomMusic,
        getAllMusic: () => mockDefaultMusic,
        getSelectedMusic: () => null,
      } as any)
      
      render(<MusicSelector />)
      
      expect(screen.getByDisplayValue('1.23')).toBeInTheDocument()
    })
  })

  describe('custom music modal', () => {
    it('should open custom music modal when clicking button', async () => {
      const user = userEvent.setup()
      render(<MusicSelector />)
      
      const customButton = screen.getByText('カスタム楽曲')
      await user.click(customButton)
      
      await waitFor(() => {
        expect(screen.getByText('カスタム楽曲設定')).toBeInTheDocument()
      })
    })

    it('should show form fields in custom music modal', async () => {
      const user = userEvent.setup()
      render(<MusicSelector />)
      
      const customButton = screen.getByText('カスタム楽曲')
      await user.click(customButton)
      
      await waitFor(() => {
        expect(screen.getByLabelText('楽曲名')).toBeInTheDocument()
        expect(screen.getByLabelText('開始ボーナス')).toBeInTheDocument()
        expect(screen.getByLabelText('フィーバー開始')).toBeInTheDocument()
        expect(screen.getByLabelText('フィーバー終了')).toBeInTheDocument()
        expect(screen.getByLabelText('合計ターン数')).toBeInTheDocument()
        expect(screen.getByLabelText('目標スコア')).toBeInTheDocument()
        expect(screen.getByLabelText('コンボボーナス係数')).toBeInTheDocument()
        expect(screen.getByLabelText('コンボ数')).toBeInTheDocument()
      })
    })

    it('should add custom music when submitting form', async () => {
      const user = userEvent.setup()
      render(<MusicSelector />)
      
      // Open modal
      const customButton = screen.getByText('カスタム楽曲')
      await user.click(customButton)
      
      // Fill form
      await user.type(screen.getByLabelText('楽曲名'), 'New Custom Music')
      await user.clear(screen.getByLabelText('開始ボーナス'))
      await user.type(screen.getByLabelText('開始ボーナス'), '5000')
      await user.clear(screen.getByLabelText('フィーバー開始'))
      await user.type(screen.getByLabelText('フィーバー開始'), '15')
      await user.clear(screen.getByLabelText('フィーバー終了'))
      await user.type(screen.getByLabelText('フィーバー終了'), '25')
      await user.clear(screen.getByLabelText('合計ターン数'))
      await user.type(screen.getByLabelText('合計ターン数'), '40')
      await user.clear(screen.getByLabelText('目標スコア'))
      await user.type(screen.getByLabelText('目標スコア'), '150000')
      
      // Submit
      const saveButton = screen.getByText('保存')
      await user.click(saveButton)
      
      expect(mockAddCustomMusic).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Custom Music',
        startBonus: 5000,
        feverStart: 15,
        feverEnd: 25,
        totalTurns: 40,
        targetScore: 150000,
      }))
    })

    it('should validate form inputs', async () => {
      const user = userEvent.setup()
      render(<MusicSelector />)
      
      // Open modal
      const customButton = screen.getByText('カスタム楽曲')
      await user.click(customButton)
      
      // Try to submit without filling required fields
      const saveButton = screen.getByText('保存')
      await user.click(saveButton)
      
      // Should not call addCustomMusic
      expect(mockAddCustomMusic).not.toHaveBeenCalled()
    })

    it('should edit existing custom music', async () => {
      const user = userEvent.setup()
      
      vi.mocked(useMusicStore).mockReturnValue({
        selectedMusicId: mockCustomMusic.id,
        initialMental: 100,
        learningCorrection: 1.0,
        customMusic: [mockCustomMusic],
        setSelectedMusicId: mockSetSelectedMusicId,
        setInitialMental: mockSetInitialMental,
        setLearningCorrection: mockSetLearningCorrection,
        addCustomMusic: mockAddCustomMusic,
        updateCustomMusic: mockUpdateCustomMusic,
        deleteCustomMusic: mockDeleteCustomMusic,
        getAllMusic: () => [...mockDefaultMusic, mockCustomMusic],
        getSelectedMusic: () => mockCustomMusic,
      } as any)
      
      render(<MusicSelector />)
      
      // Open modal
      const customButton = screen.getByText('カスタム楽曲')
      await user.click(customButton)
      
      // Should show existing music for editing
      await waitFor(() => {
        expect(screen.getByDisplayValue('Custom Music')).toBeInTheDocument()
      })
      
      // Edit name
      const nameInput = screen.getByLabelText('楽曲名')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Custom Music')
      
      // Save
      const saveButton = screen.getByText('保存')
      await user.click(saveButton)
      
      expect(mockUpdateCustomMusic).toHaveBeenCalledWith(
        mockCustomMusic.id,
        expect.objectContaining({
          name: 'Updated Custom Music',
        })
      )
    })

    it('should delete custom music', async () => {
      const user = userEvent.setup()
      
      vi.mocked(useMusicStore).mockReturnValue({
        selectedMusicId: mockCustomMusic.id,
        initialMental: 100,
        learningCorrection: 1.0,
        customMusic: [mockCustomMusic],
        setSelectedMusicId: mockSetSelectedMusicId,
        setInitialMental: mockSetInitialMental,
        setLearningCorrection: mockSetLearningCorrection,
        addCustomMusic: mockAddCustomMusic,
        updateCustomMusic: mockUpdateCustomMusic,
        deleteCustomMusic: mockDeleteCustomMusic,
        getAllMusic: () => [...mockDefaultMusic, mockCustomMusic],
        getSelectedMusic: () => mockCustomMusic,
      } as any)
      
      render(<MusicSelector />)
      
      // Open modal
      const customButton = screen.getByText('カスタム楽曲')
      await user.click(customButton)
      
      // Click delete button
      const deleteButton = screen.getByText('削除')
      await user.click(deleteButton)
      
      expect(mockDeleteCustomMusic).toHaveBeenCalledWith(mockCustomMusic.id)
    })
  })

  describe('accessibility', () => {
    it('should have proper labels for all inputs', () => {
      render(<MusicSelector />)
      
      expect(screen.getByLabelText('楽曲選択')).toBeInTheDocument()
      expect(screen.getByLabelText('初期メンタル')).toBeInTheDocument()
      expect(screen.getByLabelText('ラーニング補正')).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<MusicSelector />)
      
      // Tab through elements
      await user.tab()
      expect(screen.getByRole('combobox')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByLabelText('初期メンタル')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByLabelText('ラーニング補正')).toHaveFocus()
    })
  })
})