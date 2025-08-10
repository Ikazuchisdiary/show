import { CardData } from '../../core/models/Card'

// Card data for 藤島慈
const fujishima_megumiCards: CardData = {
  bdMegu: {
    name: 'BD Megu',
    displayName: '［18th Birthday］藤島慈',
    character: '藤島慈',
    shortCode: 'Mb',
    apCost: 10,
    stats: {
      smile: 5760,
      pure: 5760,
      cool: 5760,
      mental: 480,
    },
    centerCharacteristic: {
      name: 'アピールアップ（藤島慈）',
      effects: [
        {
          type: 'appealBoost',
          value: 4,
          target: '藤島慈',
          description: '藤島慈のアピール値が400%上昇',
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
            description: 'AP獲得',
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
            description: '追加AP獲得',
            levelValues: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
          },
        ],
      },
    ],
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'scoreGain',
          value: 2.4552,
          description: 'スコア245.52%獲得 (Lv.10)',
        },
      ],
    },
  },
  angelMegu: {
    name: 'Angel Megu',
    displayName: '［やっぱ天使！］藤島慈',
    character: '藤島慈',
    shortCode: 'Ma',
    apCost: 12,
    stats: {
      smile: 5580,
      pure: 8580,
      cool: 4800,
      mental: 540,
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
        type: 'scoreGain',
        value: 2.175,
        description: 'スコア217.5%獲得 (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'turn >= 15',
        then: [
          {
            type: 'scoreBoost',
            value: 4.86,
            description: 'スコア486%ブースト (Lv.10)',
          },
        ],
      },
      {
        type: 'apGain',
        value: 2,
        description: 'AP獲得 (Lv.12以上)',
        levelValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
      },
    ],
    centerSkill: {
      when: 'afterLastTurn',
      effects: [
        {
          type: 'scoreGain',
          value: 3.825,
          description: 'スコア382.5%獲得 (Lv.10)',
        },
      ],
    },
  },
  kuonMegu: {
    name: 'Kuon Megu',
    displayName: '［久遠の銀河へ］藤島慈',
    character: '藤島慈',
    shortCode: 'Mk',
    apCost: 10,
    stats: {
      smile: 7200,
      pure: 4920,
      cool: 4800,
      mental: 510,
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
        condition: 'turn <= 9',
        then: [
          {
            type: 'apGain',
            value: 15,
            description: 'AP獲得',
            levelValues: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'turn >= 10',
        then: [
          {
            type: 'scoreGain',
            value: 3.48,
            description: 'スコア348%獲得 (Lv.10)',
          },
        ],
      },
    ],
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'scoreGain',
          value: 1.365,
          description: 'スコア136.5%獲得 (Lv.10)',
        },
        {
          type: 'conditional',
          condition: 'turn >= 6',
          then: [
            {
              type: 'scoreGain',
              value: 1.911,
              description: 'スコア191.1%獲得 (Lv.10)',
            },
          ],
        },
      ],
    },
  },
  prismEchoMegu: {
    name: 'Prism Echo Megu',
    displayName: '［Prism Echo］藤島慈',
    character: '藤島慈',
    shortCode: 'Mpe',
    apCost: 20,
    stats: {
      smile: 7680,
      pure: 7200,
      cool: 6240,
      mental: 560,
    },
    centerCharacteristic: {
      name: 'アピールアップ・AP軽減・CT短縮',
      effects: [
        {
          type: 'appealBoost',
          value: 1.6,
          target: 'みらくらぱーく！',
          description: 'みらくらぱーく！メンバーのアピール値が160%上昇',
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
          type: 'scoreGain',
          value: 3.348,
          description: 'ライブ終了時スコア獲得（アピール合計値×334.8%）',
        },
      ],
      when: 'afterLastTurn',
    },
    effects: [
      {
        type: 'scoreGain',
        value: 7.02,
        description: 'スコア獲得 (Lv.10: 702%)',
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
  etherAriaMegumi: {
    name: 'Ether Aria Megumi',
    displayName: '［Ether Aria］藤島慈',
    character: '藤島慈',
    shortCode: 'Mea',
    apCost: 10,
    stats: {
      smile: 9120,
      pure: 6240,
      cool: 5400,
      mental: 580,
    },
    centerCharacteristic: {
      name: 'アピールアップ（みらくらぱーく！）・AP軽減・CT短縮',
      effects: [
        {
          type: 'appealBoost',
          value: 1.6,
          target: 'みらくらぱーく！',
          description: 'みらくらぱーく！メンバーのアピール値が160%上昇',
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
          type: 'scoreGain',
          value: 3.348,
          description: 'FEVER開始時スコア獲得（アピール合計値×334.8%）',
        },
      ],
      when: 'beforeFeverStart',
    },
    effects: [
      {
        type: 'scoreGain',
        value: 3.348,
        description: 'スコア獲得 (Lv.10: 334.8%)',
      },
      {
        type: 'conditional',
        condition: 'turn >= 15',
        then: [
          {
            type: 'scoreGain',
            value: 7.488,
            description: 'さらにスコア獲得 (Lv.10: 748.8%)',
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
}

export default fujishima_megumiCards
