export interface UpdateEntry {
  version: string
  date: string
  changes: string[]
}

export const updateHistory: UpdateEntry[] = [
  {
    version: '2.2.1',
    date: '2025-08-05',
    changes: [
      '新楽曲「太陽であれ！」を追加',
      '新楽曲「太陽であれ！（-2秒）」を追加',
    ],
  },
  {
    version: '2.2.0',
    date: '2025-08-05',
    changes: [
      '新カード「[Prism Echo]日野下花帆」を追加',
      '新カード「[Prism Echo]村野さやか」を追加',
      '新カード「[Prism Echo]大沢瑠璃乃」を追加',
      '新カード「[Prism Echo]乙宗梢」を追加',
      '新カード「[Prism Echo]夕霧綴理」を追加',
      '新カード「[Prism Echo]藤島慈」を追加',
      '新カード「[Ether Aria]日野下花帆」を追加',
      '新カード「[Ether Aria]百生吟子」を追加',
      'Prism Echo/Ether Aria/Oracle Étudeシリーズは1枚のみ編成可能に制限',
    ],
  },
  {
    version: '2.1.0',
    date: '2025-08-05',
    changes: [
      '同一キャラクターを2枚まで編成可能に変更',
      'センタースキル・センター特性が重複して発動するように対応',
      'v1で保存したデータの読み込みに対応',
    ],
  },
  {
    version: '2.0.0',
    date: '2025-08-05',
    changes: ['システムの内部実装を改善', 'ログ表示の細かい調整'],
  },
  {
    version: '1.9.0',
    date: '2025-07-23',
    changes: [
      'AP不足時の参考スコア計算機能を追加',
      '詳細ログの表示改善（計算式、色分け）',
      'カード除外シミュレーション機能',
    ],
  },
  {
    version: '1.8.0',
    date: '2025-07-22',
    changes: [
      'センタースキル機能の実装',
      'センターキャラクターのハイライト表示',
      'スキルパラメータの編集機能',
    ],
  },
  {
    version: '1.7.0',
    date: '2025-07-21',
    changes: [
      'カスタム楽曲の保存/削除機能',
      'ローカルストレージによる設定保存',
      'ドラッグ&ドロップの改善',
    ],
  },
]

export const CURRENT_VERSION = '2.2.1'
