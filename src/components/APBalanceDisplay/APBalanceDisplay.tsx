import React, { useState } from 'react'
import { GameState } from '@core/models/Game'
import './APBalanceDisplay.css'

interface APBalanceDisplayProps {
  simulationResult: GameState
  baseAP?: number
}

export const APBalanceDisplay: React.FC<APBalanceDisplayProps> = ({
  simulationResult,
  baseAP = 0,
}) => {
  const [showDetails, setShowDetails] = useState(false)

  const totalAP = baseAP + simulationResult.apAcquired
  const apBalance = totalAP - simulationResult.apConsumed
  const isPositive = apBalance >= 0

  // Format AP values to 2 decimal places without zero padding
  const formatAP = (value: number): string => {
    if (value === 0) return '0'
    // Round to 2 decimal places
    const rounded = Math.round(value * 100) / 100
    // Convert to string and remove trailing zeros after decimal point only
    const str = rounded.toString()
    if (str.includes('.')) {
      return str.replace(/\.?0+$/, '')
    }
    return str
  }

  // Calculate AP income and expense breakdown
  const apBreakdown = React.useMemo(() => {
    const income: Array<{ name: string; value: number }> = []
    const expense: Array<{ name: string; value: number }> = []

    // Base AP
    if (baseAP > 0) {
      income.push({ name: '基礎AP', value: baseAP })
    }

    // AP acquired from cards/effects (skill AP)
    if (simulationResult.apAcquired > 0) {
      income.push({ name: 'スキルAP', value: simulationResult.apAcquired })
    }

    // AP consumed by cards
    if (simulationResult.apConsumed > 0) {
      expense.push({ name: 'スキル発動', value: simulationResult.apConsumed })
    }

    return { income, expense }
  }, [simulationResult, baseAP])

  return (
    <div className={`ap-summary ${isPositive ? 'positive' : 'negative'}`}>
      <div className={`ap-balance ${isPositive ? 'positive' : 'negative'}`}>
        <div className="box-label">AP収支</div>
        <div className="box-value">
          {apBalance >= 0 ? '+' : ''}
          {formatAP(apBalance)}
        </div>
      </div>

      <span
        className="ap-info-icon"
        onClick={() => setShowDetails(!showDetails)}
        title="詳細を表示"
      >
        ⓘ
      </span>

      {showDetails && (
        <div className="ap-details">
          <div className="ap-detail-columns">
            <div className="ap-detail-section ap-income">
              <div className="ap-detail-label">獲得AP</div>
              {apBreakdown.income.map((item, index) => (
                <div key={index} className="ap-detail-item">
                  <span className="ap-detail-name">{item.name}</span>
                  <span className="ap-detail-value">+{formatAP(item.value)}</span>
                </div>
              ))}
              <div className="ap-detail-total">
                <span className="ap-detail-name">合計</span>
                <span className="ap-detail-value">{formatAP(totalAP)}</span>
              </div>
            </div>

            <div className="ap-detail-section ap-expense">
              <div className="ap-detail-label">消費AP</div>
              {apBreakdown.expense.map((item, index) => (
                <div key={index} className="ap-detail-item">
                  <span className="ap-detail-name">{item.name}</span>
                  <span className="ap-detail-value">{formatAP(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
