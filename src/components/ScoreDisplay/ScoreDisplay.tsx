import React, { useState } from 'react'
import { useGameStore } from '@stores/gameStore'
import './ScoreDisplay.css'

export const ScoreDisplay: React.FC = () => {
  const { simulationResult } = useGameStore()
  const [showLog, setShowLog] = useState(false)
  
  if (!simulationResult) {
    return null
  }
  
  const totalScore = simulationResult.totalScore
  const totalVoltage = simulationResult.totalVoltage
  const voltageLevel = Math.max(...simulationResult.turnResults.map(t => t.voltageLevel))
  const totalAP = simulationResult.turnResults.reduce((sum, turn) => sum + turn.apUsed, 0)
  
  return (
    <>
      <div id="result" style={{ display: 'block' }}>
        <h2>計算結果</h2>
        <div id="score">
          スコア: {totalScore.toLocaleString()}
        </div>
        <div id="apSummary">
          <div>総ボルテージ: {totalVoltage.toLocaleString()}</div>
          <div>最大ボルテージLv: {voltageLevel}</div>
          <div>消費AP: {totalAP}</div>
        </div>
        <button className="toggle-log" onClick={() => setShowLog(!showLog)}>
          {showLog ? '詳細ログを隠す' : '詳細ログを表示'}
        </button>
      </div>
      
      {showLog && (
        <div id="turnLog" style={{ display: 'block' }}>
          {simulationResult.turnResults.map((turn, index) => (
            <div key={index} className="log-turn">
              <div className="log-turn-header">
                <span className="turn-number">T{turn.turn + 1}</span>
                <span className="log-card-name">{turn.cardCharacter}</span>
                {turn.apUsed > 0 && (
                  <span className="log-ap-inline">AP-{turn.apUsed}</span>
                )}
              </div>
              {!turn.isSkipped && (
                <div className="log-details">
                  <div className="log-action">
                    スコア +{turn.scoreGain.toLocaleString()}
                  </div>
                  <div className="log-action">
                    ボルテージ +{turn.voltageGain} (Lv.{turn.voltageLevel})
                  </div>
                  <div className="log-calculation">
                    <span className="calc-value calc-base">
                      {turn.appeal}
                      <span className="calc-label">アピール</span>
                    </span>
                    <span>×</span>
                    <span className="calc-value calc-multiplier">
                      {turn.multipliers.total.toFixed(2)}
                      <span className="calc-label">倍率</span>
                    </span>
                    <span>×</span>
                    <span className="calc-value calc-voltage">
                      {(1 + turn.voltageLevel / 10).toFixed(1)}
                      <span className="calc-label">ボルテージ</span>
                    </span>
                  </div>
                </div>
              )}
              {turn.isSkipped && (
                <div className="log-action">スキップ</div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}