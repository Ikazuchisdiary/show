import React from 'react'
import { useGameStore } from '@stores/gameStore'
import './SimulationControls.css'

export const SimulationControls: React.FC = () => {
  const { 
    runSimulation, 
    isSimulating,
    selectedMusic,
    selectedCards,
    generateShareUrl
  } = useGameStore()
  
  const hasValidSelection = selectedMusic && selectedCards.some(card => card !== null)
  
  const handleShare = () => {
    const shareUrl = generateShareUrl()
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('共有URLがクリップボードにコピーされました！')
    }).catch(() => {
      prompt('共有URL:', shareUrl)
    })
  }
  
  return (
    <div className="button-container">
      <button
        onClick={runSimulation}
        disabled={!hasValidSelection || isSimulating}
      >
        {isSimulating ? 'スコア計算中...' : 'スコア計算'}
      </button>
      <button 
        className="share-button secondary"
        onClick={handleShare}
      >
        共有URLを作成
      </button>
    </div>
  )
}