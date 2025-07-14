// Global data loaded from JSON
let cardData = {};
let musicData = {};

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
        }
        const card = this.cards[this.cardTurn];
        card.do(this);
    }

    getVoltageLevel() {
        const getSubVoltageLevel = () => {
            const voltageLevels = [0, 10, 30, 60, 100, 150, 210, 280, 360, 450, 550, 660, 780, 910, 1050, 1200, 1360, 1530, 1710, 1900];
            if (this.voltagePt < 1900) {
                for (let i = 0; i < voltageLevels.length; i++) {
                    if (this.voltagePt < voltageLevels[i]) {
                        return i;
                    }
                }
            }
            return 19 + Math.floor((this.voltagePt - 1900) / 200);
        };
        
        let voltage = getSubVoltageLevel();
        if (this.music[0] + 1 <= this.turn && this.turn <= this.music[0] + this.music[1]) {
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
        }
    }

    doVoltageBoost(value, times = 1) {
        for (let i = 0; i < times; i++) {
            this.voltageBoost[this.voltageBoostCount + i] += value;
        }
        if (this.verbose) {
            this.log += `voltage boost ${value}, reach ${this.voltageBoost[this.voltageBoostCount]}\n`;
        }
    }

    getScore(value) {
        const score = Math.floor(this.appeal * value * (1 + this.scoreBoost[this.scoreBoostCount]) * (1 + this.getVoltageLevel() / 10)) * 1.5;
        this.score += score;
        this.scoreBoostCount += 1;
        if (this.verbose) {
            this.log += `get score ${score} = ${value} * ${this.appeal} * (1 + ${this.scoreBoost[this.scoreBoostCount - 1]}) * ${1 + this.getVoltageLevel() / 10} * 1.5\n`;
        }
    }

    getVoltage(value) {
        const voltagePt = Math.floor(value * (1 + this.voltageBoost[this.voltageBoostCount]));
        this.voltagePt += voltagePt;
        if (this.verbose) {
            this.log += `get voltage ${voltagePt} = ${value} * (1 + ${this.voltageBoost[this.voltageBoostCount]})\n`;
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
        this.count += 1;
        game.turn += 1;
        game.cardTurn += 1;
    }
}

// Generic card implementation using JSON data
class GenericCard extends Card {
    constructor(cardKey, cardConfig, skillValues) {
        super();
        this.cardKey = cardKey;
        this.name = cardConfig.name.toLowerCase();
        this.config = cardConfig;
        this.skillValues = skillValues || {};
    }

    do(game) {
        const effects = this.config.effects;
        
        // Process effects array sequentially
        for (let i = 0; i < effects.length; i++) {
            const effect = effects[i];
            
            switch (effect.type) {
                case 'skipTurn':
                    if (this.evaluateCondition(effect.condition, game)) {
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
                    break;
                    
                case 'mentalRecover':
                    game.mental += effect.value;
                    break;
                    
                case 'resetCardTurn':
                    game.cardTurn = -1;
                    break;
                    
                case 'conditional':
                    if (this.evaluateCondition(effect.condition, game)) {
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
        // Replace variables in condition with actual values
        let evalStr = condition;
        evalStr = evalStr.replace(/count/g, this.count);
        evalStr = evalStr.replace(/mental/g, game.mental);
        evalStr = evalStr.replace(/voltageLevel/g, game.getVoltageLevel());
        evalStr = evalStr.replace(/turn/g, game.turn + 1); // turn is 0-indexed
        
        try {
            return eval(evalStr);
        } catch (e) {
            console.error('Error evaluating condition:', condition, e);
            return false;
        }
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
                    break;
                    
                case 'resetCardTurn':
                    game.cardTurn = -1;
                    break;
            }
        }
    }
}

// Card factory
function createCard(cardType, skillValues) {
    if (!cardData[cardType]) return null;
    return new GenericCard(cardType, cardData[cardType], skillValues);
}

// Toggle music input
function toggleMusicInput() {
    const musicSelect = document.getElementById('music');
    const customMusic = document.getElementById('customMusic');
    if (musicSelect.value === 'custom') {
        customMusic.style.display = 'block';
    } else {
        customMusic.style.display = 'none';
    }
}

// Calculate function
function calculate() {
    const appeal = parseInt(document.getElementById('appeal').value);
    const musicKey = document.getElementById('music').value;
    let music;
    
    if (musicKey === 'custom') {
        music = [
            parseInt(document.getElementById('beforeFever').value),
            parseInt(document.getElementById('duringFever').value),
            parseInt(document.getElementById('afterFever').value)
        ];
    } else {
        music = musicData[musicKey].phases;
    }
    
    const cards = [];
    for (let i = 1; i <= 6; i++) {
        const cardType = document.getElementById(`card${i}`).value;
        if (cardType) {
            const skillValues = getSkillValues(i);
            cards.push(createCard(cardType, skillValues));
        }
    }
    
    if (cards.length === 0) {
        alert('少なくとも1枚のカードを選択してください。');
        return;
    }
    
    const game = new Game(cards, appeal, music, true);
    game.doGame();
    
    document.getElementById('score').textContent = game.score.toLocaleString();
    document.getElementById('result').style.display = 'block';
    document.getElementById('turnLog').textContent = game.log;
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

// Load card data from JSON
async function loadCardData() {
    try {
        const response = await fetch('cards.json');
        const data = await response.json();
        cardData = data.cards;
        musicData = data.music;
        
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
    const select = document.getElementById('music');
    select.innerHTML = '';
    
    for (const [key, music] of Object.entries(musicData)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${music.name} (${music.phases.join(', ')})`;
        select.appendChild(option);
    }
    
    // Add custom option
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'カスタム入力';
    select.appendChild(customOption);
}

function setDefaultSelections() {
    document.getElementById('card1').value = 'sachi';
    document.getElementById('card2').value = 'bdMegu';
    document.getElementById('card3').value = 'gingaKozu';
    document.getElementById('card4').value = 'iDoMeSayaka';
    document.getElementById('card5').value = 'iDoMeKaho';
    document.getElementById('card6').value = 'butoRuri';
    
    // Trigger card change events to show skill options
    for (let i = 1; i <= 6; i++) {
        onCardChange(i);
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
        
        // Update skill level options to show which have unknown values
        updateSkillLevelOptions(slotNum, cardSelect.value);
        
        // Load default values for current skill level
        onSkillLevelChange(slotNum);
    } else {
        skillSelect.style.display = 'none';
        skillParams.style.display = 'none';
    }
}

// Update skill level dropdown to show unknown values
function updateSkillLevelOptions(slotNum, cardType) {
    const skillSelect = document.getElementById(`skill${slotNum}`);
    const card = cardData[cardType];
    
    if (!card || !card.skillLevels) return;
    
    // Update each option to show if it has unknown values
    for (let level = 1; level <= 14; level++) {
        const option = skillSelect.querySelector(`option[value="${level}"]`);
        if (option) {
            const levelData = card.skillLevels[level];
            let hasNull = false;
            
            if (levelData) {
                hasNull = Object.values(levelData).some(value => value === null);
            }
            
            if (hasNull) {
                option.textContent = `スキルLv${level} (一部不明)`;
                option.style.color = '#ff6b6b';
            } else {
                option.textContent = `スキルLv${level}`;
                option.style.color = '';
            }
        }
    }
}

// Handle skill level change
function onSkillLevelChange(slotNum) {
    const cardSelect = document.getElementById(`card${slotNum}`);
    const skillSelect = document.getElementById(`skill${slotNum}`);
    const cardType = cardSelect.value;
    const skillLevel = skillSelect.value;
    
    if (!cardType || !cardData[cardType]) return;
    
    const card = cardData[cardType];
    if (card.skillLevels && card.skillLevels[skillLevel]) {
        const levelData = card.skillLevels[skillLevel];
        
        // Update all input values for this skill level
        for (const [key, value] of Object.entries(levelData)) {
            const inputId = `skill${slotNum}_${key}`;
            const input = document.getElementById(inputId);
            if (input) {
                if (value !== null) {
                    input.value = value;
                    input.style.backgroundColor = '';
                    input.placeholder = '';
                } else {
                    input.value = '';
                    input.style.backgroundColor = '#ffe4e1';
                    input.placeholder = '不明';
                }
            }
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
    
    // Hide params div if no parameters
    if (!hasParams) {
        skillParams.style.display = 'none';
        html = '<div style="color: #666; font-size: 14px;">このカードには調整可能なパラメータがありません</div>';
    } else {
        // Add help text about manual input
        html = '<div style="color: #666; font-size: 12px; margin-bottom: 10px;">※ 数値は手動で変更可能です。不明な値は自由に入力してください。</div>' + html;
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

// Initialize on page load
window.onload = function() {
    loadCardData();
};