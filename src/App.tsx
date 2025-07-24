import React, { useEffect, useState } from 'react'
import { CardSelector } from './components/CardSelector'
import { MusicSelector } from './components/MusicSelector'
import { SimulationControls } from './components/SimulationControls'
import { ScoreDisplay } from './components/ScoreDisplay'
import { UpdateBanner } from './components/UpdateBanner'
import { UpdateHistoryButton } from './components/UpdateHistoryButton'
import { UpdateHistoryModal } from './components/UpdateHistoryModal'
import { useGameStore } from './stores/gameStore'
import { useMusicStore } from './stores/musicStore'
import './App.css'

function App() {
  const { loadFromShareUrl, swapCards, insertCard, selectedMusic, selectedCards, loadStoredSkillLevels } = useGameStore()
  const { loadCustomMusic } = useMusicStore()
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  const [showUpdateHistory, setShowUpdateHistory] = useState(false)
  
  useEffect(() => {
    // Load from URL parameters on mount
    const params = new URLSearchParams(window.location.search)
    if (params.toString()) {
      loadFromShareUrl(params)
    } else {
      // Load saved data from localStorage
      loadStoredSkillLevels() // スキルレベルを読み込む
      loadCustomMusic() // カスタム楽曲を読み込む
    }
  }, [loadFromShareUrl, loadStoredSkillLevels, loadCustomMusic])
  
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }
  
  const handleDragEnd = () => {
    setDraggedIndex(null)
    // Clean up all drop indicators
    document.querySelectorAll('.card-slot').forEach(slot => {
      slot.classList.remove('drop-before', 'drop-after', 'drag-over')
    })
  }
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    // Add drop position indicator
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const midpoint = rect.top + rect.height / 2
    
    // Remove all existing indicators first
    document.querySelectorAll('.card-slot').forEach(slot => {
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
      if (draggedIndex === index || 
          (insertBefore && draggedIndex === index - 1) ||
          (!insertBefore && draggedIndex === index + 1)) {
        setDraggedIndex(null)
        document.querySelectorAll('.card-slot').forEach(slot => {
          slot.classList.remove('drop-before', 'drop-after', 'drag-over')
        })
        return
      }
      
      // Use insertCard instead of swapCards
      insertCard(draggedIndex, index, insertBefore)
    }
    
    setDraggedIndex(null)
    // Clean up all drop indicators after drop
    document.querySelectorAll('.card-slot').forEach(slot => {
      slot.classList.remove('drop-before', 'drop-after', 'drag-over')
    })
  }
  return (
    <div className="app">
      <div className="container">
        <div className="header-container">
          <h1>スクショウ計算ツール</h1>
          <UpdateHistoryButton onClick={() => setShowUpdateHistory(true)} />
        </div>
        
        <UpdateBanner onShowHistory={() => setShowUpdateHistory(true)} />
        
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
                isDragging={draggedIndex === i}
                isCenter={selectedMusic?.centerCharacter === selectedCards[i]?.character}
              />
            ))}
          </div>
        </div>
        
        <SimulationControls />
        
        <ScoreDisplay />
      </div>
      
      <UpdateHistoryModal 
        isOpen={showUpdateHistory} 
        onClose={() => setShowUpdateHistory(false)} 
      />
    </div>
  )
}

export default App