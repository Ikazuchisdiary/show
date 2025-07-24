# v1 カード選択UI 詳細分析

## 📋 概要
v1のカード選択UIを詳細に分析し、v2との差分を特定して改善点を明確にする。

## 🎨 v1のビジュアル要素

### カードスロット（.card-slot）
```css
.card-slot {
    margin-bottom: 15px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 5px;
    border: 1px solid #e0e0e0;
    transition: all 0.2s ease;
    cursor: move;
    position: relative;
}
```

### カード番号（.card-number）
```css
.card-number {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #e0e0e0;
    color: #666;
    border-radius: 50%;
    font-weight: bold;
    margin-right: 10px;
}
```
- **重要**: v1では円形（border-radius: 50%）
- 背景色は#e0e0e0（グレー）
- ドラッグインジケーターなし

### スキルレベル選択（.skill-level-select）
```css
select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    background-color: white;
    box-sizing: border-box;
}
```

## 📝 スキルパラメータ表示

### スキル情報コンテナ（.skill-params）
```css
.skill-params {
    display: none;
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #e0e0e0;
    overflow-x: auto;
}
```

### パラメータ行（.skill-param-row）
```css
.skill-param-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
    flex-wrap: wrap;
}

.skill-param-row label {
    min-width: 150px;
    width: 150px;
    font-size: 14px;
    color: #666;
    font-weight: normal;
    margin: 0;
    padding: 0;
}

.skill-param-row input {
    flex: 1;
    min-width: 100px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 14px;
}
```

## 🔍 v1とv2の主な違い

### 1. カード番号の表示
- **v1**: 
  - 四角形（border-radius: 6px）
  - 白背景、#e0e0e0のボーダー
  - ドラッグヒント（⋮⋮）があるが数字と重なっている
  - サイズ: 32px × 32px
  - box-shadow付き
- **v2**: 
  - v1と同じスタイルに更新済み
  - ドラッグヒントは削除（数字と重なるため）
- **改善済み**: ✅

### 2. カード選択ドロップダウン
- **v1**: 
  - シンプルな`<select>`要素
  - カード名のみ表示（shortCodeなし）
  - グループヘッダーに「限定-」などのプレフィックスあり
- **v2**:
  - カスタムドロップダウン実装
  - 検索機能付き
  - グループヘッダーはキャラ名のみ

### 3. スキルパラメータの編集UI
- **v1**: 
  - 入力フィールドがすべて同じ幅
  - ラベルが150px固定幅
  - 効果の説明が背景色付きspan
- **v2**:
  - 入力フィールドの幅が可変
  - ラベルも150pxだが、レイアウトが異なる

### 4. 条件付き効果の表示
- **v1**:
  ```html
  <div style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px;">
      <div style="font-weight: bold; margin-bottom: 5px;">使用回数 ≤ 3</div>
      <div>
          <div style="font-weight: bold; color: #2196F3;">▶ 成立時</div>
          <!-- 効果リスト -->
      </div>
      <div style="margin-top: 5px;">
          <div style="font-weight: bold; color: #f44336;">▶ 不成立時</div>
          <!-- 効果リスト -->
      </div>
  </div>
  ```

### 5. フォントと色
- **v1**: 
  - フォント: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - 成立時の色: `#2196F3`（青）
  - 不成立時の色: `#f44336`（赤）

## 🛠️ 改善タスク

1. **カード番号を円形に変更**
   - border-radius: 50%
   - 背景色を#e0e0e0に
   - ドラッグインジケーターを削除

2. **グループヘッダーの改善**
   - カードのカテゴリ情報を追加（「限定-」など）
   - v1のグループ構造を再現

3. **スキルパラメータのレイアウト統一**
   - すべての入力フィールドを同じ幅に
   - 効果説明のspan要素のスタイル統一

4. **色の調整**
   - 成立時: #2196F3
   - 不成立時: #f44336
   - 各種背景色をv1に合わせる

5. **センタースキル表示の追加**
   - オレンジ色（#ff9800）でセンタースキル表示
   - センタースキルレベル選択

---

*分析日: 2024-07-24*
*基準バージョン: v1 commit f77bad6*