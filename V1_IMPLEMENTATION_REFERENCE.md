# v1 実装リファレンス - 機能別コード位置マップ

## 📍 ファイル構成
- `index.html` (22,313 bytes) - UI構造
- `script.js` (206,393 bytes) - メインロジック
- `style.css` (45,000 bytes) - スタイリング
- `cardData.js` (83,727 bytes) - カード/楽曲データ

## 🎯 Critical機能の実装箇所

### 1. スキルパラメータ編集機能

#### 値の生成と表示
```javascript
// script.js:1823-1933 - generateEffectInputs()
function generateEffectInputs(effect, slotNum, effectIndex, prefix, skillLevel = 14) {
    // 各効果タイプごとの入力フィールド生成
    case 'scoreBoost':
        html += `<input type="number" id="${inputId}" value="${calculatedValue}" step="0.001">`;
```

#### ユーザー修正値の管理
```javascript
// script.js:2053-2091 - getUserModifiedSkillValues()
function getUserModifiedSkillValues(slotNum) {
    const modifiedValues = {};
    const inputs = document.querySelectorAll(`input[id^="skill${slotNum}_"]`);
    
    inputs.forEach(input => {
        if (input.placeholder && input.value !== input.placeholder) {
            modifiedValues[input.id] = parseFloat(input.value);
        }
    });
}
```

#### 修正値のハイライト
```css
/* style.css:1654-1658 */
input[type="number"].user-modified {
    background-color: #fffbdd !important;
    border-color: #ffc107 !important;
}
```

### 2. センターキャラクター機能

#### センターキャラクター検出
```javascript
// script.js:648-679 - updateCenterCharacterHighlight()
function updateCenterCharacterHighlight() {
    const music = document.getElementById('music').value;
    const musicData = getMusicData(music);
    
    for (let i = 1; i <= 6; i++) {
        const slot = document.querySelector(`.card-slot[data-slot="${i}"]`);
        const cardValue = document.getElementById(`card${i}`).value;
        
        if (cardValue && cardData[cardValue]) {
            const character = cardData[cardValue].character;
            if (musicData.centerCharacter === character) {
                slot.classList.add('center-character');
                // センター特性の表示を追加
                const centerSkillHtml = generateCenterCharacteristicDisplay(cardValue);
            }
        }
    }
}
```

#### センター特性の効果計算
```javascript
// script.js:2651-2717 - applyCenterCharacteristic()
function applyCenterCharacteristic(cards, centerCharacter) {
    cards.forEach(card => {
        if (!card || !card.data) return;
        
        const centerCard = cards.find(c => c?.data?.character === centerCharacter);
        if (centerCard?.data?.centerCharacteristic) {
            centerCard.data.centerCharacteristic.effects.forEach(effect => {
                if (effect.type === 'appealBoost') {
                    // アピール値ブースト適用
                    if (effect.target === card.data.character || 
                        (effect.target === '102期' && is102Member(card.data.character))) {
                        const boost = effect.value;
                        // ブースト適用ロジック
                    }
                }
            });
        }
    });
}
```

#### センタースタイル
```css
/* style.css:573-592 - センターキャラクターハイライト */
.card-slot.center-character {
    border-color: #ff9800;
    background-color: #fff3e0;
    box-shadow: 0 0 10px rgba(255, 152, 0, 0.3);
}

.center-characteristic-info {
    margin-top: 10px;
    padding: 10px;
    background-color: #fff8e1;
    border: 1px solid #ffc107;
    border-radius: 5px;
}
```

### 3. AP収支詳細

#### AP計算ロジック
```javascript
// script.js:3251-3358 - calculateAPBalance()
function calculateAPBalance(comboCount, initialMental, cards, musicPhases) {
    const apPerCombo = initialMental > 0 ? 0.575 : 0;
    const actualComboCount = Math.floor(comboCount - (1 - initialMental/100) / 0.04685);
    const baseAP = (59 + 1.5 * (actualComboCount - 49)) * apPerCombo;
    
    let totalAPGain = baseAP;
    let totalAPCost = 0;
    const apDetails = {
        income: {
            base: Math.floor(baseAP),
            skills: []
        },
        expense: []
    };
    
    // AP獲得とコストの詳細計算
    cards.forEach((card, index) => {
        if (card) {
            totalAPCost += card.apCost;
            apDetails.expense.push({
                card: card.displayName,
                cost: card.apCost
            });
        }
    });
}
```

#### AP表示UI
```html
<!-- index.html:424-445 - AP詳細表示構造 -->
<div id="apSummary">
    <div class="ap-balance">
        <span class="ap-label">AP収支:</span>
        <span id="apBalanceValue" class="ap-positive">+125</span>
    </div>
    <div class="ap-details-toggle">
        <button onclick="toggleAPDetails()">詳細を表示</button>
    </div>
    <div id="apDetails" class="ap-details" style="display: none;">
        <div class="ap-income">
            <h4>AP獲得</h4>
            <div class="ap-item">基礎AP: <span>300</span></div>
            <div class="ap-item">スキルAP: <span>50</span></div>
        </div>
        <div class="ap-expense">
            <h4>AP消費</h4>
            <!-- カードごとの消費 -->
        </div>
    </div>
</div>
```

### 4. センタースキルシステム

#### センタースキルUI生成
```javascript
// script.js:1435-1523 - generateCenterSkillParams()
function generateCenterSkillParams(slotNum, cardType) {
    const card = cardData[cardType];
    if (!card.centerSkill) return '';
    
    let html = `
        <div class="center-skill-section">
            <h4>センタースキル</h4>
            <select id="centerSkill${slotNum}" onchange="onCenterSkillLevelChange(${slotNum})">
    `;
    
    for (let i = 10; i >= 1; i--) {
        html += `<option value="${i}">Lv.${i}</option>`;
    }
    
    // センタースキル効果のパラメータ入力
    card.centerSkill.effects.forEach((effect, idx) => {
        html += generateEffectInputs(effect, slotNum, idx, 'center');
    });
}
```

#### センタースキル発動タイミング
```javascript
// script.js:4125-4198 - processCenterSkills()
function processCenterSkills(timing, gameState) {
    gameState.cards.forEach((card, index) => {
        if (!card || !card.centerSkill) return;
        
        const centerCard = gameState.centerCharacterCard;
        if (card === centerCard && card.centerSkill.timing === timing) {
            // センタースキル発動
            card.centerSkill.effects.forEach(effect => {
                processEffect(effect, gameState, `センタースキル(${timing})`);
            });
            
            gameState.turnLogs.push({
                type: 'centerSkill',
                timing: timing,
                card: card.displayName,
                effects: card.centerSkill.effects
            });
        }
    });
}
```

### 5. ローカルストレージ実装

#### スキルレベル保存
```javascript
// script.js:563-577 - saveCardSkillLevel()
function saveCardSkillLevel(cardType, skillLevel, isCenter = false) {
    try {
        const key = isCenter ? 
            `sukushou_card_center_skill_${cardType}` : 
            `sukushou_card_skill_${cardType}`;
        localStorage.setItem(key, skillLevel.toString());
    } catch (e) {
        console.error('Failed to save skill level:', e);
    }
}

// script.js:579-593 - loadCardSkillLevel()
function loadCardSkillLevel(cardType, isCenter = false) {
    try {
        const key = isCenter ? 
            `sukushou_card_center_skill_${cardType}` : 
            `sukushou_card_skill_${cardType}`;
        return parseInt(localStorage.getItem(key)) || (isCenter ? 5 : 10);
    } catch (e) {
        return isCenter ? 5 : 10;
    }
}
```

#### カスタム楽曲保存
```javascript
// script.js:5234-5298 - saveCustomMusic()
function saveCustomMusic() {
    const musicName = prompt('カスタム楽曲の名前を入力してください:');
    if (!musicName) return;
    
    const customMusic = {
        name: musicName,
        phases: [
            parseInt(document.getElementById('customBeforeFever').value),
            parseInt(document.getElementById('customDuringFever').value),
            parseInt(document.getElementById('customAfterFever').value)
        ],
        centerCharacter: document.getElementById('customCenterCharacter').value,
        attribute: document.getElementById('customAttribute').value,
        comboCount: {
            normal: parseInt(document.getElementById('customComboNormal').value),
            // ...他の難易度
        }
    };
    
    // 既存のリストに追加
    let customMusicList = JSON.parse(localStorage.getItem('sukushou_custom_music_list') || '[]');
    customMusicList.push(customMusic);
    localStorage.setItem('sukushou_custom_music_list', JSON.stringify(customMusicList));
}
```

#### 楽曲別編成保存
```javascript
// script.js:4521-4587 - saveCurrentState()
function saveCurrentState() {
    if (isShareMode) return; // 共有モードでは保存しない
    
    const music = document.getElementById('music').value;
    if (!music) return;
    
    const state = {
        cards: [],
        skillLevels: [],
        centerSkillLevels: [],
        customValues: {}
    };
    
    for (let i = 1; i <= 6; i++) {
        state.cards.push(document.getElementById(`card${i}`).value);
        state.skillLevels.push(document.getElementById(`skill${i}`)?.value || '10');
        // ユーザー修正値も保存
        const modifiedValues = getUserModifiedSkillValues(i);
        if (Object.keys(modifiedValues).length > 0) {
            state.customValues[i] = modifiedValues;
        }
    }
    
    localStorage.setItem(`sukushou_state_${music}`, JSON.stringify(state));
}
```

### 6. ターンログの詳細表示

#### ログ生成
```javascript
// script.js:3845-3972 - generateTurnLog()
function generateTurnLog(turn, card, actions, calculations, gameState) {
    let logHtml = `
        <div class="log-turn">
            <div class="log-turn-header">
                <span class="turn-number">T${turn + 1}</span>
                <span class="log-card-name">[${card.shortCode}] ${card.displayName}</span>
                ${card.apCost > 0 ? `<span class="log-ap-inline">AP-${card.apCost}</span>` : ''}
            </div>
    `;
    
    // 効果の詳細
    actions.forEach(action => {
        logHtml += `<div class="log-action ${getActionClass(action.type)}">`;
        logHtml += action.description;
        logHtml += '</div>';
    });
    
    // 計算式の詳細
    if (calculations.score) {
        logHtml += `
            <div class="log-calculation">
                <span class="calc-value calc-base">
                    ${calculations.appeal}
                    <span class="calc-label">アピール</span>
                </span>
                <span>×</span>
                <span class="calc-value calc-multiplier">
                    ${calculations.multiplier}
                    <span class="calc-label">倍率</span>
                </span>
                <span>×</span>
                <span class="calc-value calc-voltage">
                    ${calculations.voltageMultiplier}
                    <span class="calc-label">ボルテージ</span>
                </span>
            </div>
        `;
    }
}
```

#### ログスタイル
```css
/* style.css:2156-2298 - ターンログスタイル */
.log-turn {
    margin-bottom: 15px;
    padding: 10px;
    background-color: white;
    border-radius: 5px;
    border-left: 3px solid #4CAF50;
}

.log-action {
    margin: 2px 0 2px 20px;
    color: #666;
}

.log-action.voltage-effect {
    color: #2196F3;
}

.log-action.negative-effect {
    color: #e74c3c;
}

.log-calculation {
    font-size: 12px;
    color: #888;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    padding-left: 40px;
    margin-top: 5px;
}
```

## 🔧 ユーティリティ関数

### スキル値計算
```javascript
// script.js:146-160 - calculateSkillValue()
function calculateSkillValue(lv10Value, skillLevel, isPercentage = true) {
    const multiplier = SKILL_LEVEL_MULTIPLIERS[skillLevel - 1];
    const calculatedValue = (lv10Value / 2) * multiplier;
    
    if (isPercentage) {
        const rounded = Math.round(calculatedValue * 10000) / 10000;
        return Math.floor(rounded * 10000) / 10000;
    } else {
        return Math.floor(calculatedValue);
    }
}
```

### キャラクターグループ判定
```javascript
// script.js:2719-2747 - Character group helpers
function is102Member(character) {
    return ['乙宗梢', '藤島慈', '夕霧綴理'].includes(character);
}

function is103Member(character) {
    return ['日野下花帆', '村野さやか', '大沢瑠璃乃'].includes(character);
}

function is104Member(character) {
    return ['百生吟子', '徒町小鈴', '安養寺姫芽'].includes(character);
}
```

### URL圧縮/解凍
```javascript
// script.js:5521-5612 - URL compression
function compressUrlParams(params) {
    // LZString圧縮を使用
    return LZString.compressToEncodedURIComponent(JSON.stringify(params));
}

function decompressUrlParams(compressed) {
    try {
        return JSON.parse(LZString.decompressFromEncodedURIComponent(compressed));
    } catch (e) {
        return null;
    }
}
```

## 📊 定数定義

### スキルレベル倍率
```javascript
// script.js:6-20 - SKILL_LEVEL_MULTIPLIERS
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
    1.9,  // Lv.10
    2.0,  // Lv.11
    2.2,  // Lv.12
    2.4,  // Lv.13
    3.0   // Lv.14
];
```

### ボルテージレベル閾値
```javascript
// script.js:22-44 - VOLTAGE_LEVELS
const VOLTAGE_LEVELS = [
    0,    // Lv.0
    10,   // Lv.1
    30,   // Lv.2
    60,   // Lv.3
    100,  // Lv.4
    150,  // Lv.5
    210,  // Lv.6
    280,  // Lv.7
    360,  // Lv.8
    450,  // Lv.9
    550,  // Lv.10
    660,  // Lv.11
    780,  // Lv.12
    910,  // Lv.13
    1050, // Lv.14
    1200, // Lv.15
    1360, // Lv.16
    1530, // Lv.17
    1710, // Lv.18
    1900  // Lv.19
];
```

---

*このリファレンスは v1 commit f77bad6 に基づいています*
*作成日: 2024-07-24*