import { CardData } from '../../core/models/Card'

// Card data for 村野さやか
const murano_sayakaCards: CardData = {
  prismEchoSayaka: {
    name: 'Prism Echo Sayaka',
    displayName: '［Prism Echo］村野さやか',
    character: '村野さやか',
    shortCode: 'Spe',
    apCost: 20,
    stats: {
      smile: 6240,
      pure: 7680,
      cool: 6720,
      mental: 600,
    },
    centerCharacteristic: {
      name: 'アピールアップ・AP軽減・CT短縮',
      effects: [
        {
          type: 'appealBoost',
          value: 1.6,
          target: 'DOLLCHESTRA',
          description: 'DOLLCHESTRAメンバーのアピール値が160%上昇',
        },
        {
          type: 'apReduce',
          value: 2,
          target: 'all',
          description: '全スキルのAPを2軽減',
        },
        {
          type: 'visualOnly',
          description: 'クールタイムが2秒減少（計算機では未対応）',
        },
      ],
    },
    centerSkill: {
      effects: [
        {
          type: 'voltageGain',
          value: 279,
          description: 'ライブ開始時ボルテージ獲得 (Lv.10: 279pt)',
        },
      ],
      when: 'beforeFirstTurn',
    },
    effects: [
      {
        type: 'voltageGain',
        value: 585,
        description: 'ボルテージ獲得 (Lv.10: 585pt)',
      },
      {
        type: 'removeAfterUse',
        description: 'このカードを除外',
      },
      {
        type: 'apGain',
        value: 0,
        levelValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 15, 20],
        description: 'AP回復 (Lv.11: 5, Lv.12: 10, Lv.13: 15, Lv.14: 20)',
      },
    ],
  },
  etherAriaSayaka: {
    name: 'Ether Aria Sayaka',
    displayName: '［Ether Aria］村野さやか',
    character: '村野さやか',
    shortCode: 'Sea',
    apCost: 10,
    stats: {
      smile: 6240,
      pure: 5400,
      cool: 9240,
      mental: 570,
    },
    centerCharacteristic: {
      name: 'アピールアップ（DOLLCHESTRA）・AP軽減・CT短縮',
      effects: [
        {
          type: 'appealBoost',
          value: 1.6,
          target: 'DOLLCHESTRA',
          description: 'DOLLCHESTRAメンバーのアピール値が160%上昇',
        },
        {
          type: 'apReduce',
          value: 2,
          target: 'all',
          description: '全スキルのAPを2軽減',
        },
        {
          type: 'visualOnly',
          description: 'クールタイムが2秒減少（計算機では未対応）',
        },
      ],
    },
    centerSkill: {
      effects: [
        {
          type: 'voltageGain',
          value: 279,
          description: 'ライブ開始時にボルテージ獲得（279pt）',
        },
      ],
      when: 'beforeFirstTurn',
    },
    effects: [
      {
        type: 'voltageGain',
        value: 279,
        description: 'ボルテージ獲得 (Lv.10: 279pt)',
      },
      {
        type: 'conditional',
        condition: 'mental >= 100',
        then: [
          {
            type: 'voltageGain',
            value: 561,
            description: 'さらにボルテージ獲得 (Lv.10: 561pt)',
          },
        ],
      },
      {
        type: 'removeAfterUse',
        description: 'このカードを除外',
      },
      {
        type: 'apGain',
        value: 0,
        levelValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 15, 20],
        description: 'AP回復 (Lv.11: 5, Lv.12: 10, Lv.13: 15, Lv.14: 20)',
      },
    ],
  },
  iDoMeSayaka: {
    name: 'I Do Me Sayaka',
    displayName: '［アイドゥーミー！］村野さやか',
    character: '村野さやか',
    shortCode: 'Si',
    apCost: 14,
    stats: {
      smile: 6120,
      pure: 6960,
      cool: 6120,
      mental: 520,
    },
    centerCharacteristic: {
      name: 'アピールアップ（DOLLCHESTRA）',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: 'DOLLCHESTRA',
          description: 'DOLLCHESTRAに所属するメンバーのアピール値が200%上昇',
        },
      ],
    },
    effects: [
      {
        type: 'conditional',
        condition: 'count <= 1',
        then: [
          {
            type: 'voltageBoost',
            value: 0.525,
            description: 'ボルテージ52.5%ブースト (Lv.10)',
          },
        ],
        else: [
          {
            type: 'scoreBoost',
            value: 1.62,
            description: 'スコア162%ブースト (Lv.10)',
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'mental >= 100',
        then: [
          {
            type: 'voltageGain',
            value: 630,
            description: 'ボルテージ630獲得 (Lv.10)',
          },
        ],
        else: [
          {
            type: 'voltagePenalty',
            value: 1000,
            description: 'ボルテージ-1000',
          },
        ],
      },
    ],
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'scoreGain',
          value: 5.85,
          description: 'スコア585%獲得 (Lv.10)',
        },
        {
          type: 'conditional',
          condition: 'mental < 99',
          then: [
            {
              type: 'voltagePenalty',
              value: 1000,
              description: 'ボルテージ-1000',
            },
          ],
        },
      ],
    },
  },
  dolphinSayaka: {
    name: 'Dolphin Sayaka',
    displayName: '［ドルフィン〰ビーチ］村野さやか',
    character: '村野さやか',
    shortCode: 'Sd',
    apCost: 8,
    stats: {
      smile: 6480,
      pure: 5280,
      cool: 6000,
      mental: 440,
    },
    centerCharacteristic: {
      name: 'アピールアップ',
      effects: [
        {
          type: 'appealBoost',
          value: 0.72,
          target: 'all',
          description: '全メンバーのアピール値が72%上昇',
        },
      ],
    },
    effects: [
      {
        type: 'voltageGain',
        value: 75,
        description: 'ボルテージ75獲得 (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'mental >= 50',
        then: [
          {
            type: 'voltageGain',
            value: 80,
            description: 'ボルテージ80獲得 (Lv.10)',
          },
        ],
      },
    ],
    centerSkill: {
      when: 'beforeFirstTurn',
      effects: [
        {
          type: 'voltageGain',
          value: 232,
          description: 'ボルテージ232獲得 (Lv.10)',
        },
      ],
    },
  },
  shinjitsuSayaka: {
    name: 'Shinjitsu Sayaka',
    displayName: '［真実の舞踏会］村野さやか',
    character: '村野さやか',
    shortCode: 'Ss',
    apCost: 10,
    stats: {
      smile: 5160,
      pure: 4080,
      cool: 7920,
      mental: 490,
    },
    centerCharacteristic: {
      name: 'アピールアップ（103期）＆APレデュース',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: '103期',
          description: '103期生のアピール値が200%上昇',
        },
        {
          type: 'apReduce',
          value: 2,
          target: 'all',
          description: '全てのスキルの消費APが2減少',
        },
      ],
    },
    effects: [
      {
        type: 'conditional',
        condition: 'voltageLevel <= 8',
        then: [
          {
            type: 'voltageGain',
            value: 216,
            description: 'ボルテージ216獲得 (Lv.10)',
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'voltageLevel >= 7',
        then: [
          {
            type: 'scoreBoost',
            value: 3.72,
            description: 'スコア372%ブースト (Lv.10)',
          },
          {
            type: 'voltagePenalty',
            value: 50,
            description: 'ボルテージ-50',
          },
        ],
      },
    ],
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'voltageGain',
          value: 130,
          description: 'ボルテージ130獲得 (Lv.10)',
        },
        {
          type: 'conditional',
          condition: 'mental >= 50',
          then: [
            {
              type: 'voltageGain',
              value: 158,
              description: 'ボルテージ158獲得 (Lv.10)',
            },
          ],
        },
      ],
    },
  },
}

export default murano_sayakaCards
