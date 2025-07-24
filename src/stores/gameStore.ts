import { create } from 'zustand'
import { Card } from '../core/models/Card'
import { Music } from '../core/models/Music'
import { GameState, SimulationOptions } from '../core/models/Game'
import { GameSimulator } from '../core/simulation/GameSimulator'
import { cardData } from '../data/index'
import {
  saveCardSkillLevel,
  loadCardSkillLevel,
  saveCardCenterSkillLevel,
  loadCardCenterSkillLevel,
  loadAllCardSkillLevels,
  loadAllCenterSkillLevels,
  saveCurrentFormation,
  loadCurrentFormation,
  saveMusicState,
  loadMusicState,
  isShareMode
} from '../services/localStorageService'

interface GameStore {
  // Selected cards and their skill levels
  selectedCards: (Card | null)[]
  cardSkillLevels: number[]
  centerSkillLevels: number[]
  
  // Custom skill values (user overrides)
  customSkillValues: Record<string, Record<string, number>>
  customCenterSkillValues: Record<string, Record<string, number>>
  
  // Selected music
  selectedMusic: Music | null
  selectedDifficulty: 'normal' | 'hard' | 'expert' | 'master'
  
  // Game settings
  initialMental: number
  comboCount: number
  
  // Simulation results
  simulationResult: GameState | null
  isSimulating: boolean
  
  // Actions
  setCard: (index: number, card: Card | null) => void
  setCardSkillLevel: (index: number, level: number) => void
  setCenterSkillLevel: (index: number, level: number) => void
  loadStoredSkillLevels: () => void
  saveFormation: () => void
  loadFormation: () => void
  setCustomSkillValue: (cardIndex: number, effectKey: string, value: number) => void
  clearCustomSkillValues: (cardIndex: number) => void
  setCustomCenterSkillValue: (cardIndex: number, effectKey: string, value: number) => void
  clearCustomCenterSkillValues: (cardIndex: number) => void
  setMusic: (music: Music | null) => void
  setDifficulty: (difficulty: 'normal' | 'hard' | 'expert' | 'master') => void
  setInitialMental: (mental: number) => void
  setComboCount: (count: number) => void
  runSimulation: () => void
  clearSimulation: () => void
  generateShareUrl: () => string
  loadFromShareUrl: (params: URLSearchParams) => void
  swapCards: (fromIndex: number, toIndex: number) => void
  insertCard: (fromIndex: number, toIndex: number, insertBefore: boolean) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  selectedCards: Array(6).fill(null),
  cardSkillLevels: Array(6).fill(10),
  centerSkillLevels: Array(6).fill(10),
  customSkillValues: {},
  customCenterSkillValues: {},
  selectedMusic: null,
  selectedDifficulty: 'master',
  initialMental: 100,
  comboCount: 100,
  simulationResult: null,
  isSimulating: false,
  
  // Actions
  setCard: (index, card) => set((state) => {
    const newCards = [...state.selectedCards]
    newCards[index] = card
    
    // ローカルストレージから保存されたスキルレベルを読み込む
    if (card && !isShareMode()) {
      const savedSkillLevel = loadCardSkillLevel(card.name)
      const savedCenterSkillLevel = loadCardCenterSkillLevel(card.name)
      
      console.log(`Loading skill levels for ${card.name}:`, { savedSkillLevel, savedCenterSkillLevel })
      
      const newSkillLevels = [...state.cardSkillLevels]
      const newCenterSkillLevels = [...state.centerSkillLevels]
      
      newSkillLevels[index] = savedSkillLevel
      newCenterSkillLevels[index] = savedCenterSkillLevel
      
      // 楽曲ごとに編成を保存
      if (state.selectedMusic && state.selectedMusic.name !== 'カスタム' && 
          !state.selectedMusic.name.startsWith('custom_')) {
        const cardNames = newCards.map(c => c?.name || '')
        saveMusicState(state.selectedMusic.name, {
          cards: cardNames,
          mental: state.initialMental,
          learningCorrection: 1.5
        })
      }
      
      return { 
        selectedCards: newCards,
        cardSkillLevels: newSkillLevels,
        centerSkillLevels: newCenterSkillLevels
      }
    }
    
    // 楽曲ごとに編成を保存（カードをnullにした場合も）
    if (!isShareMode() && state.selectedMusic && 
        state.selectedMusic.name !== 'カスタム' && 
        !state.selectedMusic.name.startsWith('custom_')) {
      const cardNames = newCards.map(c => c?.name || '')
      saveMusicState(state.selectedMusic.name, {
        cards: cardNames,
        mental: state.initialMental,
        learningCorrection: 1.5
      })
    }
    
    return { selectedCards: newCards }
  }),
  
  setCardSkillLevel: (index, level) => set((state) => {
    const newLevels = [...state.cardSkillLevels]
    newLevels[index] = level
    
    // ローカルストレージに保存
    const card = state.selectedCards[index]
    if (card && !isShareMode()) {
      console.log('Saving skill level:', card.name, level)
      saveCardSkillLevel(card.name, level)
    }
    
    return { cardSkillLevels: newLevels }
  }),
  
  setCenterSkillLevel: (index, level) => set((state) => {
    const newLevels = [...state.centerSkillLevels]
    newLevels[index] = level
    
    // ローカルストレージに保存
    const card = state.selectedCards[index]
    if (card && !isShareMode()) {
      saveCardCenterSkillLevel(card.name, level)
    }
    
    return { centerSkillLevels: newLevels }
  }),
  
  loadStoredSkillLevels: () => set((state) => {
    if (isShareMode()) {
      console.log('Share mode detected, skipping localStorage load')
      return state
    }
    
    const storedSkillLevels = loadAllCardSkillLevels()
    const storedCenterSkillLevels = loadAllCenterSkillLevels()
    
    console.log('Loading stored skill levels:', storedSkillLevels)
    console.log('Loading stored center skill levels:', storedCenterSkillLevels)
    
    const newSkillLevels = [...state.cardSkillLevels]
    const newCenterSkillLevels = [...state.centerSkillLevels]
    
    // 現在選択されているカードのスキルレベルを更新
    state.selectedCards.forEach((card, index) => {
      if (card && storedSkillLevels[card.name] !== undefined) {
        newSkillLevels[index] = storedSkillLevels[card.name]
      }
      if (card && storedCenterSkillLevels[card.name] !== undefined) {
        newCenterSkillLevels[index] = storedCenterSkillLevels[card.name]
      }
    })
    
    return {
      cardSkillLevels: newSkillLevels,
      centerSkillLevels: newCenterSkillLevels
    }
  }),
  
  saveFormation: () => {
    const state = get()
    if (isShareMode()) return
    
    const cardNames = state.selectedCards.map(card => card?.name || '')
    saveCurrentFormation(cardNames)
    
    // 楽曲ごとの編成も保存
    if (state.selectedMusic) {
      const musicKey = state.selectedMusic.name
      saveMusicState(musicKey, {
        cards: cardNames,
        skillLevels: state.cardSkillLevels,
        centerSkillLevels: state.centerSkillLevels
      })
    }
  },
  
  loadFormation: () => set((state) => {
    if (isShareMode()) return state
    
    // まず汎用的な編成を読み込む
    const savedFormation = loadCurrentFormation()
    console.log('Loading formation:', savedFormation)
    
    if (savedFormation && savedFormation.length === 6) {
      const newCards: (Card | null)[] = savedFormation.map(cardName => {
        if (!cardName) return null
        return cardData[cardName] || null
      })
      
      const newSkillLevels = [...state.cardSkillLevels]
      const newCenterSkillLevels = [...state.centerSkillLevels]
      
      // 各カードのスキルレベルを読み込む
      newCards.forEach((card, index) => {
        if (card) {
          const savedSkillLevel = loadCardSkillLevel(card.name)
          const savedCenterSkillLevel = loadCardCenterSkillLevel(card.name)
          newSkillLevels[index] = savedSkillLevel
          newCenterSkillLevels[index] = savedCenterSkillLevel
        }
      })
      
      return {
        selectedCards: newCards,
        cardSkillLevels: newSkillLevels,
        centerSkillLevels: newCenterSkillLevels
      }
    }
    
    return state
  }),
  
  setCustomSkillValue: (cardIndex, effectKey, value) => set((state) => {
    const newCustomValues = { ...state.customSkillValues }
    if (!newCustomValues[cardIndex]) {
      newCustomValues[cardIndex] = {}
    }
    newCustomValues[cardIndex][effectKey] = value
    return { customSkillValues: newCustomValues }
  }),
  
  clearCustomSkillValues: (cardIndex) => set((state) => {
    const newCustomValues = { ...state.customSkillValues }
    delete newCustomValues[cardIndex]
    return { customSkillValues: newCustomValues }
  }),
  
  setCustomCenterSkillValue: (cardIndex, effectKey, value) => set((state) => {
    const newCustomValues = { ...state.customCenterSkillValues }
    if (!newCustomValues[cardIndex]) {
      newCustomValues[cardIndex] = {}
    }
    newCustomValues[cardIndex][effectKey] = value
    return { customCenterSkillValues: newCustomValues }
  }),
  
  clearCustomCenterSkillValues: (cardIndex) => set((state) => {
    const newCustomValues = { ...state.customCenterSkillValues }
    delete newCustomValues[cardIndex]
    return { customCenterSkillValues: newCustomValues }
  }),
  
  setMusic: (music) => set((state) => {
    // 現在の楽曲の編成を保存（カスタム楽曲は除く）
    if (state.selectedMusic && !isShareMode() && 
        state.selectedMusic.name !== 'カスタム' && 
        !state.selectedMusic.name.startsWith('custom_')) {
      const currentMusicKey = state.selectedMusic.name
      const cardNames = state.selectedCards.map(card => card?.name || '')
      saveMusicState(currentMusicKey, {
        cards: cardNames,
        mental: state.initialMental,
        learningCorrection: 1.5 // v1互換のため固定値
      })
    }
    
    // 新しい楽曲の編成を読み込む
    if (music && !isShareMode() && music.name !== 'カスタム' && !music.name.startsWith('custom_')) {
      const newMusicKey = music.name
      const savedState = loadMusicState(newMusicKey)
      
      if (savedState) {
        console.log(`Loading saved state for ${newMusicKey}:`, savedState)
        
        const newCards: (Card | null)[] = savedState.cards.map(cardName => {
          if (!cardName) return null
          return cardData[cardName] || null
        })
        
        // 各カードのスキルレベルを個別に読み込む
        const newSkillLevels = [...state.cardSkillLevels]
        const newCenterSkillLevels = [...state.centerSkillLevels]
        
        newCards.forEach((card, index) => {
          if (card) {
            newSkillLevels[index] = loadCardSkillLevel(card.name)
            newCenterSkillLevels[index] = loadCardCenterSkillLevel(card.name)
          }
        })
        
        return {
          selectedMusic: music,
          selectedCards: newCards,
          cardSkillLevels: newSkillLevels,
          centerSkillLevels: newCenterSkillLevels,
          selectedDifficulty: state.selectedDifficulty,
          initialMental: savedState.mental !== undefined ? savedState.mental : state.initialMental,
          comboCount: state.comboCount
        }
      }
    }
    
    return { selectedMusic: music }
  }),
  
  setDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
  
  setInitialMental: (mental) => set((state) => {
    // 現在の楽曲の設定を保存（カスタム楽曲は除く）
    if (state.selectedMusic && !isShareMode() && 
        state.selectedMusic.name !== 'カスタム' && 
        !state.selectedMusic.name.startsWith('custom_')) {
      const musicKey = state.selectedMusic.name
      const cardNames = state.selectedCards.map(card => card?.name || '')
      saveMusicState(musicKey, {
        cards: cardNames,
        mental: mental,
        learningCorrection: 1.5
      })
    }
    return { initialMental: mental }
  }),
  
  setComboCount: (count) => set({ comboCount: count }),
  
  runSimulation: () => {
    const state = get()
    
    // Validate inputs
    if (!state.selectedMusic) return
    
    const hasAtLeastOneCard = state.selectedCards.some(card => card !== null)
    if (!hasAtLeastOneCard) return
    
    set({ isSimulating: true })
    
    try {
      const options: SimulationOptions = {
        cards: state.selectedCards,
        cardSkillLevels: state.cardSkillLevels,
        centerSkillLevels: state.centerSkillLevels,
        customSkillValues: state.customSkillValues,
        customCenterSkillValues: state.customCenterSkillValues,
        music: state.selectedMusic,
        musicAttribute: state.selectedMusic.attribute,
        centerCharacter: state.selectedMusic.centerCharacter,
        initialMental: state.initialMental,
        comboCount: state.comboCount
      }
      
      const simulator = new GameSimulator(options)
      const result = simulator.simulate()
      
      set({ simulationResult: result, isSimulating: false })
    } catch (error) {
      console.error('Simulation error:', error)
      set({ isSimulating: false })
    }
  },
  
  clearSimulation: () => set({ simulationResult: null }),
  
  generateShareUrl: () => {
    const state = get()
    const params = new URLSearchParams()
    
    // Add music
    if (state.selectedMusic) {
      if (state.selectedMusic.name === 'カスタム') {
        params.set('music', 'custom')
        params.set('phases', state.selectedMusic.phases.join(','))
        if (state.selectedMusic.centerCharacter) {
          params.set('center', state.selectedMusic.centerCharacter)
        }
        params.set('attribute', state.selectedMusic.attribute)
      } else {
        // Find the music key from the data
        params.set('music', state.selectedMusic.name)
      }
    }
    
    // Add cards
    state.selectedCards.forEach((card, index) => {
      if (card) {
        params.set(`c${index + 1}`, card.name)
        params.set(`s${index + 1}`, state.cardSkillLevels[index].toString())
      }
    })
    
    // Add other settings
    params.set('difficulty', state.selectedDifficulty)
    params.set('mental', state.initialMental.toString())
    params.set('combo', state.comboCount.toString())
    
    const baseUrl = window.location.origin + window.location.pathname
    return `${baseUrl}?${params.toString()}`
  },
  
  loadFromShareUrl: (params) => {
    // Load music
    const musicParam = params.get('music')
    if (musicParam === 'custom') {
      const phases = params.get('phases')?.split(',').map(Number) || [11, 7, 5]
      const customMusic: Music = {
        name: 'カスタム',
        phases: phases as [number, number, number],
        centerCharacter: params.get('center') || '',
        attribute: (params.get('attribute') || 'smile') as 'smile' | 'pure' | 'cool'
      }
      set({ selectedMusic: customMusic })
    } else if (musicParam) {
      // TODO: Find music by name from the music data
    }
    
    // Load cards
    const newCards: (Card | null)[] = Array(6).fill(null)
    const newSkillLevels: number[] = Array(6).fill(10)
    
    for (let i = 1; i <= 6; i++) {
      const cardName = params.get(`c${i}`)
      if (cardName) {
        // TODO: Find card by name from the card data
        const skillLevel = parseInt(params.get(`s${i}`) || '10')
        newSkillLevels[i - 1] = skillLevel
      }
    }
    
    set({ 
      selectedCards: newCards,
      cardSkillLevels: newSkillLevels
    })
    
    // Load other settings
    const difficulty = params.get('difficulty')
    if (difficulty && ['normal', 'hard', 'expert', 'master'].includes(difficulty)) {
      set({ selectedDifficulty: difficulty as any })
    }
    
    const mental = params.get('mental')
    if (mental) {
      set({ initialMental: parseInt(mental) })
    }
    
    const combo = params.get('combo')
    if (combo) {
      set({ comboCount: parseInt(combo) })
    }
  },
  
  swapCards: (fromIndex, toIndex) => set((state) => {
    const newCards = [...state.selectedCards]
    const newSkillLevels = [...state.cardSkillLevels]
    const newCenterSkillLevels = [...state.centerSkillLevels]
    const newCustomValues = { ...state.customSkillValues }
    const newCustomCenterValues = { ...state.customCenterSkillValues }
    
    // Swap cards
    const tempCard = newCards[fromIndex]
    newCards[fromIndex] = newCards[toIndex]
    newCards[toIndex] = tempCard
    
    // Swap skill levels
    const tempLevel = newSkillLevels[fromIndex]
    newSkillLevels[fromIndex] = newSkillLevels[toIndex]
    newSkillLevels[toIndex] = tempLevel
    
    // Swap center skill levels
    const tempCenterLevel = newCenterSkillLevels[fromIndex]
    newCenterSkillLevels[fromIndex] = newCenterSkillLevels[toIndex]
    newCenterSkillLevels[toIndex] = tempCenterLevel
    
    // Swap custom skill values
    const tempCustom = newCustomValues[fromIndex]
    newCustomValues[fromIndex] = newCustomValues[toIndex]
    newCustomValues[toIndex] = tempCustom
    
    // Swap custom center skill values
    const tempCustomCenter = newCustomCenterValues[fromIndex]
    newCustomCenterValues[fromIndex] = newCustomCenterValues[toIndex]
    newCustomCenterValues[toIndex] = tempCustomCenter
    
    return {
      selectedCards: newCards,
      cardSkillLevels: newSkillLevels,
      centerSkillLevels: newCenterSkillLevels,
      customSkillValues: newCustomValues,
      customCenterSkillValues: newCustomCenterValues
    }
  }),
  
  insertCard: (fromIndex, toIndex, insertBefore) => set((state) => {
    const newCards = [...state.selectedCards]
    const newSkillLevels = [...state.cardSkillLevels]
    const newCenterSkillLevels = [...state.centerSkillLevels]
    const newCustomValues = { ...state.customSkillValues }
    const newCustomCenterValues = { ...state.customCenterSkillValues }
    
    // Remove the dragged card data
    const draggedCard = newCards.splice(fromIndex, 1)[0]
    const draggedLevel = newSkillLevels.splice(fromIndex, 1)[0]
    const draggedCenterLevel = newCenterSkillLevels.splice(fromIndex, 1)[0]
    const draggedCustom = newCustomValues[fromIndex]
    const draggedCustomCenter = newCustomCenterValues[fromIndex]
    
    // Delete old custom values and shift remaining ones
    const tempCustom: Record<number, Record<string, number>> = {}
    Object.keys(newCustomValues).forEach(key => {
      const index = parseInt(key)
      if (index > fromIndex) {
        tempCustom[index - 1] = newCustomValues[index]
      } else if (index < fromIndex) {
        tempCustom[index] = newCustomValues[index]
      }
    })
    
    // Calculate new insert position
    let insertPos = toIndex
    if (!insertBefore) {
      insertPos++
    }
    if (fromIndex < toIndex) {
      insertPos--
    }
    
    // Insert at new position
    newCards.splice(insertPos, 0, draggedCard)
    newSkillLevels.splice(insertPos, 0, draggedLevel)
    newCenterSkillLevels.splice(insertPos, 0, draggedCenterLevel)
    
    // Rebuild custom values with new indices
    const finalCustomValues: Record<number, Record<string, number>> = {}
    const finalCustomCenterValues: Record<number, Record<string, number>> = {}
    
    // Handle regular custom values
    Object.keys(tempCustom).forEach(key => {
      const index = parseInt(key)
      if (index >= insertPos) {
        finalCustomValues[index + 1] = tempCustom[index]
      } else {
        finalCustomValues[index] = tempCustom[index]
      }
    })
    
    // Handle center custom values
    const tempCustomCenter: Record<number, Record<string, number>> = {}
    Object.keys(newCustomCenterValues).forEach(key => {
      const index = parseInt(key)
      if (index > fromIndex) {
        tempCustomCenter[index - 1] = newCustomCenterValues[index]
      } else if (index < fromIndex) {
        tempCustomCenter[index] = newCustomCenterValues[index]
      }
    })
    
    Object.keys(tempCustomCenter).forEach(key => {
      const index = parseInt(key)
      if (index >= insertPos) {
        finalCustomCenterValues[index + 1] = tempCustomCenter[index]
      } else {
        finalCustomCenterValues[index] = tempCustomCenter[index]
      }
    })
    
    // Add the dragged card's custom values at new position
    if (draggedCustom) {
      finalCustomValues[insertPos] = draggedCustom
    }
    if (draggedCustomCenter) {
      finalCustomCenterValues[insertPos] = draggedCustomCenter
    }
    
    return {
      selectedCards: newCards,
      cardSkillLevels: newSkillLevels,
      centerSkillLevels: newCenterSkillLevels,
      customSkillValues: finalCustomValues,
      customCenterSkillValues: finalCustomCenterValues
    }
  })
}))