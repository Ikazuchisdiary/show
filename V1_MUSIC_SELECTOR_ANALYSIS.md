# V1 Music Selector UI Analysis

This document provides a comprehensive analysis of the music selector UI implementation in v1, covering HTML structure, CSS styling, and JavaScript behavior.

## 1. HTML Structure

### Main Music Selector Structure
```html
<div class="music-info-section">
    <div class="section-header">
        <h3>楽曲情報</h3>
    </div>
    <div class="section-content">
        <div class="form-group">
            <label>楽曲選択:</label>
            <div class="music-select-wrapper">
                <!-- Custom dropdown display -->
                <div class="music-select-display" onclick="toggleMusicDropdown()">
                    <div class="music-select-value">
                        <span class="music-select-title">愛♡スクリ〜ム！</span>
                        <span class="music-select-info">18-7-6 • 大沢瑠璃乃</span>
                    </div>
                    <div class="music-select-arrow">▼</div>
                </div>
                <!-- Dropdown menu -->
                <div class="music-dropdown" id="musicDropdown">
                    <div class="music-search-container">
                        <input type="text" class="music-search-input" id="musicSearchInput" 
                               placeholder="楽曲名・センターで検索..." onkeyup="filterMusicDropdown()">
                    </div>
                    <div class="music-dropdown-items">
                        <!-- Dynamically generated items -->
                    </div>
                </div>
            </div>
            <!-- Hidden select for form data -->
            <select id="music" onchange="toggleMusicInput()" style="display: none;">
                <!-- Options -->
            </select>
        </div>
        
        <!-- Stats row -->
        <div class="stats-row">
            <div class="stats-group">
                <label for="difficulty">難易度</label>
                <select id="difficulty">
                    <option value="normal">NORMAL</option>
                    <option value="hard">HARD</option>
                    <option value="expert">EXPERT</option>
                    <option value="master" selected>MASTER</option>
                </select>
            </div>
            <div class="stats-group">
                <label for="mental">初期メンタル (%)</label>
                <input type="number" id="mental" value="100" min="0" max="100">
            </div>
            <div class="stats-group">
                <label for="learningCorrection">ラーニング補正</label>
                <input type="number" id="learningCorrection" value="1.5" min="0" step="0.01">
            </div>
        </div>
        
        <!-- Custom music section -->
        <div id="customMusic" class="custom-music-inner" style="display: none;">
            <!-- Custom music content -->
        </div>
    </div>
</div>
```

### Custom Music Section Structure
```html
<div id="customMusic" class="custom-music-inner" style="display: none;">
    <div class="custom-music-card">
        <div class="custom-music-header">
            <h3>カスタム楽曲設定</h3>
        </div>
        
        <!-- Phase inputs -->
        <div class="phase-inputs-section">
            <div class="section-label">ターン数設定</div>
            <div class="phase-inputs-container">
                <div class="phase-input-group">
                    <label>フィーバー前</label>
                    <input type="number" id="beforeFever" value="11" min="0">
                </div>
                <div class="phase-separator">→</div>
                <div class="phase-input-group fever">
                    <label>フィーバー中</label>
                    <input type="number" id="duringFever" value="7" min="0">
                </div>
                <div class="phase-separator">→</div>
                <div class="phase-input-group">
                    <label>フィーバー後</label>
                    <input type="number" id="afterFever" value="5" min="0">
                </div>
            </div>
        </div>
        
        <!-- Custom music settings -->
        <div class="custom-music-settings">
            <div class="setting-row">
                <label class="setting-label">センターキャラクター</label>
                <select id="customCenterCharacter" onchange="updateCardHighlighting()">
                    <option value="">なし</option>
                    <!-- Character options -->
                </select>
            </div>
            
            <div class="custom-attribute-section">
                <label for="customAttribute">楽曲属性</label>
                <select id="customAttribute">
                    <option value="smile">スマイル</option>
                    <option value="pure">ピュア</option>
                    <option value="cool">クール</option>
                </select>
            </div>
            
            <!-- Combo inputs -->
            <div class="combo-inputs-section">
                <div class="section-label">コンボ数設定</div>
                <div class="combo-inputs-container">
                    <div class="combo-input-group">
                        <label>NORMAL</label>
                        <input type="number" id="customComboNormal" placeholder="コンボ数" min="0">
                    </div>
                    <!-- HARD, EXPERT, MASTER inputs -->
                </div>
            </div>
            
            <!-- Save row -->
            <div id="saveMusicRow" class="save-music-row">
                <input type="text" id="customMusicName" placeholder="カスタム楽曲名を入力" onkeyup="updateSaveButtonText()">
                <button id="customMusicSaveButton" onclick="saveCustomMusic()" class="save-button">
                    <span class="save-icon">💾</span>
                    <span id="saveButtonText">保存</span>
                </button>
            </div>
        </div>
    </div>
    
    <!-- Saved custom music list -->
    <div id="savedCustomMusic"></div>
</div>
```

## 2. CSS Styling Details

### Music Info Section
```css
.music-info-section {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    margin-bottom: 20px;
    overflow: hidden;
}

.music-info-section .section-header {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
}

.music-info-section .section-header h3 {
    margin: 0;
    font-size: 16px;
    color: #333;
    font-weight: 600;
}

.music-info-section .section-content {
    padding: 20px;
}
```

### Music Dropdown Styling
```css
/* Wrapper */
.music-select-wrapper {
    position: relative;
    width: 100%;
}

/* Display (closed dropdown) */
.music-select-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px 15px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.music-select-display:hover {
    border-color: #4CAF50;
    background: #fafafa;
}

.music-select-display.active {
    border-color: #4CAF50;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

/* Value display */
.music-select-value {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.music-select-title {
    font-weight: 600;
    font-size: 15px;
    color: #333;
}

.music-select-info {
    font-size: 12px;
    color: #666;
}

/* Arrow */
.music-select-arrow {
    color: #666;
    font-size: 14px;
    transition: transform 0.2s ease;
}

.music-select-display.active .music-select-arrow {
    transform: rotate(180deg);
}

/* Dropdown menu */
.music-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #4CAF50;
    border-top: none;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 1000;
    display: none;
    max-height: 400px;
    overflow: hidden;
}

.music-dropdown.show {
    display: block;
}

/* Search container */
.music-search-container {
    padding: 8px;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    position: sticky;
    top: 0;
    z-index: 1;
}

.music-search-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background: white;
}

.music-search-input:focus {
    outline: none;
    border-color: #4CAF50;
}

/* Dropdown items */
.music-dropdown-items {
    max-height: calc(400px - 50px);
    overflow-y: auto;
}

.music-dropdown-item {
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background 0.2s ease;
}

.music-dropdown-item:last-child {
    border-bottom: none;
}

.music-dropdown-item:hover {
    background: #f5f5f5;
}

.music-dropdown-item.selected {
    background: #e8f5e9;
}
```

### Stats Row
```css
.stats-row {
    display: flex;
    gap: 15px;
    margin-top: 15px;
}

.stats-group {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.stats-group label {
    display: block;
    font-size: 14px;
    color: #555;
    margin-bottom: 5px;
}
```

### Custom Music Section
```css
/* Main container */
.custom-music-inner {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
}

.custom-music-card {
    background: white;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
}

.custom-music-header {
    background: transparent;
    padding: 0 0 10px 0;
    border: none;
}

.custom-music-header h3 {
    margin: 0;
    font-size: 14px;
    color: #333;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Phase inputs */
.phase-inputs-section {
    padding: 20px 0;
    border-bottom: 1px solid #e0e0e0;
}

.section-label {
    font-size: 13px;
    color: #666;
    margin-bottom: 12px;
    font-weight: 600;
}

.phase-inputs-container {
    display: flex;
    align-items: center;
    gap: 15px;
    justify-content: center;
}

.phase-input-group {
    text-align: center;
}

.phase-input-group label {
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 6px;
    font-weight: 500;
}

.phase-input-group input[type="number"] {
    width: 70px;
    text-align: center;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.2s ease;
}

.phase-input-group input[type="number"]:focus {
    border-color: #4CAF50;
    outline: none;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

/* Fever phase special styling */
.phase-input-group.fever label {
    color: #ff6b6b;
    font-weight: 600;
}

.phase-input-group.fever input {
    border-color: #ffe0e0;
    background: #fff5f5;
}

.phase-input-group.fever input:focus {
    border-color: #ff6b6b;
}

.phase-separator {
    font-size: 20px;
    color: #999;
    font-weight: 300;
}

/* Settings */
.custom-music-settings {
    padding: 20px 0 0 0;
}

.setting-row {
    margin-bottom: 15px;
}

.setting-label {
    display: block;
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    font-weight: 600;
}

.setting-row select {
    width: 100%;
    max-width: 350px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background: white;
}

/* Custom attribute section */
.custom-attribute-section {
    margin-bottom: 20px;
}

.custom-attribute-section label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    color: #666;
    font-weight: 600;
}

.custom-attribute-section select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background: white;
}

/* Combo inputs */
.combo-inputs-section {
    margin-top: 20px;
}

.combo-inputs-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    max-width: 350px;
}

.combo-input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.combo-input-group label {
    font-size: 12px;
    color: #666;
    font-weight: 500;
}

.combo-input-group input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

/* Save row */
.save-music-row {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.save-music-row input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

.save-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.save-button:hover {
    background: #45a049;
    transform: translateY(-1px);
}

.save-button.overwrite-mode {
    background: #ff9800;
}

.save-button.overwrite-mode:hover {
    background: #f57c00;
}

.save-icon {
    font-size: 14px;
}

/* Saved custom music list */
.saved-music-container {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
}

.saved-music-header {
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
    font-size: 14px;
}

.saved-music-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    transition: all 0.2s ease;
}

.saved-music-item:hover {
    border-color: #4CAF50;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.saved-music-item:last-child {
    margin-bottom: 0;
}

.saved-music-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.saved-music-name {
    font-weight: 500;
    color: #333;
    display: flex;
    align-items: center;
    gap: 6px;
}

.saved-music-phases {
    font-size: 13px;
    color: #666;
    background: #f0f0f0;
    padding: 2px 8px;
    border-radius: 4px;
}

.saved-music-center {
    font-size: 12px;
    color: #ff9800;
    font-weight: 600;
    background: #fff8e1;
    padding: 2px 8px;
    border-radius: 4px;
}

/* Delete button */
.delete-button {
    width: 24px;
    height: 24px;
    min-width: 24px;
    padding: 0;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    transition: all 0.2s ease;
}

.delete-button:hover {
    background: #d32f2f;
    transform: scale(1.1);
}
```

### Mobile Responsive Styles
```css
@media (max-width: 600px) {
    /* Stack stats row on mobile */
    .stats-row {
        flex-direction: column;
        gap: 15px;
    }
    
    .stats-group {
        width: 100%;
    }
    
    /* Simplify music info section on mobile */
    .music-info-section {
        border-radius: 8px;
        margin-bottom: 15px;
    }
    
    .music-info-section .section-header {
        padding: 12px 15px;
    }
    
    .music-info-section .section-header h3 {
        font-size: 15px;
    }
    
    .music-info-section .section-content {
        padding: 15px;
    }
}
```

### Share Mode Styles
```css
/* Disable music selector in share mode */
body.share-mode .music-select-display {
    cursor: not-allowed;
    opacity: 0.7;
    background: #f5f5f5;
}

body.share-mode .music-select-arrow {
    opacity: 0.5;
}
```

## 3. JavaScript Behavior

### Key Functions

#### toggleMusicDropdown()
- Toggles the dropdown visibility
- Adds/removes 'active' class to display element
- Adds/removes 'show' class to dropdown
- Clears search input and resets filter when opening
- Focuses search input when opened
- Disabled in share mode

#### filterMusicDropdown()
- Filters dropdown items based on search input
- Searches both music title and center character name
- Shows/hides items based on match
- Updates no results message

#### selectMusic(value)
- Updates the hidden select element value
- Calls toggleMusicInput() to handle display changes
- Updates the display element with selected music info
- Closes the dropdown
- Updates card highlighting for center character

#### toggleMusicInput()
- Shows/hides custom music section based on selection
- Loads saved custom music data when selecting saved custom
- Handles state saving/loading for different music selections
- Updates save button text (save vs overwrite)
- Manages form field values

#### saveCustomMusic()
- Validates input (name required)
- Creates unique key (custom_timestamp)
- Checks for duplicate names (enables overwrite mode)
- Saves to localStorage
- Updates musicData object
- Updates dropdown
- Shows success message

#### deleteCustomMusic(key)
- Confirms deletion with user
- Removes from localStorage
- Removes from musicData
- Updates dropdown
- Updates display

#### updateSavedCustomMusicDisplay()
- Renders list of saved custom music
- Shows name, phases, and center character
- Includes delete button for each item
- Hidden in share mode

### Dropdown Item Structure
Each dropdown item is generated with:
```javascript
<div class="music-dropdown-item" data-value="key" onclick="selectMusic('key')">
    <div class="music-item-main">
        <span class="music-title">楽曲名</span>
        <span class="music-phases">18-7-6</span>
    </div>
    <div class="music-item-center">大沢瑠璃乃</div>
</div>
```

Custom music items have additional class:
```javascript
<div class="music-dropdown-item custom-item" ...>
```

## 4. Key Visual Details

1. **Border radius**: 6px for inputs and buttons, 12px for main section
2. **Colors**:
   - Primary green: #4CAF50 (hover: #45a049)
   - Delete red: #f44336 (hover: #d32f2f)
   - Orange (overwrite): #ff9800 (hover: #f57c00)
   - Fever red: #ff6b6b
   - Center character orange: #ff9800
   - Background grays: #f8f9fa, #f0f0f0, #e0e0e0
3. **Transitions**: 0.2s ease for all interactive elements
4. **Box shadows**: 
   - Dropdown: 0 4px 12px rgba(0,0,0,0.1)
   - Hover states: 0 2px 4px rgba(0,0,0,0.05)
   - Focus states: 0 0 0 2px rgba(76, 175, 80, 0.1)
5. **Font sizes**:
   - Section headers: 16px
   - Labels: 13px (font-weight: 600)
   - Regular text: 14px
   - Small text: 12px
6. **Spacing**:
   - Section padding: 20px
   - Element gaps: 10-15px
   - Input padding: 8-10px

## 5. Implementation Notes

1. The music selector uses a custom dropdown instead of native select for better styling
2. The actual select element is hidden but maintained for form data
3. Search functionality is client-side filtering
4. Custom music data is stored in localStorage with keys like "customMusicList"
5. Each saved custom music has a unique key format: "custom_[timestamp]"
6. The dropdown dynamically rebuilds when custom music is added/deleted
7. Share mode disables music selection but allows viewing
8. Phase inputs have special styling for the fever phase (red theme)
9. Save button changes to "overwrite" mode when name matches existing
10. Mobile responsive design stacks elements vertically below 600px

This analysis should provide all the necessary details to recreate the v1 music selector UI exactly in v2.