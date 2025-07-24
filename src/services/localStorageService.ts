import { CustomMusic } from '../core/models/Music'

// v1互換のローカルストレージキー
const KEYS = {
  cardSkillLevel: (cardType: string) => `sukushou_card_skill_${cardType}`,
  cardCenterSkillLevel: (cardType: string) => `sukushou_card_center_skill_${cardType}`,
  customMusicList: 'sukushou_custom_music_list',
  musicState: (musicKey: string) => `sukushou_state_${musicKey}`,
} as const

// カードのスキルレベルを保存
// cardTypeはカードのキー（例："gingaKozu"）を使用する
export function saveCardSkillLevel(cardType: string, skillLevel: number): void {
  if (!cardType) return
  const key = KEYS.cardSkillLevel(cardType)
  localStorage.setItem(key, skillLevel.toString())
}

// カードのスキルレベルを読み込み
// cardTypeはカードのキー（例："gingaKozu"）を使用する
export function loadCardSkillLevel(cardType: string): number {
  if (!cardType) return 14
  const key = KEYS.cardSkillLevel(cardType)
  const savedLevel = localStorage.getItem(key)
  return savedLevel ? parseInt(savedLevel, 10) : 14
}

// センタースキルレベルを保存
// cardTypeはカードのキー（例："gingaKozu"）を使用する
export function saveCardCenterSkillLevel(cardType: string, skillLevel: number): void {
  if (!cardType) return
  const key = KEYS.cardCenterSkillLevel(cardType)
  localStorage.setItem(key, skillLevel.toString())
}

// センタースキルレベルを読み込み
// cardTypeはカードのキー（例："gingaKozu"）を使用する
export function loadCardCenterSkillLevel(cardType: string): number {
  if (!cardType) return 14
  const key = KEYS.cardCenterSkillLevel(cardType)
  const savedLevel = localStorage.getItem(key)
  return savedLevel ? parseInt(savedLevel, 10) : 14
}

// カスタム楽曲リストを取得
export function getCustomMusicList(): Record<string, CustomMusic> {
  const savedList = localStorage.getItem(KEYS.customMusicList)
  return savedList ? JSON.parse(savedList) : {}
}

// カスタム楽曲リストを保存
export function saveCustomMusicList(list: Record<string, CustomMusic>): void {
  localStorage.setItem(KEYS.customMusicList, JSON.stringify(list))
}

// 楽曲ごとの編成状態を保存（v1互換）
export function saveMusicState(
  musicKey: string,
  state: {
    cards: string[]
    mental: number
    learningCorrection: number
  }
): void {
  if (!musicKey || isShareMode()) return
  const key = KEYS.musicState(musicKey)
  localStorage.setItem(key, JSON.stringify(state))
}

// 楽曲ごとの編成状態を読み込み（v1互換）
export function loadMusicState(musicKey: string): {
  cards: string[]
  mental?: number
  learningCorrection?: number
} | null {
  if (!musicKey || isShareMode()) return null
  const key = KEYS.musicState(musicKey)
  const savedState = localStorage.getItem(key)
  return savedState ? JSON.parse(savedState) : null
}


// すべてのカードのスキルレベルを読み込み
export function loadAllCardSkillLevels(): Record<string, number> {
  const skillLevels: Record<string, number> = {}
  
  // localStorageのすべてのキーを確認
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('sukushou_card_skill_') && !key.includes('center')) {
      const cardType = key.replace('sukushou_card_skill_', '')
      const level = localStorage.getItem(key)
      if (level) {
        skillLevels[cardType] = parseInt(level, 10)
      }
    }
  }
  
  return skillLevels
}

// すべてのカードのセンタースキルレベルを読み込み
export function loadAllCenterSkillLevels(): Record<string, number> {
  const centerSkillLevels: Record<string, number> = {}
  
  // localStorageのすべてのキーを確認
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('sukushou_card_center_skill_')) {
      const cardType = key.replace('sukushou_card_center_skill_', '')
      const level = localStorage.getItem(key)
      if (level) {
        centerSkillLevels[cardType] = parseInt(level, 10)
      }
    }
  }
  
  return centerSkillLevels
}

// 共有モードかどうかを判定（URLにshareパラメータがある場合）
export function isShareMode(): boolean {
  const params = new URLSearchParams(window.location.search)
  return params.has('share')
}