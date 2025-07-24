import { create } from 'zustand'
import { CustomMusic } from '../core/models/Music'
import {
  getCustomMusicList,
  saveCustomMusicList,
  isShareMode
} from '../services/localStorageService'

interface MusicStore {
  customMusicList: Record<string, CustomMusic>
  
  // Actions
  loadCustomMusic: () => void
  addCustomMusic: (music: CustomMusic) => void
  updateCustomMusic: (id: string, music: CustomMusic) => void
  deleteCustomMusic: (id: string) => void
  generateCustomMusicId: () => string
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  customMusicList: {},
  
  loadCustomMusic: () => set(() => {
    if (isShareMode()) return { customMusicList: {} }
    
    const savedList = getCustomMusicList()
    return { customMusicList: savedList }
  }),
  
  addCustomMusic: (music) => set((state) => {
    if (isShareMode()) return state
    
    const newList = { ...state.customMusicList, [music.id!]: music }
    saveCustomMusicList(newList)
    return { customMusicList: newList }
  }),
  
  updateCustomMusic: (id, music) => set((state) => {
    if (isShareMode()) return state
    
    const newList = { ...state.customMusicList, [id]: music }
    saveCustomMusicList(newList)
    return { customMusicList: newList }
  }),
  
  deleteCustomMusic: (id) => set((state) => {
    if (isShareMode()) return state
    
    const newList = { ...state.customMusicList }
    delete newList[id]
    saveCustomMusicList(newList)
    return { customMusicList: newList }
  }),
  
  generateCustomMusicId: () => {
    return `custom_${Date.now()}`
  }
}))