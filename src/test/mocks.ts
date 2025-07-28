import { vi } from 'vitest'

// Mock zustand stores
vi.mock('../stores/gameStore', () => ({
  useGameStore: vi.fn(() => ({
    selectedCards: Array(6).fill(null),
    cardSkillLevels: Array(6).fill(14),
    centerSkillLevels: Array(6).fill(14),
    customSkillValues: {},
    customCenterSkillValues: {},
    selectedMusic: null,
    selectedDifficulty: 'master',
    initialMental: 100,
    comboCount: 100,
    centerCharacter: null,
    learningCorrection: 1.5,
    customMusicList: {},
    simulationResult: null,
    isSimulating: false,
    isShareMode: false,
    setCard: vi.fn(),
    setCardSkillLevel: vi.fn(),
    setCenterSkillLevel: vi.fn(),
    loadStoredSkillLevels: vi.fn(),
    setCustomSkillValue: vi.fn(),
    clearCustomSkillValues: vi.fn(),
    setCustomCenterSkillValue: vi.fn(),
    clearCustomCenterSkillValues: vi.fn(),
    setMusic: vi.fn(),
    setDifficulty: vi.fn(),
    setInitialMental: vi.fn(),
    setComboCount: vi.fn(),
    setCenterCharacter: vi.fn(),
    setLearningCorrection: vi.fn(),
    runSimulation: vi.fn(),
    clearSimulation: vi.fn(),
    generateShareUrl: vi.fn(),
    loadFromShareUrl: vi.fn(),
    swapCards: vi.fn(),
    insertCard: vi.fn(),
    saveCustomMusic: vi.fn(),
    deleteCustomMusic: vi.fn(),
    loadCustomMusicList: vi.fn(),
    setShareMode: vi.fn(),
    exitShareMode: vi.fn(),
    saveSharedAsCustomMusic: vi.fn(),
  })),
}))

vi.mock('../stores/musicStore', () => ({
  useMusicStore: vi.fn(() => ({
    customMusicList: {},
    loadCustomMusic: vi.fn(),
    addCustomMusic: vi.fn(),
    updateCustomMusic: vi.fn(),
    deleteCustomMusic: vi.fn(),
    generateCustomMusicId: vi.fn(() => 'custom_' + Date.now()),
  })),
}))

vi.mock('../stores/settingsStore', () => ({
  useSettingsStore: vi.fn(() => ({
    showDetailedLog: true,
    showApCalculation: true,
    theme: 'auto',
    useCustomMusic: false,
    customMusicData: null,
    toggleDetailedLog: vi.fn(),
    toggleApCalculation: vi.fn(),
    setTheme: vi.fn(),
    setCustomMusic: vi.fn(),
    toggleCustomMusic: vi.fn(),
  })),
}))

// Mock data
vi.mock('../data', () => ({
  cardData: {
    testCard1: {
      name: 'Test Card 1',
      displayName: 'Test Card Display 1',
      character: 'Test Character',
      shortCode: '[TC1]',
      apCost: 20,
      stats: {
        smile: 5000,
        pure: 4000,
        cool: 3000,
      },
      effects: [
        {
          type: 'scoreGain',
          value: 1000,
        },
      ],
    },
  },
  musicData: {
    testMusic1: {
      name: 'Test Music 1',
      displayName: 'Test Music Display 1',
      phases: [10, 10, 10],
      centerCharacter: 'Test Character',
      difficulty: {
        normal: { combo: 100, appeal: 5000 },
        hard: { combo: 150, appeal: 7500 },
        expert: { combo: 200, appeal: 10000 },
        master: { combo: 250, appeal: 12500 },
      },
    },
  },
  getAllMusic: vi.fn(() => [
    {
      name: 'Test Music 1',
      displayName: 'Test Music Display 1',
      phases: [10, 10, 10],
      centerCharacter: 'Test Character',
      difficulty: {
        normal: { combo: 100, appeal: 5000 },
        hard: { combo: 150, appeal: 7500 },
        expert: { combo: 200, appeal: 10000 },
        master: { combo: 250, appeal: 12500 },
      },
    },
  ]),
  getAllCards: vi.fn(() => [
    {
      name: 'Test Card 1',
      displayName: 'Test Card Display 1',
      character: 'Test Character',
      shortCode: '[TC1]',
      apCost: 20,
      stats: {
        smile: 5000,
        pure: 4000,
        cool: 3000,
      },
      effects: [
        {
          type: 'scoreGain',
          value: 1000,
        },
      ],
    },
  ]),
}))

// Mock localStorage
const localStorageMock: Storage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
}
global.localStorage = localStorageMock
