import React, { useEffect, useState } from 'react'
import { CardSelector } from './components/CardSelector'
import { MusicSelector } from './components/MusicSelector'
import { SimulationControls } from './components/SimulationControls'
import { ScoreDisplay } from './components/ScoreDisplay'
import { UpdateBanner } from './components/UpdateBanner'
import { UpdateHistoryButton } from './components/UpdateHistoryButton'
import { UpdateHistoryModal } from './components/UpdateHistoryModal'
import { ShareModeBanner } from './components/ShareModeBanner'
import { useGameStore } from './stores/gameStore'
import { useMusicStore } from './stores/musicStore'
import { useTouchDrag } from './hooks/useTouchDrag'
import { useDuplicateCharacterDetection } from './hooks/useDuplicateCharacterDetection'
import './App.css'

function App() {
  const {
    loadFromShareUrl,
    insertCard,
    selectedMusic,
    selectedCards,
    loadStoredSkillLevels,
    loadCustomMusicList,
    isShareMode,
  } = useGameStore()
  const { loadCustomMusic } = useMusicStore()
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  const [showUpdateHistory, setShowUpdateHistory] = useState(false)

  // Detect duplicate characters
  const duplicateIndices = useDuplicateCharacterDetection(selectedCards)

  useEffect(() => {
    // Load from URL parameters on mount
    const params = new URLSearchParams(window.location.search)
    if (params.has('share') || params.has('s') || params.has('d') || params.has('data')) {
      loadFromShareUrl(params)
      // Add share-mode class to body
      document.body.classList.add('share-mode')
    } else {
      // Load saved data from localStorage
      loadStoredSkillLevels() // スキルレベルを読み込む
      loadCustomMusic() // カスタム楽曲を読み込む
      loadCustomMusicList() // カスタム楽曲リストを読み込む
    }
  }, [loadFromShareUrl, loadStoredSkillLevels, loadCustomMusic, loadCustomMusicList])

  // Update body class when share mode changes
  useEffect(() => {
    if (isShareMode) {
      document.body.classList.add('share-mode')
    } else {
      document.body.classList.remove('share-mode')
    }

    return () => {
      document.body.classList.remove('share-mode')
    }
  }, [isShareMode])

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
    // Hide drag hint after first drag
    document.body.classList.add('has-dragged')
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    // Clean up all drop indicators
    document.querySelectorAll('.card-slot').forEach((slot) => {
      slot.classList.remove('drop-before', 'drop-after', 'drag-over')
    })
  }

  const handleDragOver = (e: React.DragEvent, _index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    // Add drop position indicator
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const midpoint = rect.top + rect.height / 2

    // Remove all existing indicators first
    document.querySelectorAll('.card-slot').forEach((slot) => {
      slot.classList.remove('drop-before', 'drop-after')
    })

    // Add indicator based on mouse position
    if (e.clientY < midpoint) {
      target.classList.add('drop-before')
    } else {
      target.classList.add('drop-after')
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.classList.remove('drop-before', 'drop-after')
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()

    if (draggedIndex !== null && draggedIndex !== index) {
      const target = e.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      const midpoint = rect.top + rect.height / 2
      const insertBefore = e.clientY < midpoint

      // Don't do anything if dragging to the same position
      if (
        draggedIndex === index ||
        (insertBefore && draggedIndex === index - 1) ||
        (!insertBefore && draggedIndex === index + 1)
      ) {
        setDraggedIndex(null)
        document.querySelectorAll('.card-slot').forEach((slot) => {
          slot.classList.remove('drop-before', 'drop-after', 'drag-over')
        })
        return
      }

      // Use insertCard instead of swapCards
      insertCard(draggedIndex, index, insertBefore)
    }

    setDraggedIndex(null)
    // Clean up all drop indicators after drop
    document.querySelectorAll('.card-slot').forEach((slot) => {
      slot.classList.remove('drop-before', 'drop-after', 'drag-over')
    })
  }

  // Touch drag handlers
  const { handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel } = useTouchDrag({
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDrop: (fromIndex, toIndex, insertBefore) => {
      insertCard(fromIndex, toIndex, insertBefore)
    },
  })
  return (
    <div className="app">
      <div className="container">
        <div className="header-container">
          <h1>スクショウ計算ツール</h1>
          <UpdateHistoryButton onClick={() => setShowUpdateHistory(true)} />
        </div>

        <UpdateBanner onShowHistory={() => setShowUpdateHistory(true)} />

        <ShareModeBanner />

        <MusicSelector />

        <div className="form-group">
          <label>カード選択</label>
          <div className="card-slots">
            {Array.from({ length: 6 }, (_, i) => (
              <CardSelector
                key={i}
                index={i}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onTouchStart={(e) => handleTouchStart(e, i)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                isDragging={draggedIndex === i}
                isCenter={selectedMusic?.centerCharacter === selectedCards[i]?.character}
                isDuplicate={duplicateIndices.has(i)}
              />
            ))}
          </div>
        </div>

        <SimulationControls />

        <ScoreDisplay />
      </div>

      <UpdateHistoryModal isOpen={showUpdateHistory} onClose={() => setShowUpdateHistory(false)} />
    </div>
  )
}

export default App
