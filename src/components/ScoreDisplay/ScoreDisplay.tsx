import React, { useState, useMemo } from 'react'
import { useGameStore } from '@stores/gameStore'
import { APShortageDisplay } from '@components/APShortageDisplay'
import { GameSimulator } from '@core/simulation/GameSimulator'
import './ScoreDisplay.css'

export const ScoreDisplay: React.FC = () => {
  const { 
    simulationResult,
    cards,
    cardSkillLevels,
    centerSkillLevels,
    customSkillValues,
    customCenterSkillValues,
    selectedMusic,
    musicAttribute,
    centerCharacter,
    mental,
    comboCount
  } = useGameStore()
  const [showLog, setShowLog] = useState(false)
  
  // Calculate AP shortage result if needed
  const apShortageResult = useMemo(() => {
    if (!simulationResult || !selectedMusic) return null
    
    const netAP = simulationResult.apAcquired - simulationResult.apConsumed
    if (netAP >= 0) return null
    
    // Run AP shortage simulation
    const simulator = new GameSimulator({
      cards,
      cardSkillLevels,
      centerSkillLevels,
      customSkillValues,
      customCenterSkillValues,
      music: selectedMusic,
      musicAttribute,
      centerCharacter,
      initialMental: mental,
      comboCount
    })
    
    return simulator.simulateWithAPShortage(0) // Assuming starting AP is 0
  }, [
    simulationResult,
    cards,
    cardSkillLevels,
    centerSkillLevels,
    customSkillValues,
    customCenterSkillValues,
    selectedMusic,
    musicAttribute,
    centerCharacter,
    mental,
    comboCount
  ])
  
  if (!simulationResult) {
    return null
  }
  
  const totalScore = simulationResult.totalScore
  const totalVoltage = simulationResult.totalVoltage
  const voltageLevel = Math.max(...simulationResult.turnResults.map(t => t.voltageLevel))
  const netAP = simulationResult.apAcquired - simulationResult.apConsumed
  
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
          <div>AP収支: <span style={{ color: netAP >= 0 ? '#28a745' : '#dc3545' }}>{netAP >= 0 ? '+' : ''}{netAP}</span></div>
        </div>
        <button className="toggle-log" onClick={() => setShowLog(!showLog)}>
          {showLog ? '詳細ログを隠す' : '詳細ログを表示'}
        </button>
      </div>
      
      {apShortageResult && (
        <APShortageDisplay result={apShortageResult} totalAP={0} />
      )}
      
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