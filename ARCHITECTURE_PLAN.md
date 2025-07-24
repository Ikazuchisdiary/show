# スクショウ計算ツール リアーキテクチャ計画書

## 概要

本ドキュメントは、スクショウ計算ツールのリアーキテクチャ計画を記載したものです。
現在のプレーンなHTML/CSS/JavaScript構成から、モダンな開発環境への段階的な移行を目指します。

## 現状分析

### 現在の構造
- **ファイル構成**: index.html, script.js (4,868行), cardData.js, style.css
- **クラス設計**: Game, Card, GenericCard
- **デプロイ**: GitHub Pages（静的ホスティング）

### 主な問題点
1. **コードの巨大化**: script.jsが4,868行に達し、保守性が低下
2. **モジュール化の欠如**: すべてのロジックが単一ファイルに集中
3. **型安全性の不足**: JavaScriptのため、型エラーが実行時まで検出されない
4. **テストの欠如**: 自動テストが存在せず、手動テストに依存
5. **ビルドプロセスの不在**: 最適化やトランスパイルが行われていない
6. **グローバル変数の多用**: 名前空間の汚染とデバッグの困難さ

## 推奨技術スタック

### コア技術
- **TypeScript**: 型安全性の確保とIDEサポートの向上
- **Vite**: 高速な開発サーバーとビルドツール
- **React**: コンポーネントベースのUI構築
- **Zustand**: シンプルで軽量な状態管理

### 開発ツール
- **Vitest**: Viteと統合されたテストフレームワーク
- **ESLint + Prettier**: コード品質とフォーマットの統一
- **GitHub Actions**: CI/CDパイプライン

### デプロイ
- **GitHub Pages**: 現行通り（docsフォルダにビルド出力）

## 新アーキテクチャ設計

### ディレクトリ構造

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

## 段階的移行計画

### Phase 1: 開発環境の構築（1-2週間）

#### 目標
- モダンな開発環境の確立
- 既存機能の動作確認
- CI/CDパイプラインの構築

#### タスク
1. **プロジェクト初期化**
   - Vite + React + TypeScriptのセットアップ
   - ESLint, Prettierの設定
   - パッケージ構成の決定

2. **開発環境の整備**
   - VSCode設定ファイルの作成
   - Git hooksの設定（Husky）
   - コミット規約の導入

3. **CI/CD設定**
   - GitHub Actionsワークフローの作成
   - 自動テスト実行の設定
   - 自動デプロイの設定（docsフォルダへ）

4. **互換性テスト環境**
   - 現行版と新版の並行動作確認
   - E2Eテストの基盤構築

### Phase 2: コアロジックの移植（2-3週間）

#### 目標
- ゲームロジックのTypeScript化
- 単体テストの網羅
- データ層の分離

#### タスク
1. **型定義の作成**
   - Card, Game, Effect等のインターフェース定義
   - 型安全なデータ構造の設計

2. **計算ロジックの移植**
   - appeal.ts: アピール値計算
   - score.ts: スコア計算
   - voltage.ts: ボルテージ計算
   - ap.ts: AP計算

3. **シミュレーターの実装**
   - GameSimulatorクラスの作成
   - 既存のGameクラスロジックの移植

4. **テストの作成**
   - 各計算関数の単体テスト
   - シミュレーターの統合テスト
   - 既存版との出力比較テスト

### Phase 3: UI層の再構築（2-3週間）

#### 目標
- Reactコンポーネント化
- 状態管理の導入
- UXの改善

#### タスク
1. **基本コンポーネントの作成**
   - CardSelector: カード選択UI
   - ScoreDisplay: スコア表示
   - SimulationControls: シミュレーション制御

2. **状態管理の実装**
   - gameStore: ゲーム状態
   - cardStore: カード選択状態
   - settingsStore: 設定情報

3. **既存UIの再現**
   - 現行デザインの踏襲
   - レスポンシブ対応の改善
   - アクセシビリティの向上

4. **新機能の追加**
   - リアルタイムプレビュー
   - アンドゥ/リドゥ機能
   - キーボードショートカット

### Phase 4: 最適化と拡張（1-2週間）

#### 目標
- パフォーマンスの最適化
- 新機能の実装
- ドキュメントの整備

#### タスク
1. **パフォーマンス最適化**
   - React.memoによる再レンダリング最適化
   - 遅延ローディングの実装
   - バンドルサイズの削減

2. **新機能の実装**
   - 詳細ログのエクスポート機能
   - 複数パターンの比較機能
   - カスタムカード作成機能

3. **ドキュメント整備**
   - APIドキュメントの作成
   - 開発者向けガイド
   - ユーザーマニュアル

4. **移行完了**
   - 旧版からの完全移行
   - リダイレクト設定
   - アナウンス

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

## リスクと対策

### 技術的リスク
1. **バンドルサイズの増加**
   - 対策: Tree-shaking、Code-splitting、圧縮

2. **ブラウザ互換性**
   - 対策: Babel設定、Polyfill、機能検出

3. **パフォーマンス低下**
   - 対策: プロファイリング、最適化、CDN活用

### 運用リスク
1. **移行期間中の混乱**
   - 対策: 明確なバージョン表示、移行ガイド

2. **データ互換性**
   - 対策: データマイグレーション、後方互換性

3. **ユーザー離脱**
   - 対策: 段階的移行、フィードバック対応

## まとめ

本リアーキテクチャにより、以下の改善が期待されます：

- **開発効率の向上**: TypeScriptとモダンツールによる生産性向上
- **保守性の改善**: モジュール化とテストによる品質保証
- **拡張性の確保**: 明確な責務分離による新機能追加の容易さ
- **ユーザー体験の向上**: パフォーマンス改善と新機能

段階的な移行により、リスクを最小限に抑えながら、着実にモダンなアーキテクチャへと移行します。