import React, { useState, useMemo } from 'react'
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

  // Create tooltip text for boost badges
  const getBoostTooltip = useMemo(() => {
    const boostSources: Record<number, string[]> = {}
    
    // Collect all center cards with their characteristics
    centerCards.forEach((card) => {
      if (card?.centerCharacteristic) {
        card.centerCharacteristic.effects.forEach((effect) => {
          if (effect.type === 'appealBoost') {
            // Find which cards are affected by this center characteristic
            selectedCards.forEach((targetCard, index) => {
              if (targetCard && appealResult.details.cardDetails[index]) {
                const cardDetail = appealResult.details.cardDetails[index]
                if (cardDetail.boostPercentage > 0) {
                  // Check if this center characteristic affects this card
                  const targetMatch = 
                    effect.target === 'all' ||
                    effect.target === targetCard.character ||
                    (effect.target === '102期' && ['乙宗梢', '藤島慈', '夕霧綴理'].includes(targetCard.character)) ||
                    (effect.target === '103期' && ['日野下花帆', '村野さやか', '大沢瑠璃乃'].includes(targetCard.character)) ||
                    (effect.target === '104期' && ['百生吟子', '徒町小鈴', '安養寺姫芽'].includes(targetCard.character)) ||
                    (effect.target === 'スリーズブーケ' && ['乙宗梢', '日野下花帆', '百生吟子'].includes(targetCard.character)) ||
                    (effect.target === 'DOLLCHESTRA' && ['夕霧綴理', '村野さやか', '徒町小鈴'].includes(targetCard.character)) ||
                    (effect.target === 'みらくらぱーく！' && ['藤島慈', '大沢瑠璃乃', '安養寺姫芽'].includes(targetCard.character))
                  
                  if (targetMatch) {
                    const key = index + 1
                    if (!boostSources[key]) {
                      boostSources[key] = []
                    }
                    const sourceName = card.displayName || card.name
                    const targetDesc = effect.target === 'all' ? '全員' : effect.target
                    boostSources[key].push(`${sourceName}: ${targetDesc}に+${effect.value * 100}%`)
                  }
                }
              }
            })
          }
        })
      }
    })
    
    return (cardIndex: number) => {
      return boostSources[cardIndex]?.join('\n') || ''
    }
  }, [centerCards, selectedCards, appealResult.details.cardDetails])

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
          {/* カードごとの詳細 */}
          <div className="appeal-detail-section">
            <div className="appeal-detail-label">カード別アピール値</div>
            {appealResult.details.cardDetails && appealResult.details.cardDetails.map((card) => (
              <div key={card.cardIndex} className="card-appeal-detail">
                <div className="card-appeal-header">
                  <span className="card-number">{card.cardIndex}</span>
                  <span className="card-name">{card.displayName}</span>
                  {card.boostPercentage > 0 && (
                    <span 
                      className="card-boost-badge"
                      title={getBoostTooltip(card.cardIndex)}
                    >
                      +{Math.round(card.boostPercentage * 100) / 100}%
                    </span>
                  )}
                </div>
                <div className="card-appeal-stats">
                  <div className="card-stat-item">
                    <span className="stat-label smile">Smile</span>
                    <span className="stat-base">{card.baseStats.smile.toLocaleString()}</span>
                    {card.boostPercentage > 0 && (
                      <>
                        <span className="stat-arrow">→</span>
                        <span className="stat-boosted">{card.boostedStats.smile.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                  <div className="card-stat-item">
                    <span className="stat-label pure">Pure</span>
                    <span className="stat-base">{card.baseStats.pure.toLocaleString()}</span>
                    {card.boostPercentage > 0 && (
                      <>
                        <span className="stat-arrow">→</span>
                        <span className="stat-boosted">{card.boostedStats.pure.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                  <div className="card-stat-item">
                    <span className="stat-label cool">Cool</span>
                    <span className="stat-base">{card.baseStats.cool.toLocaleString()}</span>
                    {card.boostPercentage > 0 && (
                      <>
                        <span className="stat-arrow">→</span>
                        <span className="stat-boosted">{card.boostedStats.cool.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 合計値 */}
          <div className="appeal-detail-section">
            <div className="appeal-detail-label">属性別合計アピール値</div>
            <div className="appeal-total-grid">
              <div className="appeal-total-item">
                <span className="total-label">基礎合計</span>
                <div className="total-stats">
                  <span className="total-stat smile">Smile: {appealResult.details.baseSmile.toLocaleString()}</span>
                  <span className="total-stat pure">Pure: {appealResult.details.basePure.toLocaleString()}</span>
                  <span className="total-stat cool">Cool: {appealResult.details.baseCool.toLocaleString()}</span>
                </div>
              </div>
              <div className="appeal-total-item">
                <span className="total-label">ブースト後合計</span>
                <div className="total-stats">
                  <span className="total-stat smile">Smile: {appealResult.details.boostedSmile.toLocaleString()}</span>
                  <span className="total-stat pure">Pure: {appealResult.details.boostedPure.toLocaleString()}</span>
                  <span className="total-stat cool">Cool: {appealResult.details.boostedCool.toLocaleString()}</span>
                </div>
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
