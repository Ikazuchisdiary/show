import React, { useState } from 'react'
import { APShortageResult } from '@core/models'
import './APShortageDisplay.css'

interface APShortageDisplayProps {
  result: APShortageResult
  totalAP: number
}

export const APShortageDisplay: React.FC<APShortageDisplayProps> = ({ result, totalAP }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [showLog, setShowLog] = useState(false)
  
  const apDeficit = result.realAPConsumption - totalAP
  const excludedCount = result.excludedActivations.length
  const apBalance = totalAP - result.realAPConsumption + result.apSaved
  
  return (
    <div className="ap-shortage-box">
      <div className="ap-shortage-main">
        <div className="box-label">AP不足参考スコア</div>
        <div className="box-value">{result.score.toLocaleString()}</div>
      </div>
      <span 
        className="ap-shortage-info-icon" 
        onClick={() => setShowDetails(!showDetails)}
        title="詳細を表示"
      >
        ⓘ
      </span>
      
      <div className="ap-shortage-details" style={{ display: showDetails ? 'block' : 'none' }}>
          <div className="ap-shortage-detail-header">
            <span className="detail-icon">🚫</span>
            <span className="detail-title">除外した発動</span>
          </div>
          <div className="ap-shortage-excluded-list">
            {result.excludedActivations.map((activation, index) => (
              <div key={index} className="excluded-item">
                <span className="turn-badge">T{activation.turn + 1}</span>
                <span className="card-name">{activation.cardName}</span>
                <span className="ap-cost">AP {activation.apCost}</span>
              </div>
            ))}
          </div>
          <div className="ap-shortage-stats">
            <div className="stat-item">
              <span className="stat-label">消費AP</span>
              <span className="stat-value">{result.realAPConsumption}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">節約AP</span>
              <span className="stat-value highlight">+{result.apSaved}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">最終収支</span>
              <span className="stat-value positive">+{apBalance}</span>
            </div>
          </div>
          
          <div className="ap-shortage-log-section">
            <button 
              className="ap-shortage-log-toggle"
              onClick={() => setShowLog(!showLog)}
            >
              {showLog ? 'ログを隠す' : '詳細ログを表示'}
            </button>
          
            {showLog && (
              <div className="ap-shortage-log">
                {result.turnResults.map((turn, index) => {
                  const isExcluded = result.excludedActivations.some(a => a.turn === turn.turn)
                  return (
                    <div 
                      key={index} 
                      className={`log-turn ${isExcluded ? 'excluded-turn' : ''}`}
                    >
                      {turn.logs && turn.logs.map((log, logIndex) => (
                        <div key={logIndex} dangerouslySetInnerHTML={{ __html: log }} />
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
  )
}