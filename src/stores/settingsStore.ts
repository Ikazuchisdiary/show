import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  // Display settings
  showDetailedLog: boolean
  showApCalculation: boolean
  theme: 'light' | 'dark' | 'auto'
  
  // Calculation settings
  useCustomMusic: boolean
  customMusicData: {
    name: string
    phases: [number, number, number]
    attribute: 'smile' | 'pure' | 'cool' | null
    centerCharacter: string | null
  } | null
  
  // Actions
  toggleDetailedLog: () => void
  toggleApCalculation: () => void
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  setCustomMusic: (data: SettingsStore['customMusicData']) => void
  toggleCustomMusic: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Initial state
      showDetailedLog: true,
      showApCalculation: true,
      theme: 'auto',
      useCustomMusic: false,
      customMusicData: null,
      
      // Actions
      toggleDetailedLog: () => set((state) => ({ 
        showDetailedLog: !state.showDetailedLog 
      })),
      
      toggleApCalculation: () => set((state) => ({ 
        showApCalculation: !state.showApCalculation 
      })),
      
      setTheme: (theme) => set({ theme }),
      
      setCustomMusic: (data) => set({ customMusicData: data }),
      
      toggleCustomMusic: () => set((state) => ({ 
        useCustomMusic: !state.useCustomMusic 
      }))
    }),
    {
      name: 'sukushou-settings'
    }
  )
)