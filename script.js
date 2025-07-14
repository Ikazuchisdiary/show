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
            const skillLevel = parseInt(document.getElementById(`skill${i}`).value);
            const userModifiedValues = getSkillValues(i);
            const calculatedValues = getCalculatedSkillValues(cardType, skillLevel);
            
            // Merge user modifications with calculated values
            const finalValues = { ...calculatedValues, ...userModifiedValues };
            cards.push(createCard(cardType, finalValues));
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

// Calculate skill value based on level and base value
function calculateSkillValue(lv1Value, skillLevel, isPercentage = true) {
    const multiplier = SKILL_LEVEL_MULTIPLIERS[skillLevel - 1];
    const calculatedValue = lv1Value * multiplier;
    
    if (isPercentage) {
        // For percentage values, truncate to 3 decimal places
        return Math.floor(calculatedValue * 1000) / 1000;
    } else {
        // For voltage points, truncate to 1 decimal place (no decimal places as requested)
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
        processEffectForSkillLevel(effect, `effect_${i}`, values, skillLevel);
    }
    
    return values;
}

// Process effect to calculate skill values
function processEffectForSkillLevel(effect, prefix, values, skillLevel) {
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
                    processEffectForSkillLevel(effect.then[j], `${prefix}_then_${j}`, values, skillLevel);
                }
            }
            if (effect.else) {
                for (let j = 0; j < effect.else.length; j++) {
                    processEffectForSkillLevel(effect.else[j], `${prefix}_else_${j}`, values, skillLevel);
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

// Initialize on page load
window.onload = function() {
    loadCardData();
    
    // Setup searchable selects for all card slots
    for (let i = 1; i <= 6; i++) {
        setupSearchableSelect(i);
    }
};