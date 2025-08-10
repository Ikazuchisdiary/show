import { create } from 'zustand'
import { Card } from '../core/models/Card'
import { Music, CustomMusic } from '../core/models/Music'
import { GameState, SimulationOptions } from '../core/models/Game'
import { GameSimulator } from '../core/simulation/GameSimulator'
import { cardData, musicData } from '../data/index'
import { calculateBaseAP } from '../utils/calculateBaseAP'
import {
  saveCardSkillLevel,
  loadCardSkillLevel,
  saveCardCenterSkillLevel,
  loadCardCenterSkillLevel,
  loadAllCardSkillLevels,
  loadAllCenterSkillLevels,
  saveMusicState,
  loadMusicState,
  isShareMode,
} from '../services/localStorageService'
import { useMusicStore } from './musicStore'

interface ShareCardData {
  card: string
  skillLevel: number
  centerSkillLevel: number
  customSkillValues?: Record<string, number>
  customCenterSkillValues?: Record<string, number>
  centerActive?: boolean
}

interface ShareData {
  mental: string
  learningCorrection: string
  music: string
  customMusic: number[] | null
  customCenter: string | null
  customAttribute: string | null
  customMusicName: string | null
  customCombos?: Record<string, number>
  cards: ShareCardData[]
  centerActivations?: boolean[]
}

interface GameStore {
  // Selected cards and their skill levels
  selectedCards: (Card | null)[]
  cardSkillLevels: number[]
  centerSkillLevels: number[]

  // Custom skill values (user overrides)
  customSkillValues: Record<string, Record<string, number>>
  customCenterSkillValues: Record<string, Record<string, number>>
  
  // Center skill/characteristic activation flags
  centerActivations: boolean[]

  // Selected music
  selectedMusic: Music | null
  selectedDifficulty: 'normal' | 'hard' | 'expert' | 'master'

  // Game settings
  initialMental: number
  comboCount: number
  centerCharacter: string | null
  learningCorrection: number

  // Custom music list
  customMusicList: Record<string, Music>

  // Simulation results
  simulationResult: GameState | null
  isSimulating: boolean

  // Share mode
  isShareMode: boolean
  
  // Optimization state
  isOptimizing: boolean
  optimizationResult: {
    bestFormation: (Card | null)[]
    bestScore: number
    originalScore: number
    improvement: number
  } | null
  
  // Fixed card positions for optimization
  fixedPositions: Set<number>

  // Actions
  setCard: (index: number, card: Card | null) => void
  setCardSkillLevel: (index: number, level: number) => void
  setCenterSkillLevel: (index: number, level: number) => void
  loadStoredSkillLevels: () => void
  setCustomSkillValue: (cardIndex: number, effectKey: string, value: number) => void
  clearCustomSkillValues: (cardIndex: number) => void
  setCustomCenterSkillValue: (cardIndex: number, effectKey: string, value: number) => void
  clearCustomCenterSkillValues: (cardIndex: number) => void
  setCenterActivation: (index: number, active: boolean) => void
  setMusic: (music: Music | null) => void
  setDifficulty: (difficulty: 'normal' | 'hard' | 'expert' | 'master') => void
  setInitialMental: (mental: number) => void
  setComboCount: (count: number) => void
  setCenterCharacter: (character: string | null) => void
  setLearningCorrection: (correction: number) => void
  runSimulation: () => void
  clearSimulation: () => void
  generateShareUrl: () => string
  loadFromShareUrl: (params: URLSearchParams) => void
  swapCards: (fromIndex: number, toIndex: number) => void
  insertCard: (fromIndex: number, toIndex: number, insertBefore: boolean) => void
  loadCustomMusicList: () => void
  saveCustomMusic: (name: string, music: Music) => void
  deleteCustomMusic: (key: string) => void
  setShareMode: (enabled: boolean) => void
  exitShareMode: () => void
  saveSharedAsCustomMusic: (name: string) => void
  optimizeFormation: () => void
  toggleFixedPosition: (index: number) => void
  clearFixedPositions: () => void
}

// Helper function to get music key from music object
const getMusicKey = (music: Music): string => {
  const musicWithId = music as Music & { id?: string }
  // Check for custom music - following v1 pattern
  if (!music || musicWithId.id === 'custom' || musicWithId.id?.startsWith('custom_')) {
    return musicWithId.id || 'custom'
  }
  if (music.name === 'カスタム') {
    return 'custom'
  }
  // Find the key in musicData that corresponds to this music
  const musicKey = Object.keys(musicData).find((key) => musicData[key].name === music.name)
  return musicKey || music.name
}

// Helper function to save formation for current music
const saveFormationForMusic = (state: GameStore): void => {
  if (!state.selectedMusic) return

  const musicKey = getMusicKey(state.selectedMusic)
  // Don't save custom music states - following v1
  if (musicKey === 'custom' || musicKey.startsWith('custom_')) return

  const formationData = {
    cards: state.selectedCards.map((card) => card?.name || null),
    cardSkillLevels: state.cardSkillLevels,
    centerSkillLevels: state.centerSkillLevels,
    customSkillValues: state.customSkillValues,
    customCenterSkillValues: state.customCenterSkillValues,
    selectedDifficulty: state.selectedDifficulty,
    initialMental: state.initialMental,
    comboCount: state.comboCount,
  }

  const key = `sukushou_state_${musicKey}`
  localStorage.setItem(key, JSON.stringify(formationData))
}

// Compress share data to shorter format (v1 compatible)
const compressShareData = (data: ShareData): string => {
  const parts: string[] = []

  // Add version number
  parts.push('v2')

  // Mental and learning correction (omit if default)
  if (data.mental !== '100') parts.push('m' + data.mental)
  if (data.learningCorrection !== '1.5') parts.push('l' + data.learningCorrection)

  // Music handling
  if (data.music === 'custom' || (data.music && data.music.startsWith('custom_'))) {
    parts.push('Mc')

    // Define abbreviation maps
    const centerAbbr: Record<string, string> = {
      乙宗梢: 'k',
      夕霧綴理: 't',
      藤島慈: 'j',
      日野下花帆: 'h',
      村野さやか: 's',
      大沢瑠璃乃: 'r',
      百生吟子: 'g',
      徒町小鈴: 'o',
      安養寺姫芽: 'i',
      桂城泉: 'z',
      'セラス 柳田 リリエンフェルト': 'c',
    }
    const attrAbbr: Record<string, string> = { smile: 's', pure: 'p', cool: 'c' }

    // Custom music data
    if (data.customMusic) {
      parts.push('p' + data.customMusic.join(','))
    }
    if (data.customCenter) {
      parts.push('c' + (centerAbbr[data.customCenter] || ''))
    }
    if (data.customAttribute) {
      parts.push('a' + (attrAbbr[data.customAttribute] || ''))
    }
    if (data.customCombos) {
      const comboStr = [
        data.customCombos.normal || '',
        data.customCombos.hard || '',
        data.customCombos.expert || '',
        data.customCombos.master || '',
      ].join(',')
      if (comboStr.replace(/,/g, '')) {
        parts.push('b' + comboStr)
      }
    }
    if (data.customMusicName) {
      parts.push('n' + encodeURIComponent(data.customMusicName))
    }
  } else if (data.music) {
    // Regular music - use ID with underscores replaced
    parts.push('M' + data.music.replace(/_/g, '-'))
  }

  // Cards
  for (const cardInfo of data.cards) {
    // Find card in global cardData to get short code
    let shortCode = cardInfo.card
    for (const [_key, cardItem] of Object.entries(cardData)) {
      if (cardItem.name === cardInfo.card || cardItem.displayName === cardInfo.card) {
        shortCode = cardItem.shortCode || cardInfo.card
        break
      }
    }

    // Card: shortCode-skillLevel+centerSkillLevel
    let cardPart = 'C' + shortCode

    // Only add skill level if not 14 (v1 default)
    if (cardInfo.skillLevel !== 14) {
      cardPart += '-' + cardInfo.skillLevel
    }

    // Add center skill if different from skill level
    if (
      cardInfo.centerSkillLevel &&
      cardInfo.centerSkillLevel !== cardInfo.skillLevel &&
      cardInfo.centerSkillLevel !== 14
    ) {
      cardPart += '+' + cardInfo.centerSkillLevel
    }

    // Add custom values if exist (using * for v1 compatibility)
    if (cardInfo.customSkillValues || cardInfo.customCenterSkillValues) {
      // Encode custom values as JSON
      const customData = {
        s: cardInfo.customSkillValues,
        c: cardInfo.customCenterSkillValues,
      }
      cardPart += '*' + encodeURIComponent(JSON.stringify(customData))
    }

    parts.push(cardPart)
  }
  
  // Add center activations if any are disabled
  if (data.centerActivations && data.centerActivations.some(active => !active)) {
    parts.push('S' + data.centerActivations.map(a => a ? '1' : '0').join(''))
  }

  // Encode to base64
  const encoded = btoa(parts.join('_')).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '.')
  return encoded
}

// Decompress share data from short format
const decompressShareData = (compressed: string): ShareData => {
  try {
    // Decode base64 (restore padding)
    const encoded = compressed.replace(/-/g, '+').replace(/\./g, '/')
    const padding = '='.repeat((4 - (encoded.length % 4)) % 4)
    const decoded = atob(encoded + padding)

    const parts = decoded.split('_')
    const data: ShareData = {
      mental: '100',
      learningCorrection: '1.5',
      music: '',
      customMusic: null,
      customCenter: null,
      customAttribute: null,
      customMusicName: null,
      cards: [],
    }

    // Check version
    // let _version = 'v0'
    if (parts[0] && parts[0].startsWith('v')) {
      // _version = parts.shift()!
      parts.shift()!
    }

    const centerNames: Record<string, string> = {
      k: '乙宗梢',
      t: '夕霧綴理',
      j: '藤島慈',
      h: '日野下花帆',
      s: '村野さやか',
      r: '大沢瑠璃乃',
      g: '百生吟子',
      o: '徒町小鈴',
      i: '安養寺姫芽',
      z: '桂城泉',
      c: 'セラス 柳田 リリエンフェルト',
    }
    const attrNames: Record<string, string> = { s: 'smile', p: 'pure', c: 'cool' }

    for (const part of parts) {
      if (!part) continue

      const type = part[0]
      const value = part.substring(1)

      switch (type) {
        case 'm': // mental
          data.mental = value
          break
        case 'l': // learning correction
          data.learningCorrection = value
          break
        case 'M': // music
          if (value === 'c') {
            data.music = 'custom'
          } else {
            // Restore underscores
            data.music = value.replace(/-/g, '_')
          }
          break
        case 'p': // phases
          data.customMusic = value.split(',').map((v) => parseInt(v))
          break
        case 'c': // center character
          data.customCenter = centerNames[value] || null
          break
        case 'a': // attribute
          data.customAttribute = attrNames[value] || null
          break
        case 'b': {
          // combos
          const comboParts = value.split(',')
          data.customCombos = {}
          if (comboParts[0]) data.customCombos.normal = parseInt(comboParts[0])
          if (comboParts[1]) data.customCombos.hard = parseInt(comboParts[1])
          if (comboParts[2]) data.customCombos.expert = parseInt(comboParts[2])
          if (comboParts[3]) data.customCombos.master = parseInt(comboParts[3])
          break
        }
        case 'n': // custom music name
          data.customMusicName = decodeURIComponent(value)
          break
        case 'C': {
          // card
          let baseValue = value
          let skillLevel = 14 // v1 default
          let centerSkillLevel = 14 // v1 default
          let customDataStr = ''

          // Extract custom data if exists (after *)
          const customParts = baseValue.split('*')
          if (customParts.length > 1) {
            baseValue = customParts[0]
            customDataStr = customParts[1]
          }

          // Extract center skill level if exists (after +)
          const centerParts = baseValue.split('+')
          if (centerParts.length > 1) {
            baseValue = centerParts[0]
            centerSkillLevel = parseInt(centerParts[1]) || 14
          }

          // Split remaining by - for card code and skill level
          const cardParts = baseValue.split('-')
          const shortCode = cardParts[0]
          if (cardParts.length > 1) {
            skillLevel = parseInt(cardParts[1]) || 14
          }

          // If no center skill specified, use skill level
          if (centerParts.length === 1) {
            centerSkillLevel = skillLevel
          }

          const cardData: ShareCardData = {
            card: shortCode, // Will be converted to full name later
            skillLevel: skillLevel,
            centerSkillLevel: centerSkillLevel,
          }

          // Parse custom values if exist
          if (customDataStr) {
            try {
              const customData = JSON.parse(decodeURIComponent(customDataStr))
              if (customData.s) cardData.customSkillValues = customData.s
              if (customData.c) cardData.customCenterSkillValues = customData.c
            } catch (e) {
              console.error('Failed to parse custom values:', e)
            }
          }

          data.cards.push(cardData)
          break
        }
        
        case 'S': {
          // Center activations
          const activations = value.split('').map(v => v === '1')
          data.centerActivations = activations
          break
        }
      }
    }

    return data
  } catch (e) {
    console.error('Failed to decompress share data:', e)
    // Return default data on error
    return {
      mental: '100',
      learningCorrection: '1.5',
      music: '',
      customMusic: null,
      customCenter: null,
      customAttribute: null,
      customMusicName: null,
      cards: [],
    }
  }
}

// Helper function to load custom music list from localStorage
const loadCustomMusicListFromStorage = (): Record<string, Music> => {
  try {
    const saved = localStorage.getItem('sukushou_custom_music_list')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load custom music list:', e)
  }
  return {}
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  selectedCards: Array(6).fill(null),
  cardSkillLevels: Array(6).fill(14),
  centerSkillLevels: Array(6).fill(14),
  customSkillValues: {},
  customCenterSkillValues: {},
  centerActivations: Array(6).fill(true),
  selectedMusic: null,
  selectedDifficulty: 'master',
  initialMental: 100,
  comboCount: 100,
  centerCharacter: null,
  learningCorrection: 1.5,
  customMusicList: loadCustomMusicListFromStorage(),
  simulationResult: null,
  isSimulating: false,
  isShareMode: false,
  isOptimizing: false,
  optimizationResult: null,
  fixedPositions: new Set(),

  // Actions
  setCard: (index, card) =>
    set((state) => {
      const newCards = [...state.selectedCards]
      newCards[index] = card
      
      // カードを変更したら固定状態を解除
      const newFixedPositions = new Set(state.fixedPositions)
      if (card === null) {
        newFixedPositions.delete(index)
      }

      // ローカルストレージから保存されたスキルレベルを読み込む
      if (card && !isShareMode()) {
        const cardKey = Object.keys(cardData).find((key) => cardData[key] === card) || ''
        const savedSkillLevel = loadCardSkillLevel(cardKey)
        const savedCenterSkillLevel = loadCardCenterSkillLevel(cardKey)

        // Loading skill levels for card

        const newSkillLevels = [...state.cardSkillLevels]
        const newCenterSkillLevels = [...state.centerSkillLevels]

        newSkillLevels[index] = savedSkillLevel
        newCenterSkillLevels[index] = savedCenterSkillLevel

        // 楽曲ごとに編成を保存
        if (
          state.selectedMusic &&
          state.selectedMusic.name !== 'カスタム' &&
          !state.selectedMusic.name.startsWith('custom_')
        ) {
          // カードのキーを取得する関数
          const getCardKey = (card: Card | null) => {
            if (!card) return ''
            // cardDataから該当するキーを探す
            return Object.keys(cardData).find((key) => cardData[key] === card) || ''
          }

          const cardKeys = newCards.map(getCardKey)
          const musicKey = getMusicKey(state.selectedMusic)
          saveMusicState(musicKey, {
            cards: cardKeys,
            mental: state.initialMental,
            learningCorrection: 1.5,
          })
        }

        return {
          selectedCards: newCards,
          cardSkillLevels: newSkillLevels,
          centerSkillLevels: newCenterSkillLevels,
          fixedPositions: newFixedPositions,
        }
      }

      // 楽曲ごとに編成を保存（カードをnullにした場合も）
      if (
        !isShareMode() &&
        state.selectedMusic &&
        state.selectedMusic.name !== 'カスタム' &&
        !state.selectedMusic.name.startsWith('custom_')
      ) {
        // カードのキーを取得する関数
        const getCardKey = (card: Card | null) => {
          if (!card) return ''
          return Object.keys(cardData).find((key) => cardData[key] === card) || ''
        }

        const cardKeys = newCards.map(getCardKey)
        const musicKey = getMusicKey(state.selectedMusic)
        saveMusicState(musicKey, {
          cards: cardKeys,
          mental: state.initialMental,
          learningCorrection: 1.5,
        })
      }

      return { selectedCards: newCards, fixedPositions: newFixedPositions }
    }),

  setCardSkillLevel: (index, level) =>
    set((state) => {
      const newLevels = [...state.cardSkillLevels]
      newLevels[index] = Math.max(1, Math.min(14, level))

      // ローカルストレージに保存
      const card = state.selectedCards[index]
      if (card && !isShareMode()) {
        const cardKey = Object.keys(cardData).find((key) => cardData[key] === card) || ''
        // Saving skill level
        saveCardSkillLevel(cardKey, level)
      }

      return { cardSkillLevels: newLevels }
    }),

  setCenterSkillLevel: (index, level) =>
    set((state) => {
      const newLevels = [...state.centerSkillLevels]
      newLevels[index] = Math.max(1, Math.min(14, level))

      // ローカルストレージに保存
      const card = state.selectedCards[index]
      if (card && !isShareMode()) {
        const cardKey = Object.keys(cardData).find((key) => cardData[key] === card) || ''
        saveCardCenterSkillLevel(cardKey, level)
      }

      return { centerSkillLevels: newLevels }
    }),

  loadStoredSkillLevels: () =>
    set((state) => {
      if (isShareMode()) {
        // Share mode detected, skipping localStorage load
        return state
      }

      const storedSkillLevels = loadAllCardSkillLevels()
      const storedCenterSkillLevels = loadAllCenterSkillLevels()

      // Loading stored skill levels from localStorage
      // console.log('Loading stored skill levels:', storedSkillLevels)
      // console.log('Loading stored center skill levels:', storedCenterSkillLevels)

      const newSkillLevels = [...state.cardSkillLevels]
      const newCenterSkillLevels = [...state.centerSkillLevels]

      // 現在選択されているカードのスキルレベルを更新
      state.selectedCards.forEach((card, index) => {
        if (card) {
          const cardKey = Object.keys(cardData).find((key) => cardData[key] === card) || ''
          if (storedSkillLevels[cardKey] !== undefined) {
            newSkillLevels[index] = storedSkillLevels[cardKey]
          }
          if (storedCenterSkillLevels[cardKey] !== undefined) {
            newCenterSkillLevels[index] = storedCenterSkillLevels[cardKey]
          }
        }
      })

      return {
        cardSkillLevels: newSkillLevels,
        centerSkillLevels: newCenterSkillLevels,
      }
    }),

  setCustomSkillValue: (cardIndex, effectKey, value) =>
    set((state) => {
      const newCustomValues = { ...state.customSkillValues }
      if (!newCustomValues[cardIndex]) {
        newCustomValues[cardIndex] = {}
      }
      newCustomValues[cardIndex][effectKey] = value
      return { customSkillValues: newCustomValues }
    }),

  clearCustomSkillValues: (cardIndex) =>
    set((state) => {
      const newCustomValues = { ...state.customSkillValues }
      delete newCustomValues[cardIndex]
      return { customSkillValues: newCustomValues }
    }),

  setCustomCenterSkillValue: (cardIndex, effectKey, value) =>
    set((state) => {
      const newCustomValues = { ...state.customCenterSkillValues }
      if (!newCustomValues[cardIndex]) {
        newCustomValues[cardIndex] = {}
      }
      newCustomValues[cardIndex][effectKey] = value
      return { customCenterSkillValues: newCustomValues }
    }),

  clearCustomCenterSkillValues: (cardIndex) =>
    set((state) => {
      const newCustomValues = { ...state.customCenterSkillValues }
      delete newCustomValues[cardIndex]
      return { customCenterSkillValues: newCustomValues }
    }),
    
  setCenterActivation: (index, active) =>
    set((state) => {
      const newActivations = [...state.centerActivations]
      newActivations[index] = active
      return { centerActivations: newActivations }
    }),

  setMusic: (music) =>
    set((state) => {
      // カードのキーを取得する関数
      const getCardKey = (card: Card | null) => {
        if (!card) return ''
        return Object.keys(cardData).find((key) => cardData[key] === card) || ''
      }

      // 現在の楽曲の編成を保存（カスタム楽曲は除く） - following v1
      const musicWithId = state.selectedMusic as Music & { id?: string }
      if (
        state.selectedMusic &&
        !isShareMode() &&
        musicWithId.id !== 'custom' &&
        !musicWithId.id?.startsWith('custom_')
      ) {
        const musicKey = getMusicKey(state.selectedMusic)
        const cardKeys = state.selectedCards.map(getCardKey)
        saveMusicState(musicKey, {
          cards: cardKeys,
          mental: state.initialMental,
          learningCorrection: 1.5, // v1互換のため固定値
        })
      }

      // 新しい楽曲の編成を読み込む
      if (
        music &&
        !isShareMode() &&
        music.name !== 'カスタム' &&
        !music.name.startsWith('custom_')
      ) {
        const newMusicKey = getMusicKey(music)
        const savedState = loadMusicState(newMusicKey)

        if (savedState) {
          // Loading saved state for music
          // console.log(`Loading saved state for ${newMusicKey}:`, savedState)

          const newCards: (Card | null)[] = savedState.cards.map((cardName) => {
            if (!cardName) return null
            const card = cardData[cardName]
            if (!card) {
              console.warn(`Card not found in music state: ${cardName}`)
            }
            return card || null
          })

          // 各カードのスキルレベルを個別に読み込む
          const newSkillLevels = [...state.cardSkillLevels]
          const newCenterSkillLevels = [...state.centerSkillLevels]

          newCards.forEach((card, index) => {
            if (card) {
              const cardKey = Object.keys(cardData).find((key) => cardData[key] === card) || ''
              newSkillLevels[index] = loadCardSkillLevel(cardKey)
              newCenterSkillLevels[index] = loadCardCenterSkillLevel(cardKey)
            }
          })

          return {
            selectedMusic: music,
            selectedCards: newCards,
            cardSkillLevels: newSkillLevels,
            centerSkillLevels: newCenterSkillLevels,
            selectedDifficulty: state.selectedDifficulty,
            initialMental:
              savedState.mental !== undefined ? savedState.mental : state.initialMental,
            comboCount: state.comboCount,
          }
        }
      }

      return { selectedMusic: music }
    }),

  setDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),

  setInitialMental: (mental) =>
    set((state) => {
      // カードのキーを取得する関数
      const getCardKey = (card: Card | null) => {
        if (!card) return ''
        return Object.keys(cardData).find((key) => cardData[key] === card) || ''
      }

      // 現在の楽曲の設定を保存（カスタム楽曲は除く） - following v1
      const musicWithId = state.selectedMusic as Music & { id?: string }
      if (
        state.selectedMusic &&
        !isShareMode() &&
        musicWithId.id !== 'custom' &&
        !musicWithId.id?.startsWith('custom_')
      ) {
        const musicKey = getMusicKey(state.selectedMusic)
        const cardKeys = state.selectedCards.map(getCardKey)
        saveMusicState(musicKey, {
          cards: cardKeys,
          mental: mental,
          learningCorrection: 1.5,
        })
      }
      return { initialMental: Math.max(0, Math.min(100, mental)) }
    }),

  setComboCount: (count) => set({ comboCount: count }),

  setCenterCharacter: (character) => set({ centerCharacter: character }),

  setLearningCorrection: (correction) => set({ learningCorrection: correction }),

  runSimulation: () => {
    const state = get()

    // Validate inputs
    if (!state.selectedMusic) return

    const hasAtLeastOneCard = state.selectedCards.some((card) => card !== null)
    if (!hasAtLeastOneCard) return

    set({ isSimulating: true })

    try {
      // Get combo count from music based on difficulty
      let comboCount = state.comboCount
      if (state.selectedMusic.combos && state.selectedMusic.combos[state.selectedDifficulty]) {
        comboCount = state.selectedMusic.combos[state.selectedDifficulty]!
      }

      // Calculate base AP
      const baseAP = calculateBaseAP(comboCount, state.initialMental)

      const options: SimulationOptions = {
        cards: state.selectedCards,
        cardSkillLevels: state.cardSkillLevels,
        centerSkillLevels: state.centerSkillLevels,
        customSkillValues: state.customSkillValues,
        customCenterSkillValues: state.customCenterSkillValues,
        centerActivations: state.centerActivations,
        music: state.selectedMusic,
        musicAttribute: state.selectedMusic.attribute,
        centerCharacter: state.selectedMusic.centerCharacter,
        initialMental: state.initialMental,
        comboCount: comboCount,
        baseAP: baseAP,
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

    // Create data object for compression
    const data: ShareData = {
      mental: state.initialMental.toString(),
      learningCorrection: '1.5', // Fixed value in v2
      music: state.selectedMusic?.name || '',
      customMusic: null,
      customCenter: null,
      customAttribute: null,
      customMusicName: null,
      cards: [],
    }

    // Handle custom music - following v1 logic
    if (state.selectedMusic) {
      const musicWithId = state.selectedMusic as Music & { id?: string }
      if (musicWithId.id === 'custom' || musicWithId.id?.startsWith('custom_')) {
        data.music = 'custom'
        data.customMusic = state.selectedMusic.phases
        data.customCenter = state.selectedMusic.centerCharacter || null
        data.customAttribute = state.selectedMusic.attribute || null

        // Add combo counts if custom
        if (state.selectedMusic.combos) {
          data.customCombos = {
            normal: state.selectedMusic.combos.normal || 287,
            hard: state.selectedMusic.combos.hard || 536,
            expert: state.selectedMusic.combos.expert || 1278,
            master: state.selectedMusic.combos.master || 1857,
          }
        }

        // Add custom music name if it's a saved custom music
        if (musicWithId.id?.startsWith('custom_')) {
          const customList = state.customMusicList
          const savedMusic = customList[musicWithId.id]
          if (savedMusic) {
            data.customMusicName = savedMusic.name
          }
        } else if (state.selectedMusic.displayName) {
          // For shared custom music with a display name
          data.customMusicName = state.selectedMusic.displayName
        }
      } else {
        // Find the music key
        const musicKey = getMusicKey(state.selectedMusic)
        data.music = musicKey
      }
    }

    // Add cards with skill levels and custom values
    for (let i = 0; i < 6; i++) {
      const card = state.selectedCards[i]
      if (card) {
        const cardData: ShareCardData = {
          card: card.name,
          skillLevel: state.cardSkillLevels[i],
          centerSkillLevel: state.centerSkillLevels[i],
        }

        // Add custom skill values if they exist
        const customValues = state.customSkillValues[i]
        if (customValues && Object.keys(customValues).length > 0) {
          cardData.customSkillValues = customValues
        }

        // Add custom center skill values if they exist
        const customCenterValues = state.customCenterSkillValues[i]
        if (customCenterValues && Object.keys(customCenterValues).length > 0) {
          cardData.customCenterSkillValues = customCenterValues
        }

        data.cards.push(cardData)
      }
    }
    
    // Add center activations if any are disabled
    const hasDisabledCenter = state.centerActivations.some(active => !active)
    
    if (hasDisabledCenter) {
      data.centerActivations = state.centerActivations
    }

    // Compress data to shorter format
    const compressedData = compressShareData(data)

    // Create share URL
    const url = new URL(window.location.href)
    url.searchParams.set('s', '1')
    url.searchParams.set('d', compressedData)

    return url.toString()
  },

  loadFromShareUrl: (params) => {
    // Check for compressed format first
    const compressedData = params.get('d')
    if (compressedData) {
      const data = decompressShareData(compressedData)
      if (data) {
        // Load mental
        if (data.mental) {
          set({ initialMental: parseInt(data.mental) })
        }

        // Load music
        if (data.music === 'custom') {
          const customMusic: Music = {
            id: 'custom',
            name: data.customMusicName || 'カスタム',
            displayName: data.customMusicName || undefined,
            phases: data.customMusic || [11, 7, 5],
            centerCharacter: data.customCenter || undefined,
            attribute: (data.customAttribute as 'smile' | 'pure' | 'cool') || undefined,
            combos: data.customCombos,
          }
          set({ selectedMusic: customMusic })
        } else if (data.music && data.music.startsWith('custom_')) {
          // Saved custom music
          const customList = get().customMusicList
          const savedMusic = customList[data.music]
          if (savedMusic) {
            set({ selectedMusic: savedMusic })
          }
        } else if (data.music) {
          // Regular music - find in musicData
          const music = musicData[data.music]
          if (music) {
            set({ selectedMusic: music })
          }
        }

        // Load cards
        const newCards: (Card | null)[] = Array(6).fill(null)
        const newSkillLevels: number[] = Array(6).fill(14)
        const newCenterSkillLevels: number[] = Array(6).fill(14)
        const newCustomSkillValues: Record<number, Record<string, number>> = {}
        const newCustomCenterSkillValues: Record<number, Record<string, number>> = {}
        // Default to all activated for backward compatibility
        const newCenterActivations: boolean[] = data.centerActivations || Array(6).fill(true)

        data.cards.forEach((cardInfo: ShareCardData, index: number) => {
          if (index >= 6) return

          // Find card by short code or name
          let foundCard: Card | null = null
          for (const [_key, card] of Object.entries(cardData)) {
            if (card.shortCode === cardInfo.card || card.name === cardInfo.card) {
              foundCard = card
              break
            }
          }

          if (foundCard) {
            newCards[index] = foundCard
            newSkillLevels[index] = cardInfo.skillLevel || 14
            newCenterSkillLevels[index] = cardInfo.centerSkillLevel || 14

            if (cardInfo.customSkillValues) {
              newCustomSkillValues[index] = cardInfo.customSkillValues
            }
            if (cardInfo.customCenterSkillValues) {
              newCustomCenterSkillValues[index] = cardInfo.customCenterSkillValues
            }
          }
        })

        set({
          selectedCards: newCards,
          cardSkillLevels: newSkillLevels,
          centerSkillLevels: newCenterSkillLevels,
          customSkillValues: newCustomSkillValues,
          customCenterSkillValues: newCustomCenterSkillValues,
          centerActivations: newCenterActivations,
          learningCorrection: data.learningCorrection ? parseFloat(data.learningCorrection) : 1.5,
          isShareMode: true,
        })

        return
      }
    }

    // Fall back to old format for backward compatibility
    const musicParam = params.get('music')
    if (musicParam === 'custom') {
      const phases = params.get('phases')?.split(',').map(Number) || [11, 7, 5]
      const customMusic: Music = {
        name: 'カスタム',
        phases: phases as [number, number, number],
        centerCharacter: params.get('center') || '',
        attribute: (params.get('attribute') || 'smile') as 'smile' | 'pure' | 'cool',
      }
      set({ selectedMusic: customMusic })
    } else if (musicParam) {
      const music = musicData[musicParam]
      if (music) {
        set({ selectedMusic: music })
      }
    }

    // Load cards
    const newCards: (Card | null)[] = Array(6).fill(null)
    const newSkillLevels: number[] = Array(6).fill(14)

    for (let i = 1; i <= 6; i++) {
      const cardName = params.get(`c${i}`)
      if (cardName) {
        // Find card by name
        let foundCard: Card | null = null
        for (const [_key, card] of Object.entries(cardData)) {
          if (card.name === cardName) {
            foundCard = card
            break
          }
        }
        if (foundCard) {
          newCards[i - 1] = foundCard
          const skillLevel = parseInt(params.get(`s${i}`) || '10')
          newSkillLevels[i - 1] = skillLevel
        }
      }
    }

    set({
      selectedCards: newCards,
      cardSkillLevels: newSkillLevels,
    })

    // Load other settings
    const difficulty = params.get('difficulty')
    if (difficulty && ['normal', 'hard', 'expert', 'master'].includes(difficulty)) {
      set({ selectedDifficulty: difficulty as 'normal' | 'hard' | 'expert' | 'master' })
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

  swapCards: (fromIndex, toIndex) => {
    set((state) => {
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
        customCenterSkillValues: newCustomCenterValues,
      }
    })

    // Save formation after swap
    const state = get()
    saveFormationForMusic(state)
  },

  insertCard: (fromIndex, toIndex, insertBefore) => {
    set((state) => {
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
      Object.keys(newCustomValues).forEach((key) => {
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
      Object.keys(tempCustom).forEach((key) => {
        const index = parseInt(key)
        if (index >= insertPos) {
          finalCustomValues[index + 1] = tempCustom[index]
        } else {
          finalCustomValues[index] = tempCustom[index]
        }
      })

      // Handle center custom values
      const tempCustomCenter: Record<number, Record<string, number>> = {}
      Object.keys(newCustomCenterValues).forEach((key) => {
        const index = parseInt(key)
        if (index > fromIndex) {
          tempCustomCenter[index - 1] = newCustomCenterValues[index]
        } else if (index < fromIndex) {
          tempCustomCenter[index] = newCustomCenterValues[index]
        }
      })

      Object.keys(tempCustomCenter).forEach((key) => {
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
        customCenterSkillValues: finalCustomCenterValues,
      }
    })

    // Save formation after insert
    const state = get()
    saveFormationForMusic(state)
  },

  saveCustomMusic: (name, music) =>
    set((state) => {
      const key = music.name // Should be like 'custom_1234567890'
      const newCustomMusicList = { ...state.customMusicList }
      newCustomMusicList[key] = { ...music, displayName: name }

      // Save to localStorage
      localStorage.setItem('sukushou_custom_music_list', JSON.stringify(newCustomMusicList))

      // Update musicData as well
      musicData[key] = { ...music, displayName: name }

      return { customMusicList: newCustomMusicList }
    }),

  deleteCustomMusic: (key) =>
    set((state) => {
      const newCustomMusicList = { ...state.customMusicList }
      delete newCustomMusicList[key]

      // Save to localStorage
      localStorage.setItem('sukushou_custom_music_list', JSON.stringify(newCustomMusicList))

      // Remove from musicData
      delete musicData[key]

      // Remove any saved state for this music
      localStorage.removeItem(`sukushou_state_${key}`)

      return { customMusicList: newCustomMusicList }
    }),

  loadCustomMusicList: () =>
    set(() => {
      const customMusicList = loadCustomMusicListFromStorage()

      // Also add to musicData for immediate use
      Object.entries(customMusicList).forEach(([key, music]) => {
        musicData[key] = music
      })

      return { customMusicList }
    }),

  setShareMode: (enabled: boolean) => set({ isShareMode: enabled }),

  exitShareMode: () => {
    // Clear URL parameters
    const url = new URL(window.location.href)
    url.searchParams.delete('share')
    url.searchParams.delete('s')
    url.searchParams.delete('d')
    url.searchParams.delete('data')
    window.history.replaceState({}, document.title, url.toString())

    // Reset to normal mode
    set({ isShareMode: false })

    // Reload the page to reset state
    window.location.reload()
  },

  saveSharedAsCustomMusic: (name) => {
    const state = get()
    if (!state.selectedMusic || !name.trim()) return

    // Generate a new custom music ID
    const timestamp = Date.now()
    const customId = `custom_${timestamp}`

    // Create the custom music object (compatible with regular custom music format)
    const customMusic: CustomMusic = {
      id: customId,
      name: name, // Use the display name as name (v1 compatible)
      phases: state.selectedMusic.phases,
      centerCharacter: state.selectedMusic.centerCharacter || '',
      attribute: state.selectedMusic.attribute || 'smile',
      combos: state.selectedMusic.combos,
    }

    // Use musicStore to save the custom music
    const musicStore = useMusicStore.getState()
    musicStore.addCustomMusic(customMusic)

    // Get the updated customMusicList from musicStore to ensure sync
    const updatedMusicStore = useMusicStore.getState()
    const newCustomMusicList = { ...updatedMusicStore.customMusicList }

    // Clear URL parameters
    const url = new URL(window.location.href)
    url.searchParams.delete('share')
    url.searchParams.delete('s')
    url.searchParams.delete('d')
    url.searchParams.delete('data')
    window.history.replaceState({}, document.title, url.toString())

    // Exit share mode and select the new custom music
    set({
      isShareMode: false,
      customMusicList: newCustomMusicList,
      selectedMusic: customMusic,
    })

    alert(`カスタム楽曲「${name}」として保存しました！`)
  },

  optimizeFormation: () => {
    const state = get()

    // Validate inputs
    if (!state.selectedMusic) return

    const validCards = state.selectedCards.filter((card) => card !== null)
    if (validCards.length === 0) return

    set({ isOptimizing: true, optimizationResult: null })

    try {
      // Get combo count from music based on difficulty
      let comboCount = state.comboCount
      if (state.selectedMusic.combos && state.selectedMusic.combos[state.selectedDifficulty]) {
        comboCount = state.selectedMusic.combos[state.selectedDifficulty]!
      }

      // Calculate base AP
      const baseAP = calculateBaseAP(comboCount, state.initialMental)

      // Create array of valid card indices
      const validIndices: number[] = []
      const fixedIndices: number[] = []
      const movableIndices: number[] = []
      
      state.selectedCards.forEach((card, index) => {
        if (card !== null) {
          validIndices.push(index)
          if (state.fixedPositions.has(index)) {
            fixedIndices.push(index)
          } else {
            movableIndices.push(index)
          }
        }
      })

      // If only one or no movable cards, nothing to optimize
      if (movableIndices.length <= 1) {
        set({ isOptimizing: false })
        if (fixedIndices.length > 0) {
          alert('固定されていないカードが1枚以下のため、最適化できません。')
        } else {
          alert('最適化するには2枚以上のカードが必要です。')
        }
        return
      }

      // Generate all permutations of movable card positions
      const permutations: number[][] = []
      const generatePermutations = (arr: number[], start: number) => {
        if (start >= arr.length - 1) {
          // Create full arrangement including fixed positions
          const fullArrangement: number[] = Array(6).fill(-1)
          
          // Place fixed cards first
          fixedIndices.forEach(idx => {
            fullArrangement[idx] = idx
          })
          
          // Place movable cards in available positions
          let movableIndex = 0
          for (let i = 0; i < 6; i++) {
            if (fullArrangement[i] === -1 && state.selectedCards[i] !== null) {
              fullArrangement[i] = arr[movableIndex]
              movableIndex++
            }
          }
          
          permutations.push(fullArrangement.filter(i => i !== -1))
          return
        }
        for (let i = start; i < arr.length; i++) {
          // Swap
          const temp = arr[start]
          arr[start] = arr[i]
          arr[i] = temp
          
          generatePermutations(arr, start + 1)
          
          // Backtrack
          arr[i] = arr[start]
          arr[start] = temp
        }
      }

      generatePermutations([...movableIndices], 0)

      let bestScore = 0
      let bestFormation: (Card | null)[] = [...state.selectedCards]
      let originalScore = 0

      // Calculate original score first
      const originalOptions: SimulationOptions = {
        cards: state.selectedCards,
        cardSkillLevels: state.cardSkillLevels,
        centerSkillLevels: state.centerSkillLevels,
        customSkillValues: state.customSkillValues,
        customCenterSkillValues: state.customCenterSkillValues,
        music: state.selectedMusic,
        musicAttribute: state.selectedMusic.attribute,
        centerCharacter: state.selectedMusic.centerCharacter,
        initialMental: state.initialMental,
        comboCount: comboCount,
        baseAP: baseAP,
      }

      const originalSimulator = new GameSimulator(originalOptions)
      const originalResult = originalSimulator.simulate()
      const apShortageResult = originalSimulator.simulateWithAPShortage(baseAP, originalResult)
      originalScore = apShortageResult ? apShortageResult.score : originalResult.totalScore

      // Test each permutation
      for (const perm of permutations) {
        // Create new card arrangement
        const newCards: (Card | null)[] = Array(6).fill(null)
        const newSkillLevels: number[] = [...state.cardSkillLevels]
        const newCenterSkillLevels: number[] = [...state.centerSkillLevels]
        const newCustomSkillValues: Record<string, Record<string, number>> = {}
        const newCustomCenterSkillValues: Record<string, Record<string, number>> = {}

        // Place cards according to permutation
        perm.forEach((originalIndex, newIndex) => {
          newCards[newIndex] = state.selectedCards[originalIndex]
          newSkillLevels[newIndex] = state.cardSkillLevels[originalIndex]
          newCenterSkillLevels[newIndex] = state.centerSkillLevels[originalIndex]
          if (state.customSkillValues[originalIndex]) {
            newCustomSkillValues[newIndex] = state.customSkillValues[originalIndex]
          }
          if (state.customCenterSkillValues[originalIndex]) {
            newCustomCenterSkillValues[newIndex] = state.customCenterSkillValues[originalIndex]
          }
        })

        const options: SimulationOptions = {
          cards: newCards,
          cardSkillLevels: newSkillLevels,
          centerSkillLevels: newCenterSkillLevels,
          customSkillValues: newCustomSkillValues,
          customCenterSkillValues: newCustomCenterSkillValues,
          music: state.selectedMusic,
          musicAttribute: state.selectedMusic.attribute,
          centerCharacter: state.selectedMusic.centerCharacter,
          initialMental: state.initialMental,
          comboCount: comboCount,
          baseAP: baseAP,
        }

        const simulator = new GameSimulator(options)
        const result = simulator.simulate()
        const apShortage = simulator.simulateWithAPShortage(baseAP, result)
        const score = apShortage ? apShortage.score : result.totalScore

        if (score > bestScore) {
          bestScore = score
          bestFormation = newCards
        }
      }

      const improvement = bestScore - originalScore

      set({
        isOptimizing: false,
        optimizationResult: {
          bestFormation,
          bestScore,
          originalScore,
          improvement,
        },
      })

      // If improvement found, ask user if they want to apply it
      if (improvement > 0) {
        const confirmMessage = `最適化により ${improvement.toLocaleString()} 点のスコア向上が見つかりました。\n` +
          `現在: ${originalScore.toLocaleString()} 点\n` +
          `最適: ${bestScore.toLocaleString()} 点\n\n` +
          `この編成を適用しますか？`
        
        if (confirm(confirmMessage)) {
          // Apply the best formation
          const newSkillLevels = [...state.cardSkillLevels]
          const newCenterSkillLevels = [...state.centerSkillLevels]
          const newCustomSkillValues: Record<number, Record<string, number>> = {}
          const newCustomCenterSkillValues: Record<number, Record<string, number>> = {}

          // Find the mapping from original to new positions
          bestFormation.forEach((card, newIndex) => {
            if (card) {
              const originalIndex = state.selectedCards.findIndex(c => c === card)
              if (originalIndex >= 0) {
                newSkillLevels[newIndex] = state.cardSkillLevels[originalIndex]
                newCenterSkillLevels[newIndex] = state.centerSkillLevels[originalIndex]
                if (state.customSkillValues[originalIndex]) {
                  newCustomSkillValues[newIndex] = state.customSkillValues[originalIndex]
                }
                if (state.customCenterSkillValues[originalIndex]) {
                  newCustomCenterSkillValues[newIndex] = state.customCenterSkillValues[originalIndex]
                }
              }
            }
          })

          set({
            selectedCards: bestFormation,
            cardSkillLevels: newSkillLevels,
            centerSkillLevels: newCenterSkillLevels,
            customSkillValues: newCustomSkillValues,
            customCenterSkillValues: newCustomCenterSkillValues,
          })

          // Save formation after optimization
          saveFormationForMusic(get())
        }
      } else {
        alert('現在の編成が既に最適です。')
      }
    } catch (error) {
      console.error('Optimization error:', error)
      set({ isOptimizing: false })
      alert('最適化中にエラーが発生しました。')
    }
  },

  toggleFixedPosition: (index) => {
    set((state) => {
      const newFixedPositions = new Set(state.fixedPositions)
      if (newFixedPositions.has(index)) {
        newFixedPositions.delete(index)
      } else {
        newFixedPositions.add(index)
      }
      return { fixedPositions: newFixedPositions }
    })
  },

  clearFixedPositions: () => {
    set({ fixedPositions: new Set() })
  },
}))
