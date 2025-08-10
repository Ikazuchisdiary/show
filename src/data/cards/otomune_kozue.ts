import { CardData } from '../../core/models/Card'

// Card data for 乙宗梢
const otomune_kozueCards: CardData = {
  gingaKozu: {
    name: 'Ginga Kozu',
    displayName: '［輪廻の銀河へ］乙宗梢',
    character: '乙宗梢',
    shortCode: 'Kg',
    apCost: 10,
    stats: {
      smile: 5160,
      pure: 4680,
      cool: 7440,
      mental: 480,
    },
    centerCharacteristic: {
      name: 'アピールアップ（102期）＆APレデュース',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: '102期',
          description: '102期生のアピール値が200%上昇',
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
        condition: 'count <= 3',
        then: [
          {
            type: 'voltageBoost',
            value: 2.16,
            description: 'ボルテージ216%ブースト (Lv.10)',
          },
          {
            type: 'resetCardTurn',
            description: 'カード順リセット',
          },
        ],
        else: [
          {
            type: 'scoreBoost',
            value: 2.16,
            description: 'スコア216%ブースト (Lv.10)',
          },
        ],
      },
    ],
  },
  bdKozu: {
    name: 'BD Kozu',
    displayName: '［18th Birthday］乙宗梢',
    character: '乙宗梢',
    shortCode: 'Kb',
    apCost: 10,
    stats: {
      smile: 5760,
      pure: 5760,
      cool: 5760,
      mental: 480,
    },
    centerCharacteristic: {
      name: 'アピールアップ（乙宗梢）',
      effects: [
        {
          type: 'appealBoost',
          value: 4,
          target: '乙宗梢',
          description: '乙宗梢のアピール値が400%上昇',
        },
      ],
    },
    effects: [
      {
        type: 'scoreBoost',
        value: 0.825,
        description: 'スコア82.5%ブースト (Lv.10)',
      },
      {
        type: 'voltageBoost',
        value: 0.825,
        description: 'ボルテージ82.5%ブースト (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'count <= 4',
        then: [
          {
            type: 'apGain',
            value: 5,
            description: 'AP獲得 (固定値)',
            levelValues: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'count <= 2',
        then: [
          {
            type: 'apGain',
            value: 5,
            description: 'さらにAP獲得 (固定値)',
            levelValues: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
          },
        ],
      },
    ],
    centerSkill: {
      effects: [
        {
          type: 'apGain',
          value: 4,
          description: 'AP獲得',
          levelValues: [4, 4, 4, 5, 5, 6, 6, 6, 7, 8, 8, 9, 10, 11],
        },
        {
          type: 'conditional',
          condition: 'turn >= 6',
          then: [
            {
              type: 'apGain',
              value: 2,
              description: 'さらにAP獲得',
              levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
            },
          ],
        },
      ],
      when: 'beforeFeverStart',
    },
  },
  beProudKozu: {
    name: 'Be Proud Kozu',
    displayName: '［be proud］乙宗梢',
    character: '乙宗梢',
    shortCode: 'Kp',
    apCost: 5,
    stats: {
      smile: 8640,
      pure: 5640,
      cool: 5040,
      mental: 510,
    },
    centerCharacteristic: {
      name: 'アピールアップ（102期）&APレデュース&CTレデュース',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: '102期',
          description: '102期生のアピール値が200%上昇',
        },
        {
          type: 'apReduce',
          value: 1,
          target: 'all',
          description: '全てのスキルの消費APが1減少',
        },
        {
          type: 'visualOnly',
          description: 'クールタイムが2秒減少（計算機では未対応）',
        },
      ],
    },
    effects: [
      {
        type: 'removeAfterUse',
        condition: 'skillLevel >= 12 ? count == 10 : count == 6',
        description: '6回使用後はデッキから除外 (Lv.12以上: 10回)',
      },
      {
        type: 'voltageBoost',
        value: 0.75,
        description: 'ボルテージ75%ブースト (Lv.10)',
      },
      {
        type: 'resetCardTurn',
        description: '山札リセット',
      },
    ],
  },
  kisekiKozu: {
    name: 'Kiseki Kozu',
    displayName: '［奇跡の舞踏会］乙宗梢',
    character: '乙宗梢',
    shortCode: 'Kk',
    apCost: 8,
    stats: {
      smile: 7200,
      pure: 5160,
      cool: 4920,
      mental: 480,
    },
    centerCharacteristic: {
      name: 'アピールアップ（102期）＆APレデュース',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: '102期',
          description: '102期生のアピール値が200%上昇',
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
            type: 'voltageBoost',
            value: 1.62,
            description: 'ボルテージ162%ブースト (Lv.10)',
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'voltageLevel >= 7',
        then: [
          {
            type: 'scoreBoost',
            value: 2.16,
            description: 'スコア216%ブースト (Lv.10)',
          },
        ],
      },
    ],
  },
  prismEchoKozu: {
    name: 'Prism Echo Kozu',
    displayName: '［Prism Echo］乙宗梢',
    character: '乙宗梢',
    shortCode: 'Kzpe',
    apCost: 12,
    stats: {
      smile: 7200,
      pure: 6720,
      cool: 6240,
      mental: 640,
    },
    centerCharacteristic: {
      name: 'アピールアップ・AP軽減・CT短縮',
      effects: [
        {
          type: 'appealBoost',
          value: 1.6,
          target: 'スリーズブーケ',
          description: 'スリーズブーケメンバーのアピール値が160%上昇',
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
          type: 'apGain',
          value: 12,
          description: 'AP回復',
          levelValues: [6, 7, 8, 8, 9, 10, 10, 11, 12, 12, 13, 14, 16, 18],
        },
      ],
      when: 'beforeFirstTurn',
    },
    effects: [
      {
        type: 'scoreBoost',
        value: 1.365,
        description: 'スコア136.5%ブースト (Lv.10)',
      },
      {
        type: 'voltageBoost',
        value: 1.365,
        description: 'ボルテージ136.5%ブースト (Lv.10)',
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
  etherAriaKozu: {
    name: 'Ether Aria Kozu',
    displayName: '［Ether Aria］乙宗梢',
    character: '乙宗梢',
    shortCode: 'Kea',
    apCost: 16,
    stats: {
      smile: 5880,
      pure: 5640,
      cool: 9000,
      mental: 590,
    },
    centerCharacteristic: {
      name: 'アピールアップ（スリーズブーケ）・AP軽減・CT短縮',
      effects: [
        {
          type: 'appealBoost',
          value: 1.6,
          target: 'スリーズブーケ',
          description: 'スリーズブーケメンバーのアピール値が160%上昇',
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
          type: 'apGain',
          value: 12,
          description: 'ライブ開始時AP回復（12）',
        },
      ],
      when: 'beforeFirstTurn',
    },
    effects: [
      {
        type: 'scoreBoost',
        value: 2.175,
        turns: 1,
        description: 'スコア獲得スキルによるスコア獲得量が1回の間217.5%上昇 (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'count <= 3',
        then: [
          {
            type: 'resetCardTurn',
            description: '次に発動するスキルをデッキの1枚目から順に戻す',
          },
        ],
      },
      {
        type: 'apGain',
        value: 0,
        levelValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 15, 20],
        description: 'AP回復 (Lv.11: 5, Lv.12: 10, Lv.13: 15, Lv.14: 20)',
      },
    ],
  },
}

export default otomune_kozueCards
