import React from 'react'
import { useGameStore } from '@stores/gameStore'
import { calculateAppealValue } from '@core/calculations/appeal'
import './AppealDisplay.css'

export const AppealDisplay: React.FC = () => {
  const { 
    selectedCards,
    selectedMusic
  } = useGameStore()
  
  // Find center card for center characteristic
  const centerCard = selectedCards.find(
    card => card && selectedMusic && card.character === selectedMusic.centerCharacter
  ) || null
  
  // Get music attribute from selected music
  const musicAttribute = selectedMusic?.attribute || null
  
  // Calculate appeal value
  const appeal = calculateAppealValue({
    cards: selectedCards,
    musicAttribute: musicAttribute,
    centerCard,
    centerCharacteristic: centerCard?.centerCharacteristic
  })
  
  return (
    <div className="appeal-box">
      <div className="box-label">アピール値</div>
      <div className="box-value">{appeal.toLocaleString()}</div>
    </div>
  )
}