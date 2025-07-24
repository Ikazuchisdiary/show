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
              {turn.logs && turn.logs.length > 0 ? (
                // v1形式の詳細ログがある場合はそれを表示
                turn.logs.map((log, logIndex) => (
                  <div key={logIndex} dangerouslySetInnerHTML={{ __html: log }} />
                ))
              ) : (
                // 詳細ログがない場合は簡易表示（フォールバック）
                <>
                  <div className="log-turn-header">
                    <span className="turn-number">T{turn.turn + 1}</span>
                    <span className="log-card-name">{turn.cardName}</span>
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
                    </div>
                  )}
                  {turn.isSkipped && (
                    <div className="log-action">スキップ</div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}