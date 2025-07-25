import React, { useState } from 'react'
import { useGameStore } from '@stores/gameStore'
import './ShareModeBanner.css'

export const ShareModeBanner: React.FC = () => {
  const { isShareMode, saveSharedAsCustomMusic, exitShareMode } = useGameStore()
  const [customName, setCustomName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)
  
  if (!isShareMode) return null
  
  const handleSaveAsCustom = () => {
    if (!showNameInput) {
      setShowNameInput(true)
      return
    }
    
    if (!customName.trim()) {
      alert('カスタム楽曲名を入力してください。')
      return
    }
    
    saveSharedAsCustomMusic(customName.trim())
    setShowNameInput(false)
    setCustomName('')
  }
  
  const handleCancel = () => {
    setShowNameInput(false)
    setCustomName('')
  }
  
  return (
    <div className="share-mode-banner">
      <div className="share-mode-header">共有された編成を表示中</div>
      <div className="share-mode-content">
        {!showNameInput ? (
          <>
            <button onClick={handleSaveAsCustom} className="save-shared-button">
              カスタム楽曲として保存
            </button>
            <button onClick={exitShareMode} className="exit-share-button">
              通常モードに戻る
            </button>
          </>
        ) : (
          <div className="custom-name-input-container">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="カスタム楽曲名を入力"
              className="custom-name-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSaveAsCustom()
                if (e.key === 'Escape') handleCancel()
              }}
            />
            <button onClick={handleSaveAsCustom} className="save-shared-button">
              保存
            </button>
            <button onClick={handleCancel} className="exit-share-button">
              キャンセル
            </button>
          </div>
        )}
      </div>
    </div>
  )
}