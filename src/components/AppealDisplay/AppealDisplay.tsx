import React, { useState } from 'react'
import { useGameStore } from '@stores/gameStore'
import { calculateAppealValueWithDetails, AppealCalculationResult } from '@core/calculations/appeal'
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

  // Group center boosts by percentage
  const groupedBoosts = appealResult.details.centerBoosts.reduce((acc, boost) => {
    if (!acc[boost.boostPercentage]) {
      acc[boost.boostPercentage] = []
    }
    acc[boost.boostPercentage].push(boost)
    return acc
  }, {} as Record<number, AppealCalculationResult['details']['centerBoosts']>)

  return (
    <div className="appeal-summary">
      <div className="appeal-box">
        <div className="box-label">アピール値</div>
        <div className="box-value">{appealResult.totalAppeal.toLocaleString()}</div>
      </div>

      <span
        className="appeal-info-icon"
        onClick={handleToggleDetails}
        title="詳細を表示"
      >
        ⓘ
      </span>

      {showDetails && (
        <div className="appeal-details">
          <div className="appeal-detail-section">
            <div className="appeal-detail-label">基礎アピール値</div>
            <div className="appeal-attribute-grid">
              <div className="appeal-attribute-item">
                <span className="attribute-label smile">Smile</span>
                <span className="attribute-value">{appealResult.details.baseSmile.toLocaleString()}</span>
              </div>
              <div className="appeal-attribute-item">
                <span className="attribute-label pure">Pure</span>
                <span className="attribute-value">{appealResult.details.basePure.toLocaleString()}</span>
              </div>
              <div className="appeal-attribute-item">
                <span className="attribute-label cool">Cool</span>
                <span className="attribute-value">{appealResult.details.baseCool.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {appealResult.details.centerBoosts.length > 0 && (
            <div className="appeal-detail-section">
              <div className="appeal-detail-label">センター特性ボーナス</div>
              {Object.entries(groupedBoosts).map(([percentage, boosts]) => (
                <div key={percentage} className="center-boost-group">
                  <div className="boost-percentage">+{percentage}%</div>
                  <div className="boost-cards">
                    {boosts.map((boost, index) => (
                      <div key={index} className="boost-card-item">
                        {boost.displayName}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="appeal-detail-section">
            <div className="appeal-detail-label">ブースト後アピール値</div>
            <div className="appeal-attribute-grid">
              <div className="appeal-attribute-item">
                <span className="attribute-label smile">Smile</span>
                <span className="attribute-value">
                  {appealResult.details.boostedSmile.toLocaleString()}
                  {appealResult.details.boostedSmile > appealResult.details.baseSmile && (
                    <span className="attribute-boost">
                      (+{(appealResult.details.boostedSmile - appealResult.details.baseSmile).toLocaleString()})
                    </span>
                  )}
                </span>
              </div>
              <div className="appeal-attribute-item">
                <span className="attribute-label pure">Pure</span>
                <span className="attribute-value">
                  {appealResult.details.boostedPure.toLocaleString()}
                  {appealResult.details.boostedPure > appealResult.details.basePure && (
                    <span className="attribute-boost">
                      (+{(appealResult.details.boostedPure - appealResult.details.basePure).toLocaleString()})
                    </span>
                  )}
                </span>
              </div>
              <div className="appeal-attribute-item">
                <span className="attribute-label cool">Cool</span>
                <span className="attribute-value">
                  {appealResult.details.boostedCool.toLocaleString()}
                  {appealResult.details.boostedCool > appealResult.details.baseCool && (
                    <span className="attribute-boost">
                      (+{(appealResult.details.boostedCool - appealResult.details.baseCool).toLocaleString()})
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {musicAttribute && (
            <div className="appeal-detail-section">
              <div className="appeal-detail-label">楽曲属性補正</div>
              <div className="appeal-calculation">
                <div className="calc-step">
                  <span className="calc-label">一致属性 ({musicAttribute})</span>
                  <span className="calc-formula">
                    {appealResult.details['boosted' + musicAttribute.charAt(0).toUpperCase() + musicAttribute.slice(1) as keyof typeof appealResult.details]?.toLocaleString() || '0'} × 100%
                  </span>
                  <span className="calc-result">
                    = {Math.ceil(appealResult.details.matchingAttributeAppeal).toLocaleString()}
                  </span>
                </div>
                <div className="calc-step">
                  <span className="calc-label">不一致属性</span>
                  <span className="calc-formula">
                    {(() => {
                      const nonMatchingTotal = 
                        (musicAttribute === 'smile' ? appealResult.details.boostedPure + appealResult.details.boostedCool :
                         musicAttribute === 'pure' ? appealResult.details.boostedSmile + appealResult.details.boostedCool :
                         appealResult.details.boostedSmile + appealResult.details.boostedPure);
                      return `${nonMatchingTotal.toLocaleString()} × 10%`;
                    })()}
                  </span>
                  <span className="calc-result">
                    = {Math.ceil(appealResult.details.nonMatchingAttributeAppeal).toLocaleString()}
                  </span>
                </div>
                <div className="calc-total">
                  <span className="calc-label">合計アピール値</span>
                  <span className="calc-result">
                    {Math.ceil(appealResult.details.matchingAttributeAppeal).toLocaleString()} + {Math.ceil(appealResult.details.nonMatchingAttributeAppeal).toLocaleString()} = {appealResult.totalAppeal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
