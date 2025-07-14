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
    constructor(cards, appeal, music, verbose = false) {
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
        this.log = "";
        this.logHtml = "";
        this.currentTurnLog = [];
    }

    doGame() {
        while (this.turn < this.music.reduce((a, b) => a + b, 0)) {
            this.turnUp();
        }
    }

    turnUp() {
        if (this.cardTurn >= this.cards.length) {
            this.cardTurn = 0;
        }
        if (this.verbose) {
            this.log += `turn ${this.turn + 1}\n`;
            this.currentTurnLog = [];
            const phase = this.getCurrentPhase();
            this.currentTurnLog.push(`<div class="log-turn-header">ターン ${this.turn + 1} ${phase}</div>`);
        }
        const card = this.cards[this.cardTurn];
        
        // Store initial turn state to check if turn was skipped
        const initialTurn = this.turn;
        card.do(this);
        const turnSkipped = this.turn === initialTurn;
        
        // Only create log entry if turn was not skipped
        if (this.verbose && this.currentTurnLog.length > 1 && !turnSkipped) {
            this.logHtml += `<div class="log-turn">${this.currentTurnLog.join('')}</div>`;
        }
    }
    
    getCurrentPhase() {
        const beforeFever = this.music[0];
        const duringFever = this.music[1];
        
        if (this.turn < beforeFever) {
            return '<span style="color: #666;">[通常]</span>';
        } else if (this.turn < beforeFever + duringFever) {
            return '<span style="color: #ff6b6b; font-weight: bold;">[フィーバー]</span>';
        } else {
            return '<span style="color: #666;">[フィーバー後]</span>';
        }
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
            this.currentTurnLog.push(`<div class="log-action"><span class="log-score-boost">スコアブースト +${percent}% (合計: ${total}%)</span></div>`);
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
            this.currentTurnLog.push(`<div class="log-action"><span class="log-voltage-boost">ボルテージブースト +${percent}% (合計: ${total}%)</span></div>`);
        }
    }

    getScore(value) {
        const score = Math.floor(this.appeal * value * (1 + this.scoreBoost[this.scoreBoostCount]) * (1 + this.getVoltageLevel() / 10) * 1.5);
        this.score += score;
        this.scoreBoostCount += 1;
        if (this.verbose) {
            this.log += `get score ${score} = ${value} * ${this.appeal} * (1 + ${this.scoreBoost[this.scoreBoostCount - 1]}) * ${1 + this.getVoltageLevel() / 10} * 1.5\n`;
            const voltageLevel = this.getVoltageLevel();
            const totalScoreBoostPercent = ((1 + this.scoreBoost[this.scoreBoostCount - 1]) * 100).toFixed(2);
            const totalVoltageLevelPercent = ((1 + voltageLevel / 10) * 100).toFixed(2);
            this.currentTurnLog.push(`<div class="log-action"><span class="log-score-gain">スコア獲得: +${score.toLocaleString()}</span></div>`);
            
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
            calcHtml += `<span class="calc-value calc-fever">1.5<span class="calc-label">ラーニング</span></span>`;
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
            this.currentTurnLog.push(`<div class="log-action"><span class="log-voltage-gain">ボルテージ獲得: +${voltagePt} (合計: ${this.voltagePt})</span></div>`);
            
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
        game.cardTurn += 1;
    }
}

// Generic card implementation using JSON data
class GenericCard extends Card {
    constructor(cardKey, cardConfig, skillValues, skillLevel) {
        super();
        this.cardKey = cardKey;
        this.name = cardConfig.name.toLowerCase();
        this.displayName = cardConfig.displayName;
        this.config = cardConfig;
        this.skillValues = skillValues || {};
        this.skillLevel = skillLevel || 1;
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
        
        // Add card name at the top
        if (game.verbose) {
            const cardName = this.displayName || this.name;
            game.currentTurnLog.push(`<div class="log-action"><span class="log-card-name">${cardName}</span></div>`);
        }
        
        // Process effects array sequentially
        for (let i = 0; i < effects.length; i++) {
            const effect = effects[i];
            
            switch (effect.type) {
                case 'skipTurn':
                    const skipConditionMet = this.evaluateCondition(effect.condition, game);
                    if (game.verbose) {
                        const formattedCondition = this.formatCondition(effect.condition, game);
                        game.currentTurnLog.push(`<div class="log-action" style="color: #666;">条件判定: ${formattedCondition} → ${skipConditionMet ? '条件成立（スキップ）' : '条件不成立'}</div>`);
                    }
                    if (skipConditionMet) {
                        // Don't log skip action since we'll hide the entire turn
                        game.cardTurn += 1;
                        return;
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
                        game.currentTurnLog.push(`<div class="log-action log-mental">メンタル回復: +${effect.value} (合計: ${game.mental})</div>`);
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
                        game.currentTurnLog.push(`<div class="log-action log-mental" style="color: #e74c3c;">${logMessage}: -${reduction} (合計: ${game.mental})</div>`);
                    }
                    break;
                    
                case 'resetCardTurn':
                    game.cardTurn = -1;
                    if (game.verbose) {
                        game.currentTurnLog.push(`<div class="log-action" style="color: #3498db;">カード順リセット</div>`);
                    }
                    break;
                    
                case 'conditional':
                    const conditionMet = this.evaluateCondition(effect.condition, game);
                    if (game.verbose) {
                        const conditionText = this.formatCondition(effect.condition, game);
                        const resultText = conditionMet ? '成立' : '不成立';
                        const resultColor = conditionMet ? '#27ae60' : '#95a5a6';
                        game.currentTurnLog.push(`<div class="log-action" style="color: ${resultColor};">条件判定: ${conditionText} → ${resultText}</div>`);
                    }
                    if (conditionMet) {
                        // Process "then" effects
                        this.processEffects(effect.then, game, `effect_${i}_then`);
                    } else if (effect.else) {
                        // Process "else" effects
                        this.processEffects(effect.else, game, `effect_${i}_else`);
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
        
        // Replace variables in condition with turn start values
        let evalStr = condition;
        evalStr = evalStr.replace(/count/g, values.count);
        
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
        
        // Format the condition more naturally
        if (condition.includes('count')) {
            if (condition.includes('>=')) {
                const match = condition.match(/count\s*>=\s*(\d+)/);
                if (match) {
                    formatted = `使用回数(${this.count}) ≥ ${match[1]}`;
                }
            } else if (condition.includes('>')) {
                const match = condition.match(/count\s*>\s*(\d+)/);
                if (match) {
                    formatted = `使用回数(${this.count}) > ${match[1]}`;
                }
            } else if (condition.includes('<=')) {
                const match = condition.match(/count\s*<=\s*(\d+)/);
                if (match) {
                    formatted = `使用回数(${this.count}) ≤ ${match[1]}`;
                }
            } else if (condition.includes('<')) {
                const match = condition.match(/count\s*<\s*(\d+)/);
                if (match) {
                    formatted = `使用回数(${this.count}) < ${match[1]}`;
                }
            } else if (condition.match(/count\s*===?\s*(\d+)/)) {
                const match = condition.match(/count\s*===?\s*(\d+)/);
                if (match) {
                    formatted = `使用回数(${this.count}) = ${match[1]}`;
                }
            }
        }
        
        return formatted;
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
                    game.cardTurn = -1;
                    if (game.verbose) {
                        game.currentTurnLog.push(`<div class="log-action" style="color: #3498db;">カード順リセット</div>`);
                    }
                    break;
            }
        }
    }
}

// Card factory
function createCard(cardType, skillValues, skillLevel) {
    if (!cardData[cardType]) return null;
    return new GenericCard(cardType, cardData[cardType], skillValues, skillLevel);
}

// Toggle music input
function toggleMusicInput() {
    const musicSelect = document.getElementById('music');
    const customMusic = document.getElementById('customMusic');
    
    // Get previous music value to save its state
    const previousMusic = musicSelect.getAttribute('data-previous-value') || 'i_do_me';
    
    // Save current state for the previous song
    if (previousMusic !== 'custom') {
        const tempMusicValue = musicSelect.value;
        musicSelect.value = previousMusic;
        saveCurrentState();
        musicSelect.value = tempMusicValue;
    }
    
    // If switching to custom, store the previous song's phase values
    if (musicSelect.value === 'custom' && previousMusic !== 'custom') {
        let previousPhases;
        if (musicData[previousMusic]) {
            previousPhases = musicData[previousMusic].phases;
        } else {
            // Check custom music list
            const customList = getCustomMusicList();
            if (customList[previousMusic]) {
                previousPhases = customList[previousMusic].phases;
            }
        }
        
        if (previousPhases) {
            document.getElementById('beforeFever').value = previousPhases[0];
            document.getElementById('duringFever').value = previousPhases[1];
            document.getElementById('afterFever').value = previousPhases[2];
        }
    }
    
    // Update previous value
    musicSelect.setAttribute('data-previous-value', musicSelect.value);
    
    if (musicSelect.value === 'custom') {
        customMusic.style.display = 'block';
        updateSavedCustomMusicDisplay();
    } else {
        customMusic.style.display = 'none';
        // Load state for the selected song
        setTimeout(() => loadStateForSong(musicSelect.value), 50);
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
    
    const appeal = parseInt(document.getElementById('appeal').value);
    const initialMental = parseInt(document.getElementById('mental').value);
    const musicKey = document.getElementById('music').value;
    let music;
    
    if (musicKey === 'custom') {
        music = [
            parseInt(document.getElementById('beforeFever').value),
            parseInt(document.getElementById('duringFever').value),
            parseInt(document.getElementById('afterFever').value)
        ];
    } else if (musicData[musicKey]) {
        music = musicData[musicKey].phases;
    } else {
        // Check custom music list
        const customList = getCustomMusicList();
        if (customList[musicKey]) {
            music = customList[musicKey].phases;
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
            cards.push(createCard(cardType, finalValues, skillLevel));
        }
    }
    
    if (cards.length === 0) {
        alert('少なくとも1枚のカードを選択してください。');
        return;
    }
    
    const game = new Game(cards, appeal, music, true);
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
    for (const [character, slots] of Object.entries(characterSlots)) {
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
        slot.classList.remove('duplicate-character');
    }
    
    // Highlight duplicate slots
    duplicateSlots.forEach(slotNum => {
        const slot = document.querySelector(`.card-slot[data-slot="${slotNum}"]`);
        slot.classList.add('duplicate-character');
    });
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
        
        // Load saved skill level for this card
        const savedSkillLevel = loadCardSkillLevel(cardSelect.value);
        skillSelect.value = savedSkillLevel;
        
        // Update skill level options to show which have unknown values
        updateSkillLevelOptions(slotNum);
        
        // Load default values for current skill level
        onSkillLevelChange(slotNum);
    } else {
        skillSelect.style.display = 'none';
        skillParams.style.display = 'none';
    }
    
    // Check for duplicate characters
    updateDuplicateCharacterHighlight();
}

// Update skill level dropdown to show unknown values
function updateSkillLevelOptions(slotNum) {
    const skillSelect = document.getElementById(`skill${slotNum}`);
    
    // Since we're calculating values now, all levels are known
    for (let level = 1; level <= 14; level++) {
        const option = skillSelect.querySelector(`option[value="${level}"]`);
        if (option) {
            option.textContent = `スキルLv${level}`;
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
    
    // Save skill level for this card
    saveCardSkillLevel(cardType, skillLevel);
    
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
}

// Generate skill parameter inputs
function generateSkillParams(slotNum, cardType) {
    const skillParams = document.getElementById(`skillParams${slotNum}`);
    const card = cardData[cardType];
    if (!card) return;
    
    let html = '';
    const effects = card.effects;
    let hasParams = false;
    
    // Process effects array
    for (let i = 0; i < effects.length; i++) {
        const effect = effects[i];
        const effectHtml = generateEffectInputs(effect, slotNum, i, '');
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

// Generate input fields for effects
function generateEffectInputs(effect, slotNum, effectIndex, prefix) {
    let html = '';
    const inputId = prefix ? `skill${slotNum}_${prefix}_${effectIndex}_value` : `skill${slotNum}_effect_${effectIndex}_value`;
    
    switch (effect.type) {
        case 'scoreBoost':
            if (effect.value !== undefined) {
                html += `<div class="skill-param-row">
                    <label>スコアブースト:</label>
                    <input type="number" id="${inputId}" value="${effect.value}" step="0.001">
                </div>`;
            }
            break;
            
        case 'voltageBoost':
            if (effect.value !== undefined) {
                html += `<div class="skill-param-row">
                    <label>ボルテージブースト:</label>
                    <input type="number" id="${inputId}" value="${effect.value}" step="0.001">
                </div>`;
            }
            break;
            
        case 'scoreGain':
            if (effect.value !== undefined) {
                html += `<div class="skill-param-row">
                    <label>スコア倍率:</label>
                    <input type="number" id="${inputId}" value="${effect.value}" step="0.01">
                </div>`;
            }
            break;
            
        case 'voltageGain':
            if (effect.value !== undefined) {
                html += `<div class="skill-param-row">
                    <label>ボルテージ獲得:</label>
                    <input type="number" id="${inputId}" value="${effect.value}" step="1">
                </div>`;
            }
            break;
            
        case 'conditional':
            if (effect.then || effect.else) {
                html += `<div style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">条件: ${effect.condition}</div>`;
                
                if (effect.then) {
                    html += '<div style="margin-left: 10px;">';
                    html += '<div style="font-weight: bold; color: #2196F3;">条件成立時:</div>';
                    for (let j = 0; j < effect.then.length; j++) {
                        html += generateEffectInputs(effect.then[j], slotNum, j, `effect_${effectIndex}_then`);
                    }
                    html += '</div>';
                }
                
                if (effect.else) {
                    html += '<div style="margin-left: 10px;">';
                    html += '<div style="font-weight: bold; color: #f44336;">条件不成立時:</div>';
                    for (let j = 0; j < effect.else.length; j++) {
                        html += generateEffectInputs(effect.else[j], slotNum, j, `effect_${effectIndex}_else`);
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

// Calculate skill value based on level and base value
function calculateSkillValue(lv1Value, skillLevel, isPercentage = true) {
    const multiplier = SKILL_LEVEL_MULTIPLIERS[skillLevel - 1];
    const calculatedValue = lv1Value * multiplier;
    
    if (isPercentage) {
        // Round to avoid floating point errors, then truncate to 4 decimal places
        // This fixes issues like 0.4125 * 3.0 = 1.2374999999999998
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
                // Special handling for tenchiIzumi at skill level 14
                if (cardType === 'tenchiIzumi' && skillLevel === 14 && effect.value === 139) {
                    values[`${prefix}_value`] = 418;
                } else {
                    values[`${prefix}_value`] = calculateSkillValue(effect.value, skillLevel, false);
                }
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
    const musicKey = document.getElementById('music').value;
    if (musicKey === 'custom') return; // Don't save custom music states
    
    const state = {
        appeal: document.getElementById('appeal').value,
        mental: document.getElementById('mental').value,
        cards: []
    };
    
    // Save card selections and skill values (but not skill level)
    for (let i = 1; i <= 6; i++) {
        const cardData = {
            card: document.getElementById(`card${i}`).value,
            // Don't save skillLevel here - it will be saved separately per card
            skillValues: getSkillValues(i)
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

// Load state from localStorage
function loadStateForSong(musicKey) {
    if (musicKey === 'custom') return; // Don't load for custom music
    
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
        
        // Load appeal and mental
        document.getElementById('appeal').value = state.appeal || 88146;
        document.getElementById('mental').value = state.mental || 100;
        
        // Load card selections
        for (let i = 1; i <= 6; i++) {
            const cardData = state.cards[i - 1];
            if (cardData) {
                // Set card selection
                document.getElementById(`card${i}`).value = cardData.card || '';
                
                // Trigger card change to show skill options (this will load the saved skill level)
                onCardChange(i);
                
                // Don't load skill level from song state anymore - it's loaded per card
                
                // Trigger skill level change
                onSkillLevelChange(i);
                
                // Load custom skill values
                if (cardData.skillValues) {
                    for (const [key, value] of Object.entries(cardData.skillValues)) {
                        const input = document.getElementById(`skill${i}_${key}`);
                        if (input) {
                            input.value = value;
                        }
                    }
                }
                
                // Update search input display
                const searchInput = document.getElementById(`cardSearch${i}`);
                const selectElement = document.getElementById(`card${i}`);
                const selectedOption = selectElement.options[selectElement.selectedIndex];
                if (selectedOption && selectedOption.value) {
                    searchInput.value = selectedOption.textContent;
                }
            }
        }
        
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

function setupDragAndDrop() {
    const cardSlots = document.querySelectorAll('.card-slot');
    
    cardSlots.forEach(slot => {
        slot.addEventListener('dragstart', handleDragStart);
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('drop', handleDrop);
        slot.addEventListener('dragend', handleDragEnd);
        slot.addEventListener('dragenter', handleDragEnter);
        slot.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter() {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave() {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        // Swap the card data
        swapCards(draggedElement, this);
    }
    
    return false;
}

function handleDragEnd() {
    const cardSlots = document.querySelectorAll('.card-slot');
    cardSlots.forEach(slot => {
        slot.classList.remove('dragging');
        slot.classList.remove('drag-over');
    });
}

function swapCards(fromSlot, toSlot) {
    const fromSlotNum = fromSlot.getAttribute('data-slot');
    const toSlotNum = toSlot.getAttribute('data-slot');
    
    // Get current values
    const fromCard = document.getElementById(`card${fromSlotNum}`).value;
    const fromSkill = document.getElementById(`skill${fromSlotNum}`).value;
    const fromSkillValues = getSkillValues(fromSlotNum);
    const fromSearchValue = document.getElementById(`cardSearch${fromSlotNum}`).value;
    
    const toCard = document.getElementById(`card${toSlotNum}`).value;
    const toSkill = document.getElementById(`skill${toSlotNum}`).value;
    const toSkillValues = getSkillValues(toSlotNum);
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
    
    // Trigger skill level changes
    onSkillLevelChange(fromSlotNum);
    onSkillLevelChange(toSlotNum);
    
    // Restore custom skill values
    for (const [key, value] of Object.entries(toSkillValues)) {
        const input = document.getElementById(`skill${fromSlotNum}_${key}`);
        if (input) input.value = value;
    }
    
    for (const [key, value] of Object.entries(fromSkillValues)) {
        const input = document.getElementById(`skill${toSlotNum}_${key}`);
        if (input) input.value = value;
    }
    
    // Update search inputs
    document.getElementById(`cardSearch${fromSlotNum}`).value = toSearchValue;
    document.getElementById(`cardSearch${toSlotNum}`).value = fromSearchValue;
    
    // Check for duplicate characters after swap
    updateDuplicateCharacterHighlight();
    
    // Save the new state
    setTimeout(saveCurrentState, 100);
}

// Initialize on page load
window.onload = function() {
    loadCardData();
    
    // Setup searchable selects for all card slots
    for (let i = 1; i <= 6; i++) {
        setupSearchableSelect(i);
    }
    
    // Setup drag and drop
    setupDragAndDrop();
    
    // Use setTimeout to ensure DOM is fully ready and card data is loaded
    setTimeout(() => {
        // Setup auto-save
        setupAutoSave();
        
        // Load state for default song
        const defaultMusic = document.getElementById('music').value;
        loadStateForSong(defaultMusic);
    }, 100);
};

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
    
    // Generate a unique key for this custom music
    const key = 'custom_' + Date.now();
    
    // Save to custom music list
    const customList = getCustomMusicList();
    customList[key] = {
        name: name,
        phases: phases,
        description: `フィーバー前: ${phases[0]}, フィーバー中: ${phases[1]}, フィーバー後: ${phases[2]}`
    };
    saveCustomMusicList(customList);
    
    // Update the music dropdown
    updateMusicDropdown();
    
    // Select the newly saved custom music
    document.getElementById('music').value = key;
    toggleMusicInput();
    
    // Clear the name input
    document.getElementById('customMusicName').value = '';
    
    alert(`「${name}」を保存しました。`);
}

function deleteCustomMusic(key) {
    const customList = getCustomMusicList();
    const name = customList[key].name;
    
    if (confirm(`「${name}」を削除しますか？`)) {
        delete customList[key];
        saveCustomMusicList(customList);
        
        // Also delete any saved state for this music
        localStorage.removeItem(`sukushou_state_${key}`);
        
        // Update the dropdown
        updateMusicDropdown();
        
        // If the deleted music was selected, switch to default
        if (document.getElementById('music').value === key) {
            document.getElementById('music').value = 'i_do_me';
            toggleMusicInput();
        }
    }
}

function updateMusicDropdown() {
    const select = document.getElementById('music');
    const currentValue = select.value;
    
    // Clear and rebuild options
    select.innerHTML = '';
    
    // Add default music options
    for (const [key, music] of Object.entries(musicData)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${music.name} (${music.phases.join(', ')})`;
        select.appendChild(option);
    }
    
    // Add saved custom music
    const customList = getCustomMusicList();
    for (const [key, music] of Object.entries(customList)) {
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
}

function updateSavedCustomMusicDisplay() {
    const container = document.getElementById('savedCustomMusic');
    const customList = getCustomMusicList();
    const entries = Object.entries(customList);
    
    if (entries.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<div style="margin-top: 10px; padding: 10px; background: #f0f0f0; border-radius: 5px;">';
    html += '<div style="font-weight: bold; margin-bottom: 5px;">保存済みカスタム楽曲:</div>';
    
    entries.forEach(([key, music]) => {
        html += `<div style="display: flex; justify-content: space-between; align-items: center; margin: 5px 0; padding: 5px; background: white; border-radius: 3px;">`;
        html += `<span>${music.name} (${music.phases.join(', ')})</span>`;
        html += `<button onclick="deleteCustomMusic('${key}')" style="width: auto; padding: 5px 10px; background-color: #f44336; font-size: 12px;">削除</button>`;
        html += `</div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}