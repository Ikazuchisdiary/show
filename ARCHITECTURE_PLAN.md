# スクショウ計算ツール リアーキテクチャ計画書

## 概要

本ドキュメントは、スクショウ計算ツールのリアーキテクチャ計画を記載したものです。
v1のプレーンなHTML/CSS/JavaScript構成から、v2のモダンなTypeScript/React/Vite環境への移行が**2025年7月25日に完了**しました。

## 移行前の状況（v1）

### 旧構造
- **ファイル構成**: index.html, script.js (4,868行), cardData.js, style.css
- **クラス設計**: Game, Card, GenericCard
- **デプロイ**: GitHub Pages（静的ホスティング）

### 移行前の問題点（すべて解決済み）
1. ~~**コードの巨大化**: script.jsが4,868行に達し、保守性が低下~~ → **解決**: モジュール化完了
2. ~~**モジュール化の欠如**: すべてのロジックが単一ファイルに集中~~ → **解決**: 適切な分割を実施
3. ~~**型安全性の不足**: JavaScriptのため、型エラーが実行時まで検出されない~~ → **解決**: TypeScript化完了
4. ~~**テストの欠如**: 自動テストが存在せず、手動テストに依存~~ → **解決**: Vitest導入済み
5. ~~**ビルドプロセスの不在**: 最適化やトランスパイルが行われていない~~ → **解決**: Vite導入済み
6. ~~**グローバル変数の多用**: 名前空間の汚染とデバッグの困難さ~~ → **解決**: モジュール化完了

## 現在の技術スタック（v2）

### 実装済みの技術
- **TypeScript** ✅: 型安全性の確保とIDEサポートの向上
- **Vite** ✅: 高速な開発サーバーとビルドツール
- **React** ✅: コンポーネントベースのUI構築
- **Zustand** ✅: シンプルで軽量な状態管理

### 開発ツール
- **Vitest** ✅: Viteと統合されたテストフレームワーク
- **ESLint** ✅: コード品質の統一
- **Prettier** ✅: コードフォーマットの統一
- **GitHub Actions**: CI/CDパイプライン（未実装）

### デプロイ
- **開発環境**: `/v2/` ディレクトリで稼働中
- **本番環境**: GitHub Pages対応予定（docsフォルダにビルド出力）

## 実装済みアーキテクチャ（v2）

### 現在のディレクトリ構造

```
sukushou/
├── src/
│   ├── components/          # UIコンポーネント
│   │   ├── CardSelector/
│   │   │   ├── index.tsx
│   │   │   ├── CardSelector.tsx
│   │   │   └── CardSelector.test.tsx
│   │   ├── ScoreDisplay/
│   │   │   ├── index.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   └── ScoreDisplay.test.tsx
│   │   ├── SimulationControls/
│   │   │   ├── index.tsx
│   │   │   ├── SimulationControls.tsx
│   │   │   └── SimulationControls.test.tsx
│   │   └── UpdateBanner/
│   │       ├── index.tsx
│   │       └── UpdateBanner.tsx
│   │
│   ├── core/               # ゲームロジック（UIに依存しない）
│   │   ├── models/         # 型定義
│   │   │   ├── Card.ts
│   │   │   ├── Game.ts
│   │   │   ├── Music.ts
│   │   │   └── Effect.ts
│   │   ├── calculations/   # 計算ロジック
│   │   │   ├── appeal.ts
│   │   │   ├── score.ts
│   │   │   ├── voltage.ts
│   │   │   └── ap.ts
│   │   └── simulation/     # シミュレーション実行
│   │       ├── GameSimulator.ts
│   │       └── GameSimulator.test.ts
│   │
│   ├── data/               # 静的データ
│   │   ├── cards/
│   │   │   └── cardData.json
│   │   ├── music/
│   │   │   └── musicData.json
│   │   └── constants.ts
│   │
│   ├── hooks/              # カスタムReactフック
│   │   ├── useGameSimulation.ts
│   │   ├── useCardSelection.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── stores/             # Zustand状態管理
│   │   ├── gameStore.ts
│   │   ├── cardStore.ts
│   │   └── settingsStore.ts
│   │
│   ├── utils/              # ユーティリティ関数
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── share.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/                 # 静的アセット
│   └── favicon.ico
│
├── docs/                   # ビルド出力（GitHub Pages用）
│
├── tests/                  # E2Eテスト
│   └── simulation.e2e.ts
│
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions設定
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── ARCHITECTURE_PLAN.md
├── CLAUDE.md
└── README.md
```

### 主要コンポーネントの責務

#### コアロジック層（src/core/）
- **純粋関数による実装**: UIに依存しない計算ロジック
- **単体テスト可能**: すべての関数に対してテストを記述
- **型安全**: TypeScriptによる厳格な型定義

#### UI層（src/components/）
- **React関数コンポーネント**: フックを活用したモダンな実装
- **単一責任の原則**: 各コンポーネントは1つの責務のみを持つ
- **Storybookでの開発**: コンポーネントカタログの作成（オプション）

#### 状態管理（src/stores/）
- **Zustandによるシンプルな実装**: Reduxよりも学習コストが低い
- **永続化**: LocalStorageとの連携
- **DevTools対応**: デバッグの容易さ

## 移行完了状況

### Phase 1: 開発環境の構築 ✅ **完了**

#### 達成項目
- ✅ Vite + React + TypeScriptのセットアップ
- ✅ ESLint, Prettierの設定
- ✅ VSCode設定ファイルの作成
- ✅ 開発環境での動作確認

#### 未実装項目
- ⏳ GitHub Actionsワークフロー（次期対応）
- ⏳ E2Eテスト（必要に応じて追加）

### Phase 2: コアロジックの移植 ✅ **完了**

#### 達成項目
- ✅ Card, Game, Effect等のインターフェース定義
- ✅ GameSimulatorクラスの完全実装
- ✅ すべての計算ロジックのTypeScript化
- ✅ v1との完全な互換性確保

### Phase 3: UI層の再構築 ✅ **完了**

#### 達成項目
- ✅ すべてのコンポーネントのReact化
- ✅ Zustandによる状態管理
- ✅ v1と同等のUI/UX
- ✅ レスポンシブ対応
- ✅ モバイルタッチ対応

### Phase 4: 機能拡張 ✅ **v1機能は完了**

#### 達成項目
- ✅ URL共有機能
- ✅ カスタム楽曲管理
- ✅ アップデートバナー
- ✅ 詳細ログ表示
- ✅ AP不足計算
- ✅ 重複キャラクター検出

#### 今後の新機能（v1にない機能）
- ⏳ リアルタイムプレビュー
- ⏳ アンドゥ/リドゥ機能
- ⏳ キーボードショートカット
- ⏳ 詳細ログのエクスポート

## GitHub Pagesデプロイ戦略

### ビルド設定
```javascript
// vite.config.ts
export default {
  base: '/sukushou/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  }
}
```

### GitHub Actions ワークフロー
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v2
        with:
          path: ./docs
      - uses: actions/deploy-pages@v2
```

### 移行手順
1. **並行運用期間**
   - 現行版: `/` (index.html)
   - 新版: `/v2/` (docs/index.html)

2. **段階的切り替え**
   - ベータ版として公開
   - フィードバック収集
   - 安定版リリース

3. **完全移行**
   - 旧版を`/legacy/`に移動
   - 新版を`/`に配置
   - 301リダイレクト設定

## 今後の課題と対策

### 残作業
1. **本番デプロイ**
   - GitHub Pagesへのビルド・デプロイ設定
   - v1からv2への移行戦略

2. **CI/CD整備**
   - GitHub Actionsの設定
   - 自動テストの拡充

3. **パフォーマンス最適化**
   - バンドルサイズの削減
   - Code-splittingの実装

### 新機能の追加計画

#### 優先度：高
1. **カードコレクション管理機能**
   - 所持カード一覧画面の新規作成
   - カードごとのスキルレベル設定UI
   - ローカルストレージでの永続化
   - カード選択時のフィルタリング機能
   - インポート/エクスポート機能

2. **最適編成探索機能**
   - 遺伝的アルゴリズムまたは動的計画法による探索
   - AP制約を考慮した実現可能解の生成
   - 探索進捗のリアルタイム表示
   - 複数候補の比較機能
   - 探索条件のカスタマイズ（センターキャラ固定など）

#### 優先度：中
3. **リアルタイムプレビュー**
   - カード変更時の即座の反映
   - アニメーション付きスコア更新

4. **アンドゥ/リドゥ**
   - 操作履歴の管理
   - キーボードショートカット

#### 優先度：低
5. **エクスポート機能**
   - 詳細ログのCSV/JSON出力
   - 画像としての結果保存

## 成果

本リアーキテクチャにより、以下の改善を達成しました：

- **開発効率の向上** ✅: TypeScriptとモダンツールによる生産性向上
- **保守性の改善** ✅: モジュール化とテストによる品質保証
- **拡張性の確保** ✅: 明確な責務分離による新機能追加の容易さ
- **ユーザー体験の向上** ✅: v1と同等の機能を維持しつつ、より良いパフォーマンス

移行は**2025年7月25日に成功裏に完了**し、v2はv1の全機能を完全に再現しています。