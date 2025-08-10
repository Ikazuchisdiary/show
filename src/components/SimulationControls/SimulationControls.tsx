import React from 'react'
import { useGameStore } from '@stores/gameStore'
import { useDuplicateCharacterDetection } from '@hooks/useDuplicateCharacterDetection'
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
  const duplicateIndices = useDuplicateCharacterDetection(selectedCards)

  const handleCalculate = () => {
    // Check for duplicate characters first
    if (duplicateIndices.size > 0) {
      alert(
        '同じキャラクターのカードが複数選択されています。\nキャラクターの重複を解消してから計算してください。',
      )
      return
    }
    runSimulation()
  }

  const handleShare = () => {
    const shareUrl = generateShareUrl()
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
      alert(
        '同じキャラクターのカードが複数選択されています。\nキャラクターの重複を解消してから最適化してください。',
      )
      return
    }
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
