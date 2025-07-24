# v1 ローカルストレージ分析

## 保存されているデータの種類と形式

### 1. カードのスキルレベル
- **キー**: `sukushou_card_skill_${cardType}`
- **値**: スキルレベル (1-14の数値)
- **例**: `sukushou_card_skill_gingaKozu` → "14"

### 2. センタースキルレベル
- **キー**: `sukushou_card_center_skill_${cardType}`
- **値**: センタースキルレベル (1-14の数値)
- **例**: `sukushou_card_center_skill_gingaKozu` → "10"

### 3. カスタム楽曲リスト
- **キー**: `sukushou_custom_music_list`
- **値**: JSON形式のオブジェクト
```json
{
  "custom_1234567890": {
    "id": "custom_1234567890",
    "name": "カスタム楽曲名",
    "phases": [11, 7, 5],
    "centerCharacter": "乙宗梢",
    "attribute": "smile",
    "combos": {
      "normal": 100,
      "hard": 200,
      "expert": 300,
      "master": 400
    }
  }
}
```

### 4. 楽曲ごとの編成状態
- **キー**: `sukushou_state_${musicKey}`
- **値**: JSON形式のオブジェクト（カード構成とスキルレベル）

## v1の実装パターン

### 保存関数
```javascript
function saveCardSkillLevel(cardType, skillLevel) {
    if (!cardType) return;
    const key = `sukushou_card_skill_${cardType}`;
    localStorage.setItem(key, skillLevel);
}

function saveCardCenterSkillLevel(cardType, skillLevel) {
    if (!cardType || isShareMode) return; // 共有モードでは保存しない
    const key = `sukushou_card_center_skill_${cardType}`;
    localStorage.setItem(key, skillLevel);
}
```

### 読み込み関数
```javascript
function loadCardSkillLevel(cardType) {
    if (!cardType) return 14;
    const key = `sukushou_card_skill_${cardType}`;
    const savedLevel = localStorage.getItem(key);
    return savedLevel ? parseInt(savedLevel) : 14;
}

function loadCardCenterSkillLevel(cardType) {
    if (!cardType) return 14;
    const key = `sukushou_card_center_skill_${cardType}`;
    const savedLevel = localStorage.getItem(key);
    return savedLevel ? parseInt(savedLevel) : 14;
}
```

### カスタム楽曲の管理
```javascript
function getCustomMusicList() {
    const savedList = localStorage.getItem('sukushou_custom_music_list');
    return savedList ? JSON.parse(savedList) : {};
}

function saveCustomMusicList(list) {
    localStorage.setItem('sukushou_custom_music_list', JSON.stringify(list));
}
```

## v2での実装方針

### 1. 互換性の維持
- v1と同じキー名を使用してデータを保存
- v1で保存されたデータを読み込めるようにする

### 2. Zustandストアとの統合
- ローカルストレージの読み書きをZustandのミドルウェアで管理
- 状態変更時に自動的に保存

### 3. 実装手順
1. localStorageService.tsを作成してv1互換の読み書き関数を実装
2. gameStoreにpersistミドルウェアを追加
3. カード選択時、スキルレベル変更時に自動保存
4. アプリ起動時にローカルストレージからデータを復元

### 4. 注意点
- 共有モード時は保存しない（v1と同じ動作）
- カスタムスキル値は保存しない（スキルレベルから自動計算）
- センタースキルレベルも別途保存