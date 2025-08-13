import React from 'react'
import { useGameStore } from '@stores/gameStore'
import { useDuplicateCharacterDetection } from '@hooks/useDuplicateCharacterDetection'
import { trackFeatureUsage } from '@/analytics'
import './SimulationControls.css'

export const SimulationControls: React.FC = () => {
  const {
    runSimulation,
    isSimulating,
    selectedMusic,
    selectedCards,
    generateShareUrl,
    optimizeFormation,
    isOptimizing,
  } = useGameStore()

  const hasValidSelection = selectedMusic && selectedCards.some((card) => card !== null)
  const { duplicateIndices, hasDRDuplicates, hasCharacterDuplicates } =
    useDuplicateCharacterDetection(selectedCards)

  const handleCalculate = () => {
    // Check for duplicate characters first
    if (duplicateIndices.size > 0) {
      if (hasDRDuplicates && hasCharacterDuplicates) {
        alert(
          'DRカードが複数選択されています。また、同じキャラクターのカードが複数選択されています。\nDRカードは1枚まで、同じキャラクターは2枚までしか編成できません。',
        )
      } else if (hasDRDuplicates) {
        alert('DRカードが複数選択されています。\nDRカードは1枚までしか編成できません。')
      } else {
        alert(
          '同じキャラクターのカードが複数選択されています。\nキャラクターの重複を解消してから計算してください。',
        )
      }
      return
    }
    runSimulation()
  }

  const handleShare = () => {
    const shareUrl = generateShareUrl()
    trackFeatureUsage('share_url_created', {
      share_url: shareUrl,
    })
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert('共有URLがクリップボードにコピーされました！')
      })
      .catch(() => {
        prompt('共有URL:', shareUrl)
      })
  }

  const handleOptimize = () => {
    // Check for duplicate characters first
    if (duplicateIndices.size > 0) {
      if (hasDRDuplicates && hasCharacterDuplicates) {
        alert(
          'DRカードが複数選択されています。また、同じキャラクターのカードが複数選択されています。\nDRカードは1枚まで、同じキャラクターは2枚までしか編成できません。',
        )
      } else if (hasDRDuplicates) {
        alert('DRカードが複数選択されています。\nDRカードは1枚までしか編成できません。')
      } else {
        alert(
          '同じキャラクターのカードが複数選択されています。\nキャラクターの重複を解消してから最適化してください。',
        )
      }
      return
    }
    trackFeatureUsage('formation_optimization')
    optimizeFormation()
  }

  return (
    <div className="button-container">
      <button
        className="primary-button"
        onClick={handleCalculate}
        disabled={!hasValidSelection || isSimulating}
      >
        {isSimulating ? 'スコア計算中...' : 'スコア計算'}
      </button>
      <button
        className="optimize-button secondary"
        onClick={handleOptimize}
        disabled={!hasValidSelection || isOptimizing || isSimulating}
      >
        {isOptimizing ? '最適化中...' : '並び順最適化'}
      </button>
      <button className="share-button secondary" onClick={handleShare}>
        共有URLを作成
      </button>
    </div>
  )
}
