import React, { useState } from 'react'
import { useGameStore } from '@stores/gameStore'
import { calculateAppealValueWithDetails } from '@core/calculations/appeal'
import './AppealDisplay.css'

export const AppealDisplay: React.FC = () => {
  const { selectedCards, selectedMusic } = useGameStore()
  const [showDetails, setShowDetails] = useState(false)

  // Find all center cards for center characteristics
  const centerCards = selectedMusic?.centerCharacter
    ? selectedCards.filter(
        (card) => card && card.character === selectedMusic.centerCharacter,
      )
    : []

  // Get music attribute from selected music
  const musicAttribute = selectedMusic?.attribute || null

  // Calculate appeal value with details
  const appealResult = calculateAppealValueWithDetails({
    cards: selectedCards,
    musicAttribute: musicAttribute,
    // Use only centerCharacteristics to avoid double application
    centerCharacteristics: centerCards
      .map((card) => card?.centerCharacteristic)
      .filter((c) => c !== undefined),
  })

  const handleToggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div className="appeal-box" onClick={handleToggleDetails} style={{ cursor: 'pointer' }}>
      <div className="box-label">アピール値</div>
      <div className="box-value">{appealResult.totalAppeal.toLocaleString()}</div>
      {showDetails && (
        <div className="appeal-details">
          <div className="detail-section">
            <div className="detail-label">基礎アピール値</div>
            <div className="detail-item">
              <span className="attribute-smile">Smile: {appealResult.details.baseSmile.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="attribute-pure">Pure: {appealResult.details.basePure.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="attribute-cool">Cool: {appealResult.details.baseCool.toLocaleString()}</span>
            </div>
          </div>
          {appealResult.details.centerBoosts.length > 0 && (
            <div className="detail-section">
              <div className="detail-label">センター特性ボーナス</div>
              {appealResult.details.centerBoosts.map((boost, index) => (
                <div key={index} className="detail-item">
                  {boost.cardIndex}枚目: {boost.cardName} (+{boost.boostPercentage}%)
                </div>
              ))}
            </div>
          )}
          <div className="detail-section">
            <div className="detail-label">ブースト後アピール値</div>
            <div className="detail-item">
              <span className="attribute-smile">Smile: {appealResult.details.boostedSmile.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="attribute-pure">Pure: {appealResult.details.boostedPure.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="attribute-cool">Cool: {appealResult.details.boostedCool.toLocaleString()}</span>
            </div>
          </div>
          {musicAttribute && (
            <div className="detail-section">
              <div className="detail-label">楽曲属性補正</div>
              <div className="detail-item">
                一致属性 ({musicAttribute}): {Math.ceil(appealResult.details.matchingAttributeAppeal).toLocaleString()} (100%)
              </div>
              <div className="detail-item">
                不一致属性: {Math.ceil(appealResult.details.nonMatchingAttributeAppeal).toLocaleString()} (10%)
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
