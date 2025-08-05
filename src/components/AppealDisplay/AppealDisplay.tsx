import React from 'react'
import { useGameStore } from '@stores/gameStore'
import { calculateAppealValue } from '@core/calculations/appeal'
import './AppealDisplay.css'

export const AppealDisplay: React.FC = () => {
  const { selectedCards, selectedMusic } = useGameStore()

  // Find all center cards for center characteristics
  const centerCards = selectedMusic?.centerCharacter
    ? selectedCards.filter(
        (card) => card && card.character === selectedMusic.centerCharacter,
      )
    : []

  // Get music attribute from selected music
  const musicAttribute = selectedMusic?.attribute || null

  // Calculate appeal value
  const appeal = calculateAppealValue({
    cards: selectedCards,
    musicAttribute: musicAttribute,
    // Use only centerCharacteristics to avoid double application
    centerCharacteristics: centerCards
      .map((card) => card?.centerCharacteristic)
      .filter((c) => c !== undefined),
  })

  return (
    <div className="appeal-box">
      <div className="box-label">アピール値</div>
      <div className="box-value">{appeal.toLocaleString()}</div>
    </div>
  )
}
