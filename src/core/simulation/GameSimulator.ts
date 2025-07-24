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
      
      // Multipliers and boosts
      scoreBoost: 0,
      voltageBoost: 0,
      skillInvocationBoost: 0,
      centerSkillMultiplier: 1,
      
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
    
    // Process card effects
    let skipTurn = false
    let resetCardTurn = false
    
    for (let i = 0; i < card.effects.length; i++) {
      const effect = card.effects[i]
      const result = this.processEffect(effect, card, this.state.currentCardIndex, `effect_${i}`)
      if (result.skipTurn) skipTurn = true
      if (result.resetCardTurn) resetCardTurn = true
    }
    
    if (skipTurn) {
      this.skipTurn()
      return
    }
    
    // Calculate turn results
    const turnResult = this.calculateTurnResult(card)
    this.state.turnResults.push(turnResult)
    
    // Update game state
    this.state.totalScore += turnResult.scoreGain
    this.state.totalVoltage += turnResult.voltageGain
    
    // Update card usage
    if (resetCardTurn) {
      this.state.cardTurnCounts[this.state.currentCardIndex] = 0
    } else {
      this.state.cardTurnCounts[this.state.currentCardIndex]++
    }
    this.state.totalCardUses[this.state.currentCardIndex]++
    
    // Move to next card
    this.moveToNextCard()
  }
  
  private getCurrentCard(): Card | null {
    return this.state.cards[this.state.currentCardIndex]
  }
  
  private moveToNextCard(): void {
    let nextIndex = this.state.currentCardIndex
    let attempts = 0
    
    do {
      nextIndex = (nextIndex + 1) % 6
      attempts++
    } while (!this.state.cards[nextIndex] && attempts < 6)
    
    this.state.currentCardIndex = nextIndex
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
    
    switch (effect.type) {
      case 'conditional':
        const conditionalResult = this.processConditionalEffect(effect as ConditionalEffect, card, cardIndex, effectPath)
        skipTurn = conditionalResult.skipTurn
        resetCardTurn = conditionalResult.resetCardTurn
        break
        
      case 'scoreBoost':
        this.state.scoreBoost += customValue !== undefined ? customValue : effect.value
        break
        
      case 'voltageBoost':
        this.state.voltageBoost += customValue !== undefined ? customValue : effect.value
        break
        
      case 'skillInvocationBoost':
        this.state.skillInvocationBoost += customValue !== undefined ? customValue : effect.value
        break
        
      case 'skipTurn':
        skipTurn = true
        break
        
      case 'resetCardTurn':
        resetCardTurn = true
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
    const effectsToProcess = conditionMet ? effect.then : (effect.else || [])
    const pathPrefix = conditionMet ? 'then' : 'else'
    
    for (let i = 0; i < effectsToProcess.length; i++) {
      const subEffect = effectsToProcess[i]
      const result = this.processEffect(subEffect, card, cardIndex, `${effectPath}_${pathPrefix}_${i}`)
      if (result.skipTurn) skipTurn = true
      if (result.resetCardTurn) resetCardTurn = true
    }
    
    return { skipTurn, resetCardTurn }
  }
  
  private evaluateCondition(condition: string, card: Card): boolean {
    const cardIndex = this.state.currentCardIndex
    const turnCount = this.state.cardTurnCounts[cardIndex]
    const totalUses = this.state.totalCardUses[cardIndex]
    const voltage = this.state.totalVoltage
    const phase = this.state.currentPhase?.name
    
    // Special handling for fantasyGin card
    if (card.name === 'fantasyGin' && condition === 'count <= 999') {
      const deckResetCount = this.customSkillValues[cardIndex]?.['deckResetCount']
      if (deckResetCount !== undefined) {
        // Use the custom deck reset count
        return turnCount <= deckResetCount
      }
    }
    
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
    
    return false
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
    
    // Calculate base multiplier from card effects
    let baseMultiplier = 0
    for (let i = 0; i < card.effects.length; i++) {
      const effect = card.effects[i]
      if (effect.type === 'scoreGain') {
        const customValue = this.customSkillValues[cardIndex]?.[`effect_${i}`]
        baseMultiplier += customValue !== undefined ? customValue : effect.value
      }
    }
    
    // Apply skill level multiplier
    const adjustedMultiplier = baseMultiplier * skillMultiplier
    
    // Apply skill invocation boost
    const finalMultiplier = calculateSkillInvocationMultiplier(
      adjustedMultiplier,
      this.state.skillInvocationBoost
    )
    
    // Calculate voltage
    const voltageGain = Math.floor(appeal * this.state.voltageBoost)
    const voltageLevel = getVoltageLevel(
      this.state.totalVoltage + voltageGain,
      this.state.currentTurn,
      this.state.music
    )
    
    // Calculate score
    const scoreGain = calculateScore(
      finalMultiplier,
      appeal,
      this.state.scoreBoost,
      voltageLevel,
      this.state.centerSkillMultiplier
    )
    
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
        base: baseMultiplier,
        skill: skillMultiplier,
        skillBoost: this.state.skillInvocationBoost,
        voltage: voltageLevel / 10,
        fever: this.state.currentPhase?.name === 'duringFever' ? 2 : 1,
        center: this.state.centerSkillMultiplier,
        total: finalMultiplier
      }
    }
  }
  
  private getCenterCard(): Card | null {
    if (!this.state.centerCharacter || !this.state.music) return null
    
    return this.state.cards.find(
      card => card && card.character === this.state.music?.centerCharacter
    ) || null
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
        // AP gain handled separately in v1 logic
        break
        
      case 'scoreGain':
        const scoreValue = customValue !== undefined ? customValue : (effect.value * skillMultiplier)
        // Direct score gain - apply to total score
        const centerCard = this.state.cards[centerIndex]
        if (centerCard) {
          const appeal = calculateAppealValue({
            cards: this.state.cards,
            musicAttribute: this.state.musicAttribute as any,
            centerCard: this.getCenterCard(),
            centerCharacteristic: this.getCenterCard()?.centerCharacteristic
          })
          const score = Math.floor(appeal * scoreValue)
          this.state.totalScore += score
        }
        break
        
      case 'scoreBoost':
        const boostValue = customValue !== undefined ? customValue : (effect.value * skillMultiplier)
        this.state.scoreBoost += boostValue
        break
        
      case 'voltageGain':
        const voltageValue = customValue !== undefined ? customValue : Math.floor(effect.value * skillMultiplier)
        this.state.totalVoltage += voltageValue
        break
        
      case 'voltageBoost':
        const voltageBoostValue = customValue !== undefined ? customValue : (effect.value * skillMultiplier)
        this.state.voltageBoost += voltageBoostValue
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