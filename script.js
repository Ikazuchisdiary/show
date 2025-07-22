// Global data loaded from JSON
let cardData = {};
let musicData = {};

// Skill level multipliers (Lv.1 = 1.0x, Lv.2 = 1.1x, ..., Lv.14 = 3.0x)
const SKILL_LEVEL_MULTIPLIERS = [
    1.0,  // Lv.1
    1.1,  // Lv.2
    1.2,  // Lv.3
    1.3,  // Lv.4
    1.4,  // Lv.5
    1.5,  // Lv.6
    1.6,  // Lv.7
    1.7,  // Lv.8
    1.8,  // Lv.9
    2.0,  // Lv.10
    2.2,  // Lv.11
    2.4,  // Lv.12
    2.6,  // Lv.13
    3.0   // Lv.14
];

// Game class
class Game {
    constructor(cards, appeal, music, verbose = false, centerCharacter = null, learningCorrection = 1.5) {
        this.score = 0;
        this.scoreBoost = new Array(100).fill(0);
        this.scoreBoostCount = 0;
        this.voltagePt = 0;
        this.voltageBoost = new Array(100).fill(0);
        this.voltageBoostCount = 0;
        this.turn = 0;
        this.cards = cards;
        this.cardTurn = 0;
        this.mental = 100;
        this.appeal = appeal;
        this.music = music;
        this.verbose = verbose;
        this.learningCorrection = learningCorrection;
        this.log = "";
        this.logHtml = "";
        this.currentTurnLog = [];
        this.centerCharacter = centerCharacter;
        this.centerSkillActivated = {
            beforeFirstTurn: false,
            beforeFeverStart: false,
            afterLastTurn: false
        };
        this.removedCards = new Set(); // 除外されたカードを管理
        this.resetCardRequested = false; // resetCardTurnのフラグ
    }

    doGame() {
        // Check for beforeFirstTurn center skills
        this.activateCenterSkills('beforeFirstTurn');
        
        while (this.turn < this.music.reduce((a, b) => a + b, 0)) {
            // Check for beforeFeverStart center skills
            if (this.turn === this.music[0] && !this.centerSkillActivated.beforeFeverStart) {
                this.activateCenterSkills('beforeFeverStart');
            }
            
            this.turnUp();
        }
        
        // Check for afterLastTurn center skills
        this.activateCenterSkills('afterLastTurn');
    }

    turnUp() {
        // カードの選択を繰り返し、除外されていないカードを見つける
        let card = null;
        let attemptCount = 0;
        let currentIndex = this.cardTurn;
        let foundIndex = -1;
        
        while (attemptCount < this.cards.length) {
            if (currentIndex >= this.cards.length) {
                currentIndex = 0;
            }
            
            const currentCard = this.cards[currentIndex];
            
            // 除外されていないカードなら使用
            if (!this.removedCards.has(currentCard.name)) {
                card = currentCard;
                foundIndex = currentIndex;
                break;
            }
            
            // 次のカードへ
            currentIndex++;
            attemptCount++;
        }
        
        // すべてのカードが除外されている場合
        if (!card) {
            this.turn++;
            return;
        }
        
        // ログの作成
        if (this.verbose) {
            this.log += `turn ${this.turn + 1}\n`;
            this.currentTurnLog = [];
            const phase = this.getCurrentPhase();
            const cardName = card.displayName || card.name;
            this.currentTurnLog.push(`<div class="log-turn-header"><span class="turn-number">${this.turn + 1}</span> ${phase} <span class="log-card-name">${cardName}</span></div>`);
        }
        
        // 次のカード使用のためのフラグ
        this.resetCardRequested = false;
        
        card.do(this);
        
        // Create log entry only if we have content
        if (this.verbose && this.currentTurnLog.length > 0) {
            this.logHtml += `<div class="log-turn">${this.currentTurnLog.join('')}</div>`;
        }
        
        // resetCardTurnが要求された場合は0に、そうでなければ見つけたカードの次へ
        if (this.resetCardRequested) {
            this.cardTurn = 0;
        } else {
            this.cardTurn = foundIndex + 1;
            if (this.cardTurn >= this.cards.length) {
                this.cardTurn = 0;
            }
        }
    }
    
    getCurrentPhase() {
        const beforeFever = this.music[0];
        const duringFever = this.music[1];
        
        if (this.turn >= beforeFever && this.turn < beforeFever + duringFever) {
            return '<span class="fever-icon">🔥</span>';
        }
        return '';
    }

    getVoltageLevel() {
        const getSubVoltageLevel = () => {
            const voltageLevels = [0, 10, 30, 60, 100, 150, 210, 280, 360, 450, 550, 660, 780, 910, 1050, 1200, 1360, 1530, 1710, 1900];
            if (this.voltagePt < 10) {
                return 0;
            }
            if (this.voltagePt < 1900) {
                for (let i = 1; i < voltageLevels.length; i++) {
                    if (this.voltagePt < voltageLevels[i]) {
                        return i - 1;
                    }
                }
            }
            return 19 + Math.floor((this.voltagePt - 1900) / 200);
        };
        
        let voltage = getSubVoltageLevel();
        // Fever phase: turns are 0-indexed, so fever starts at this.music[0]
        if (this.music[0] <= this.turn && this.turn < this.music[0] + this.music[1]) {
            voltage *= 2;
        }
        return voltage;
    }

    doScoreBoost(value, times = 1) {
        for (let i = 0;i < times; i++) {
            this.scoreBoost[this.scoreBoostCount + i] += value;
        }
        if (this.verbose) {
            this.log += `score boost ${value}, reach ${this.scoreBoost[this.scoreBoostCount]}\n`;
            const percent = (value * 100).toFixed(2);
            const total = (this.scoreBoost[this.scoreBoostCount] * 100).toFixed(2);
            this.currentTurnLog.push(`<div class="log-action log-boost-action"><div class="log-score-boost">スコアブースト</div><div class="boost-values">+${percent}% → ${total}%</div></div>`);
        }
    }

    doVoltageBoost(value, times = 1) {
        for (let i = 0; i < times; i++) {
            this.voltageBoost[this.voltageBoostCount + i] += value;
        }
        if (this.verbose) {
            this.log += `voltage boost ${value}, reach ${this.voltageBoost[this.voltageBoostCount]}\n`;
            const percent = (value * 100).toFixed(2);
            const total = (this.voltageBoost[this.voltageBoostCount] * 100).toFixed(2);
            this.currentTurnLog.push(`<div class="log-action log-boost-action"><div class="log-voltage-boost">ボルテージブースト</div><div class="boost-values">+${percent}% → ${total}%</div></div>`);
        }
    }

    getScore(value) {
        const score = Math.floor(this.appeal * value * (1 + this.scoreBoost[this.scoreBoostCount]) * (1 + this.getVoltageLevel() / 10) * this.learningCorrection);
        this.score += score;
        this.scoreBoostCount += 1;
        if (this.verbose) {
            this.log += `get score ${score} = ${value} * ${this.appeal} * (1 + ${this.scoreBoost[this.scoreBoostCount - 1]}) * ${1 + this.getVoltageLevel() / 10} * ${this.learningCorrection}\n`;
            const voltageLevel = this.getVoltageLevel();
            const totalScoreBoostPercent = ((1 + this.scoreBoost[this.scoreBoostCount - 1]) * 100).toFixed(2);
            const totalVoltageLevelPercent = ((1 + voltageLevel / 10) * 100).toFixed(2);
            this.currentTurnLog.push(`<div class="log-action log-boost-action"><div class="log-score-gain">スコア獲得</div><div class="score-gain-values">+${score.toLocaleString()} → ${this.score.toLocaleString()}</div></div>`);
            
            // Build calculation display with labels
            let calcHtml = '<div class="log-calculation">';
            calcHtml += `<span class="calc-value calc-base">${value}<span class="calc-label">倍率</span></span>`;
            calcHtml += '<span class="calc-operator">×</span>';
            calcHtml += `<span class="calc-value calc-appeal">${this.appeal.toLocaleString()}<span class="calc-label">アピール</span></span>`;
            calcHtml += '<span class="calc-operator">×</span>';
            calcHtml += `<span class="calc-value calc-score-boost">${totalScoreBoostPercent}%<span class="calc-label">ブースト</span></span>`;
            calcHtml += '<span class="calc-operator">×</span>';
            calcHtml += `<span class="calc-value calc-voltage-level">${totalVoltageLevelPercent}%<span class="calc-label">Lv${voltageLevel}</span></span>`;
            calcHtml += '<span class="calc-operator">×</span>';
            calcHtml += `<span class="calc-value calc-fever">${this.learningCorrection}<span class="calc-label">ラーニング</span></span>`;
            calcHtml += '</div>';
            
            this.currentTurnLog.push(calcHtml);
        }
    }

    getVoltage(value) {
        const voltagePt = Math.floor(value * (1 + this.voltageBoost[this.voltageBoostCount]));
        this.voltagePt += voltagePt;
        if (this.verbose) {
            this.log += `get voltage ${voltagePt} = ${value} * (1 + ${this.voltageBoost[this.voltageBoostCount]})\n`;
            const totalBoostPercent = ((1 + this.voltageBoost[this.voltageBoostCount]) * 100).toFixed(2);
            const oldLevel = this.getVoltageLevel();
            this.voltageBoostCount += 1;
            const newLevel = this.getVoltageLevel();
            this.voltageBoostCount -= 1;
            this.currentTurnLog.push(`<div class="log-action"><span class="log-voltage-gain">ボルテージ獲得: +${voltagePt} → ${this.voltagePt}</span></div>`);
            
            // Build voltage calculation display
            let calcHtml = '<div class="log-calculation">';
            calcHtml += `<span class="calc-value calc-base">${value}<span class="calc-label">基本値</span></span>`;
            calcHtml += '<span class="calc-operator">×</span>';
            calcHtml += `<span class="calc-value calc-voltage-level">${totalBoostPercent}%<span class="calc-label">ブースト</span></span>`;
            calcHtml += '</div>';
            
            this.currentTurnLog.push(calcHtml);
            if (oldLevel !== newLevel) {
                this.currentTurnLog.push(`<div class="log-action" style="color: #e74c3c; font-weight: bold;">　→ ボルテージレベル ${oldLevel} → ${newLevel}</div>`);
            }
        }
        this.voltageBoostCount += 1;
    }
    
    activateCenterSkills(timing) {
        if (!this.centerCharacter || this.centerSkillActivated[timing]) return;
        
        // Find cards with matching character and center skill for this timing
        for (const card of this.cards) {
            if (card.config && card.config.character === this.centerCharacter && 
                card.config.centerSkill && card.config.centerSkill.timing === timing) {
                
                this.centerSkillActivated[timing] = true;
                
                if (this.verbose) {
                    this.currentTurnLog = [];
                    const isFeverTiming = timing === 'beforeFeverStart' || 
                        (timing === 'afterLastTurn' && this.music[1] >= this.totalTurns - this.music[0]);
                    const feverIcon = isFeverTiming ? '<span class="fever-icon">🔥</span>' : '';
                    this.currentTurnLog.push(`<div class="log-turn-header"><span class="turn-number center-skill">センタースキル</span>${feverIcon} <span class="log-card-name">${card.displayName}</span></div>`);
                }
                
                // Process center skill effects
                const centerSkill = card.config.centerSkill;
                for (let i = 0; i < centerSkill.effects.length; i++) {
                    this.processCenterSkillEffect(centerSkill.effects[i], card.centerSkillLevel, card.centerSkillValues, i);
                }
                
                if (this.verbose) {
                    this.logHtml += `<div class="log-turn">${this.currentTurnLog.join('')}</div>`;
                }
                break; // Only activate first matching center skill
            }
        }
    }
    
    processCenterSkillEffect(effect, skillLevel, centerSkillValues, effectIndex = 0, prefix = '') {
        const key = prefix ? `${prefix}_${effectIndex}_value` : `effect_${effectIndex}_value`;
        
        switch (effect.type) {
            case 'scoreGain':
                const scoreValue = centerSkillValues[key] !== undefined ? 
                    parseFloat(centerSkillValues[key]) : effect.value;
                this.getScore(scoreValue);
                break;
                
            case 'scoreBoost':
                const boostValue = centerSkillValues[key] !== undefined ? 
                    parseFloat(centerSkillValues[key]) : effect.value;
                this.doScoreBoost(boostValue);
                break;
                
            case 'voltageGain':
                const voltageValue = centerSkillValues[key] !== undefined ? 
                    parseInt(centerSkillValues[key]) : effect.value;
                this.getVoltage(voltageValue);
                break;
                
            case 'voltageBoost':
                const voltageBoostValue = centerSkillValues[key] !== undefined ? 
                    parseFloat(centerSkillValues[key]) : effect.value;
                this.doVoltageBoost(voltageBoostValue);
                break;
                
            case 'voltagePenalty':
                this.voltagePt = Math.max(0, this.voltagePt - effect.value);
                if (this.verbose) {
                    this.currentTurnLog.push(`<div class="log-action"><span style="color: #e74c3c;">ボルテージ-${effect.value} (残り: ${this.voltagePt})</span></div>`);
                }
                break;
                
            case 'mentalReduction':
                const reduction = Math.floor(this.mental * effect.value / 100);
                this.mental = Math.max(0, this.mental - reduction);
                if (this.verbose) {
                    this.currentTurnLog.push(`<div class="log-action"><span style="color: #e74c3c;">メンタル${effect.value}%減少 → ${this.mental}%</span></div>`);
                }
                break;
                
            case 'appealBoost':
                const appealBoostValue = centerSkillValues[key] !== undefined ? 
                    parseFloat(centerSkillValues[key]) : effect.value;
                this.appeal = Math.floor(this.appeal * (1 + appealBoostValue));
                if (this.verbose) {
                    this.currentTurnLog.push(`<div class="log-action"><span style="color: #2196F3;">アピール値${Math.round(appealBoostValue * 100)}%上昇 → ${this.appeal}</span></div>`);
                }
                break;
                
            case 'conditional':
                // Evaluate condition using current game state
                const conditionMet = this.evaluateCenterSkillCondition(effect.condition);
                
                if (this.verbose) {
                    // Create a dummy card object to use formatCondition
                    const dummyCard = {
                        formatCondition: GenericCard.prototype.formatCondition,
                        displayName: 'センタースキル',
                        turnStartValues: {
                            mental: this.mental,
                            voltageLevel: this.getVoltageLevel(),
                            voltagePt: this.voltagePt,
                            turn: this.turn,
                            count: 0
                        }
                    };
                    const conditionInfo = dummyCard.formatCondition.call(dummyCard, effect.condition, this);
                    
                    if (conditionMet) {
                        this.currentTurnLog.push(`<div class="log-condition-success">
                            <span class="condition-text">${conditionInfo.formatted}</span>
                            <span class="condition-arrow">→</span>
                            <span class="condition-result">成立 ✓</span>
                        </div>`);
                    } else {
                        this.currentTurnLog.push(`<div class="log-condition-fail">
                            <span class="condition-text">${conditionInfo.formatted}</span>
                            <span class="condition-arrow">→</span>
                            <span class="condition-result">不成立 ✗</span>
                        </div>`);
                    }
                }
                
                if (conditionMet) {
                    if (effect.then) {
                        for (let i = 0; i < effect.then.length; i++) {
                            const thenPrefix = prefix ? `${prefix}_then` : 'then';
                            this.processCenterSkillEffect(effect.then[i], skillLevel, centerSkillValues, i, thenPrefix);
                        }
                    }
                } else if (effect.else) {
                    for (let i = 0; i < effect.else.length; i++) {
                        const elsePrefix = prefix ? `${prefix}_else` : 'else';
                        this.processCenterSkillEffect(effect.else[i], skillLevel, centerSkillValues, i, elsePrefix);
                    }
                }
                break;
        }
    }
    
    calculateCenterSkillValue(baseValue, skillLevel, isPercentage) {
        const multiplier = SKILL_LEVEL_MULTIPLIERS[skillLevel - 1];
        const calculatedValue = baseValue * multiplier;
        
        if (isPercentage) {
            const rounded = Math.round(calculatedValue * 10000) / 10000;
            return Math.floor(rounded * 10000) / 10000;
        } else {
            return Math.floor(calculatedValue);
        }
    }
    
    evaluateCenterSkillCondition(condition) {
        // Similar to card evaluateCondition but using current game state
        const parts = condition.split(/\s*(<=|>=|<|>|===|==|!=)\s*/);
        if (parts.length !== 3) return false;
        
        const [leftExpr, operator, rightExpr] = parts;
        const leftValue = this.evaluateCenterSkillExpression(leftExpr);
        const rightValue = this.evaluateCenterSkillExpression(rightExpr);
        
        switch (operator) {
            case '<=': return leftValue <= rightValue;
            case '>=': return leftValue >= rightValue;
            case '<': return leftValue < rightValue;
            case '>': return leftValue > rightValue;
            case '===':
            case '==': return leftValue == rightValue;
            case '!=': return leftValue != rightValue;
            default: return false;
        }
    }
    
    evaluateCenterSkillExpression(expr) {
        const trimmed = expr.trim();
        
        // Check for game state properties
        switch (trimmed) {
            case 'mental': return this.mental;
            case 'voltageLevel': return this.getVoltageLevel();
            case 'voltagePt': return this.voltagePt;
            case 'turn': return this.turn;
            default:
                // Try to parse as number
                const num = parseFloat(trimmed);
                return isNaN(num) ? 0 : num;
        }
    }
    
    formatCenterSkillCondition(condition) {
        // Format condition for display (match regular skill formatting)
        let formatted = condition;
        
        // Replace variables with actual values
        const replacements = {
            'mental': this.mental,
            'voltageLevel': this.getVoltageLevel(), 
            'voltagePt': this.voltagePt,
            'turn': this.turn
        };
        
        for (const [key, value] of Object.entries(replacements)) {
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            formatted = formatted.replace(regex, value);
        }
        
        return formatted;
    }
}

// Base Card class
class Card {
    constructor() {
        this.count = 0;
        this.name = "";
    }

    do(game) {
        if (game.verbose) {
            game.log += `done ${this.name}\n`;
        }
        game.turn += 1;
    }
}

// Generic card implementation using JSON data
class GenericCard extends Card {
    constructor(cardKey, cardConfig, skillValues, skillLevel, centerSkillLevel, centerSkillValues) {
        super();
        this.cardKey = cardKey;
        this.name = cardConfig.name.toLowerCase();
        this.displayName = cardConfig.displayName;
        this.config = cardConfig;
        this.skillValues = skillValues || {};
        this.skillLevel = skillLevel || 1;
        this.centerSkillLevel = centerSkillLevel || skillLevel || 1;
        this.centerSkillValues = centerSkillValues || {};
    }

    do(game) {
        // Increment count first for 1-indexed counting in conditions
        this.count += 1;
        
        // Store turn start values for conditional evaluation
        this.turnStartValues = {
            mental: game.mental,
            voltageLevel: game.getVoltageLevel(),
            voltagePt: game.voltagePt,
            turn: game.turn,
            count: this.count
        };
        
        const effects = this.config.effects;
        
        // Process effects array sequentially
        for (let i = 0; i < effects.length; i++) {
            const effect = effects[i];
            
            switch (effect.type) {
                case 'removeAfterUse':
                    const shouldRemove = this.evaluateCondition(effect.condition, game);
                    
                    
                    if (shouldRemove) {
                        // カードを除外リストに追加
                        game.removedCards.add(this.name);
                        
                        if (game.verbose) {
                            game.currentTurnLog.push(`<div class="log-condition-skip">
                                <span class="condition-result">デッキから除外 🚫</span>
                            </div>`);
                        }
                    }
                    break;
                    
                case 'skipTurn':
                    // 後方互換性のため一時的に残す
                    const skipConditionMet = this.evaluateCondition(effect.condition, game);
                    
                    if (skipConditionMet) {
                        // カードを除外リストに追加
                        game.removedCards.add(this.name);
                        
                        if (game.verbose) {
                            game.currentTurnLog.push(`<div class="log-condition-skip">
                                <span class="condition-result">デッキから除外 🚫</span>
                            </div>`);
                        }
                    }
                    break;
                    
                case 'scoreBoost':
                    const scoreBoostValue = this.skillValues[`effect_${i}_value`] !== undefined ? 
                        parseFloat(this.skillValues[`effect_${i}_value`]) : effect.value;
                    game.doScoreBoost(scoreBoostValue);
                    break;
                    
                case 'voltageBoost':
                    const voltageBoostValue = this.skillValues[`effect_${i}_value`] !== undefined ? 
                        parseFloat(this.skillValues[`effect_${i}_value`]) : effect.value;
                    game.doVoltageBoost(voltageBoostValue);
                    break;
                    
                case 'scoreGain':
                    const scoreGainValue = this.skillValues[`effect_${i}_value`] !== undefined ? 
                        parseFloat(this.skillValues[`effect_${i}_value`]) : effect.value;
                    game.getScore(scoreGainValue);
                    break;
                    
                case 'voltageGain':
                    const voltageGainValue = this.skillValues[`effect_${i}_value`] !== undefined ? 
                        parseInt(this.skillValues[`effect_${i}_value`]) : effect.value;
                    game.getVoltage(voltageGainValue);
                    break;
                    
                case 'voltagePenalty':
                    game.voltagePt -= effect.value;
                    if (game.verbose) {
                        game.currentTurnLog.push(`<div class="log-action" style="color: #e74c3c;">ボルテージペナルティ: -${effect.value}</div>`);
                    }
                    break;
                    
                case 'mentalRecover':
                    game.mental += effect.value;
                    if (game.verbose) {
                        game.currentTurnLog.push(`<div class="log-action log-mental">メンタル回復: +${effect.value} → ${game.mental}%</div>`);
                    }
                    break;
                    
                case 'mentalReduction':
                    // Mental reduction - check if it's percentage or fixed value
                    let reduction;
                    let logMessage;
                    if (effect.value >= 1) {
                        // Fixed value reduction
                        reduction = effect.value;
                        logMessage = `メンタル${effect.value}減少`;
                    } else {
                        // Percentage reduction (for backward compatibility)
                        reduction = Math.floor(game.mental * effect.value);
                        logMessage = `メンタル${effect.value * 100}%減少`;
                    }
                    game.mental = Math.max(1, game.mental - reduction);
                    if (game.verbose) {
                        game.currentTurnLog.push(`<div class="log-action log-mental" style="color: #e74c3c;">${logMessage}: -${reduction} → ${game.mental}%</div>`);
                    }
                    break;
                    
                case 'resetCardTurn':
                    game.resetCardRequested = true;
                    if (game.verbose) {
                        game.currentTurnLog.push(`<div class="log-action" style="color: #3498db;">カード順リセット</div>`);
                    }
                    break;
                    
                case 'conditional':
                    const conditionMet = this.evaluateCondition(effect.condition, game);
                    if (game.verbose) {
                        const conditionInfo = this.formatCondition(effect.condition, game);
                        if (conditionMet) {
                            game.currentTurnLog.push(`<div class="log-condition-success">
                                <span class="condition-text">${conditionInfo.formatted}</span>
                                <span class="condition-arrow">→</span>
                                <span class="condition-result">成立 ✓</span>
                            </div>`);
                        } else {
                            game.currentTurnLog.push(`<div class="log-condition-fail">
                                <span class="condition-text">${conditionInfo.formatted}</span>
                                <span class="condition-arrow">→</span>
                                <span class="condition-result">不成立 ✗</span>
                            </div>`);
                        }
                    }
                    if (conditionMet) {
                        // Process "then" effects
                        if (game.verbose) {
                            game.currentTurnLog.push(`<div class="conditional-effects">`);
                        }
                        this.processEffects(effect.then, game, `effect_${i}_then`);
                        if (game.verbose) {
                            game.currentTurnLog.push(`</div>`);
                        }
                    } else if (effect.else) {
                        // Process "else" effects
                        if (game.verbose) {
                            game.currentTurnLog.push(`<div class="conditional-effects">`);
                        }
                        this.processEffects(effect.else, game, `effect_${i}_else`);
                        if (game.verbose) {
                            game.currentTurnLog.push(`</div>`);
                        }
                    }
                    break;
            }
        }
        
        super.do(game);
    }
    
    evaluateCondition(condition, game) {
        // Use turn start values for evaluation
        const values = this.turnStartValues || {
            mental: game.mental,
            voltageLevel: game.getVoltageLevel(),
            voltagePt: game.voltagePt,
            turn: game.turn,
            count: this.count
        };
        
        // First handle ternary operator if present
        if (condition.includes('?')) {
            const ternaryMatch = condition.match(/(.+)\?(.+):(.+)/);
            if (ternaryMatch) {
                const [_, condPart, truePart, falsePart] = ternaryMatch;
                const condResult = this.evaluateCondition(condPart.trim(), game);
                return this.evaluateCondition(condResult ? truePart.trim() : falsePart.trim(), game);
            }
        }
        
        // Replace variables in condition with turn start values
        let evalStr = condition;
        evalStr = evalStr.replace(/count/g, values.count);
        evalStr = evalStr.replace(/skillLevel/g, this.skillLevel);
        
        // Special handling for fantasyGin mental condition
        if (this.cardKey === 'fantasyGin' && condition.includes('mental')) {
            // Get the number of deck resets allowed from skillValues
            const resetCount = this.skillValues && this.skillValues.mentalThreshold ? 
                parseInt(this.skillValues.mentalThreshold) : 999;
            
            // If we haven't exceeded the allowed reset count, allow deck reset
            // If we have exceeded it, prevent deck reset and set mental to 29
            if (values.count <= resetCount) {
                // Use turn start mental value
                evalStr = evalStr.replace(/mental/g, values.mental);
            } else {
                // Set game.mental to 29 and prevent deck reset
                game.mental = 29;
                evalStr = evalStr.replace(/mental/g, '29');
            }
        } else {
            evalStr = evalStr.replace(/mental/g, values.mental);
        }
        
        evalStr = evalStr.replace(/voltageLevel/g, values.voltageLevel);
        evalStr = evalStr.replace(/turn/g, values.turn + 1); // turn is 0-indexed
        
        try {
            return eval(evalStr);
        } catch (e) {
            console.error('Error evaluating condition:', condition, e);
            return false;
        }
    }
    
    formatCondition(condition, game) {
        let formatted = condition;
        
        // Use turn start values for display
        const values = this.turnStartValues || {
            mental: game.mental,
            voltageLevel: game.getVoltageLevel(),
            voltagePt: game.voltagePt,
            turn: game.turn,
            count: this.count
        };
        
        // Replace variables with their turn start values in parentheses
        formatted = formatted.replace(/count/g, `${values.count}`);
        formatted = formatted.replace(/mental/g, `${values.mental}`);
        formatted = formatted.replace(/voltageLevel/g, `${values.voltageLevel}`);
        formatted = formatted.replace(/turn/g, `${values.turn + 1}`);
        
        // Create a description of what's being checked
        let description = '';
        if (condition.includes('count')) {
            if (condition.match(/count\s*>\s*(\d+)/)) {
                const match = condition.match(/count\s*>\s*(\d+)/);
                description = `${this.displayName}の使用回数が${match[1]}回を超えているか`;
                formatted = `使用回数(${this.count}) > ${match[1]}`;
            } else if (condition.match(/count\s*>=\s*(\d+)/)) {
                const match = condition.match(/count\s*>=\s*(\d+)/);
                description = `${this.displayName}の使用回数が${match[1]}回以上か`;
                formatted = `使用回数(${this.count}) ≥ ${match[1]}`;
            } else if (condition.match(/count\s*<=\s*(\d+)/)) {
                const match = condition.match(/count\s*<=\s*(\d+)/);
                description = `${this.displayName}の使用回数が${match[1]}回以下か`;
                formatted = `使用回数(${this.count}) ≤ ${match[1]}`;
            }
        } else if (condition.includes('turn')) {
            if (condition.match(/turn\s*>=\s*(\d+)/)) {
                const match = condition.match(/turn\s*>=\s*(\d+)/);
                description = `${match[1]}ターン目以降か`;
                formatted = `ターン(${values.turn + 1}) ≥ ${match[1]}`;
            }
        } else if (condition.includes('mental')) {
            if (condition.match(/mental\s*>=\s*(\d+)/)) {
                const match = condition.match(/mental\s*>=\s*(\d+)/);
                description = `メンタルが${match[1]}%以上か`;
                formatted = `メンタル(${values.mental}%) ≥ ${match[1]}%`;
            } else if (condition.match(/mental\s*<=\s*(\d+)/)) {
                const match = condition.match(/mental\s*<=\s*(\d+)/);
                description = `メンタルが${match[1]}%以下か`;
                formatted = `メンタル(${values.mental}%) ≤ ${match[1]}%`;
            } else if (condition.match(/mental\s*<\s*(\d+)/)) {
                const match = condition.match(/mental\s*<\s*(\d+)/);
                description = `メンタルが${match[1]}%未満か`;
                formatted = `メンタル(${values.mental}%) < ${match[1]}%`;
            }
        } else if (condition.includes('voltageLevel')) {
            if (condition.match(/voltageLevel\s*>=\s*(\d+)/)) {
                const match = condition.match(/voltageLevel\s*>=\s*(\d+)/);
                description = `ボルテージレベルが${match[1]}以上か`;
                formatted = `ボルテージLv(${values.voltageLevel}) ≥ ${match[1]}`;
            } else if (condition.match(/voltageLevel\s*<=\s*(\d+)/)) {
                const match = condition.match(/voltageLevel\s*<=\s*(\d+)/);
                description = `ボルテージレベルが${match[1]}以下か`;
                formatted = `ボルテージLv(${values.voltageLevel}) ≤ ${match[1]}`;
            }
        }
        
        return { formatted, description };
    }
    
    processEffects(effects, game, prefix) {
        for (let j = 0; j < effects.length; j++) {
            const effect = effects[j];
            const key = `${prefix}_${j}_value`;
            
            switch (effect.type) {
                case 'scoreBoost':
                    const scoreBoostValue = this.skillValues[key] !== undefined ? 
                        parseFloat(this.skillValues[key]) : effect.value;
                    game.doScoreBoost(scoreBoostValue);
                    break;
                    
                case 'voltageBoost':
                    const voltageBoostValue = this.skillValues[key] !== undefined ? 
                        parseFloat(this.skillValues[key]) : effect.value;
                    game.doVoltageBoost(voltageBoostValue);
                    break;
                    
                case 'scoreGain':
                    const scoreGainValue = this.skillValues[key] !== undefined ? 
                        parseFloat(this.skillValues[key]) : effect.value;
                    game.getScore(scoreGainValue);
                    break;
                    
                case 'voltageGain':
                    const voltageGainValue = this.skillValues[key] !== undefined ? 
                        parseInt(this.skillValues[key]) : effect.value;
                    game.getVoltage(voltageGainValue);
                    break;
                    
                case 'voltagePenalty':
                    game.voltagePt -= effect.value;
                    if (game.verbose) {
                        game.currentTurnLog.push(`<div class="log-action" style="color: #e74c3c;">ボルテージペナルティ: -${effect.value}</div>`);
                    }
                    break;
                    
                case 'resetCardTurn':
                    game.resetCardRequested = true;
                    if (game.verbose) {
                        game.currentTurnLog.push(`<div class="log-action" style="color: #3498db;">カード順リセット</div>`);
                    }
                    break;
            }
        }
    }
}

// Card factory
function createCard(cardType, skillValues, skillLevel, centerSkillLevel, centerSkillValues) {
    if (!cardData[cardType]) return null;
    return new GenericCard(cardType, cardData[cardType], skillValues, skillLevel, centerSkillLevel, centerSkillValues);
}

// Toggle music dropdown
function toggleMusicDropdown() {
    const dropdown = document.getElementById('musicDropdown');
    const display = document.querySelector('.music-select-display');
    const searchInput = document.getElementById('musicSearchInput');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        display.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        display.classList.add('active');
        // Clear search and show all items
        if (searchInput) {
            searchInput.value = '';
            filterMusicDropdown();
            // Focus search input
            searchInput.focus();
        }
    }
}

// Filter music dropdown
function filterMusicDropdown() {
    const searchInput = document.getElementById('musicSearchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const items = document.querySelectorAll('.music-dropdown-item');
    let hasVisibleItems = false;
    
    items.forEach(item => {
        const title = item.querySelector('.music-title')?.textContent.toLowerCase() || '';
        const centerName = item.querySelector('.center-name')?.textContent.toLowerCase() || '';
        const customDesc = item.querySelector('.custom-description')?.textContent.toLowerCase() || '';
        
        if (title.includes(searchTerm) || centerName.includes(searchTerm) || customDesc.includes(searchTerm)) {
            item.style.display = '';
            hasVisibleItems = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    let noResultsEl = document.querySelector('.music-no-results');
    if (!hasVisibleItems) {
        if (!noResultsEl) {
            const container = document.querySelector('.music-dropdown-items');
            noResultsEl = document.createElement('div');
            noResultsEl.className = 'music-no-results';
            noResultsEl.textContent = '検索結果がありません';
            container.appendChild(noResultsEl);
        }
        noResultsEl.style.display = 'block';
    } else if (noResultsEl) {
        noResultsEl.style.display = 'none';
    }
}

// Select music function
function selectMusic(value) {
    const musicSelect = document.getElementById('music');
    musicSelect.value = value;
    
    // Update dropdown display
    updateMusicDisplay(value);
    
    // Update visual selection
    document.querySelectorAll('.music-dropdown-item').forEach(item => {
        item.classList.remove('selected');
    });
    document.querySelector(`.music-dropdown-item[data-value="${value}"]`)?.classList.add('selected');
    
    // Close dropdown
    document.getElementById('musicDropdown').classList.remove('show');
    document.querySelector('.music-select-display').classList.remove('active');
    
    toggleMusicInput();
}

// Update music display
function updateMusicDisplay(value) {
    const titleEl = document.querySelector('.music-select-title');
    const infoEl = document.querySelector('.music-select-info');
    
    if (value === 'custom') {
        titleEl.textContent = 'カスタム入力';
        infoEl.textContent = '楽曲データを自由に設定';
    } else if (musicData[value]) {
        const music = musicData[value];
        titleEl.textContent = music.name;
        infoEl.textContent = `${music.phases[0]}-${music.phases[1]}-${music.phases[2]} • ${music.centerCharacter}`;
    } else {
        // Check custom music list
        const customList = getCustomMusicList();
        if (customList[value]) {
            const music = customList[value];
            titleEl.textContent = music.name;
            infoEl.textContent = `${music.phases[0]}-${music.phases[1]}-${music.phases[2]}${music.centerCharacter ? ' • ' + music.centerCharacter : ''}`;
        }
    }
}

// Rebuild music dropdown with custom songs
function rebuildMusicDropdown() {
    const dropdownItems = document.querySelector('.music-dropdown-items');
    if (!dropdownItems) return;
    
    // Clear existing items except the search container
    const existingItems = dropdownItems.querySelectorAll('.music-dropdown-item');
    existingItems.forEach(item => item.remove());
    
    // Add all music options (including custom ones already in musicData)
    for (const [key, music] of Object.entries(musicData)) {
        const item = createMusicDropdownItem(key, music);
        dropdownItems.appendChild(item);
    }
    
    // Add custom input option
    const customItem = document.createElement('div');
    customItem.className = 'music-dropdown-item custom-item';
    customItem.setAttribute('data-value', 'custom');
    customItem.setAttribute('onclick', "selectMusic('custom')");
    customItem.innerHTML = `
        <div class="music-item-main">
            <span class="music-title">カスタム入力</span>
            <span class="custom-icon">✏️</span>
        </div>
        <div class="music-item-sub">
            <span class="custom-description">楽曲データを自由に設定</span>
        </div>
    `;
    dropdownItems.appendChild(customItem);
    
    // Update current selection
    const currentValue = document.getElementById('music').value;
    const currentItem = dropdownItems.querySelector(`[data-value="${currentValue}"]`);
    if (currentItem) {
        currentItem.classList.add('selected');
    }
}

// Create music dropdown item
function createMusicDropdownItem(key, music) {
    const item = document.createElement('div');
    item.className = 'music-dropdown-item';
    item.setAttribute('data-value', key);
    item.setAttribute('onclick', `selectMusic('${key}')`);
    
    const centerName = music.centerCharacter || '';
    item.innerHTML = `
        <div class="music-item-main">
            <span class="music-title">${music.name}</span>
            <div class="music-phases">
                <span class="phase-tag">${music.phases[0]}</span>
                <span class="phase-arrow">→</span>
                <span class="phase-tag fever">${music.phases[1]}</span>
                <span class="phase-arrow">→</span>
                <span class="phase-tag">${music.phases[2]}</span>
            </div>
        </div>
        <div class="music-item-sub">
            <span class="center-label">センター:</span>
            <span class="center-name">${centerName}</span>
        </div>
    `;
    
    return item;
}

// Toggle music input
function toggleMusicInput() {
    const musicSelect = document.getElementById('music');
    const customMusic = document.getElementById('customMusic');
    
    // Get previous music value to save its state
    const previousMusic = musicSelect.getAttribute('data-previous-value') || 'ai_scream';
    
    // Save current state for the previous song
    if (previousMusic !== 'custom' && previousMusic !== musicSelect.value) {
        const tempMusicValue = musicSelect.value;
        musicSelect.value = previousMusic;
        saveCurrentState();
        musicSelect.value = tempMusicValue;
    }
    
    // If switching to custom, store the previous song's phase values and center
    if (musicSelect.value === 'custom' && previousMusic !== 'custom') {
        let previousPhases;
        let previousCenter;
        if (musicData[previousMusic]) {
            previousPhases = musicData[previousMusic].phases;
            previousCenter = musicData[previousMusic].centerCharacter;
        } else {
            // Check custom music list
            const customList = getCustomMusicList();
            if (customList[previousMusic]) {
                previousPhases = customList[previousMusic].phases;
                previousCenter = customList[previousMusic].centerCharacter;
            }
        }
        
        if (previousPhases) {
            document.getElementById('beforeFever').value = previousPhases[0];
            document.getElementById('duringFever').value = previousPhases[1];
            document.getElementById('afterFever').value = previousPhases[2];
        }
        
        // Set center character
        const centerSelect = document.getElementById('customCenterCharacter');
        if (centerSelect && previousCenter) {
            centerSelect.value = previousCenter;
        }
    }
    
    // Update previous value
    musicSelect.setAttribute('data-previous-value', musicSelect.value);
    
    if (musicSelect.value === 'custom') {
        customMusic.style.display = 'block';
        updateSavedCustomMusicDisplay();
    } else {
        customMusic.style.display = 'none';
        
        // Load state for the selected song (共有モードではスキップ)
        if (!isShareMode) {
            setTimeout(() => {
                loadStateForSong(musicSelect.value);
                // Update center character highlighting after loading state
                updateCenterCharacterHighlight();
            }, 50);
        } else {
            // 共有モードでもセンターキャラクターのハイライトは更新
            setTimeout(() => {
                updateCenterCharacterHighlight();
            }, 50);
        }
    }
}

// Calculate function
function calculate() {
    // Check for duplicate characters first
    const duplicateSlots = checkDuplicateCharacters();
    if (duplicateSlots.size > 0) {
        alert('同じキャラクターのカードが複数選択されています。\nキャラクターの重複を解消してから計算してください。');
        return;
    }
    
    const appeal = parseInt(document.getElementById('appeal').value) || 0;
    const initialMental = parseInt(document.getElementById('mental').value);
    const learningCorrection = parseFloat(document.getElementById('learningCorrection').value);
    const musicKey = document.getElementById('music').value;
    let music;
    let centerCharacter = null;
    
    if (musicKey === 'custom') {
        music = [
            parseInt(document.getElementById('beforeFever').value),
            parseInt(document.getElementById('duringFever').value),
            parseInt(document.getElementById('afterFever').value)
        ];
        centerCharacter = document.getElementById('customCenterCharacter').value || null;
    } else if (musicData[musicKey]) {
        music = musicData[musicKey].phases;
        centerCharacter = musicData[musicKey].centerCharacter || null;
    } else {
        // Check custom music list
        const customList = getCustomMusicList();
        if (customList[musicKey]) {
            music = customList[musicKey].phases;
            centerCharacter = customList[musicKey].centerCharacter || null;
        } else {
            alert('楽曲が見つかりません。');
            return;
        }
    }
    
    const cards = [];
    for (let i = 1; i <= 6; i++) {
        const cardType = document.getElementById(`card${i}`).value;
        if (cardType) {
            const skillLevel = parseInt(document.getElementById(`skill${i}`).value);
            const userModifiedValues = getSkillValues(i);
            const calculatedValues = getCalculatedSkillValues(cardType, skillLevel);
            
            // Merge user modifications with calculated values
            const finalValues = { ...calculatedValues, ...userModifiedValues };
            
            // Check if this is the center character and get center skill level and values
            let centerSkillLevel = skillLevel;
            let centerSkillValues = {};
            if (cardData[cardType] && cardData[cardType].character === centerCharacter) {
                const centerSkillSelect = document.getElementById(`centerSkillLevel${i}`);
                if (centerSkillSelect) {
                    centerSkillLevel = parseInt(centerSkillSelect.value) || skillLevel;
                }
                centerSkillValues = getCenterSkillValues(i);
            }
            
            cards.push(createCard(cardType, finalValues, skillLevel, centerSkillLevel, centerSkillValues));
        }
    }
    
    if (cards.length === 0) {
        alert('少なくとも1枚のカードを選択してください。');
        return;
    }
    
    const game = new Game(cards, appeal, music, true, centerCharacter, learningCorrection);
    game.mental = initialMental; // Set initial mental value
    game.doGame();
    
    document.getElementById('score').textContent = game.score.toLocaleString();
    document.getElementById('result').style.display = 'block';
    
    // Use HTML log if available, otherwise fall back to text log
    const logElement = document.getElementById('turnLog');
    if (game.logHtml) {
        logElement.innerHTML = game.logHtml;
    } else {
        logElement.textContent = game.log;
    }
}

// Toggle log display
function toggleLog() {
    const log = document.getElementById('turnLog');
    if (log.style.display === 'none' || log.style.display === '') {
        log.style.display = 'block';
        document.querySelector('.toggle-log').textContent = '詳細ログを隠す';
    } else {
        log.style.display = 'none';
        document.querySelector('.toggle-log').textContent = '詳細ログを表示';
    }
}

// Load card data from global variable
function loadCardData() {
    try {
        // Use data from cardData.js
        cardData = gameData.cards;
        musicData = gameData.music;
        
        // Load custom music from localStorage
        const customList = getCustomMusicList();
        for (const [key, music] of Object.entries(customList)) {
            musicData[key] = music;
        }
        
        // Populate card dropdowns
        populateCardDropdowns();
        
        // Populate music dropdown
        populateMusicDropdown();
        
        // Set default selections
        setDefaultSelections();
    } catch (error) {
        console.error('Failed to load card data:', error);
        alert('カードデータの読み込みに失敗しました。');
    }
}

function populateCardDropdowns() {
    for (let i = 1; i <= 6; i++) {
        const select = document.getElementById(`card${i}`);
        select.innerHTML = '<option value="">未選択</option>';
        
        for (const [key, card] of Object.entries(cardData)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = card.displayName;
            select.appendChild(option);
        }
    }
}

function populateMusicDropdown() {
    updateMusicDropdown();
}

function setDefaultSelections() {
    document.getElementById('card1').value = 'sachi';
    document.getElementById('card2').value = 'bdMegu';
    document.getElementById('card3').value = 'gingaKozu';
    document.getElementById('card4').value = 'iDoMeSayaka';
    document.getElementById('card5').value = 'iDoMeKaho';
    document.getElementById('card6').value = 'butoRuri';
    
    // Trigger card change events to show skill options and update search inputs
    for (let i = 1; i <= 6; i++) {
        onCardChange(i);
        // Update search input to show selected card name
        const searchInput = document.getElementById(`cardSearch${i}`);
        const selectElement = document.getElementById(`card${i}`);
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        if (selectedOption && selectedOption.value) {
            searchInput.value = selectedOption.textContent;
        }
    }
    
    // Update center character highlighting for default selection
    updateCenterCharacterHighlight();
    
    // Check for duplicate characters in default selection
    updateDuplicateCharacterHighlight();
}

// Check for duplicate characters and return list of slot numbers with duplicates
function checkDuplicateCharacters() {
    const characterSlots = {};
    const duplicateSlots = new Set();
    
    // Build a map of character to slot numbers
    for (let i = 1; i <= 6; i++) {
        const cardValue = document.getElementById(`card${i}`).value;
        if (cardValue && cardData[cardValue]) {
            const character = cardData[cardValue].character;
            if (!characterSlots[character]) {
                characterSlots[character] = [];
            }
            characterSlots[character].push(i);
        }
    }
    
    // Find slots with duplicate characters
    for (const slots of Object.values(characterSlots)) {
        if (slots.length > 1) {
            slots.forEach(slot => duplicateSlots.add(slot));
        }
    }
    
    return duplicateSlots;
}

// Update visual feedback for duplicate characters
function updateDuplicateCharacterHighlight() {
    const duplicateSlots = checkDuplicateCharacters();
    
    // Reset all slots
    for (let i = 1; i <= 6; i++) {
        const slot = document.querySelector(`.card-slot[data-slot="${i}"]`);
        if (slot) {
            slot.classList.remove('duplicate-character');
        }
    }
    
    // Highlight duplicate slots
    duplicateSlots.forEach(slotNum => {
        const slot = document.querySelector(`.card-slot[data-slot="${slotNum}"]`);
        if (slot) {
            slot.classList.add('duplicate-character');
        }
    });
}

// Wrapper function to update card highlighting when center character changes
function updateCardHighlighting() {
    updateCenterCharacterHighlight();
    updateDuplicateCharacterHighlight();
}

// Update center character highlighting and display center skills
function updateCenterCharacterHighlight() {
    const musicSelect = document.getElementById('music');
    let centerCharacter = null;
    
    // Get center character for current music
    if (musicSelect.value === 'custom') {
        // For custom music, check the customCenterCharacter select
        centerCharacter = document.getElementById('customCenterCharacter').value || null;
    } else if (musicData[musicSelect.value]) {
        centerCharacter = musicData[musicSelect.value].centerCharacter;
    } else {
        const customList = getCustomMusicList();
        if (customList[musicSelect.value]) {
            centerCharacter = customList[musicSelect.value].centerCharacter;
        }
    }
    
    // Update highlighting for all slots
    for (let i = 1; i <= 6; i++) {
        const slot = document.querySelector(`.card-slot[data-slot="${i}"]`);
        const cardValue = document.getElementById(`card${i}`).value;
        
        // Remove existing center skill info
        const existingInfo = slot.querySelector('.center-skill-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        // Check if this card matches center character
        if (centerCharacter && cardValue && cardData[cardValue] && 
            cardData[cardValue].character === centerCharacter) {
            slot.classList.add('center-character');
            
            // Always add center skill level selection for center characters
            const infoDiv = document.createElement('div');
            infoDiv.className = 'center-skill-info';
            
            // Add center skill level selector (共有モードでは既に設定されている値を使用)
            const savedLevel = !isShareMode ? loadCardCenterSkillLevel(cardValue) : 14;
            let centerSkillHtml = `
                <div class="skill-param-row" style="align-items: flex-start; margin-bottom: 10px;">
                    <span style="display: inline-flex; align-items: center; gap: 8px;">
                        <span style="color: #ff9800; font-weight: bold; font-size: 13px;">センタースキル</span>
                        <select id="centerSkillLevel${i}" class="skill-level-select" onchange="onCenterSkillLevelChange(${i})">
            `;
            
            for (let level = 14; level >= 1; level--) {
                const selected = level === savedLevel ? 'selected' : '';
                centerSkillHtml += `<option value="${level}" ${selected}>Lv.${level}</option>`;
            }
            
            centerSkillHtml += `</select></span></div>`;
            
            // Add center skill parameters if card has center skill
            if (cardData[cardValue].centerSkill) {
                const centerSkill = cardData[cardValue].centerSkill;
                // Use saved center skill level (共有モードでは既存の値を使用)
                const savedCenterSkillLevel = !isShareMode ? loadCardCenterSkillLevel(cardValue) : 
                    parseInt(document.getElementById(`centerSkillLevel${i}`)?.value) || 14;
                
                // Add timing display
                let timingText = '';
                switch (centerSkill.timing) {
                    case 'beforeFirstTurn':
                        timingText = 'ライブ開始時';
                        break;
                    case 'beforeFeverStart':
                        timingText = 'FEVER開始時';
                        break;
                    case 'afterLastTurn':
                        timingText = 'ライブ終了時';
                        break;
                }
                
                centerSkillHtml += `<div style="color: #ff9800; font-weight: bold; font-size: 14px; margin: 5px 0;">⚡ ${timingText}</div>`;
                
                // Generate center skill parameters similar to regular skills
                let hasParams = false;
                for (let j = 0; j < centerSkill.effects.length; j++) {
                    const effect = centerSkill.effects[j];
                    const effectHtml = generateCenterSkillEffectInputs(effect, i, j, '', savedCenterSkillLevel);
                    if (effectHtml) {
                        centerSkillHtml += effectHtml;
                        hasParams = true;
                    }
                }
                
                if (!hasParams) {
                    centerSkillHtml += '<div style="color: #666; font-size: 14px;">このセンタースキルには調整可能なパラメータがありません</div>';
                }
            } else {
                centerSkillHtml += `
                    <div style="color: #999; font-size: 14px;">
                        このカードはスコアに影響するセンタースキルを持っていません
                    </div>
                `;
            }
            
            infoDiv.innerHTML = centerSkillHtml;
            
            // Insert after skill params
            const skillParams = document.getElementById(`skillParams${i}`);
            skillParams.parentNode.insertBefore(infoDiv, skillParams.nextSibling);
        } else {
            slot.classList.remove('center-character');
        }
    }
}

// Handle card selection change
function onCardChange(slotNum) {
    const cardSelect = document.getElementById(`card${slotNum}`);
    const skillSelect = document.getElementById(`skill${slotNum}`);
    const skillParams = document.getElementById(`skillParams${slotNum}`);
    
    if (cardSelect.value) {
        skillSelect.style.display = 'inline-block';
        generateSkillParams(slotNum, cardSelect.value);
        skillParams.style.display = 'block';
        
        // Load saved skill level for this card (共有モードでは既に設定されている値を使用)
        if (!isShareMode) {
            const savedSkillLevel = loadCardSkillLevel(cardSelect.value);
            skillSelect.value = savedSkillLevel;
        }
        
        // Update skill level options to show which have unknown values
        updateSkillLevelOptions(slotNum);
        
        // Load default values for current skill level
        onSkillLevelChange(slotNum);
    } else {
        skillSelect.style.display = 'none';
        skillParams.style.display = 'none';
    }
    
    // Update center character highlighting first
    updateCenterCharacterHighlight();
    
    // Then check for duplicate characters (needs to know center character)
    updateDuplicateCharacterHighlight();
}

// Update skill level dropdown to show unknown values
function updateSkillLevelOptions(slotNum) {
    const skillSelect = document.getElementById(`skill${slotNum}`);
    
    // Since we're calculating values now, all levels are known
    for (let level = 1; level <= 14; level++) {
        const option = skillSelect.querySelector(`option[value="${level}"]`);
        if (option) {
            option.textContent = `Lv.${level}`;
            option.style.color = '';
        }
    }
}

// Handle skill level change
function onSkillLevelChange(slotNum) {
    const cardSelect = document.getElementById(`card${slotNum}`);
    const skillSelect = document.getElementById(`skill${slotNum}`);
    const cardType = cardSelect.value;
    const skillLevel = parseInt(skillSelect.value);
    
    if (!cardType || !cardData[cardType]) return;
    
    // Save skill level for this card (only in non-share mode)
    if (!isShareMode) {
        saveCardSkillLevel(cardType, skillLevel);
    }
    
    // Calculate values for this skill level
    const calculatedValues = getCalculatedSkillValues(cardType, skillLevel);
    
    // Update all input values for this skill level
    for (const [key, value] of Object.entries(calculatedValues)) {
        const inputId = `skill${slotNum}_${key}`;
        const input = document.getElementById(inputId);
        if (input) {
            input.value = value;
            input.style.backgroundColor = '';
            input.placeholder = '';
        }
    }
    
    // beProudKozuの場合、removeAfterUseの説明文を更新
    if (cardType === 'beProudKozu') {
        const skillParamsDiv = document.getElementById(`skillParams${slotNum}`);
        if (skillParamsDiv) {
            const spans = skillParamsDiv.querySelectorAll('span');
            for (const span of spans) {
                if (span.textContent.includes('回使用後はデッキから除外')) {
                    if (skillLevel >= 12) {
                        span.textContent = '10回使用後はデッキから除外';
                    } else {
                        span.textContent = '6回使用後はデッキから除外';
                    }
                    break;
                }
            }
        }
    }
    
    // Update center skill display when skill level changes
    updateCenterCharacterHighlight();
}

// Generate skill parameter inputs
function generateSkillParams(slotNum, cardType, skillLevel = null) {
    const skillParams = document.getElementById(`skillParams${slotNum}`);
    const card = cardData[cardType];
    if (!card) return;
    
    // Get skill level if not provided
    if (skillLevel === null) {
        const skillSelect = document.getElementById(`skill${slotNum}`);
        skillLevel = parseInt(skillSelect?.value) || (!isShareMode ? loadCardSkillLevel(cardType) : 14);
    }
    
    let html = '';
    const effects = card.effects;
    let hasParams = false;
    
    // Process effects array
    for (let i = 0; i < effects.length; i++) {
        const effect = effects[i];
        const effectHtml = generateEffectInputs(effect, slotNum, i, '', skillLevel);
        if (effectHtml) {
            html += effectHtml;
            hasParams = true;
        }
    }
    
    // Add special input for fantasyGin card
    if (cardType === 'fantasyGin') {
        html += `<div class="skill-param-row">
            <label>何回デッキリセット？:</label>
            <input type="number" id="skill${slotNum}_mentalThreshold" value="999" min="0" step="1">
            <div style="color: #666; font-size: 12px; margin-top: 5px;">デッキリセットする回数を指定（0=リセットなし、999=常にリセット）</div>
        </div>`;
        hasParams = true;
    }
    
    // Hide params div if no parameters
    if (!hasParams) {
        skillParams.style.display = 'none';
        html = '<div style="color: #666; font-size: 14px;">このカードには調整可能なパラメータがありません</div>';
    } else {
        // Don't add any help text
    }
    
    skillParams.innerHTML = html;
}

// Generate input fields for center skill effects
function generateCenterSkillEffectInputs(effect, slotNum, effectIndex, prefix, skillLevel = 14) {
    let html = '';
    const inputId = prefix ? `centerSkill${slotNum}_${prefix}_${effectIndex}_value` : `centerSkill${slotNum}_effect_${effectIndex}_value`;
    
    switch (effect.type) {
        case 'scoreGain':
            if (effect.value !== undefined) {
                const calculatedValue = calculateSkillValue(effect.value, skillLevel, true);
                html += `<div class="skill-param-row">
                    <label>スコア獲得倍率:</label>
                    <input type="number" id="${inputId}" value="${calculatedValue}" step="0.001" style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px;">
                </div>`;
            }
            break;
        case 'scoreBoost':
            if (effect.value !== undefined) {
                const calculatedValue = calculateSkillValue(effect.value, skillLevel, true);
                html += `<div class="skill-param-row">
                    <label>スコアブースト:</label>
                    <input type="number" id="${inputId}" value="${calculatedValue}" step="0.001" style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px;">
                </div>`;
            }
            break;
        case 'voltageGain':
            if (effect.value !== undefined) {
                const calculatedValue = calculateSkillValue(effect.value, skillLevel, false);
                html += `<div class="skill-param-row">
                    <label>ボルテージ獲得:</label>
                    <input type="number" id="${inputId}" value="${Math.floor(calculatedValue)}" step="1" style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px;">
                </div>`;
            }
            break;
        case 'voltageBoost':
            if (effect.value !== undefined) {
                const calculatedValue = calculateSkillValue(effect.value, skillLevel, true);
                html += `<div class="skill-param-row">
                    <label>ボルテージブースト:</label>
                    <input type="number" id="${inputId}" value="${calculatedValue}" step="0.001" style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px;">
                </div>`;
            }
            break;
        case 'voltagePenalty':
            if (effect.value !== undefined) {
                html += `<div class="skill-param-row">
                    <label>ボルテージ減少:</label>
                    <span style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px; background-color: #ffebee; color: #c62828; display: inline-block; box-sizing: border-box; height: 32px; line-height: 20px;">-${effect.value}</span>
                </div>`;
            }
            break;
        case 'mentalReduction':
            if (effect.value !== undefined) {
                html += `<div class="skill-param-row">
                    <label>${effect.description || 'メンタル減少'}:</label>
                    <span style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px; background-color: #ffebee; color: #c62828; display: inline-block; box-sizing: border-box; height: 32px; line-height: 20px;">${effect.value}%</span>
                </div>`;
            }
            break;
        case 'appealBoost':
            if (effect.value !== undefined) {
                const calculatedValue = calculateSkillValue(effect.value, skillLevel, true);
                html += `<div class="skill-param-row">
                    <label>アピール値上昇:</label>
                    <input type="number" id="${inputId}" value="${calculatedValue}" step="0.001" style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px;">
                </div>`;
            }
            break;
        case 'removeAfterUse':
        case 'skipTurn': // 後方互換性のため残す
            // スキルレベルに応じて説明文を動的に生成
            let removeDescription = effect.description || 'デッキから除外';
            if (cardKey === 'beProudKozu' && effect.condition && effect.condition.includes('skillLevel')) {
                const skillLevel = parseInt(document.getElementById(`${cardKey}_skillLevel`).value) || 10;
                if (skillLevel >= 12) {
                    removeDescription = '10回使用後はデッキから除外';
                } else {
                    removeDescription = '6回使用後はデッキから除外';
                }
            }
            html += `<div class="skill-param-row">
                <label>効果:</label>
                <span style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px; background-color: #f5f5f5; color: #666; display: inline-block; box-sizing: border-box; height: 32px; line-height: 20px;">${removeDescription}</span>
            </div>`;
            break;
        case 'resetCardTurn':
            html += `<div class="skill-param-row">
                <label>効果:</label>
                <span style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px; background-color: #e3f2fd; color: #1565c0; display: inline-block; box-sizing: border-box; height: 32px; line-height: 20px;">${effect.description || '山札リセット'}</span>
            </div>`;
            break;
        case 'conditional':
            if (effect.then || effect.else) {
                html += `<div style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">${formatConditionForDisplay(effect.condition)}</div>`;
                
                if (effect.then) {
                    html += '<div>';
                    html += '<div style="font-weight: bold; color: #2196F3; margin-top: 5px;">▶ 成立時</div>';
                    for (let i = 0; i < effect.then.length; i++) {
                        const thenEffect = effect.then[i];
                        const thenPrefix = prefix ? `${prefix}_then` : 'then';
                        html += generateCenterSkillEffectInputs(thenEffect, slotNum, i, thenPrefix, skillLevel);
                    }
                    html += '</div>';
                }
                
                if (effect.else && effect.else.length > 0) {
                    html += '<div>';
                    html += '<div style="font-weight: bold; color: #f44336; margin-top: 5px;">▶ 不成立時</div>';
                    for (let i = 0; i < effect.else.length; i++) {
                        const elseEffect = effect.else[i];
                        const elsePrefix = prefix ? `${prefix}_else` : 'else';
                        html += generateCenterSkillEffectInputs(elseEffect, slotNum, i, elsePrefix, skillLevel);
                    }
                    html += '</div>';
                }
                
                html += '</div>';
            }
            break;
    }
    
    return html;
}

// Generate input fields for effects
function generateEffectInputs(effect, slotNum, effectIndex, prefix, skillLevel = 14) {
    let html = '';
    const inputId = prefix ? `skill${slotNum}_${prefix}_${effectIndex}_value` : `skill${slotNum}_effect_${effectIndex}_value`;
    
    switch (effect.type) {
        case 'scoreBoost':
            if (effect.value !== undefined) {
                const calculatedValue = calculateSkillValue(effect.value, skillLevel, true);
                html += `<div class="skill-param-row">
                    <label>スコアブースト:</label>
                    <input type="number" id="${inputId}" value="${calculatedValue}" step="0.001" style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px;">
                </div>`;
            }
            break;
            
        case 'voltageBoost':
            if (effect.value !== undefined) {
                const calculatedValue = calculateSkillValue(effect.value, skillLevel, true);
                html += `<div class="skill-param-row">
                    <label>ボルテージブースト:</label>
                    <input type="number" id="${inputId}" value="${calculatedValue}" step="0.001" style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px;">
                </div>`;
            }
            break;
            
        case 'scoreGain':
            if (effect.value !== undefined) {
                const calculatedValue = calculateSkillValue(effect.value, skillLevel, true);
                html += `<div class="skill-param-row">
                    <label>スコア獲得倍率:</label>
                    <input type="number" id="${inputId}" value="${calculatedValue}" step="0.01" style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px;">
                </div>`;
            }
            break;
            
        case 'voltageGain':
            if (effect.value !== undefined) {
                const calculatedValue = calculateSkillValue(effect.value, skillLevel, false);
                html += `<div class="skill-param-row">
                    <label>ボルテージ獲得:</label>
                    <input type="number" id="${inputId}" value="${Math.floor(calculatedValue)}" step="1" style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px;">
                </div>`;
            }
            break;
            
        case 'mentalRecover':
            if (effect.value !== undefined) {
                html += `<div class="skill-param-row">
                    <label>メンタル回復:</label>
                    <span style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px; background-color: #e8f5e9; color: #2e7d32; display: inline-block; box-sizing: border-box; height: 32px; line-height: 20px;">+${effect.value}</span>
                </div>`;
            }
            break;
            
        case 'mentalReduction':
            if (effect.value !== undefined) {
                html += `<div class="skill-param-row">
                    <label>メンタル減少:</label>
                    <span style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px; background-color: #ffebee; color: #c62828; display: inline-block; box-sizing: border-box; height: 32px; line-height: 20px;">-${effect.value}</span>
                </div>`;
            }
            break;
            
        case 'voltagePenalty':
            if (effect.value !== undefined) {
                html += `<div class="skill-param-row">
                    <label>ボルテージ減少:</label>
                    <span style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px; background-color: #ffebee; color: #c62828; display: inline-block; box-sizing: border-box; height: 32px; line-height: 20px;">-${effect.value}</span>
                </div>`;
            }
            break;
            
        case 'removeAfterUse':
        case 'skipTurn': // 後方互換性のため残す
            html += `<div class="skill-param-row">
                <label>効果:</label>
                <span style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px; background-color: #f5f5f5; color: #666; display: inline-block; box-sizing: border-box; height: 32px; line-height: 20px;">${effect.description || 'ターンスキップ'}</span>
            </div>`;
            break;
            
        case 'resetCardTurn':
            html += `<div class="skill-param-row">
                <label>効果:</label>
                <span style="flex: 1; min-width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 14px; background-color: #e3f2fd; color: #1565c0; display: inline-block; box-sizing: border-box; height: 32px; line-height: 20px;">${effect.description || '山札リセット'}</span>
            </div>`;
            break;
            
        case 'conditional':
            if (effect.then || effect.else) {
                html += `<div style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">${formatConditionForDisplay(effect.condition)}</div>`;
                
                if (effect.then) {
                    html += '<div>';
                    html += '<div style="font-weight: bold; color: #2196F3;">▶ 成立時</div>';
                    for (let j = 0; j < effect.then.length; j++) {
                        html += generateEffectInputs(effect.then[j], slotNum, j, `effect_${effectIndex}_then`, skillLevel);
                    }
                    html += '</div>';
                }
                
                if (effect.else && effect.else.length > 0) {
                    html += '<div style="margin-top: 5px;">';
                    html += '<div style="font-weight: bold; color: #f44336;">▶ 不成立時</div>';
                    for (let j = 0; j < effect.else.length; j++) {
                        html += generateEffectInputs(effect.else[j], slotNum, j, `effect_${effectIndex}_else`, skillLevel);
                    }
                    html += '</div>';
                }
                
                html += '</div>';
            }
            break;
    }
    
    return html;
}

// Get skill values from inputs
function getSkillValues(slotNum) {
    const values = {};
    const inputs = document.querySelectorAll(`#skillParams${slotNum} input`);
    
    inputs.forEach(input => {
        const id = input.id;
        const key = id.replace(`skill${slotNum}_`, '');
        values[key] = input.value;
    });
    
    return values;
}

// Get center skill values from input fields
function getCenterSkillValues(slotNum) {
    const values = {};
    const inputs = document.querySelectorAll(`.card-slot[data-slot="${slotNum}"] .center-skill-info input[type="number"]`);
    
    inputs.forEach(input => {
        const id = input.id;
        const key = id.replace(`centerSkill${slotNum}_`, '');
        values[key] = input.value;
    });
    
    return values;
}

// Format condition for user-friendly display
function formatConditionForDisplay(condition) {
    let formatted = condition;
    
    // Match patterns and format like log entries
    if (formatted.match(/count\s*>\s*(\d+)/)) {
        const match = formatted.match(/count\s*>\s*(\d+)/);
        formatted = `使用回数 > ${match[1]}`;
    } else if (formatted.match(/count\s*>=\s*(\d+)/)) {
        const match = formatted.match(/count\s*>=\s*(\d+)/);
        formatted = `使用回数 ≥ ${match[1]}`;
    } else if (formatted.match(/count\s*<=\s*(\d+)/)) {
        const match = formatted.match(/count\s*<=\s*(\d+)/);
        formatted = `使用回数 ≤ ${match[1]}`;
    } else if (formatted.match(/count\s*<\s*(\d+)/)) {
        const match = formatted.match(/count\s*<\s*(\d+)/);
        formatted = `使用回数 < ${match[1]}`;
    } else if (formatted.match(/turn\s*>=\s*(\d+)/)) {
        const match = formatted.match(/turn\s*>=\s*(\d+)/);
        formatted = `ターン ≥ ${match[1]}`;
    } else if (formatted.match(/turn\s*>\s*(\d+)/)) {
        const match = formatted.match(/turn\s*>\s*(\d+)/);
        formatted = `ターン > ${match[1]}`;
    } else if (formatted.match(/mental\s*>=\s*(\d+)/)) {
        const match = formatted.match(/mental\s*>=\s*(\d+)/);
        formatted = `メンタル ≥ ${match[1]}%`;
    } else if (formatted.match(/mental\s*<=\s*(\d+)/)) {
        const match = formatted.match(/mental\s*<=\s*(\d+)/);
        formatted = `メンタル ≤ ${match[1]}%`;
    } else if (formatted.match(/mental\s*<\s*(\d+)/)) {
        const match = formatted.match(/mental\s*<\s*(\d+)/);
        formatted = `メンタル < ${match[1]}%`;
    } else if (formatted.match(/voltageLevel\s*>=\s*(\d+)/)) {
        const match = formatted.match(/voltageLevel\s*>=\s*(\d+)/);
        formatted = `ボルテージLv ≥ ${match[1]}`;
    } else if (formatted.match(/voltageLevel\s*<=\s*(\d+)/)) {
        const match = formatted.match(/voltageLevel\s*<=\s*(\d+)/);
        formatted = `ボルテージLv ≤ ${match[1]}`;
    }
    
    return formatted;
}

// Calculate skill value based on level and base value
// Now using Lv.10 value as base: actualValue = (lv10Value / 2) * multiplier
function calculateSkillValue(lv10Value, skillLevel, isPercentage = true) {
    // Now we receive Lv.10 values directly from cardData.js
    // Apply the multiplier from Lv.10
    const multiplier = SKILL_LEVEL_MULTIPLIERS[skillLevel - 1];
    const calculatedValue = (lv10Value / 2) * multiplier;
    
    if (isPercentage) {
        // Round to avoid floating point errors, then truncate to 4 decimal places
        const rounded = Math.round(calculatedValue * 10000) / 10000;
        return Math.floor(rounded * 10000) / 10000;
    } else {
        // For voltage points, truncate to integer
        return Math.floor(calculatedValue);
    }
}

// Get skill values for a card at a specific level
function getCalculatedSkillValues(cardType, skillLevel) {
    const card = cardData[cardType];
    if (!card || !card.effects) return {};
    
    const values = {};
    
    // Process effects array
    for (let i = 0; i < card.effects.length; i++) {
        const effect = card.effects[i];
        processEffectForSkillLevel(effect, `effect_${i}`, values, skillLevel, cardType);
    }
    
    return values;
}

// Process effect to calculate skill values
function processEffectForSkillLevel(effect, prefix, values, skillLevel, cardType) {
    switch (effect.type) {
        case 'scoreBoost':
        case 'voltageBoost':
            if (effect.value !== undefined) {
                // effect.value is now the Lv.1 value
                values[`${prefix}_value`] = calculateSkillValue(effect.value, skillLevel, true);
            }
            break;
            
        case 'scoreGain':
            if (effect.value !== undefined) {
                values[`${prefix}_value`] = calculateSkillValue(effect.value, skillLevel, true);
            }
            break;
            
        case 'voltageGain':
            if (effect.value !== undefined) {
                values[`${prefix}_value`] = calculateSkillValue(effect.value, skillLevel, false);
            }
            break;
            
        case 'conditional':
            if (effect.then) {
                for (let j = 0; j < effect.then.length; j++) {
                    processEffectForSkillLevel(effect.then[j], `${prefix}_then_${j}`, values, skillLevel, cardType);
                }
            }
            if (effect.else) {
                for (let j = 0; j < effect.else.length; j++) {
                    processEffectForSkillLevel(effect.else[j], `${prefix}_else_${j}`, values, skillLevel, cardType);
                }
            }
            break;
    }
}

// Setup searchable select functionality
function setupSearchableSelect(slotNum) {
    const searchInput = document.getElementById(`cardSearch${slotNum}`);
    const selectElement = document.getElementById(`card${slotNum}`);
    const wrapper = searchInput.parentElement;
    let isComposing = false;
    
    // Create custom dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'card-dropdown';
    wrapper.appendChild(dropdown);
    
    // Create options in dropdown
    function createDropdownOptions() {
        dropdown.innerHTML = '';
        for (let i = 0; i < selectElement.options.length; i++) {
            const option = selectElement.options[i];
            const div = document.createElement('div');
            div.className = 'card-option';
            div.textContent = option.textContent;
            div.dataset.value = option.value;
            div.dataset.index = i;
            
            if (option.value === selectElement.value) {
                div.classList.add('selected');
            }
            
            div.addEventListener('click', function() {
                selectElement.value = this.dataset.value;
                selectElement.dispatchEvent(new Event('change'));
                wrapper.classList.remove('active');
            });
            
            dropdown.appendChild(div);
        }
    }
    
    // Show current selection in search input
    function updateSearchInput() {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        if (selectedOption && selectedOption.value) {
            searchInput.value = selectedOption.textContent;
        } else {
            searchInput.value = '';
        }
    }
    
    // Track composition state for Japanese input
    searchInput.addEventListener('compositionstart', function() {
        isComposing = true;
    });
    
    searchInput.addEventListener('compositionend', function() {
        isComposing = false;
        // Trigger filter after composition ends
        this.dispatchEvent(new Event('input'));
    });
    
    // Show dropdown on focus
    searchInput.addEventListener('focus', function() {
        wrapper.classList.add('active');
        createDropdownOptions();
        this.select();
    });
    
    // Filter options based on search
    searchInput.addEventListener('input', function() {
        if (isComposing) return; // Don't filter during composition
        
        const searchTerm = this.value.toLowerCase();
        const options = dropdown.querySelectorAll('.card-option');
        let firstVisible = null;
        
        options.forEach(option => {
            const optionText = option.textContent.toLowerCase();
            if (optionText.includes(searchTerm) || !searchTerm) {
                option.classList.remove('hidden');
                if (!firstVisible) firstVisible = option;
            } else {
                option.classList.add('hidden');
            }
        });
        
        // Update selected visual state
        options.forEach(opt => opt.classList.remove('selected'));
        if (firstVisible) {
            firstVisible.classList.add('selected');
        }
    });
    
    // Handle option selection
    selectElement.addEventListener('change', function() {
        updateSearchInput();
        onCardChange(slotNum);
    });
    
    // Close dropdown on click outside
    document.addEventListener('click', function(e) {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('active');
            updateSearchInput();
        }
    });
    
    // Handle keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        // Don't handle keyboard events during composition
        if (isComposing) return;
        
        const visibleOptions = Array.from(dropdown.querySelectorAll('.card-option:not(.hidden)'));
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            
            let currentIndex = visibleOptions.findIndex(opt => opt.classList.contains('selected'));
            if (currentIndex === -1) currentIndex = 0;
            
            let newIndex;
            if (e.key === 'ArrowDown') {
                newIndex = currentIndex + 1 < visibleOptions.length ? currentIndex + 1 : currentIndex;
            } else {
                newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
            }
            
            visibleOptions.forEach(opt => opt.classList.remove('selected'));
            if (visibleOptions[newIndex]) {
                visibleOptions[newIndex].classList.add('selected');
                // Scroll into view if needed
                visibleOptions[newIndex].scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedOption = dropdown.querySelector('.card-option.selected');
            if (selectedOption) {
                selectElement.value = selectedOption.dataset.value;
                selectElement.dispatchEvent(new Event('change'));
            }
            wrapper.classList.remove('active');
        } else if (e.key === 'Escape') {
            wrapper.classList.remove('active');
            updateSearchInput();
        }
    });
    
    // Initialize
    updateSearchInput();
}

// Save current state to localStorage
function saveCurrentState() {
    // Don't save anything in share mode
    if (isShareMode) return;
    
    const musicKey = document.getElementById('music').value;
    if (musicKey === 'custom') return; // Don't save custom music states
    
    const state = {
        appeal: document.getElementById('appeal').value,
        mental: document.getElementById('mental').value,
        learningCorrection: document.getElementById('learningCorrection').value,
        cards: []
    };
    
    // Save card selections only (skill values are calculated from skill level)
    for (let i = 1; i <= 6; i++) {
        const cardData = {
            card: document.getElementById(`card${i}`).value
            // スキルレベルは別途保存、スキル値は保存しない
        };
        state.cards.push(cardData);
    }
    
    // Save state for this specific song
    const key = `sukushou_state_${musicKey}`;
    localStorage.setItem(key, JSON.stringify(state));
    console.log(`Saved state for ${musicKey}`, state);
}

// Save skill level for a specific card type
function saveCardSkillLevel(cardType, skillLevel) {
    if (!cardType) return;
    const key = `sukushou_card_skill_${cardType}`;
    localStorage.setItem(key, skillLevel);
}

// Load skill level for a specific card type
function loadCardSkillLevel(cardType) {
    if (!cardType) return 14;
    const key = `sukushou_card_skill_${cardType}`;
    const savedLevel = localStorage.getItem(key);
    return savedLevel ? parseInt(savedLevel) : 14;
}

// Save center skill level for a specific card type
function saveCardCenterSkillLevel(cardType, skillLevel) {
    if (!cardType || isShareMode) return; // 共有モードでは保存しない
    const key = `sukushou_card_center_skill_${cardType}`;
    localStorage.setItem(key, skillLevel);
}

// Load center skill level for a specific card type
function loadCardCenterSkillLevel(cardType) {
    if (!cardType) return 14;
    const key = `sukushou_card_center_skill_${cardType}`;
    const savedLevel = localStorage.getItem(key);
    return savedLevel ? parseInt(savedLevel) : 14;
}

// Handle center skill level change
function onCenterSkillLevelChange(slotNum) {
    const cardSelect = document.getElementById(`card${slotNum}`);
    const centerSkillSelect = document.getElementById(`centerSkillLevel${slotNum}`);
    const cardType = cardSelect.value;
    const centerSkillLevel = parseInt(centerSkillSelect.value);
    
    if (!cardType || !cardData[cardType]) return;
    
    // Save center skill level for this card
    saveCardCenterSkillLevel(cardType, centerSkillLevel);
    
    // Update center skill parameter values based on new level
    if (cardData[cardType].centerSkill) {
        updateCenterSkillValues(slotNum, cardData[cardType].centerSkill, centerSkillLevel);
    }
}

// Update center skill input values based on skill level
function updateCenterSkillValues(slotNum, centerSkill, skillLevel) {
    const updateEffectValues = (effect, effectIndex, prefix) => {
        const inputId = prefix ? `centerSkill${slotNum}_${prefix}_${effectIndex}_value` : `centerSkill${slotNum}_effect_${effectIndex}_value`;
        const input = document.getElementById(inputId);
        
        if (input && effect.value !== undefined) {
            const isVoltage = effect.type === 'voltageGain';
            const calculatedValue = calculateSkillValue(effect.value, skillLevel, !isVoltage);
            // Set value directly like regular skills
            input.value = isVoltage ? Math.floor(calculatedValue) : calculatedValue;
            input.style.backgroundColor = '';
            input.placeholder = '';
        }
        
        // Handle conditional effects recursively
        if (effect.type === 'conditional') {
            if (effect.then) {
                effect.then.forEach((thenEffect, i) => {
                    const thenPrefix = prefix ? `${prefix}_then` : 'then';
                    updateEffectValues(thenEffect, i, thenPrefix);
                });
            }
            if (effect.else) {
                effect.else.forEach((elseEffect, i) => {
                    const elsePrefix = prefix ? `${prefix}_else` : 'else';
                    updateEffectValues(elseEffect, i, elsePrefix);
                });
            }
        }
    };
    
    // Update all effect values
    centerSkill.effects.forEach((effect, index) => {
        updateEffectValues(effect, index, '');
    });
}

// Load state from localStorage
function loadStateForSong(musicKey) {
    if (musicKey === 'custom' || isShareMode) return; // Don't load for custom music or share mode
    
    const key = `sukushou_state_${musicKey}`;
    const savedState = localStorage.getItem(key);
    console.log(`Loading state for ${musicKey}`, savedState);
    
    if (!savedState) {
        console.log(`No saved state found for ${musicKey}`);
        return;
    }
    
    try {
        const state = JSON.parse(savedState);
        console.log(`Parsed state for ${musicKey}`, state);
        
        // Load appeal, mental, and learning correction
        document.getElementById('appeal').value = state.appeal || 88146;
        document.getElementById('mental').value = state.mental || 100;
        document.getElementById('learningCorrection').value = state.learningCorrection || 1.5;
        
        // Load card selections
        for (let i = 1; i <= 6; i++) {
            const cardData = state.cards[i - 1];
            if (cardData) {
                // Set card selection
                document.getElementById(`card${i}`).value = cardData.card || '';
                
                // Trigger card change to show skill options (this will load the saved skill level)
                onCardChange(i);
                
                // Don't load skill level from song state anymore - it's loaded per card
                
                // Trigger skill level change (スキル値は自動計算される)
                onSkillLevelChange(i);
                
                // Update search input display
                const searchInput = document.getElementById(`cardSearch${i}`);
                const selectElement = document.getElementById(`card${i}`);
                const selectedOption = selectElement.options[selectElement.selectedIndex];
                if (selectedOption && selectedOption.value) {
                    searchInput.value = selectedOption.textContent;
                }
            }
        }
        
        // Update center character highlighting after loading
        updateCenterCharacterHighlight();
        
        // Check for duplicate characters after loading
        updateDuplicateCharacterHighlight();
    } catch (e) {
        console.error('Error loading saved state:', e);
    }
}

// Setup auto-save on input changes
function setupAutoSave() {
    // Save on any input change
    const inputs = document.querySelectorAll('input[type="number"], select');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            // Small delay to ensure all related changes are complete
            setTimeout(saveCurrentState, 100);
        });
    });
}

// Save state before page unload
window.addEventListener('beforeunload', function() {
    saveCurrentState();
});

// Also save on visibility change (mobile/tab switching)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        saveCurrentState();
    }
});

// Drag and drop functionality
let draggedElement = null;
let touchItem = null;
let touchOffset = {x: 0, y: 0};
let longPressTimer = null;
let touchStartPos = {x: 0, y: 0};
let isDragging = false;

function setupDragAndDrop() {
    const cardSlots = document.querySelectorAll('.card-slot');
    
    cardSlots.forEach(slot => {
        // Standard drag and drop for desktop
        slot.addEventListener('dragstart', handleDragStart);
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('drop', handleDrop);
        slot.addEventListener('dragend', handleDragEnd);
        slot.addEventListener('dragenter', handleDragEnter);
        slot.addEventListener('dragleave', handleDragLeave);
        
        // Touch events for mobile
        slot.addEventListener('touchstart', handleTouchStart, {passive: false});
        slot.addEventListener('touchmove', handleTouchMove, {passive: false});
        slot.addEventListener('touchend', handleTouchEnd, {passive: false});
        slot.addEventListener('touchcancel', handleTouchCancel, {passive: false});
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    
    // Hide drag hint after first drag
    document.body.classList.add('has-dragged');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    // Visual feedback for drop position
    const rect = this.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    
    if (e.clientY < midpoint) {
        this.classList.add('drop-before');
        this.classList.remove('drop-after');
    } else {
        this.classList.add('drop-after');
        this.classList.remove('drop-before');
    }
    
    return false;
}

function handleDragEnter() {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave() {
    this.classList.remove('drag-over');
    this.classList.remove('drop-before');
    this.classList.remove('drop-after');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        const rect = this.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const insertBefore = e.clientY < midpoint;
        
        // Insert the card at the drop position
        insertCard(draggedElement, this, insertBefore);
    }
    
    return false;
}

function handleDragEnd() {
    const cardSlots = document.querySelectorAll('.card-slot');
    cardSlots.forEach(slot => {
        slot.classList.remove('dragging');
        slot.classList.remove('drag-over');
        slot.classList.remove('drop-before');
        slot.classList.remove('drop-after');
    });
}

function insertCard(fromSlot, toSlot, insertBefore) {
    const fromSlotNum = parseInt(fromSlot.getAttribute('data-slot'));
    const toSlotNum = parseInt(toSlot.getAttribute('data-slot'));
    
    // Don't do anything if dragging to the same position
    if (fromSlotNum === toSlotNum || 
        (insertBefore && fromSlotNum === toSlotNum - 1) ||
        (!insertBefore && fromSlotNum === toSlotNum + 1)) {
        return;
    }
    
    // Store all card data
    const cardData = [];
    for (let i = 1; i <= 6; i++) {
        cardData.push({
            card: document.getElementById(`card${i}`).value,
            skill: document.getElementById(`skill${i}`).value,
            // スキル値は保存しない（スキルレベルから自動計算）
            searchValue: document.getElementById(`cardSearch${i}`).value
        });
    }
    
    // Remove the dragged card data
    const draggedData = cardData.splice(fromSlotNum - 1, 1)[0];
    
    // Calculate new insert position
    let insertPos = toSlotNum - 1;
    if (!insertBefore) {
        insertPos++;
    }
    if (fromSlotNum < toSlotNum) {
        insertPos--;
    }
    
    // Insert at new position
    cardData.splice(insertPos, 0, draggedData);
    
    // Apply the new order
    for (let i = 0; i < cardData.length; i++) {
        const data = cardData[i];
        const slotNum = i + 1;
        
        document.getElementById(`card${slotNum}`).value = data.card;
        document.getElementById(`cardSearch${slotNum}`).value = data.searchValue;
        
        // Trigger card change to update skill displays
        onCardChange(slotNum);
        
        // Restore skill level
        document.getElementById(`skill${slotNum}`).value = data.skill;
        
        // Trigger skill level change
        onSkillLevelChange(slotNum);
        
        // スキル値はスキルレベルから自動計算されるため復元不要
    }
    
    // Check for duplicate characters
    updateCenterCharacterHighlight();
    updateDuplicateCharacterHighlight();
    
    // Save the new state
    setTimeout(saveCurrentState, 100);
}

// Keep old swapCards function for compatibility
function swapCards(fromSlot, toSlot) {
    const fromSlotNum = fromSlot.getAttribute('data-slot');
    const toSlotNum = toSlot.getAttribute('data-slot');
    
    // Get current values
    const fromCard = document.getElementById(`card${fromSlotNum}`).value;
    const fromSkill = document.getElementById(`skill${fromSlotNum}`).value;
    const fromSearchValue = document.getElementById(`cardSearch${fromSlotNum}`).value;
    
    const toCard = document.getElementById(`card${toSlotNum}`).value;
    const toSkill = document.getElementById(`skill${toSlotNum}`).value;
    const toSearchValue = document.getElementById(`cardSearch${toSlotNum}`).value;
    
    // Swap card selections
    document.getElementById(`card${fromSlotNum}`).value = toCard;
    document.getElementById(`card${toSlotNum}`).value = fromCard;
    
    // Trigger card changes to update UI
    onCardChange(fromSlotNum);
    onCardChange(toSlotNum);
    
    // Restore skill levels
    document.getElementById(`skill${fromSlotNum}`).value = toSkill;
    document.getElementById(`skill${toSlotNum}`).value = fromSkill;
    
    // Trigger skill level changes (スキル値は自動計算される)
    onSkillLevelChange(fromSlotNum);
    onSkillLevelChange(toSlotNum);
    
    // Update search inputs
    document.getElementById(`cardSearch${fromSlotNum}`).value = toSearchValue;
    document.getElementById(`cardSearch${toSlotNum}`).value = fromSearchValue;
    
    // Update center character highlighting after swap
    updateCenterCharacterHighlight();
    
    // Check for duplicate characters after swap
    updateDuplicateCharacterHighlight();
    
    // Save the new state
    setTimeout(saveCurrentState, 100);
}


// Close notice banner
function closeNotice() {
    const banner = document.getElementById('noticeBanner');
    banner.classList.add('hidden');
    // Save preference
    localStorage.setItem('noticeHidden', 'true');
}

// Initialize on page load - moved to DOMContentLoaded at the bottom

// Custom music management functions
function getCustomMusicList() {
    const savedList = localStorage.getItem('sukushou_custom_music_list');
    return savedList ? JSON.parse(savedList) : {};
}

function saveCustomMusicList(list) {
    localStorage.setItem('sukushou_custom_music_list', JSON.stringify(list));
}

function saveCustomMusic() {
    const name = document.getElementById('customMusicName').value.trim();
    if (!name) {
        alert('カスタム楽曲名を入力してください。');
        return;
    }
    
    const phases = [
        parseInt(document.getElementById('beforeFever').value),
        parseInt(document.getElementById('duringFever').value),
        parseInt(document.getElementById('afterFever').value)
    ];
    
    const centerCharacter = document.getElementById('customCenterCharacter').value;
    
    // Generate a unique key for this custom music
    const key = 'custom_' + Date.now();
    
    // Create custom music object
    const customMusic = {
        name: name,
        phases: phases,
        centerCharacter: centerCharacter || null,
        description: `フィーバー前: ${phases[0]}, フィーバー中: ${phases[1]}, フィーバー後: ${phases[2]}`
    };
    
    // Save to custom music list
    const customList = getCustomMusicList();
    customList[key] = customMusic;
    saveCustomMusicList(customList);
    
    // Also add to musicData for immediate use
    musicData[key] = customMusic;
    
    // Update the music dropdown
    updateMusicDropdown();
    rebuildMusicDropdown();
    
    // Select the newly saved custom music
    document.getElementById('music').value = key;
    toggleMusicInput();
    
    // Clear the name input
    document.getElementById('customMusicName').value = '';
    
    // Update saved custom music display
    updateSavedCustomMusicDisplay();
}

function deleteCustomMusic(key) {
    const customList = getCustomMusicList();
    const name = customList[key].name;
    
    if (confirm(`「${name}」を削除しますか？`)) {
        delete customList[key];
        saveCustomMusicList(customList);
        
        // Also delete from musicData
        delete musicData[key];
        
        // Also delete any saved state for this music
        localStorage.removeItem(`sukushou_state_${key}`);
        
        // Update the dropdown
        updateMusicDropdown();
        
        // If the deleted music was selected, switch to default
        if (document.getElementById('music').value === key) {
            document.getElementById('music').value = 'ai_scream';
            toggleMusicInput();
        }
    }
}

function updateMusicDropdown() {
    const select = document.getElementById('music');
    const currentValue = select.value;
    
    // Clear and rebuild options
    select.innerHTML = '';
    
    // Add all music options (including custom ones already in musicData)
    for (const [key, music] of Object.entries(musicData)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${music.name} (${music.phases.join(', ')})`;
        select.appendChild(option);
    }
    
    // Add custom input option
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'カスタム入力';
    select.appendChild(customOption);
    
    // Restore selection if it still exists
    if (Array.from(select.options).some(opt => opt.value === currentValue)) {
        select.value = currentValue;
    }
    
    // Update saved custom music display
    updateSavedCustomMusicDisplay();
    
    // Rebuild the visual dropdown
    rebuildMusicDropdown();
}

function updateSavedCustomMusicDisplay() {
    const container = document.getElementById('savedCustomMusic');
    const customList = getCustomMusicList();
    const entries = Object.entries(customList);
    
    if (entries.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<div class="saved-music-container">';
    html += '<div class="saved-music-header">保存済みカスタム楽曲</div>';
    
    entries.forEach(([key, music]) => {
        html += `<div class="saved-music-item">`;
        html += `<div class="saved-music-info">`;
        html += `<span class="saved-music-name">${music.name}</span>`;
        html += `<span class="saved-music-phases">${music.phases[0]}-${music.phases[1]}-${music.phases[2]}</span>`;
        if (music.centerCharacter) {
            // Extract first name (given name) only
            const firstNameMap = {
                '乙宗梢': '梢',
                '夕霧綴理': '綴理',
                '藤島慈': '慈',
                '日野下花帆': '花帆',
                '村野さやか': 'さやか',
                '大沢瑠璃乃': '瑠璃乃',
                '百生吟子': '吟子',
                '徒町小鈴': '小鈴',
                '安養寺姫芽': '姫芽',
                '桂城泉': '泉',
                'セラス 柳田 リリエンフェルト': 'セラス'
            };
            const firstName = firstNameMap[music.centerCharacter] || music.centerCharacter;
            html += `<span class="saved-music-center">${firstName}</span>`;
        }
        html += `</div>`;
        html += `<button onclick="deleteCustomMusic('${key}')" class="delete-button">×</button>`;
        html += `</div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Initialize page on load - moved to DOMContentLoaded at the bottom

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const wrapper = document.querySelector('.music-select-wrapper');
    if (wrapper && !wrapper.contains(event.target)) {
        document.getElementById('musicDropdown')?.classList.remove('show');
        document.querySelector('.music-select-display')?.classList.remove('active');
    }
});

// Touch event handlers for mobile
function handleTouchStart(e) {
    const touch = e.touches[0];
    const element = this;
    touchStartPos.x = touch.clientX;
    touchStartPos.y = touch.clientY;
    isDragging = false;
    
    const rect = element.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    // Store current positions
    touchItem = element;
    touchOffset.x = offsetX;
    touchOffset.y = offsetY;
    
    // Start long press timer (500ms)
    longPressTimer = setTimeout(() => {
        // Check if we still have a valid touch and not already dragging
        if (!touchItem || isDragging) return;
        
        isDragging = true;
        touchItem.classList.add('dragging');
        
        // Add a clone for visual feedback
        const clone = touchItem.cloneNode(true);
        clone.id = 'drag-clone';
        clone.style.position = 'fixed';
        clone.style.zIndex = '9999';
        clone.style.opacity = '0.9';
        clone.style.pointerEvents = 'none';
        clone.style.width = rect.width + 'px';
        clone.style.left = (touchStartPos.x - touchOffset.x) + 'px';
        clone.style.top = (touchStartPos.y - touchOffset.y) + 'px';
        clone.style.backgroundColor = '#ffffff';
        clone.classList.remove('dragging'); // Remove dragging class from clone
        document.body.appendChild(clone);
        
        // Haptic feedback for supported devices
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }, 500);
}

function handleTouchMove(e) {
    const touch = e.touches[0];
    
    // Cancel long press if moved too much before timer
    if (!isDragging && longPressTimer) {
        const moveDistance = Math.sqrt(
            Math.pow(touch.clientX - touchStartPos.x, 2) + 
            Math.pow(touch.clientY - touchStartPos.y, 2)
        );
        
        if (moveDistance > 10) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    }
    
    // Only handle drag if long press was triggered
    if (!isDragging) return;
    
    // Prevent scrolling and text selection on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        e.preventDefault();
    }
    
    if (!touchItem) return;
    
    const clone = document.getElementById('drag-clone');
    
    if (clone) {
        clone.style.left = (touch.clientX - touchOffset.x) + 'px';
        clone.style.top = (touch.clientY - touchOffset.y) + 'px';
    }
    
    // Find element under touch point
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const slotBelow = elementBelow?.closest('.card-slot');
    
    // Clear previous indicators
    document.querySelectorAll('.card-slot').forEach(slot => {
        slot.classList.remove('drop-before', 'drop-after');
    });
    
    if (slotBelow && slotBelow !== touchItem) {
        const rect = slotBelow.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        
        if (touch.clientY < midpoint) {
            slotBelow.classList.add('drop-before');
        } else {
            slotBelow.classList.add('drop-after');
        }
    }
}

function handleTouchEnd(e) {
    // Always clear long press timer first
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
    
    // Always clean up any existing clone immediately
    const existingClone = document.getElementById('drag-clone');
    if (existingClone) {
        existingClone.remove();
    }
    
    // Only process drop if dragging was active
    if (isDragging && touchItem) {
        // Prevent default to stop any text selection on iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
            e.preventDefault();
        }
        
        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const slotBelow = elementBelow?.closest('.card-slot');
        
        // Perform the drop
        if (slotBelow && slotBelow !== touchItem) {
            const rect = slotBelow.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            const insertBefore = touch.clientY < midpoint;
            
            insertCard(touchItem, slotBelow, insertBefore);
        }
    }
    
    // Always clear all visual indicators
    document.querySelectorAll('.card-slot').forEach(slot => {
        slot.classList.remove('dragging', 'drop-before', 'drop-after');
    });
    
    // Reset all states
    touchItem = null;
    isDragging = false;
    touchStartPos = {x: 0, y: 0};
}

function handleTouchCancel() {
    // Clean up if touch is cancelled
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
    
    const clone = document.getElementById('drag-clone');
    if (clone) {
        clone.remove();
    }
    
    document.querySelectorAll('.card-slot').forEach(slot => {
        slot.classList.remove('dragging', 'drop-before', 'drop-after');
    });
    
    touchItem = null;
    isDragging = false;
}

// URL share functionality
let isShareMode = false;

function createShareURL() {
    const data = {
        appeal: document.getElementById('appeal').value,
        mental: document.getElementById('mental').value,
        learningCorrection: document.getElementById('learningCorrection').value,
        music: document.getElementById('music').value,
        customMusic: null,
        customCenter: null,
        cards: []
    };
    
    // If using custom music or saved custom music, save the phases and center
    if (data.music === 'custom') {
        data.customMusic = [
            parseInt(document.getElementById('beforeFever').value) || 0,
            parseInt(document.getElementById('duringFever').value) || 0,
            parseInt(document.getElementById('afterFever').value) || 0
        ];
        data.customCenter = document.getElementById('customCenterCharacter').value || null;
    } else if (data.music && data.music.startsWith('custom_')) {
        // 保存されたカスタム楽曲の場合
        const customList = getCustomMusicList();
        if (customList[data.music]) {
            data.customMusic = customList[data.music].phases;
            data.customCenter = customList[data.music].centerCharacter;
            data.customMusicName = customList[data.music].name;
        }
    }
    
    // Collect card data
    for (let i = 1; i <= 6; i++) {
        const cardId = document.getElementById(`card${i}`).value;
        if (cardId) {
            const cardData = {
                id: cardId,
                skill: parseInt(document.getElementById(`skill${i}`).value),
                centerSkill: parseInt(document.getElementById(`centerSkillLevel${i}`)?.value || 14)
            };
            data.cards.push(cardData);
        }
    }
    
    // Compress and encode data
    const json = JSON.stringify(data);
    const compressed = btoa(unescape(encodeURIComponent(json)));
    
    // Create share URL
    const url = new URL(window.location.href);
    url.searchParams.set('share', '1');
    url.searchParams.set('data', compressed);
    
    // Copy to clipboard
    navigator.clipboard.writeText(url.toString()).then(() => {
        alert('共有URLをクリップボードにコピーしました！');
    }).catch(() => {
        prompt('共有URL:', url.toString());
    });
}

function loadShareData() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('share') === '1') {
        isShareMode = true;
        document.getElementById('shareMode').style.display = 'block';
        document.body.classList.add('share-mode');
        
        const encodedData = urlParams.get('data');
        if (encodedData) {
            try {
                const json = decodeURIComponent(escape(atob(encodedData)));
                const data = JSON.parse(json);
                
                // Load appeal value
                if (data.appeal) {
                    document.getElementById('appeal').value = data.appeal;
                }
                
                // Load mental and learning correction
                if (data.mental) {
                    document.getElementById('mental').value = data.mental;
                }
                if (data.learningCorrection) {
                    document.getElementById('learningCorrection').value = data.learningCorrection;
                }
                
                // Load music
                if (data.music && data.music.startsWith('custom_') && data.customMusic) {
                    // 保存されたカスタム楽曲の場合、一時的にmusicDataに追加
                    const tempCustomMusic = {
                        name: data.customMusicName || 'カスタム楽曲',
                        phases: data.customMusic,
                        centerCharacter: data.customCenter || null
                    };
                    musicData[data.music] = tempCustomMusic;
                    
                    // ドロップダウンを更新
                    updateMusicDropdown();
                    rebuildMusicDropdown();
                    
                    // 楽曲を選択
                    document.getElementById('music').value = data.music;
                    toggleMusicInput();
                } else if (data.music) {
                    document.getElementById('music').value = data.music;
                    toggleMusicInput();
                } else if (data.customMusic) {
                    document.getElementById('music').value = 'custom';
                    toggleMusicInput();
                    // Set custom music phases
                    document.getElementById('beforeFever').value = data.customMusic[0];
                    document.getElementById('duringFever').value = data.customMusic[1];
                    document.getElementById('afterFever').value = data.customMusic[2];
                    
                    // Set custom center if provided
                    if (data.customCenter) {
                        document.getElementById('customCenterCharacter').value = data.customCenter;
                        // Trigger change event to update display
                        const event = new Event('change');
                        document.getElementById('customCenterCharacter').dispatchEvent(event);
                    }
                }
                
                
                // Load cards
                data.cards.forEach((card, index) => {
                    if (index < 6) {
                        const slotNum = index + 1;
                        document.getElementById(`card${slotNum}`).value = card.id;
                        onCardChange(slotNum);
                        
                        // Update search input display after onCardChange
                        setTimeout(() => {
                            const searchInput = document.getElementById(`cardSearch${slotNum}`);
                            const selectElement = document.getElementById(`card${slotNum}`);
                            const selectedOption = selectElement.options[selectElement.selectedIndex];
                            if (selectedOption && selectedOption.value) {
                                searchInput.value = selectedOption.textContent;
                            }
                        }, 50);
                        
                        if (card.skill) {
                            document.getElementById(`skill${slotNum}`).value = card.skill;
                            onSkillLevelChange(slotNum);
                        }
                        
                        // スキルの数値はスキルレベルから自動計算されるため、paramsは読み込まない
                        
                        // Load center skill level (センタースキルの数値も自動計算)
                        if (card.centerSkill) {
                            setTimeout(() => {
                                const centerSkillSelect = document.getElementById(`centerSkillLevel${slotNum}`);
                                if (centerSkillSelect) {
                                    centerSkillSelect.value = card.centerSkill;
                                    onCenterSkillLevelChange(slotNum);
                                }
                            }, 200);
                        }
                    }
                });
                
            } catch (e) {
                console.error('Failed to load share data:', e);
                console.error('Encoded data:', encodedData);
                alert('共有URLのデータの読み込みに失敗しました。\n\nエラー: ' + e.message);
            }
        }
    }
}

function saveAsCustomMusic() {
    // Get current music configuration
    const musicSelect = document.getElementById('music');
    const musicValue = musicSelect.value;
    
    let currentMusic = null;
    let musicName = '';
    let phases = [];
    let center = '';
    
    if (musicValue === 'custom') {
        // Custom music - get values from inputs
        musicName = 'カスタム楽曲';
        phases = [
            parseInt(document.getElementById('beforeFever').value) || 0,
            parseInt(document.getElementById('duringFever').value) || 0,
            parseInt(document.getElementById('afterFever').value) || 0
        ];
        center = document.getElementById('customCenterCharacter').value || '';
    } else if (musicData[musicValue]) {
        // Existing music
        currentMusic = musicData[musicValue];
        musicName = currentMusic.name;
        phases = [...currentMusic.phases];
        center = currentMusic.centerCharacter || '';
    } else {
        alert('楽曲情報が見つかりません');
        return;
    }
    
    // Generate a name for the custom music
    const customName = prompt(
        'カスタム楽曲名を入力してください：',
        `${musicName} (カスタム編成)`
    );
    
    if (!customName || customName.trim() === '') {
        return;
    }
    
    // Create custom music object
    const customMusic = {
        id: 'custom_' + Date.now(),
        name: customName.trim(),
        phases: phases,
        center: center,
        centerCharacter: center,
        description: `フィーバー前: ${phases[0]}, フィーバー中: ${phases[1]}, フィーバー後: ${phases[2]}`
    };
    
    // Save to custom music list
    const customList = getCustomMusicList();
    customList[customMusic.id] = customMusic;
    saveCustomMusicList(customList);
    
    // Add to musicData for immediate use
    musicData[customMusic.id] = customMusic;
    
    // Save current card configuration with this custom music
    const cardState = {};
    for (let i = 1; i <= 6; i++) {
        cardState[`card${i}`] = {
            id: document.getElementById(`card${i}`).value,
            skillLevel: parseInt(document.getElementById(`skill${i}`).value) || 14
            // スキルの数値は保存しない（スキルレベルから自動計算）
        };
    }
    
    // Save card configuration for this custom music
    localStorage.setItem(`state_${customMusic.id}`, JSON.stringify({
        appeal: document.getElementById('appeal').value,
        mental: document.getElementById('mental').value,
        learningCorrection: document.getElementById('learningCorrection').value,
        cards: cardState
    }));
    
    // Update the select element to include the new option
    const musicSelectElement = document.getElementById('music');
    const newOption = document.createElement('option');
    newOption.value = customMusic.id;
    newOption.textContent = `${customMusic.name} (${customMusic.phases.join('-')})`;
    musicSelectElement.appendChild(newOption);
    
    // Rebuild music dropdown to include new custom music
    rebuildMusicDropdown();
    
    // Switch to the new custom music
    musicSelect.value = customMusic.id;
    toggleMusicInput();
    
    // Remove share parameters from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    url.searchParams.delete('data');
    window.history.replaceState({}, document.title, url.pathname);
    
    // Hide share mode banner
    document.getElementById('shareMode').style.display = 'none';
    document.body.classList.remove('share-mode');
    isShareMode = false;
    
    alert(`カスタム楽曲「${customName}」として保存しました！`);
}

function exitShareMode() {
    // Remove share parameters from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    url.searchParams.delete('data');
    window.history.replaceState({}, document.title, url.pathname);
    
    // Hide share mode banner
    document.getElementById('shareMode').style.display = 'none';
    document.body.classList.remove('share-mode');
    isShareMode = false;
    
    // Reload the page to restore previous state
    location.reload();
}

// Initialize share mode on page load
document.addEventListener('DOMContentLoaded', function() {
    // First, load card data
    loadCardData();
    
    // Setup searchable selects for all card slots
    for (let i = 1; i <= 6; i++) {
        setupSearchableSelect(i);
    }
    
    // Setup drag and drop
    setupDragAndDrop();
    
    // Add event listener for custom center character changes
    const customCenterSelect = document.getElementById('customCenterCharacter');
    if (customCenterSelect) {
        customCenterSelect.addEventListener('change', function() {
            const musicSelect = document.getElementById('music');
            if (musicSelect.value === 'custom') {
                const centerDisplay = document.getElementById('centerCharacterDisplay');
                const centerNameSpan = document.getElementById('centerCharacterName');
                
                if (this.value) {
                    centerDisplay.style.display = 'block';
                    centerNameSpan.textContent = this.value;
                } else {
                    centerDisplay.style.display = 'none';
                }
                
                // Update center character highlighting
                updateCenterCharacterHighlight();
            }
        });
    }
    
    // Check if in share mode first
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('share') === '1') {
        // Don't load from localStorage in share mode
        loadShareData();
    } else {
        // Normal mode - load from localStorage
        loadAppeal();
        loadMusic();
        loadCardSelections();
        
        // Check notice preference
        if (localStorage.getItem('noticeHidden') === 'true') {
            const banner = document.getElementById('noticeBanner');
            if (banner) {
                banner.classList.add('hidden');
            }
        }
    }
    
    // Use setTimeout to ensure DOM is fully ready and card data is loaded
    setTimeout(() => {
        // Setup auto-save only in non-share mode
        if (!isShareMode) {
            setupAutoSave();
        }
        
        // Load state for default song
        const defaultMusic = document.getElementById('music').value;
        if (!isShareMode) {
            loadStateForSong(defaultMusic);
        }
        
        // Show center character for default song
        toggleMusicInput();
    }, 100);
    
    // Rebuild dropdown to include any saved custom songs
    rebuildMusicDropdown();
    
    // Initialize selected music
    const currentMusic = document.getElementById('music').value;
    if (currentMusic) {
        document.querySelector(`.music-dropdown-item[data-value="${currentMusic}"]`)?.classList.add('selected');
        updateMusicDisplay(currentMusic);
    }
    
    // Add keyboard navigation for music search
    const searchInput = document.getElementById('musicSearchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.getElementById('musicDropdown').classList.remove('show');
                document.querySelector('.music-select-display').classList.remove('active');
            }
        });
    }
});