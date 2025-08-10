import {
  Card,
  GameState,
  GamePhase,
  TurnResult,
  SimulationOptions,
  Effect,
  ConditionalEffect,
  APShortageResult,
  RemoveAfterUseEffect,
  ApGainEffect,
  MentalReductionEffect,
  MentalRecoverEffect,
} from '../models'
import { roundSkillValue } from '../../utils/skillValueRounding'
import { calculateAppealValue, getVoltageLevel, SKILL_LEVEL_MULTIPLIERS } from '../calculations'

export class GameSimulator {
  private state: GameState
  private customSkillValues: Record<string, Record<string, number>>
  private customCenterSkillValues: Record<string, Record<string, number>>
  private centerSkillLevels: number[]
  private centerActivations: boolean[]
  private currentTurnScoreGain: number = 0
  private currentTurnVoltageGain: number = 0
  private currentTurnLogs: string[] = []
  // Store turn start values for condition evaluation
  private turnStartVoltageLevel: number = 0
  private turnStartMental: number = 100

  // Cache for appeal value
  private cachedAppealValue: number | null = null

  constructor(options: SimulationOptions) {
    this.customSkillValues = options.customSkillValues || {}
    this.customCenterSkillValues = options.customCenterSkillValues || {}
    this.centerSkillLevels = options.centerSkillLevels || Array(6).fill(10)
    this.centerActivations = options.centerActivations || Array(6).fill(true)
    this.state = this.initializeState(options)
  }

  private initializeState(options: SimulationOptions): GameState {
    const { cards = [], cardSkillLevels, music, musicAttribute, centerCharacter } = options

    // Calculate phases
    const phases: GamePhase[] = []
    if (music.phases.length >= 3) {
      const [beforeFever, duringFever, afterFever] = music.phases

      phases.push({
        name: 'beforeFever',
        startTurn: 0,
        endTurn: beforeFever - 1,
      })

      phases.push({
        name: 'duringFever',
        startTurn: beforeFever,
        endTurn: beforeFever + duringFever - 1,
      })

      phases.push({
        name: 'afterFever',
        startTurn: beforeFever + duringFever,
        endTurn: beforeFever + duringFever + afterFever - 1,
      })
    }

    // Find first valid card index
    let initialCardIndex = 0
    if (cards && cards.length > 0) {
      for (let i = 0; i < cards.length; i++) {
        if (cards[i] !== null) {
          initialCardIndex = i
          break
        }
      }
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
      currentCardIndex: initialCardIndex,
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
      baseAP: options.baseAP || 0,
      apAcquired: 0,
      apConsumed: 0,

      // Card management
      removedCards: new Set<string>(),

      // Turn tracking
      turnResults: [],
      cardTurnCounts: new Array(6).fill(0),
      totalCardUses: new Array(6).fill(0),
      cardActivationLog: [],

      // Phase info
      phases,
      currentPhase: phases[0] || null,
    }
  }

  /**
   * Run the full simulation
   */
  simulate(): GameState {
    const totalTurns = this.getTotalTurns()

    // Check if we have any valid cards
    const hasValidCards = this.state.cards.some((card) => card !== null)
    if (!hasValidCards) {
      // Return empty state if no cards
      return this.state
    }

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
    this.state.currentPhase =
      this.state.phases.find((phase) => turn >= phase.startTurn && turn <= phase.endTurn) || null
  }

  private isFirstTurnOfPhase(phaseName: string): boolean {
    const phase = this.state.phases.find((p) => p.name === phaseName)
    return phase ? this.state.currentTurn === phase.startTurn : false
  }

  private processTurn(): void {
    const card = this.getCurrentCard()

    if (!card) {
      this.skipTurn()
      return
    }

    // Store turn start values for condition evaluation (v1 behavior)
    this.turnStartVoltageLevel = getVoltageLevel(
      this.state.totalVoltage,
      this.state.currentTurn,
      this.state.music,
    )
    this.turnStartMental = this.state.mental

    // Reset turn gains and logs
    this.currentTurnScoreGain = 0
    this.currentTurnVoltageGain = 0
    this.currentTurnLogs = []

    // Calculate effective AP cost with center characteristic reduction
    const effectiveAPCost = this.getEffectiveAPCost(card)

    // Add turn header log with card name (v1 style)
    const phase = this.getPhaseStr()
    // Show only consumed AP in the log (not the balance)
    const apBefore = this.state.apConsumed
    const apAfter = this.state.apConsumed + effectiveAPCost
    let apDisplayHtml = ''
    if (effectiveAPCost > 0) {
      // Show consumed AP like v1 (positive values, red color from CSS)
      apDisplayHtml = `<span class="log-ap-inline">${apBefore} → ${apAfter}</span>`
    }
    this.currentTurnLogs.push(
      `<div class="log-turn-header">
        <span class="turn-number">${this.state.currentTurn + 1}</span>
        ${phase}
        <span class="log-card-name">${card.displayName || card.name}</span>
        ${apDisplayHtml}
      </div>`,
    )

    // We'll update this log entry after processing effects
    const activationLogIndex = this.state.cardActivationLog.length

    this.state.cardActivationLog.push({
      turn: this.state.currentTurn,
      cardName: card.displayName || card.name,
      cardIndex: this.state.currentCardIndex,
      apCost: effectiveAPCost,
      isCenterSkill: false,
      scoreBefore: this.state.totalScore,
      scoreBoostBefore: [...this.state.scoreBoost],
      scoreBoostCountBefore: this.state.scoreBoostCount,
      voltagePtBefore: this.state.totalVoltage,
      scoreGain: 0, // Will be updated after processing
      scoreBoostAfter: [], // Will be updated after processing
      scoreBoostCountAfter: 0, // Will be updated after processing
      voltagePtAfter: 0, // Will be updated after processing
    })

    // Increment card usage count BEFORE processing effects (v1 compatibility)
    this.state.cardTurnCounts[this.state.currentCardIndex]++
    this.state.totalCardUses[this.state.currentCardIndex]++

    // Process card effects
    let skipTurn = false
    let resetCardRequested = false
    const removeAfterUseEffects: Array<{ effect: Effect; index: number }> = []

    // Process all effects except removeAfterUse first
    for (let i = 0; i < card.effects.length; i++) {
      const effect = card.effects[i]
      if (effect.type === 'removeAfterUse') {
        // Save removeAfterUse for later processing
        removeAfterUseEffects.push({ effect, index: i })
      } else {
        const result = this.processEffect(effect, card, this.state.currentCardIndex, `effect_${i}`)
        if (result.skipTurn) skipTurn = true
        if (result.resetCardTurn) resetCardRequested = true
      }
    }

    // Process removeAfterUse effects last
    for (const { effect, index } of removeAfterUseEffects) {
      const result = this.processEffect(
        effect,
        card,
        this.state.currentCardIndex,
        `effect_${index}`,
      )
      if (result.skipTurn) skipTurn = true
    }

    if (skipTurn) {
      this.skipTurn()
      return
    }

    // Calculate turn results
    const turnResult = this.calculateTurnResult(card, effectiveAPCost)
    this.state.turnResults.push(turnResult)

    // Update the activation log with the actual score gain
    if (activationLogIndex < this.state.cardActivationLog.length) {
      this.state.cardActivationLog[activationLogIndex].scoreGain = turnResult.scoreGain
      this.state.cardActivationLog[activationLogIndex].scoreBoostAfter = [...this.state.scoreBoost]
      this.state.cardActivationLog[activationLogIndex].scoreBoostCountAfter =
        this.state.scoreBoostCount
      this.state.cardActivationLog[activationLogIndex].voltagePtAfter = this.state.totalVoltage
    }

    // Don't update score/voltage here since it's already done in getScore/getVoltage

    // Update AP consumption
    this.state.apConsumed += effectiveAPCost

    // Move to next card (resetCardRequested only affects card rotation, not usage counts)
    this.moveToNextCard(resetCardRequested)
  }

  private getCurrentCard(): Card | null {
    // Ensure currentCardIndex is valid
    if (this.state.currentCardIndex < 0 || this.state.currentCardIndex >= this.state.cards.length) {
      return null
    }

    const card = this.state.cards[this.state.currentCardIndex]
    // Check if card exists and is not removed
    if (!card || this.state.removedCards.has(card.name)) {
      return null
    }
    return card
  }

  private getEffectiveAPCost(card: Card): number {
    let apCost = card.apCost

    // Apply AP reduction from center characteristics (複数のセンターカードに対応)
    const centerCards = this.getCenterCards()
    for (const centerCard of centerCards) {
      const centerIndex = this.state.cards.findIndex((card) => card === centerCard)
      if (centerIndex === -1 || !this.centerActivations[centerIndex]) continue

      if (centerCard?.centerCharacteristic?.effects) {
        for (const effect of centerCard.centerCharacteristic.effects) {
          if (effect.type === 'apReduce') {
            const reduction = effect.value
            apCost = Math.max(0, apCost - reduction)
          }
        }
      }
    }

    return apCost
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
    // Get current card safely
    const card =
      this.state.currentCardIndex >= 0 && this.state.currentCardIndex < this.state.cards.length
        ? this.state.cards[this.state.currentCardIndex]
        : null

    this.state.turnResults.push({
      turn: this.state.currentTurn,
      cardIndex: this.state.currentCardIndex,
      cardName: card?.name || 'Unknown',
      cardCharacter: card?.character || 'Unknown',
      appeal: 0,
      scoreGain: 0,
      voltageGain: 0,
      voltageLevel: getVoltageLevel(
        this.state.totalVoltage,
        this.state.currentTurn,
        this.state.music,
      ),
      apUsed: 0,
      isSkipped: true,
      multipliers: {
        base: 0,
        skill: 0,
        skillBoost: 0,
        voltage: 0,
        fever: 0,
        center: 0,
        total: 0,
      },
    })

    this.moveToNextCard()
  }

  private processEffect(
    effect: Effect,
    card: Card,
    cardIndex: number,
    effectPath: string,
  ): { skipTurn: boolean; resetCardTurn: boolean } {
    let skipTurn = false
    let resetCardTurn = false

    // Check for custom skill value
    const customValue = this.customSkillValues[cardIndex]?.[effectPath]
    const skillLevel = this.state.cardSkillLevels[cardIndex]
    const skillMultiplier = SKILL_LEVEL_MULTIPLIERS[skillLevel - 1] || 1

    switch (effect.type) {
      case 'conditional': {
        const conditionalResult = this.processConditionalEffect(
          effect as ConditionalEffect,
          card,
          cardIndex,
          effectPath,
        )
        skipTurn = conditionalResult.skipTurn
        resetCardTurn = conditionalResult.resetCardTurn
        break
      }

      case 'scoreGain': {
        // Calculate score immediately like v1
        let scoreGainValue: number
        if (customValue !== undefined) {
          scoreGainValue = customValue
        } else {
          // Apply skill level formula when no custom value exists
          // v1 formula: (lv10Value / 2) * multiplier
          scoreGainValue = roundSkillValue((effect.value / 2) * skillMultiplier, true)
        }
        // Note: skill multiplier is applied in getScore method, not here
        this.getScore(scoreGainValue)
        break
      }

      case 'voltageGain': {
        // Calculate voltage immediately like v1
        let voltageGainValue: number
        if (customValue !== undefined) {
          voltageGainValue = customValue
        } else {
          // Apply skill level formula when no custom value exists
          // v1 formula: (lv10Value / 2) * multiplier
          voltageGainValue = roundSkillValue((effect.value / 2) * skillMultiplier, false)
        }
        // No skill multiplier applied to voltage gain
        this.getVoltage(voltageGainValue)
        break
      }

      case 'scoreBoost': {
        let scoreBoostValue: number
        if (customValue !== undefined) {
          scoreBoostValue = customValue
        } else {
          // Apply skill level formula when no custom value exists
          // v1 formula: (lv10Value / 2) * multiplier
          scoreBoostValue = roundSkillValue((effect.value / 2) * skillMultiplier, true)
        }
        // No skill multiplier applied to boost values in v1
        this.state.scoreBoost[this.state.scoreBoostCount] += scoreBoostValue
        const percent = (scoreBoostValue * 100).toFixed(2)
        const total = (this.state.scoreBoost[this.state.scoreBoostCount] * 100).toFixed(2)
        this.currentTurnLogs.push(
          `<div class="log-action log-boost-action"><div class="log-score-boost">スコアブースト</div><div class="boost-values">+${percent}% → ${total}%</div></div>`,
        )
        break
      }

      case 'voltageBoost': {
        let voltageBoostValue: number
        if (customValue !== undefined) {
          voltageBoostValue = customValue
        } else {
          // Apply skill level formula when no custom value exists
          // v1 formula: (lv10Value / 2) * multiplier
          voltageBoostValue = roundSkillValue((effect.value / 2) * skillMultiplier, true)
        }
        // No skill multiplier applied to boost values in v1
        this.state.voltageBoost[this.state.voltageBoostCount] += voltageBoostValue
        const vPercent = (voltageBoostValue * 100).toFixed(2)
        const vTotal = (this.state.voltageBoost[this.state.voltageBoostCount] * 100).toFixed(2)
        this.currentTurnLogs.push(
          `<div class="log-action log-boost-action"><div class="log-voltage-boost">ボルテージブースト</div><div class="boost-values">+${vPercent}% → ${vTotal}%</div></div>`,
        )
        break
      }

      case 'skillInvocationBoost': {
        let skillInvocationValue: number
        if (customValue !== undefined) {
          skillInvocationValue = customValue
        } else {
          // Apply skill level formula when no custom value exists
          skillInvocationValue = roundSkillValue((effect.value / 2) * skillMultiplier, true)
        }
        // No skill multiplier applied to boost values in v1
        this.state.skillInvocationBoost += skillInvocationValue
        break
      }

      case 'skipTurn':
        skipTurn = true
        break

      case 'resetCardTurn':
        resetCardTurn = true
        this.currentTurnLogs.push(
          `<div class="log-action" style="color: #3498db;">カード順リセット</div>`,
        )
        break

      case 'apGain': {
        // AP gain is handled differently - use effect value or level values
        let apValue: number
        const apEffect = effect as ApGainEffect
        if (customValue !== undefined) {
          apValue = customValue
        } else if (apEffect.levelValues && apEffect.levelValues[skillLevel - 1] !== undefined) {
          // When levelValues are provided, use them directly without applying skill multiplier
          apValue = apEffect.levelValues[skillLevel - 1]
        } else {
          // Apply skill level formula when no levelValues exist
          // v1 formula: (lv10Value / 2) * multiplier
          apValue = roundSkillValue((apEffect.value / 2) * skillMultiplier, false)
        }
        this.getAP(apValue)
        break
      }

      case 'mentalReduction': {
        const mentalEffect = effect as MentalReductionEffect
        let reductionValue: number
        if (mentalEffect.levelValues && mentalEffect.levelValues[skillLevel - 1] !== undefined) {
          reductionValue = mentalEffect.levelValues[skillLevel - 1]
        } else {
          reductionValue = effect.value
        }
        this.state.mental = Math.max(0, this.state.mental - reductionValue)
        this.currentTurnLogs.push(
          `<div class="log-action"><span style="color: #e74c3c;">メンタル減少: -${reductionValue} → ${this.state.mental}%</span></div>`,
        )
        break
      }

      case 'mentalRecover': {
        const mentalRecoverEffect = effect as MentalRecoverEffect
        let mentalRecoverValue: number
        if (customValue !== undefined) {
          mentalRecoverValue = customValue
        } else if (
          mentalRecoverEffect.levelValues &&
          mentalRecoverEffect.levelValues[skillLevel - 1] !== undefined
        ) {
          mentalRecoverValue = mentalRecoverEffect.levelValues[skillLevel - 1]
        } else {
          mentalRecoverValue = effect.value
        }
        // No skill multiplier applied to mental recover in v1
        this.state.mental += mentalRecoverValue
        this.currentTurnLogs.push(
          `<div class="log-action log-mental">メンタル回復: +${mentalRecoverValue} → ${this.state.mental}%</div>`,
        )
        break
      }

      case 'voltagePenalty': {
        const voltagePenaltyValue = customValue !== undefined ? customValue : effect.value
        // No skill multiplier applied to voltage penalty in v1
        this.state.totalVoltage = Math.max(0, this.state.totalVoltage - voltagePenaltyValue)
        this.currentTurnLogs.push(
          `<div class="log-action" style="color: #e74c3c;">ボルテージペナルティ: -${voltagePenaltyValue}</div>`,
        )
        break
      }

      case 'removeAfterUse': {
        // Evaluate condition for removal
        const shouldRemove = this.evaluateRemoveCondition(effect, card, cardIndex)
        if (shouldRemove) {
          this.state.removedCards.add(card.name)
          this.currentTurnLogs.push(
            `<div class="log-condition-skip">
              <span class="condition-result">デッキから除外 🚫</span>
            </div>`,
          )
        }
        break
      }

      case 'visualOnly': {
        // Visual only effect - just show in log but don't process
        if (effect.description) {
          this.currentTurnLogs.push(
            `<div class="log-action" style="color: #9e9e9e; font-style: italic;">${effect.description}</div>`,
          )
        }
        break
      }
    }

    return { skipTurn, resetCardTurn }
  }

  private processConditionalEffect(
    effect: ConditionalEffect,
    card: Card,
    cardIndex: number,
    effectPath: string,
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
        </div>`,
      )
    } else {
      this.currentTurnLogs.push(
        `<div class="log-condition-fail">
          <span class="condition-text">${conditionText}</span>
          <span class="condition-arrow">→</span>
          <span class="condition-result">不成立 ✗</span>
        </div>`,
      )
    }

    const effectsToProcess = conditionMet ? effect.then : effect.else || []
    const pathPrefix = conditionMet ? 'then' : 'else'

    // Process effects with v1-style conditional effects wrapper
    if (effectsToProcess.length > 0) {
      this.currentTurnLogs.push(`<div class="conditional-effects">`)

      for (let i = 0; i < effectsToProcess.length; i++) {
        const subEffect = effectsToProcess[i]
        const result = this.processEffect(
          subEffect,
          card,
          cardIndex,
          `${effectPath}_${pathPrefix}_${i}`,
        )
        if (result.skipTurn) skipTurn = true
        if (result.resetCardTurn) resetCardTurn = true
      }

      this.currentTurnLogs.push(`</div>`)
    }

    return { skipTurn, resetCardTurn }
  }

  private formatCondition(condition: string, _card: Card): string {
    const cardIndex = this.state.currentCardIndex
    // Use totalCardUses for count (total times card has been used in the game)
    const turnCount = this.state.totalCardUses[cardIndex]
    // Use turn start values for display (v1 behavior)
    const voltageLevel = this.turnStartVoltageLevel
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
        const operatorText =
          operator === '<='
            ? '以下'
            : operator === '>='
              ? '以上'
              : operator === '=='
                ? '回目'
                : operator === '<'
                  ? '未満'
                  : '超'
        return `カード発動${turnCount + 1}回目 (${value}回${operatorText})`
      }
    }

    // voltage条件のフォーマット
    if (condition.includes('voltageLevel')) {
      const match = condition.match(/voltageLevel\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        const operatorText =
          operator === '<='
            ? '以下'
            : operator === '>='
              ? '以上'
              : operator === '=='
                ? ''
                : operator === '<'
                  ? '未満'
                  : '超'
        return `ボルテージLv.${voltageLevel} (Lv.${value}${operatorText})`
      }
    }

    // mental条件のフォーマット
    if (condition.includes('mental')) {
      const match = condition.match(/mental\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        const operatorText =
          operator === '<='
            ? '以下'
            : operator === '>='
              ? '以上'
              : operator === '=='
                ? ''
                : operator === '<'
                  ? '未満'
                  : '超'
        return `メンタル${this.state.mental}% (${value}%${operatorText})`
      }
    }

    // turn条件のフォーマット
    if (condition.includes('turn')) {
      const match = condition.match(/turn\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        const operatorText =
          operator === '<='
            ? '以下'
            : operator === '>='
              ? '以上'
              : operator === '=='
                ? '目'
                : operator === '<'
                  ? '未満'
                  : '超'
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

  private evaluateSingleCondition(
    condition: string,
    turnCount: number,
    skillLevel: number,
  ): boolean {
    // Simple condition evaluation
    if (condition.includes('count')) {
      const match = condition.match(/count\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])

        switch (operator) {
          case '<=':
            return turnCount <= value
          case '>=':
            return turnCount >= value
          case '==':
            return turnCount === value
          case '<':
            return turnCount < value
          case '>':
            return turnCount > value
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
          case '<=':
            return skillLevel <= value
          case '>=':
            return skillLevel >= value
          case '==':
            return skillLevel === value
          case '<':
            return skillLevel < value
          case '>':
            return skillLevel > value
        }
      }
    }

    // Mental conditions
    if (condition.includes('mental')) {
      const match = condition.match(/mental\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        // Use turn start mental value for condition evaluation (v1 behavior)
        const mental = this.turnStartMental

        switch (operator) {
          case '<=':
            return mental <= value
          case '>=':
            return mental >= value
          case '==':
            return mental === value
          case '<':
            return mental < value
          case '>':
            return mental > value
        }
      }
    }

    // Voltage level conditions
    if (condition.includes('voltageLevel')) {
      const match = condition.match(/voltageLevel\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        // Use turn start voltage level for condition evaluation (v1 behavior)
        const voltageLevel = this.turnStartVoltageLevel

        switch (operator) {
          case '<=':
            return voltageLevel <= value
          case '>=':
            return voltageLevel >= value
          case '==':
            return voltageLevel === value
          case '<':
            return voltageLevel < value
          case '>':
            return voltageLevel > value
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
          case '<=':
            return turn <= value
          case '>=':
            return turn >= value
          case '==':
            return turn === value
          case '<':
            return turn < value
          case '>':
            return turn > value
        }
      }
    }

    return false
  }

  private evaluateRemoveCondition(
    effect: RemoveAfterUseEffect,
    card: Card,
    _cardIndex: number,
  ): boolean {
    // For cards with conditions
    if (effect.condition) {
      return this.evaluateCondition(effect.condition, card)
    }

    // If no condition, always remove
    return true
  }

  // Add v1-style getAP method
  private getAP(value: number): void {
    // Apply 1.5x multiplier to AP gains (v1 behavior)
    const actualValue = value * 1.5
    this.state.apAcquired += actualValue

    // Format AP display like v1
    const formatAP = (value: number): string => {
      const int = Math.floor(value)
      const decimal = value - int
      if (decimal === 0) return int.toString()
      const rounded = Math.round(value * 100) / 100
      return rounded.toString()
    }

    this.currentTurnLogs.push(
      `<div class="log-action log-boost-action"><div class="log-ap-gain">💎 AP獲得</div><div class="ap-gain-values">+${formatAP(actualValue)} → ${formatAP(this.state.apAcquired)}</div></div>`,
    )
  }

  // Get appeal value with caching
  private getAppealValue(): number {
    if (this.cachedAppealValue !== null) {
      return this.cachedAppealValue
    }

    const centerCards = this.getCenterCards()
    const activeCenterCharacteristics = centerCards
      .map((card) => {
        const centerIndex = this.state.cards.findIndex((c) => c === card)
        if (centerIndex === -1 || !this.centerActivations[centerIndex]) {
          return null
        }
        return card.centerCharacteristic
      })
      .filter((c) => c !== null && c !== undefined)

    this.cachedAppealValue = calculateAppealValue({
      cards: this.state.cards,
      musicAttribute: this.state.musicAttribute as 'smile' | 'pure' | 'cool' | undefined,
      centerCard: this.getCenterCard(),
      // Use only centerCharacteristics to avoid double application
      centerCharacteristics: activeCenterCharacteristics,
    })

    return this.cachedAppealValue
  }

  // Add v1-style getScore method
  private getScore(value: number): void {
    const appeal = this.getAppealValue()

    const voltageLevel = getVoltageLevel(
      this.state.totalVoltage,
      this.state.currentTurn,
      this.state.music,
    )

    const score = Math.floor(
      appeal *
        value *
        (1 + this.state.scoreBoost[this.state.scoreBoostCount]) *
        (1 + voltageLevel / 10) *
        this.state.learningCorrection,
    )

    this.state.totalScore += score
    this.currentTurnScoreGain += score
    this.state.scoreBoostCount = Math.min(this.state.scoreBoostCount + 1, 99)

    // Add detailed log
    const totalScoreBoostPercent = (
      (1 + this.state.scoreBoost[this.state.scoreBoostCount - 1]) *
      100
    ).toFixed(2)
    const totalVoltageLevelPercent = ((1 + voltageLevel / 10) * 100).toFixed(2)

    this.currentTurnLogs.push(
      `<div class="log-action log-boost-action"><div class="log-score-gain">スコア獲得</div><div class="score-gain-values">+${score.toLocaleString()} → ${this.state.totalScore.toLocaleString()}</div></div>`,
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
    const voltagePt = Math.floor(
      value * (1 + this.state.voltageBoost[this.state.voltageBoostCount]),
    )
    const oldLevel = getVoltageLevel(
      this.state.totalVoltage,
      this.state.currentTurn,
      this.state.music,
    )
    this.state.totalVoltage += voltagePt
    this.currentTurnVoltageGain += voltagePt
    const newLevel = getVoltageLevel(
      this.state.totalVoltage,
      this.state.currentTurn,
      this.state.music,
    )
    this.state.voltageBoostCount = Math.min(this.state.voltageBoostCount + 1, 99)

    // Add detailed log
    this.currentTurnLogs.push(
      `<div class="log-action"><span class="log-voltage-gain">ボルテージ獲得: +${voltagePt} → ${this.state.totalVoltage}</span></div>`,
    )

    // Build voltage calculation display
    let calcHtml = '<div class="log-calculation">'
    calcHtml += `<span class="calc-value calc-base">${value}<span class="calc-label">基本値</span></span>`
    calcHtml += '<span class="calc-operator">&times;</span>'
    calcHtml += `<span class="calc-value calc-voltage-boost">${((1 + this.state.voltageBoost[this.state.voltageBoostCount - 1]) * 100).toFixed(2)}%<span class="calc-label">ブースト</span></span>`
    calcHtml += '</div>'

    this.currentTurnLogs.push(calcHtml)

    if (oldLevel !== newLevel) {
      this.currentTurnLogs.push(
        `<div class="log-action" style="color: #e74c3c; font-weight: bold;">&nbsp;&rarr; ボルテージレベル ${oldLevel} → ${newLevel}</div>`,
      )
    }
  }

  private calculateTurnResult(card: Card, effectiveAPCost: number): TurnResult {
    const cardIndex = this.state.currentCardIndex
    const skillLevel = this.state.cardSkillLevels[cardIndex]
    const skillMultiplier = SKILL_LEVEL_MULTIPLIERS[skillLevel - 1] || 1

    // Calculate appeal
    const appeal = this.getAppealValue()

    const voltageLevel = getVoltageLevel(
      this.state.totalVoltage,
      this.state.currentTurn,
      this.state.music,
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
      apUsed: effectiveAPCost,
      isSkipped: false,
      multipliers: {
        base: 0, // Will be filled based on actual effects
        skill: skillMultiplier,
        skillBoost: this.state.skillInvocationBoost,
        voltage: voltageLevel / 10,
        fever: this.state.currentPhase?.name === 'duringFever' ? 2 : 1,
        center: this.state.centerSkillMultiplier,
        total: 0, // Will be filled based on actual calculation
      },
      logs: [...this.currentTurnLogs],
    }
  }

  private getCenterCard(): Card | null {
    if (!this.state.music?.centerCharacter) return null

    return (
      this.state.cards.find(
        (card) => card && card.character === this.state.music?.centerCharacter,
      ) || null
    )
  }

  private getCenterCards(): Card[] {
    if (!this.state.music?.centerCharacter) return []

    return this.state.cards.filter(
      (card) => card && card.character === this.state.music?.centerCharacter,
    ) as Card[]
  }

  private getPhaseStr(): string {
    if (!this.state.currentPhase) return ''

    // v1 style: Only show fever icon during fever
    if (this.state.currentPhase.name === 'duringFever') {
      return '<span class="fever-icon">🔥</span>'
    }
    return ''
  }

  /**
   * Calculate score with AP shortage
   */
  simulateWithAPShortage(baseAP: number, previousState?: GameState): APShortageResult | null {
    // Use previous simulation result if provided, otherwise run a new simulation
    const normalState = previousState || this.simulate()
    const totalAvailableAP = baseAP + normalState.apAcquired
    const apShortage = normalState.apConsumed - totalAvailableAP

    if (apShortage <= 0) {
      // No AP shortage
      return null
    }

    // Determine which activations to exclude
    const activationLog = [...normalState.cardActivationLog]
    const excludedActivations: Array<{ turn: number; cardName: string; apCost: number }> = []
    let apSaved = 0
    const excludedIndices = new Set<number>()

    // Start from the last activation and work backwards
    for (let i = activationLog.length - 1; i >= 0; i--) {
      const activation = activationLog[i]

      // Skip center skills
      if (activation.isCenterSkill) {
        continue
      }

      // Only consider cards with AP cost
      if (activation.apCost > 0) {
        excludedIndices.add(i)
        // Get the card to find its displayName
        const card = this.state.cards[activation.cardIndex]
        const displayName = card ? card.displayName || card.name : activation.cardName

        excludedActivations.unshift({
          turn: activation.turn,
          cardName: displayName,
          apCost: activation.apCost,
        })

        apSaved += activation.apCost

        if (apSaved >= apShortage) {
          // We've saved enough AP
          break
        }
      }
    }

    if (excludedActivations.length === 0) {
      return null // No activations to exclude
    }

    // Find the first excluded activation to get the score at that point
    let firstExcludedIndex = -1
    for (let i = 0; i < activationLog.length; i++) {
      if (excludedIndices.has(i) && !activationLog[i].isCenterSkill) {
        firstExcludedIndex = i
        break
      }
    }

    let finalScore = 0
    let finalApConsumed = 0

    if (firstExcludedIndex >= 0) {
      // Use the scoreBefore from the first excluded activation
      const firstExcludedActivation = activationLog[firstExcludedIndex]
      finalScore = firstExcludedActivation.scoreBefore

      // Calculate AP consumed up to the first excluded activation
      for (let i = 0; i < firstExcludedIndex; i++) {
        if (!activationLog[i].isCenterSkill) {
          finalApConsumed += activationLog[i].apCost
        }
      }
    } else {
      // No excluded activation found, use the final score
      finalScore = normalState.totalScore
      finalApConsumed = normalState.apConsumed
    }

    // Get the state at the exclusion point
    const firstExcluded = firstExcludedIndex >= 0 ? activationLog[firstExcludedIndex] : null
    const currentBoosts = firstExcluded?.scoreBoostBefore || []
    const currentVoltage = firstExcluded?.voltagePtBefore || 0
    const scoreBoostCount = firstExcluded?.scoreBoostCountBefore || 0
    const lastExcludedTurn = firstExcluded?.turn || normalState.currentTurn

    // Calculate voltage level using the same logic as getVoltageLevel
    const voltageLevel = this.calculateVoltageLevel(currentVoltage)

    // Check for center skills that would still activate after excluded activations
    const centerCard = this.getCenterCard()
    if (centerCard && centerCard.centerSkill) {
      const centerSkill = centerCard.centerSkill
      const centerIndex = this.state.cards.findIndex((card) => card === centerCard)
      const centerSkillLevel = this.centerSkillLevels[centerIndex]
      const skillMultiplier = SKILL_LEVEL_MULTIPLIERS[centerSkillLevel - 1] || 1

      // Calculate total turns
      const music = this.state.music!

      // Check timing for center skill activation
      let shouldActivate = false

      if (centerSkill.when === 'beforeFeverStart') {
        // Check if we haven't excluded activations before fever start
        if (lastExcludedTurn <= music.phases[0]) {
          shouldActivate = true
        }
      } else if (centerSkill.when === 'afterLastTurn') {
        // afterLastTurn center skills activate after all turns are completed
        // Since we're only excluding card activations (not the game flow),
        // the game still completes and afterLastTurn activates (v1 behavior)
        shouldActivate = true
      } else if (centerSkill.when === 'beforeFirstTurn') {
        // beforeFirstTurn always activates at the start
        shouldActivate = true
      }

      if (shouldActivate && centerSkill.effects) {
        // Apply center skill effects to calculate additional score
        for (const effect of centerSkill.effects) {
          if (effect.type === 'scoreGain') {
            // Get custom value if available
            const customKey = `center_effect_${centerSkill.effects.indexOf(effect)}_value`
            const customValue = this.customCenterSkillValues[centerIndex]?.[customKey]
            let effectValue =
              customValue !== undefined
                ? customValue
                : (effect.levelValues?.[centerSkillLevel - 1] ?? effect.value)
            // Apply skill level formula for center skills (v1 compatibility)
            effectValue = roundSkillValue((effectValue / 2) * skillMultiplier, true)

            // Determine if voltage level should be doubled based on center skill timing
            let actualVoltageLevel = voltageLevel
            if (centerSkill.when === 'beforeFeverStart') {
              // beforeFeverStart always happens during fever, so double voltage level
              actualVoltageLevel *= 2
            } else if (centerSkill.when === 'afterLastTurn' && music.phases[2] === 0) {
              // afterLastTurn during fever if afterFever phase is 0
              actualVoltageLevel *= 2
            }

            // For afterLastTurn, use the state from the center skill activation log
            let actualVoltageMultiplier = 1.0 + actualVoltageLevel / 10
            let actualBoostMultiplier = 1.0 + (currentBoosts[scoreBoostCount] || 0)

            if (centerSkill.when === 'afterLastTurn') {
              // Find the center skill in activation log to get its state
              for (let i = activationLog.length - 1; i >= 0; i--) {
                if (
                  activationLog[i].isCenterSkill &&
                  activationLog[i].cardName === (centerCard.displayName || centerCard.name)
                ) {
                  const centerActivation = activationLog[i]
                  let centerVoltageLevel = this.calculateVoltageLevel(
                    centerActivation.voltagePtBefore,
                  )
                  // Apply fever doubling if applicable
                  if (music.phases[2] === 0) {
                    centerVoltageLevel *= 2
                  }
                  actualVoltageLevel = centerVoltageLevel
                  actualVoltageMultiplier = 1.0 + centerVoltageLevel / 10
                  actualBoostMultiplier =
                    1.0 +
                    (centerActivation.scoreBoostBefore[centerActivation.scoreBoostCountBefore] || 0)
                  break
                }
              }
            }

            // Calculate appeal using the same method as in the regular simulation
            const appeal = this.getAppealValue()

            const scoreGain = Math.ceil(
              appeal *
                effectValue *
                actualBoostMultiplier *
                actualVoltageMultiplier *
                this.state.learningCorrection,
            )
            finalScore += scoreGain
          }
        }
      }
    }

    // Create turn results by filtering out excluded turns
    const filteredTurnResults = normalState.turnResults.filter((turn) => {
      return !excludedActivations.some((ex) => ex.turn === turn.turn)
    })

    return {
      score: finalScore,
      voltage: currentVoltage,
      voltageLevel,
      apSaved,
      realAPConsumption: finalApConsumed,
      excludedActivations,
      turnResults: filteredTurnResults,
    }
  }

  private calculateVoltageLevel(voltage: number): number {
    const voltageLevels = [
      0, 10, 30, 60, 100, 150, 210, 280, 360, 450, 550, 660, 780, 910, 1050, 1200, 1360, 1530, 1710,
      1900,
    ]

    if (voltage < 10) return 0

    if (voltage < 1900) {
      for (let i = 1; i < voltageLevels.length; i++) {
        if (voltage < voltageLevels[i]) {
          return i - 1
        }
      }
    }

    return 19 + Math.floor((voltage - 1900) / 200)
  }

  private applyCenterSkillsAtTiming(timing: string): void {
    const centerCards = this.getCenterCards()
    if (centerCards.length === 0) return

    // Process each center card
    for (const centerCard of centerCards) {
      // Find the center card index
      const centerIndex = this.state.cards.findIndex((card) => card === centerCard)
      if (centerIndex === -1) continue

      // Check if center is activated for this card
      if (!this.centerActivations[centerIndex]) continue

      // Process center skill effects
      if (centerCard.centerSkill && centerCard.centerSkill.when === timing) {
        // Reset turn logs for center skill
        this.currentTurnLogs = []

        // Add center skill header log
        const isFeverTiming =
          timing === 'beforeFeverStart' ||
          (timing === 'afterLastTurn' &&
            this.state.music &&
            this.state.music.phases[1] >= this.getTotalTurns() - this.state.music.phases[0])
        const feverIcon = isFeverTiming ? '<span class="fever-icon">🔥</span>' : ''
        this.currentTurnLogs.push(
          `<div class="log-turn-header">
            <span class="turn-number center-skill">センタースキル</span>
            ${feverIcon}
            <span class="log-card-name">${centerCard.displayName || centerCard.name}</span>
          </div>`,
        )

        // Record center skill activation log
        const centerActivationIndex = this.state.cardActivationLog.length

        this.state.cardActivationLog.push({
          turn: this.state.currentTurn,
          cardName: centerCard.displayName || centerCard.name,
          cardIndex: centerIndex,
          apCost: 0,
          isCenterSkill: true,
          scoreBefore: this.state.totalScore,
          scoreBoostBefore: [...this.state.scoreBoost],
          scoreBoostCountBefore: this.state.scoreBoostCount,
          voltagePtBefore: this.state.totalVoltage,
          scoreGain: 0, // Will be updated after processing
          scoreBoostAfter: [], // Will be updated after processing
          scoreBoostCountAfter: 0, // Will be updated after processing
          voltagePtAfter: 0, // Will be updated after processing
        })

        const centerSkillLevel = this.centerSkillLevels[centerIndex]
        const skillMultiplier = SKILL_LEVEL_MULTIPLIERS[centerSkillLevel - 1] || 1

        for (let i = 0; i < centerCard.centerSkill.effects.length; i++) {
          const effect = centerCard.centerSkill.effects[i]
          this.processCenterSkillEffect(effect, centerIndex, skillMultiplier, `center_effect_${i}`)
        }

        // Add center skill log to turn results
        if (this.currentTurnLogs.length > 1) {
          // More than just header
          this.state.turnResults.push({
            turn: this.state.currentTurn,
            cardIndex: centerIndex,
            cardName: centerCard.name,
            cardCharacter: centerCard.character,
            appeal: 0,
            scoreGain: this.currentTurnScoreGain,
            voltageGain: this.currentTurnVoltageGain,
            voltageLevel: getVoltageLevel(
              this.state.totalVoltage,
              this.state.currentTurn,
              this.state.music,
            ),
            apUsed: 0,
            isSkipped: false,
            multipliers: {
              base: 0,
              skill: skillMultiplier,
              skillBoost: 0,
              voltage: 0,
              fever: 0,
              center: 0,
              total: 0,
            },
            logs: [...this.currentTurnLogs],
          })
        }

        // Update center skill activation log
        if (centerActivationIndex < this.state.cardActivationLog.length) {
          this.state.cardActivationLog[centerActivationIndex].scoreGain = this.currentTurnScoreGain
          this.state.cardActivationLog[centerActivationIndex].scoreBoostAfter = [
            ...this.state.scoreBoost,
          ]
          this.state.cardActivationLog[centerActivationIndex].scoreBoostCountAfter =
            this.state.scoreBoostCount
          this.state.cardActivationLog[centerActivationIndex].voltagePtAfter =
            this.state.totalVoltage
        }

        // Reset turn gains
        this.currentTurnScoreGain = 0
        this.currentTurnVoltageGain = 0
      }

      // Process center characteristic effects (keep for compatibility)
      if (centerCard.centerCharacteristic?.effects) {
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
  }

  private processCenterSkillEffect(
    effect: Effect,
    centerIndex: number,
    skillMultiplier: number,
    effectPath: string,
  ): void {
    // Check for custom center skill value
    const customValue = this.customCenterSkillValues[centerIndex]?.[effectPath]

    switch (effect.type) {
      case 'apGain': {
        // AP gain with level values support
        let apValue: number
        const apEffect = effect as ApGainEffect
        if (customValue !== undefined) {
          apValue = customValue
        } else if (
          apEffect.levelValues &&
          apEffect.levelValues[this.centerSkillLevels[centerIndex] - 1] !== undefined
        ) {
          apValue = apEffect.levelValues[this.centerSkillLevels[centerIndex] - 1]
        } else {
          // Apply skill level formula when no levelValues exist
          // v1 formula: (lv10Value / 2) * multiplier
          apValue = roundSkillValue((apEffect.value / 2) * skillMultiplier, false)
        }
        this.getAP(apValue)
        break
      }

      case 'scoreGain': {
        let scoreValue: number
        if (customValue !== undefined) {
          scoreValue = customValue
        } else {
          // Apply skill level formula
          // v1 formula: (lv10Value / 2) * multiplier
          scoreValue = roundSkillValue((effect.value / 2) * skillMultiplier, true)
        }
        // Center skill score gain uses getScore method like regular cards
        this.getScore(scoreValue)
        break
      }

      case 'scoreBoost': {
        let boostValue: number
        if (customValue !== undefined) {
          boostValue = customValue
        } else {
          // Apply skill level formula
          // v1 formula: (lv10Value / 2) * multiplier
          boostValue = roundSkillValue((effect.value / 2) * skillMultiplier, true)
        }
        this.state.scoreBoost[this.state.scoreBoostCount] += boostValue
        break
      }

      case 'voltageGain': {
        let voltageValue: number
        if (customValue !== undefined) {
          voltageValue = customValue
        } else {
          // Center skill values are stored as actual Lv.10 values (not doubled like regular skills)
          // Regular skills use (value / 2) * multiplier, but center skills use value directly
          // To match this pattern, we need to double the value first
          voltageValue = roundSkillValue((effect.value * skillMultiplier) / 2.0, false)
        }
        // Apply voltage boost when gaining voltage
        const voltageWithBoost = Math.floor(
          voltageValue * (1 + this.state.voltageBoost[this.state.voltageBoostCount]),
        )
        this.state.totalVoltage += voltageWithBoost
        // Increment voltage boost counter after use
        this.state.voltageBoostCount = Math.min(this.state.voltageBoostCount + 1, 99)
        // Add log
        this.currentTurnVoltageGain += voltageWithBoost
        this.currentTurnLogs.push(
          `<div class="log-action log-boost-action"><div class="log-voltage-gain">⚡ ボルテージ獲得</div><div class="voltage-gain-values">+${voltageWithBoost} → ${this.state.totalVoltage}</div></div>`,
        )
        break
      }

      case 'voltageBoost': {
        let voltageBoostValue: number
        if (customValue !== undefined) {
          voltageBoostValue = customValue
        } else {
          // Apply skill level formula
          // v1 formula: (lv10Value / 2) * multiplier
          voltageBoostValue = roundSkillValue((effect.value / 2) * skillMultiplier, true)
        }
        this.state.voltageBoost[this.state.voltageBoostCount] += voltageBoostValue
        break
      }

      case 'mentalReduction': {
        const mentalEffect = effect as MentalReductionEffect
        const centerSkillLevel = this.centerSkillLevels[centerIndex]
        let reductionValue: number
        if (
          mentalEffect.levelValues &&
          mentalEffect.levelValues[centerSkillLevel - 1] !== undefined
        ) {
          reductionValue = mentalEffect.levelValues[centerSkillLevel - 1]
        } else {
          reductionValue = mentalEffect.value
        }
        this.state.mental = Math.max(0, this.state.mental - reductionValue)
        this.currentTurnLogs.push(
          `<div class="log-action"><span style="color: #e74c3c;">メンタル減少: -${reductionValue} → ${this.state.mental}%</span></div>`,
        )
        break
      }

      case 'conditional': {
        const conditionalEffect = effect as ConditionalEffect
        const conditionMet = this.evaluateCenterSkillCondition(conditionalEffect.condition)
        const effectsToProcess = conditionMet
          ? conditionalEffect.then
          : conditionalEffect.else || []
        const pathPrefix = conditionMet ? 'then' : 'else'

        for (let i = 0; i < effectsToProcess.length; i++) {
          this.processCenterSkillEffect(
            effectsToProcess[i],
            centerIndex,
            skillMultiplier,
            `${effectPath}_${pathPrefix}_${i}`,
          )
        }
        break
      }

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
          case '<=':
            return turn <= value
          case '>=':
            return turn >= value
          case '==':
            return turn === value
          case '<':
            return turn < value
          case '>':
            return turn > value
        }
      }
    }

    if (condition.includes('mental')) {
      const match = condition.match(/mental\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        // Use turn start mental value for center skill conditions (v1 behavior)
        const mental = this.turnStartMental

        switch (operator) {
          case '<=':
            return mental <= value
          case '>=':
            return mental >= value
          case '==':
            return mental === value
          case '<':
            return mental < value
          case '>':
            return mental > value
        }
      }
    }

    if (condition.includes('voltageLevel')) {
      const match = condition.match(/voltageLevel\s*([<>=]+)\s*(\d+)/)
      if (match) {
        const operator = match[1]
        const value = parseInt(match[2])
        // Use turn start voltage level for center skill conditions (v1 behavior)
        const voltageLevel = this.turnStartVoltageLevel

        switch (operator) {
          case '<=':
            return voltageLevel <= value
          case '>=':
            return voltageLevel >= value
          case '==':
            return voltageLevel === value
          case '<':
            return voltageLevel < value
          case '>':
            return voltageLevel > value
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
