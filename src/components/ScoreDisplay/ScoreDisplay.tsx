import React, { useState, useMemo } from 'react'
import { useGameStore } from '@stores/gameStore'
import { APBalanceDisplay } from '@components/APBalanceDisplay'
import { APShortageDisplay } from '@components/APShortageDisplay'
import { AppealDisplay } from '@components/AppealDisplay'
import { GameSimulator } from '@core/simulation/GameSimulator'
import { calculateBaseAP } from '@utils/calculateBaseAP'
import './ScoreDisplay.css'

export const ScoreDisplay: React.FC = () => {
  const {
    simulationResult,
    selectedCards,
    cardSkillLevels,
    centerSkillLevels,
    customSkillValues,
    customCenterSkillValues,
    selectedMusic,
    selectedDifficulty,
    centerCharacter,
    comboCount,
    initialMental,
  } = useGameStore()
  const [showLog, setShowLog] = useState(false)

  // Calculate base AP first
  const baseAP = useMemo(() => {
    // Get combo count from music based on difficulty
    let actualComboCount = comboCount
    if (selectedMusic?.combos && selectedMusic.combos[selectedDifficulty]) {
      actualComboCount = selectedMusic.combos[selectedDifficulty]!
    }
    return calculateBaseAP(actualComboCount, initialMental)
  }, [comboCount, initialMental, selectedMusic, selectedDifficulty])

  // Calculate AP shortage result if needed
  const apShortageResult = useMemo(() => {
    if (!simulationResult || !selectedMusic) return null

    const totalAvailableAP = baseAP + simulationResult.apAcquired
    const netAP = totalAvailableAP - simulationResult.apConsumed
    if (netAP >= 0) return null

    // Get combo count from music based on difficulty
    let actualComboCount = comboCount
    if (selectedMusic.combos && selectedMusic.combos[selectedDifficulty]) {
      actualComboCount = selectedMusic.combos[selectedDifficulty]!
    }

    // Create a new simulator with the same configuration
    const simulator = new GameSimulator({
      cards: selectedCards,
      cardSkillLevels,
      centerSkillLevels,
      customSkillValues,
      customCenterSkillValues,
      music: selectedMusic,
      musicAttribute: selectedMusic?.attribute,
      centerCharacter: selectedMusic?.centerCharacter ?? centerCharacter ?? undefined,
      initialMental,
      comboCount: actualComboCount,
    })

    // Pass the existing simulation result to avoid re-simulation
    return simulator.simulateWithAPShortage(baseAP, simulationResult) // Include base AP and previous state
  }, [
    simulationResult,
    selectedCards,
    cardSkillLevels,
    centerSkillLevels,
    customSkillValues,
    customCenterSkillValues,
    selectedMusic,
    selectedDifficulty,
    centerCharacter,
    comboCount,
    baseAP,
    initialMental,
  ])

  if (!simulationResult) {
    return null
  }

  const totalScore = simulationResult.totalScore

  return (
    <>
      <div id="result" style={{ display: 'block' }}>
        <h2>計算結果</h2>
        <div id="score">{totalScore.toLocaleString()}</div>
        <div className="result-details">
          <AppealDisplay />

          <APBalanceDisplay simulationResult={simulationResult} baseAP={baseAP} />

          {apShortageResult && <APShortageDisplay result={apShortageResult} totalAP={baseAP} />}
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
                <div dangerouslySetInnerHTML={{ __html: turn.logs.join('') }} />
              ) : (
                // 詳細ログがない場合は簡易表示（フォールバック）
                <>
                  <div className="log-turn-header">
                    <span className="turn-number">T{turn.turn + 1}</span>
                    <span className="log-card-name">{turn.cardName}</span>
                    {turn.apUsed > 0 && <span className="log-ap-inline">AP-{turn.apUsed}</span>}
                  </div>
                  {!turn.isSkipped && (
                    <div className="log-details">
                      <div className="log-action">スコア +{turn.scoreGain.toLocaleString()}</div>
                      <div className="log-action">
                        ボルテージ +{turn.voltageGain} (Lv.{turn.voltageLevel})
                      </div>
                    </div>
                  )}
                  {turn.isSkipped && <div className="log-action">スキップ</div>}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
