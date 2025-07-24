import React, { useState, useEffect } from 'react'
import { CURRENT_VERSION } from '@core/data/updateHistory'
import './UpdateBanner.css'

interface UpdateBannerProps {
  onShowHistory: () => void
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({ onShowHistory }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Check if user has seen this version
    const lastSeenVersion = localStorage.getItem('sukushou_lastVersion')
    
    if (lastSeenVersion !== CURRENT_VERSION) {
      setIsVisible(true)
    }
  }, [])
  
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    localStorage.setItem('sukushou_lastVersion', CURRENT_VERSION)
    setIsVisible(false)
  }
  
  if (!isVisible) return null
  
  return (
    <div className="update-banner" onClick={onShowHistory}>
      <button className="update-close-button" onClick={handleDismiss}>×</button>
      <div className="update-banner-content">
        <span className="update-icon">🆕</span>
        <span className="update-text">新しいアップデートがあります</span>
      </div>
    </div>
  )
}