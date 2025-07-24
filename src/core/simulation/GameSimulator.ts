import { 
  Card, 
  GameState, 
  GamePhase, 
  TurnResult, 
  SimulationOptions,
  Effect,
  ConditionalEffect
} from '../models'
import {
  calculateAppealValue,
  calculateScore,
  getVoltageLevel,
  calculateSkillInvocationMultiplier,
  SKILL_LEVEL_MULTIPLIERS
} from '../calculations'

export class GameSimulator {
  private state: GameState
  private customSkillValues: Record<string, Record<string, number>>
  private customCenterSkillValues: Record<string, Record<string, number>>
  private centerSkillLevels: number[]
  private currentTurnScoreGain: number = 0
  private currentTurnVoltageGain: number = 0
  private currentTurnLogs: string[] = []
  
  constructor(options: SimulationOptions) {
    this.customSkillValues = options.customSkillValues || {}
    this.customCenterSkillValues = options.customCenterSkillValues || {}
    this.centerSkillLevels = options.centerSkillLevels || Array(6).fill(10)
    this.state = this.initializeState(options)
  }
  
  private initializeState(options: SimulationOptions): GameState {
    const { cards, cardSkillLevels, music, musicAttribute, centerCharacter } = options
    
    // Calculate phases
    const phases: GamePhase[] = []
    if (music.phases.length >= 3) {
      const [beforeFever, duringFever, afterFever] = music.phases
      
      phases.push({
        name: 'beforeFever',
        startTurn: 0,
        endTurn: beforeFever - 1
      })
      
      phases.push({
        name: 'duringFever', 
        startTurn: beforeFever,
        endTurn: beforeFever + duringFever - 1
      })
      
      phases.push({
        name: 'afterFever',
        startTurn: beforeFever + duringFever,
        endTurn: beforeFever + duringFever + afterFever - 1
      })
    }
    
    return {
      // Core state
      cards,
      cardSkillLevels,
      music,
      musicAttribute: musicAttribute || null,
      centerCharacter: centerCharacter || null,
      
      // Game progress
      currentTurn: 0,
      currentCardIndex: 0,
      totalScore: 0,
      totalVoltage: 0,
      
      // Multipliers and boosts (using arrays like v1)
      scoreBoost: new Array(100).fill(0),
      scoreBoostCount: 0,
      voltageBoost: new Array(100).fill(0),
      voltageBoostCount: 0,
      skillInvocationBoost: 0,
      centerSkillMultiplier: 1,
      learningCorrection: 1.5, // Default v1 value
      
      // Game resources
      mental: options.initialMental || 100,
      apAcquired: 0,
      apConsumed: 0,
      
      // Card management
      removedCards: new Set<string>(),
      
      // Turn tracking
      turnResults: [],
      cardTurnCounts: new Array(6).fill(0),
      totalCardUses: new Array(6).fill(0),
      
      // Phase info
      phases,
      currentPhase: phases[0] || null
    }
  }
  
  /**
   * Run the full simulation
   */
  simulate(): GameState {
    const totalTurns = this.getTotalTurns()
    
    // Apply center skills at start
    this.applyCenterSkillsAtTiming('beforeFirstTurn')
    
    for (let turn = 0; turn < totalTurns; turn++) {
      this.state.currentTurn = turn
      this.updateCurrentPhase()
      
      // Apply center skills at fever start
      if (this.isFirstTurnOfPhase('duringFever')) {
        this.applyCenterSkillsAtTiming('beforeFeverStart')
      }
      
      this.processTurn()
    }
    
    // Apply center skills at end
    this.applyCenterSkillsAtTiming('afterLastTurn')
    
    return this.state
  }
  
  private getTotalTurns(): number {
    if (!this.state.music || !this.state.music.phases.length) return 0
    return this.state.music.phases.reduce((sum, phase) => sum + phase, 0)
  }
  
  private updateCurrentPhase(): void {
    const turn = this.state.currentTurn
    this.state.currentPhase = this.state.phases.find(
      phase => turn >= phase.startTurn && turn <= phase.endTurn
    ) || null
  }
  
  private isFirstTurnOfPhase(phaseName: string): boolean {
    const phase = this.state.phases.find(p => p.name === phaseName)
    return phase ? this.state.currentTurn === phase.startTurn : false
  }
  
  private processTurn(): void {
    const card = this.getCurrentCard()
    
    if (!card) {
      this.skipTurn()
      return
    }
    
    // Reset turn gains and logs
    this.currentTurnScoreGain = 0
    this.currentTurnVoltageGain = 0
    this.currentTurnLogs = []
    
    // Add turn header log with card name (v1 style)
    const phase = this.getPhaseStr()
    const apDisplay = card.apCost > 0 ? `<span class="log-ap-inline">AP-${card.apCost}</span>` : ''
    this.currentTurnLogs.push(
      `<div class="log-turn-header">
        <span class="turn-number">${this.state.currentTurn + 1}</span>
        ${phase}
        <span class="log-card-name">${card.displayName || card.name}</span>
        ${apDisplay}
      </div>`
    )
    
    // Increment card usage count BEFORE processing effects (v1 compatibility)
    this.state.cardTurnCounts[this.state.currentCardIndex]++
    this.state.totalCardUses[this.state.currentCardIndex]++
    
    // Process card effects
    let skipTurn = false
    let resetCardRequested = false
    let removeAfterUseEffects: Array<{effect: Effect, index: number}> = []
    
    // Process all effects except removeAfterUse first
    for (let i = 0; i < card.effects.length; i++) {
      const effect = card.effects[i]
      if (effect.type === 'removeAfterUse' || effect.type === 'skipTurn') {
        // Save removeAfterUse for later processing
        removeAfterUseEffects.push({effect, index: i})
      } else {
        const result = this.processEffect(effect, card, this.state.currentCardIndex, `effect_${i}`)
        if (result.skipTurn) skipTurn = true
        if (result.resetCardTurn) resetCardRequested = true
      }
    }
    
    // Process removeAfterUse effects last
    for (const {effect, index} of removeAfterUseEffects) {
      const result = this.processEffect(effect, card, this.state.currentCardIndex, `effect_${index}`)
      if (result.skipTurn) skipTurn = true
    }
    
    if (skipTurn) {
      this.skipTurn()
      return
    }
    
    // Calculate turn results
    const turnResult = this.calculateTurnResult(card)
    this.state.turnResults.push(turnResult)
    
    // Don't update score/voltage here since it's already done in getScore/getVoltage
    
    // Update AP consumption
    this.state.apConsumed += card.apCost
    
    // Move to next card (resetCardRequested only affects card rotation, not usage counts)
    this.moveToNextCard(resetCardRequested)
  }
  
  private getCurrentCard(): Card | null {
    const card = this.state.cards[this.state.currentCardIndex]
    // Check if card is removed
    if (card && this.state.removedCards.has(card.name)) {
      return null
    }
    return card
  }
  
  private moveToNextCard(resetCardRequested: boolean = false): void {
    if (resetCardRequested) {
      // Reset to first card
      this.state.currentCardIndex = 0
      // Find first non-null and non-removed card from the beginning
      let attempts = 0
      while (attempts < 6) {
        const card = this.state.cards[this.state.currentCardIndex]
        if (card && !this.state.removedCards.has(card.name)) {
          break
        }
        this.state.currentCardIndex = (this.state.currentCardIndex + 1) % 6
        attempts++
      }
    } else {
      // Normal rotation to next card
      let nextIndex = this.state.currentCardIndex
      let attempts = 0
      
      do {
        nextIndex = (nextIndex + 1) % 6
        attempts++
        const card = this.state.cards[nextIndex]
        if (card && !this.state.removedCards.has(card.name)) {
          break
        }
      } while (attempts < 6)
      
      this.state.currentCardIndex = nextIndex
    }
  }
  
  private skipTurn(): void {
    const card = this.getCurrentCard()
    
    this.state.turnResults.push({
      turn: this.state.currentTurn,
      cardIndex: this.state.currentCardIndex,
      cardName: card?.name || 'Unknown',
      cardCharacter: card?.character || 'Unknown',
      appeal: 0,
      scoreGain: 0,
      voltageGain: 0,
      voltageLevel: getVoltageLevel(this.state.totalVoltage, this.state.currentTurn, this.state.music),
      apUsed: 0,
      isSkipped: true,
      multipliers: {
        base: 0,
        skill: 0,
        skillBoost: 0,
        voltage: 0,
        fever: 0,
        center: 0,
        total: 0
      }
    })
    
    this.moveToNextCard()
  }
  
  private processEffect(effect: Effect, card: Card, cardIndex: number, effectPath: string): { skipTurn: boolean; resetCardTurn: boolean } {
    let skipTurn = false
    let resetCardTurn = false
    
    // Check for custom skill value
    const customValue = this.customSkillValues[cardIndex]?.[effectPath]
    const skillLevel = this.state.cardSkillLevels[cardIndex]
    const skillMultiplier = SKILL_LEVEL_MULTIPLIERS[skillLevel - 1] || 1
    
    switch (effect.type) {
      case 'conditional':
        const conditionalResult = this.processConditionalEffect(effect as ConditionalEffect, card, cardIndex, effectPath)
        skipTurn = conditionalResult.skipTurn
        resetCardTurn = conditionalResult.resetCardTurn
        break
        
      case 'scoreGain':
        // Calculate score immediately like v1
        const scoreGainValue = customValue !== undefined ? customValue : effect.value
        const adjustedValue = scoreGainValue * skillMultiplier
        this.getScore(adjustedValue)
        break
        
      case 'voltageGain':
        // Calculate voltage immediately like v1
        const voltageGainValue = customValue !== undefined ? customValue : effect.value
        const adjustedVoltageValue = voltageGainValue * skillMultiplier
        this.getVoltage(adjustedVoltageValue)
        break
        
      case 'scoreBoost':
        const scoreBoostValue = customValue !== undefined ? customValue : effect.value
        this.state.scoreBoost[this.state.scoreBoostCount] += scoreBoostValue
        const percent = (scoreBoostValue * 100).toFixed(2)
        const total = (this.state.scoreBoost[this.state.scoreBoostCount] * 100).toFixed(2)
        this.currentTurnLogs.push(
          `<div class="log-action log-boost-action"><div class="log-score-boost">スコアブースト</div><div class="boost-values">+${percent}% → ${total}%</div></div>`
        )
        break
        
      case 'voltageBoost':
        const voltageBoostValue = customValue !== undefined ? customValue : effect.value
        this.state.voltageBoost[this.state.voltageBoostCount] += voltageBoostValue
        const vPercent = (voltageBoostValue * 100).toFixed(2)
        const vTotal = (this.state.voltageBoost[this.state.voltageBoostCount] * 100).toFixed(2)
        this.currentTurnLogs.push(
          `<div class="log-action log-boost-action"><div class="log-voltage-boost">ボルテージブースト</div><div class="boost-values">+${vPercent}% → ${vTotal}%</div></div>`
        )
        break
        
      case 'skillInvocationBoost':
        this.state.skillInvocationBoost += customValue !== undefined ? customValue : effect.value
        break
        
      case 'skipTurn':
        skipTurn = true
        break
        
      case 'resetCardTurn':
        resetCardTurn = true
        this.currentTurnLogs.push(
          `<div class="log-action" style="color: #3498db;">カード順リセット</div>`
        )
        break
        
      case 'apGain':
        // AP gain is handled differently - use effect value or level values
        let apValue: number
        const apEffect = effect as any // TODO: add proper type
        if (customValue !== undefined) {
          apValue = customValue
        } else if (apEffect.levelValues && apEffect.levelValues[skillLevel - 1] !== undefined) {
          apValue = apEffect.levelValues[skillLevel - 1]
        } else {
          apValue = apEffect.value
        }
        this.getAP(apValue)
        break
        
      case 'mentalReduction':
        const reduction = Math.floor(this.state.mental * (effect.value / 100))
        this.state.mental = Math.max(0, this.state.mental - reduction)
        this.currentTurnLogs.push(
          `<div class="log-action"><span style="color: #e74c3c;">メンタル${effect.value}%減少 → ${this.state.mental}%</span></div>`
        )
        break
        
      case 'mentalRecover':
        this.state.mental += effect.value
        this.currentTurnLogs.push(
          `<div class="log-action log-mental">メンタル回復: +${effect.value} → ${this.state.mental}%</div>`
        )
        break
        
      case 'voltagePenalty':
        this.state.totalVoltage = Math.max(0, this.state.totalVoltage - effect.value)
        this.currentTurnLogs.push(
          `<div class="log-action" style="color: #e74c3c;">ボルテージペナルティ: -${effect.value}</div>`
        )
        break
        
      case 'removeAfterUse':
      case 'skipTurn': // 後方互換性のため
        // Evaluate condition for removal
        const shouldRemove = this.evaluateRemoveCondition(effect, card, cardIndex)
        if (shouldRemove) {
          this.state.removedCards.add(card.name)
          this.currentTurnLogs.push(
            `<div class="log-condition-skip">
              <span class="condition-result">デッキから除外 🚫</span>
            </div>`
          )
        }
        break
    }
    
    return { skipTurn, resetCardTurn }
  }
  
  private processConditionalEffect(
    effect: ConditionalEffect, 
    card: Card,
    cardIndex: number,
    effectPath: string
  ): { skipTurn: boolean; resetCardTurn: boolean } {
    let skipTurn = false
    let resetCardTurn = false
    
    const conditionMet = this.evaluateCondition(effect.condition, card)
    
    // Add condition log
    const conditionText = this.formatCondition(effect.condition, card)
    if (conditionMet) {
      this.currentTurnLogs.push(
        `<div class="log-condition-success">
          <span class="condition-text">${conditionText}</span>
          <span class="condition-arrow">→</span>
          <span class="condition-result">成立 ✓</span>
        </div>`
      )
    } else {
      this.currentTurnLogs.push(
        `<div class="log-condition-fail">
          <span class="condition-text">${conditionText}</span>
          <span class="condition-arrow">→</span>
          <span class="condition-result">不成立 ✗</span>
        </div>`
      )
    }
    
    const effectsToProcess = conditionMet ? effect.then : (effect.else || [])
    const pathPrefix = conditionMet ? 'then' : 'else'
    
    // Process effects with proper indentation in logs
    const originalLogs = [...this.currentTurnLogs]
    for (let i = 0; i < effectsToProcess.length; i++) {
      const subEffect = effectsToProcess[i]
      const result = this.processEffect(subEffect, card, cardIndex, `${effectPath}_${pathPrefix}_${i}`)
      if (result.skipTurn) skipTurn = true
      if (result.resetCardTurn) resetCardTurn = true
    }
    
    // Add indentation to conditional effect logs
    const newLogs = this.currentTurnLogs.slice(originalLogs.length)
    for (const log of newLogs) {
      const index = this.currentTurnLogs.indexOf(log)
      if (index >= 0) {
        this.currentTurnLogs[index] = log.replace('class="log-', 'class="log-conditional-indent log-')
      }
    }
    
    return { skipTurn, resetCardTurn }
  }
  
  private formatCondition(condition: string, card: Card): string {
    const cardIndex = this.state.currentCardIndex
    // Use totalCardUses for count (total times card has been used in the game)
    const turnCount = this.state.totalCardUses[cardIndex]
    const voltage = this.state.totalVoltage
    const voltageLevel = getVoltageLevel(voltage, this.state.currentTurn, this.state.music)
    const skillLevel = this.state.cardSkillLevels[cardIndex]
    
    // Handle ternary operator
    if (condition.includes('?')) {
      const ternaryMatch = condition.match(/(.+)\?(.+):(.+)/)
      if (ternaryMatch) {
        const [, condition1, trueExpr, falseExpr] = ternaryMatch
        const conditionMet = this.evaluateSingleCondition(condition1.trim(), turnCount, skillLevel)
        const expressionToEval = conditionMet ? trueExpr.trim() : falseExpr.trim()
        
        // Format like "スキルLv.10: 使用回数(6) == 6"
        let formatted = ''
        if (condition1.includes('skillLevel')) {
          formatted = `スキルLv.${skillLevel}: `
        }
        
        if (expressionToEval.includes('count')) {
          const match = expressionToEval.match(/count\s*([<>=]+)\s*(\d+)/)
          if (match) {
            const operator = match[1] === '==' ? '=' : match[1]
            formatted += `使用回数(${turnCount}) ${operator} ${match[2]}`
          }
        }
        
        return formatted || condition
      }
    }
    
    // count条件のフォーマット
    if (condition.includes('count')) {
      const match = condition.match(/count\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        const operatorText = operator === '<=' ? '以下' : operator === '>=' ? '以上' : operator === '==' ? '回目' : operator === '<' ? '未満' : '超'
        return `カード発動${turnCount + 1}回目 (${value}回${operatorText})`
      }
    }
    
    // voltage条件のフォーマット
    if (condition.includes('voltageLevel')) {
      const match = condition.match(/voltageLevel\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        const operatorText = operator === '<=' ? '以下' : operator === '>=' ? '以上' : operator === '==' ? '' : operator === '<' ? '未満' : '超'
        return `ボルテージLv.${voltageLevel} (Lv.${value}${operatorText})`
      }
    }
    
    // mental条件のフォーマット
    if (condition.includes('mental')) {
      const match = condition.match(/mental\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        const operatorText = operator === '<=' ? '以下' : operator === '>=' ? '以上' : operator === '==' ? '' : operator === '<' ? '未満' : '超'
        return `メンタル${this.state.mental}% (${value}%${operatorText})`
      }
    }
    
    // turn条件のフォーマット
    if (condition.includes('turn')) {
      const match = condition.match(/turn\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        const operatorText = operator === '<=' ? '以下' : operator === '>=' ? '以上' : operator === '==' ? '目' : operator === '<' ? '未満' : '超'
        return `ターン${this.state.currentTurn + 1} (${value}ターン${operatorText})`
      }
    }
    
    return condition
  }
  
  private evaluateCondition(condition: string, card: Card): boolean {
    const cardIndex = this.state.currentCardIndex
    // Use totalCardUses for count (total times card has been used in the game)
    const turnCount = this.state.totalCardUses[cardIndex]
    const skillLevel = this.state.cardSkillLevels[cardIndex]
    
    // Handle ternary operator (e.g., "skillLevel >= 12 ? count == 10 : count == 6")
    if (condition.includes('?')) {
      const ternaryMatch = condition.match(/(.+)\?(.+):(.+)/)
      if (ternaryMatch) {
        const [, condition1, trueExpr, falseExpr] = ternaryMatch
        const conditionMet = this.evaluateSingleCondition(condition1.trim(), turnCount, skillLevel)
        const expressionToEval = conditionMet ? trueExpr.trim() : falseExpr.trim()
        const result = this.evaluateSingleCondition(expressionToEval, turnCount, skillLevel)
        return result
      }
    }
    
    // Special handling for fantasyGin card
    if (card.name === 'fantasyGin' && condition === 'count <= 999') {
      const deckResetCount = this.customSkillValues[cardIndex]?.['deckResetCount']
      if (deckResetCount !== undefined) {
        // Use the custom deck reset count
        return turnCount <= deckResetCount
      }
    }
    
    return this.evaluateSingleCondition(condition, turnCount, skillLevel)
  }
  
  private evaluateSingleCondition(condition: string, turnCount: number, skillLevel: number): boolean {
    // Simple condition evaluation
    if (condition.includes('count')) {
      const match = condition.match(/count\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        
        switch (operator) {
          case '<=': return turnCount <= value
          case '>=': return turnCount >= value
          case '==': return turnCount === value
          case '<': return turnCount < value
          case '>': return turnCount > value
        }
      }
    }
    
    // Skill level conditions
    if (condition.includes('skillLevel')) {
      const match = condition.match(/skillLevel\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        
        switch (operator) {
          case '<=': return skillLevel <= value
          case '>=': return skillLevel >= value
          case '==': return skillLevel === value
          case '<': return skillLevel < value
          case '>': return skillLevel > value
        }
      }
    }
    
    // Mental conditions
    if (condition.includes('mental')) {
      const match = condition.match(/mental\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        const mental = this.state.mental
        
        switch (operator) {
          case '<=': return mental <= value
          case '>=': return mental >= value
          case '==': return mental === value
          case '<': return mental < value
          case '>': return mental > value
        }
      }
    }
    
    // Voltage level conditions
    if (condition.includes('voltageLevel')) {
      const match = condition.match(/voltageLevel\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        const voltageLevel = getVoltageLevel(this.state.totalVoltage, this.state.currentTurn, this.state.music)
        
        switch (operator) {
          case '<=': return voltageLevel <= value
          case '>=': return voltageLevel >= value
          case '==': return voltageLevel === value
          case '<': return voltageLevel < value
          case '>': return voltageLevel > value
        }
      }
    }
    
    // Turn conditions
    if (condition.includes('turn')) {
      const match = condition.match(/turn\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        const turn = this.state.currentTurn + 1 // 1-indexed for conditions
        
        switch (operator) {
          case '<=': return turn <= value
          case '>=': return turn >= value
          case '==': return turn === value
          case '<': return turn < value
          case '>': return turn > value
        }
      }
    }
    
    return false
  }
  
  private evaluateRemoveCondition(effect: any, card: Card, cardIndex: number): boolean {
    // For cards with conditions
    if (effect.condition) {
      return this.evaluateCondition(effect.condition, card)
    }
    
    // If no condition, always remove
    return true
  }
  
  // Add v1-style getAP method
  private getAP(value: number): void {
    this.state.apAcquired += value
    
    // Format AP display like v1
    const formatAP = (value: number): string => {
      const int = Math.floor(value)
      const decimal = value - int
      if (decimal === 0) return int.toString()
      const rounded = Math.round(value * 100) / 100
      return rounded.toString()
    }
    
    this.currentTurnLogs.push(
      `<div class="log-action log-boost-action"><div class="log-ap-gain">💎 AP獲得</div><div class="ap-gain-values">+${formatAP(value)} → ${formatAP(this.state.apAcquired)}</div></div>`
    )
  }
  
  // Add v1-style getScore method
  private getScore(value: number): void {
    const appeal = calculateAppealValue({
      cards: this.state.cards,
      musicAttribute: this.state.musicAttribute as any,
      centerCard: this.getCenterCard(),
      centerCharacteristic: this.getCenterCard()?.centerCharacteristic
    })
    
    const voltageLevel = getVoltageLevel(
      this.state.totalVoltage,
      this.state.currentTurn,
      this.state.music
    )
    
    const score = Math.floor(
      appeal * value * 
      (1 + this.state.scoreBoost[this.state.scoreBoostCount]) * 
      (1 + voltageLevel / 10) * 
      this.state.learningCorrection
    )
    
    this.state.totalScore += score
    this.currentTurnScoreGain += score
    this.state.scoreBoostCount = Math.min(this.state.scoreBoostCount + 1, 99)
    
    // Add detailed log
    const totalScoreBoostPercent = ((1 + this.state.scoreBoost[this.state.scoreBoostCount - 1]) * 100).toFixed(2)
    const totalVoltageLevelPercent = ((1 + voltageLevel / 10) * 100).toFixed(2)
    
    this.currentTurnLogs.push(
      `<div class="log-action log-boost-action"><div class="log-score-gain">スコア獲得</div><div class="score-gain-values">+${score.toLocaleString()} → ${this.state.totalScore.toLocaleString()}</div></div>`
    )
    
    // Build calculation display
    let calcHtml = '<div class="log-calculation">'
    calcHtml += `<span class="calc-value calc-base">${value.toFixed(2)}<span class="calc-label">倍率</span></span>`
    calcHtml += '<span class="calc-operator">×</span>'
    calcHtml += `<span class="calc-value calc-appeal">${appeal.toLocaleString()}<span class="calc-label">アピール</span></span>`
    calcHtml += '<span class="calc-operator">×</span>'
    calcHtml += `<span class="calc-value calc-score-boost">${totalScoreBoostPercent}%<span class="calc-label">ブースト</span></span>`
    calcHtml += '<span class="calc-operator">×</span>'
    calcHtml += `<span class="calc-value calc-voltage-level">${totalVoltageLevelPercent}%<span class="calc-label">Lv${voltageLevel}</span></span>`
    calcHtml += '<span class="calc-operator">×</span>'
    calcHtml += `<span class="calc-value calc-fever">${this.state.learningCorrection}<span class="calc-label">ラーニング</span></span>`
    calcHtml += '</div>'
    
    this.currentTurnLogs.push(calcHtml)
  }
  
  // Add v1-style getVoltage method
  private getVoltage(value: number): void {
    const voltagePt = Math.floor(value * (1 + this.state.voltageBoost[this.state.voltageBoostCount]))
    const oldLevel = getVoltageLevel(this.state.totalVoltage, this.state.currentTurn, this.state.music)
    this.state.totalVoltage += voltagePt
    this.currentTurnVoltageGain += voltagePt
    const newLevel = getVoltageLevel(this.state.totalVoltage, this.state.currentTurn, this.state.music)
    this.state.voltageBoostCount = Math.min(this.state.voltageBoostCount + 1, 99)
    
    // Add detailed log
    this.currentTurnLogs.push(
      `<div class="log-action"><span class="log-voltage-gain">ボルテージ獲得: +${voltagePt} → ${this.state.totalVoltage}</span></div>`
    )
    
    // Build voltage calculation display
    let calcHtml = '<div class="log-calculation">'
    calcHtml += `<span class="calc-value calc-base">${value}<span class="calc-label">基本値</span></span>`
    calcHtml += '<span class="calc-operator">×</span>'
    calcHtml += `<span class="calc-value calc-voltage-boost">${((1 + this.state.voltageBoost[this.state.voltageBoostCount - 1]) * 100).toFixed(2)}%<span class="calc-label">ブースト</span></span>`
    calcHtml += '</div>'
    
    this.currentTurnLogs.push(calcHtml)
    
    if (oldLevel !== newLevel) {
      this.currentTurnLogs.push(
        `<div class="log-action" style="color: #e74c3c; font-weight: bold;">　→ ボルテージレベル ${oldLevel} → ${newLevel}</div>`
      )
    }
  }
  
  private calculateTurnResult(card: Card): TurnResult {
    const cardIndex = this.state.currentCardIndex
    const skillLevel = this.state.cardSkillLevels[cardIndex]
    const skillMultiplier = SKILL_LEVEL_MULTIPLIERS[skillLevel - 1] || 1
    
    // Calculate appeal
    const centerCard = this.getCenterCard()
    const appeal = calculateAppealValue({
      cards: this.state.cards,
      musicAttribute: this.state.musicAttribute as any,
      centerCard,
      centerCharacteristic: centerCard?.centerCharacteristic
    })
    
    const voltageLevel = getVoltageLevel(
      this.state.totalVoltage,
      this.state.currentTurn,
      this.state.music
    )
    
    // Use the accumulated gains from this turn
    const scoreGain = this.currentTurnScoreGain
    const voltageGain = this.currentTurnVoltageGain
    
    return {
      turn: this.state.currentTurn,
      cardIndex: this.state.currentCardIndex,
      cardName: card.name,
      cardCharacter: card.character,
      appeal,
      scoreGain,
      voltageGain,
      voltageLevel,
      apUsed: card.apCost,
      isSkipped: false,
      multipliers: {
        base: 0, // Will be filled based on actual effects
        skill: skillMultiplier,
        skillBoost: this.state.skillInvocationBoost,
        voltage: voltageLevel / 10,
        fever: this.state.currentPhase?.name === 'duringFever' ? 2 : 1,
        center: this.state.centerSkillMultiplier,
        total: 0 // Will be filled based on actual calculation
      },
      logs: [...this.currentTurnLogs]
    }
  }
  
  private getCenterCard(): Card | null {
    if (!this.state.centerCharacter || !this.state.music) return null
    
    return this.state.cards.find(
      card => card && card.character === this.state.music?.centerCharacter
    ) || null
  }
  
  private getPhaseStr(): string {
    if (!this.state.currentPhase) return ''
    
    switch (this.state.currentPhase.name) {
      case 'beforeFever':
        return '<span style="color: #666;">フィーバー前</span>'
      case 'duringFever':
        return '<span style="color: #e74c3c;">フィーバー中</span>'
      case 'afterFever':
        return '<span style="color: #666;">フィーバー後</span>'
      default:
        return ''
    }
  }
  
  private applyCenterSkillsAtTiming(timing: string): void {
    const centerCard = this.getCenterCard()
    if (!centerCard) return
    
    // Find the center card index
    const centerIndex = this.state.cards.findIndex(card => card === centerCard)
    if (centerIndex === -1) return
    
    // Process center skill effects
    if (centerCard.centerSkill && centerCard.centerSkill.when === timing) {
      const centerSkillLevel = this.centerSkillLevels[centerIndex]
      const skillMultiplier = SKILL_LEVEL_MULTIPLIERS[centerSkillLevel - 1] || 1
      
      for (let i = 0; i < centerCard.centerSkill.effects.length; i++) {
        const effect = centerCard.centerSkill.effects[i]
        this.processCenterSkillEffect(effect, centerIndex, skillMultiplier, `center_effect_${i}`)
      }
    }
    
    // Process center characteristic effects (keep for compatibility)
    if (centerCard.centerCharacteristic) {
      for (let i = 0; i < centerCard.centerCharacteristic.effects.length; i++) {
        const effect = centerCard.centerCharacteristic.effects[i]
        if (effect.type === 'centerSkill' && effect.timing === timing) {
          for (let j = 0; j < effect.effects.length; j++) {
            const subEffect = effect.effects[j]
            this.processEffect(subEffect, centerCard, centerIndex, `center_${timing}_${i}_${j}`)
          }
        }
      }
    }
  }
  
  private processCenterSkillEffect(effect: Effect, centerIndex: number, skillMultiplier: number, effectPath: string): void {
    // Check for custom center skill value
    const customValue = this.customCenterSkillValues[centerIndex]?.[effectPath]
    
    switch (effect.type) {
      case 'apGain':
        // AP gain with level values support
        let apValue: number
        const apEffect = effect as any
        if (customValue !== undefined) {
          apValue = customValue
        } else if (apEffect.levelValues && apEffect.levelValues[this.centerSkillLevels[centerIndex] - 1] !== undefined) {
          apValue = apEffect.levelValues[this.centerSkillLevels[centerIndex] - 1]
        } else {
          apValue = apEffect.value * skillMultiplier
        }
        this.getAP(apValue)
        break
        
      case 'scoreGain':
        const scoreValue = customValue !== undefined ? customValue : (effect.value * skillMultiplier)
        // Center skill score gain uses getScore method like regular cards
        this.getScore(scoreValue)
        break
        
      case 'scoreBoost':
        const boostValue = customValue !== undefined ? customValue : (effect.value * skillMultiplier)
        this.state.scoreBoost[this.state.scoreBoostCount] += boostValue
        break
        
      case 'voltageGain':
        const voltageValue = customValue !== undefined ? customValue : Math.floor(effect.value * skillMultiplier)
        // Apply voltage boost when gaining voltage
        const voltageWithBoost = Math.floor(voltageValue * (1 + this.state.voltageBoost[this.state.voltageBoostCount]))
        this.state.totalVoltage += voltageWithBoost
        // Increment voltage boost counter after use
        this.state.voltageBoostCount = Math.min(this.state.voltageBoostCount + 1, 99)
        break
        
      case 'voltageBoost':
        const voltageBoostValue = customValue !== undefined ? customValue : (effect.value * skillMultiplier)
        this.state.voltageBoost[this.state.voltageBoostCount] += voltageBoostValue
        break
        
      case 'mentalReduction':
        // Mental reduction is a fixed percentage, not affected by skill level
        // Handled in game initialization
        break
        
      case 'conditional':
        const conditionalEffect = effect as ConditionalEffect
        const conditionMet = this.evaluateCenterSkillCondition(conditionalEffect.condition)
        const effectsToProcess = conditionMet ? conditionalEffect.then : (conditionalEffect.else || [])
        const pathPrefix = conditionMet ? 'then' : 'else'
        
        for (let i = 0; i < effectsToProcess.length; i++) {
          this.processCenterSkillEffect(effectsToProcess[i], centerIndex, skillMultiplier, `${effectPath}_${pathPrefix}_${i}`)
        }
        break
        
      case 'voltagePenalty':
        this.state.totalVoltage = Math.max(0, this.state.totalVoltage - effect.value)
        break
        
      case 'appealBoost':
        // This is handled during appeal calculation, not here
        break
    }
  }
  
  private evaluateCenterSkillCondition(condition: string): boolean {
    // Evaluate condition based on current game state
    if (condition.includes('turn')) {
      const match = condition.match(/turn\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        const turn = this.state.currentTurn
        
        switch (operator) {
          case '<=': return turn <= value
          case '>=': return turn >= value
          case '==': return turn === value
          case '<': return turn < value
          case '>': return turn > value
        }
      }
    }
    
    if (condition.includes('mental')) {
      const match = condition.match(/mental\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        // Mental is stored as percentage in options
        const mental = this.state.music?.phases ? 100 : 100 // Default to 100 if not set
        
        switch (operator) {
          case '<=': return mental <= value
          case '>=': return mental >= value
          case '==': return mental === value
          case '<': return mental < value
          case '>': return mental > value
        }
      }
    }
    
    if (condition.includes('voltageLevel')) {
      const match = condition.match(/voltageLevel\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        const voltageLevel = getVoltageLevel(this.state.totalVoltage, this.state.currentTurn, this.state.music)
        
        switch (operator) {
          case '<=': return voltageLevel <= value
          case '>=': return voltageLevel >= value
          case '==': return voltageLevel === value
          case '<': return voltageLevel < value
          case '>': return voltageLevel > value
        }
      }
    }
    
    return false
  }
  
  /**
   * Get the final simulation results
   */
  getResults(): GameState {
    return this.state
  }
}