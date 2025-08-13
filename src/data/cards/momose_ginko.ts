import { CardData } from '../../core/models/Card'

// Card data for 百生吟子
const momose_ginkoCards: CardData = {
  etherAriaGin: {
    name: 'Ether Aria Gin',
    displayName: '［Ether Aria］百生吟子',
    character: '百生吟子',
    shortCode: 'Gea',
    apCost: 12,
    stats: {
      smile: 5520,
      pure: 7800,
      cool: 7440,
      mental: 590,
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
          type: 'mentalReduction',
          value: 60,
          levelValues: [30, 30, 35, 35, 40, 45, 45, 50, 50, 60, 70, 75, 80, 90],
          description: '最大メンタル減少 (Lv.10: 60%, Lv.14: 90%)',
        },
      ],
      when: 'beforeFirstTurn',
    },
    effects: [
      {
        type: 'conditional',
        condition: 'mental <= 1',
        then: [
          {
            type: 'scoreBoost',
            value: 4.35,
            turns: 1,
            description: 'スコア獲得スキルによるスコア獲得量が1回の間435%上昇 (Lv.10)',
          },
        ],
      },
      {
        type: 'removeAfterUse',
        condition: 'count >= 2',
        description: '2回使用後はデッキから除外',
      },
      {
        type: 'apGain',
        value: 0,
        levelValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8, 12],
        description: 'AP回復 (Lv.12: 4, Lv.13: 8, Lv.14: 12)',
      },
    ],
  },
  butoGin: {
    name: 'Buto Gin',
    displayName: '［輝跡の舞踏会］百生吟子',
    character: '百生吟子',
    shortCode: 'Gb',
    apCost: 10,
    stats: {
      smile: 4320,
      pure: 6720,
      cool: 6120,
      mental: 490,
    },
    centerCharacteristic: {
      name: 'アピールアップ（104期）＆APレデュース',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: '104期',
          description: '104期生のアピール値が200%上昇',
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
        condition: 'mental <= 10',
        then: [
          {
            type: 'scoreBoost',
            value: 1.6875,
            description: 'スコア168.75%ブースト (Lv.10)',
          },
          {
            type: 'voltageBoost',
            value: 1.6875,
            description: 'ボルテージ168.75%ブースト (Lv.10)',
          },
          {
            type: 'apGain',
            value: 10,
            description: 'AP獲得 (Lv.10: 10)',
            levelValues: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
          },
        ],
      },
      {
        type: 'mentalReduction',
        value: 50,
        description: 'メンタル50%減少',
      },
    ],
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'apGain',
          value: 5,
          description: 'AP獲得',
          levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
        },
        {
          type: 'conditional',
          condition: 'voltageLevel >= 4',
          then: [
            {
              type: 'apGain',
              value: 5,
              description: '追加AP獲得',
              levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
            },
          ],
        },
      ],
    },
  },
  bdGin: {
    name: 'BD Gin',
    displayName: '［16th Birthday］百生吟子',
    character: '百生吟子',
    shortCode: 'Gbd',
    apCost: 10,
    stats: {
      smile: 5760,
      pure: 5760,
      cool: 5760,
      mental: 480,
    },
    centerCharacteristic: {
      name: 'アピールアップ（百生吟子）',
      effects: [
        {
          type: 'appealBoost',
          value: 4,
          target: '百生吟子',
          description: '百生吟子のアピール値が400%上昇',
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
        condition: 'mental <= 75',
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
        condition: 'mental <= 25',
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
          condition: 'mental <= 50',
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
  fantasyGin: {
    name: 'Fantasy Gin',
    displayName: '［37.5℃のファンタジー］百生吟子',
    character: '百生吟子',
    shortCode: 'Gf',
    apCost: 7,
    stats: {
      smile: 6720,
      pure: 6120,
      cool: 4440,
      mental: 480,
    },
    centerCharacteristic: {
      name: 'アピールアップ',
      effects: [
        {
          type: 'appealBoost',
          value: 0.8,
          target: 'all',
          description: '全メンバーのアピール値+80%',
        },
      ],
    },
    effects: [
      {
        type: 'scoreBoost',
        value: 1.1375,
        description: 'スコア113.75%ブースト (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'mental >= 30',
        then: [
          {
            type: 'resetCardTurn',
            description: '山札リセット',
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'mental <= 25',
        then: [
          {
            type: 'apGain',
            value: 3,
            description: 'AP獲得',
            levelValues: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
          },
        ],
      },
    ],
    centerSkill: {
      when: 'beforeFirstTurn',
      effects: [
        {
          type: 'mentalReduction',
          value: 5,
          description: '最大メンタル5%減少 (Lv.10)',
        },
      ],
    },
  },
  linkFutureGin: {
    name: 'Link Future Gin',
    displayName: '［Link to the FUTURE］百生吟子',
    character: '百生吟子',
    shortCode: 'Gl',
    apCost: 1,
    stats: {
      smile: 7560,
      pure: 6840,
      cool: 4800,
      mental: 520,
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
        type: 'removeAfterUse',
        condition: 'count == 3',
        description: '3回使用後はデッキから除外',
      },
      {
        type: 'mentalReduction',
        value: 10,
        description: 'メンタル10減少',
      },
    ],
  },
  seiranGin: {
    name: 'Seiran Gin',
    displayName: '［青嵐の鯉流し］百生吟子',
    character: '百生吟子',
    shortCode: 'Gs',
    apCost: 15,
    stats: {
      smile: 5880,
      pure: 6720,
      cool: 4800,
      mental: 470,
    },
    centerCharacteristic: {
      name: 'アピールアップ',
      effects: [
        {
          type: 'appealBoost',
          value: 0.8,
          target: 'all',
          description: '全メンバーのアピール値が80%上昇',
        },
      ],
    },
    effects: [
      {
        type: 'scoreBoost',
        value: 3.1875,
        description: 'スコア318.75%ブースト (Lv.10)',
      },
    ],
  },
  reflectionGin: {
    name: 'Reflection Gin',
    displayName: '［Reflection in the mirror］百生吟子',
    character: '百生吟子',
    shortCode: 'Gr',
    apCost: 10,
    stats: {
      smile: 6480,
      pure: 5820,
      cool: 5040,
      mental: 475,
    },
    centerCharacteristic: {
      name: 'アピールアップ（スリーズブーケ）',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: 'スリーズブーケ',
          description: 'スリーズブーケに所属するメンバーのアピール値が200%上昇',
        },
      ],
    },
    effects: [
      {
        type: 'scoreBoost',
        value: 2.325,
        description: 'スコア232.5%ブースト (Lv.10)',
      },
    ],
  },
  dreamGin: {
    name: 'Dream Gin',
    displayName: '［Dream Believers］百生吟子',
    character: '百生吟子',
    shortCode: 'Gd',
    apCost: 10,
    stats: {
      smile: 5040,
      pure: 5640,
      cool: 6360,
      mental: 500,
    },
    centerCharacteristic: {
      name: 'アピールアップ',
      effects: [
        {
          type: 'appealBoost',
          value: 0.8,
          target: 'all',
          description: '全メンバーのアピール値が80%上昇',
        },
      ],
    },
    effects: [
      {
        type: 'scoreBoost',
        value: 1.8125,
        description: 'スコア181.25%ブースト (Lv.10)',
      },
    ],
  },
  yumewazuraiGin: {
    name: 'Yumewazurai Gin',
    displayName: '［ユメワズライ］百生吟子',
    character: '百生吟子',
    shortCode: 'Gy',
    apCost: 15,
    stats: {
      smile: 6240,
      pure: 5520,
      cool: 5520,
      mental: 480,
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
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'apGain',
          value: 5,
          description: 'AP獲得',
          levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
        },
      ],
    },
    effects: [
      {
        type: 'voltageBoost',
        value: 1.575,
        description: 'ボルテージ獲得スキルによるボルテージ獲得量が157.5%上昇 (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'mental <= 10',
        then: [
          {
            type: 'voltageBoost',
            value: 2.835,
            description:
              'メンタルが最大値の10%以下の時、ボルテージ獲得スキルによるボルテージ獲得量が283.5%上昇 (Lv.10)',
          },
        ],
      },
    ],
  },
  auroraFlowerGin: {
    name: 'Aurora Flower Gin',
    displayName: '［AURORA FLOWER］百生吟子',
    character: '百生吟子',
    shortCode: 'Ga',
    apCost: 12,
    stats: {
      smile: 6360,
      pure: 6360,
      cool: 6360,
      mental: 530,
    },
    centerCharacteristic: {
      name: 'アピールアップ（スリーズブーケ）',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: 'スリーズブーケ',
          description: 'スリーズブーケに所属するメンバーのアピール値が200%上昇',
        },
      ],
    },
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'apGain',
          value: 5,
          description: 'AP回復',
          levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
        },
        {
          type: 'conditional',
          condition: 'mental <= 50',
          then: [
            {
              type: 'apGain',
              value: 5,
              description: 'メンタルが最大値の50%以下の時、AP回復',
              levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
            },
          ],
        },
      ],
    },
    effects: [
      {
        type: 'voltageBoost',
        value: 1.1375,
        description: 'ボルテージ獲得効果スキルによるボルテージ獲得量が、1回の間113.75%上昇 (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'mental <= 10',
        then: [
          {
            type: 'voltageBoost',
            value: 2.0475,
            description:
              'メンタルが最大値の10%以下の時、ボルテージ獲得効果スキルによるボルテージ獲得量が、1回の間204.75%上昇 (Lv.10)',
          },
        ],
      },
    ],
  },
}

export default momose_ginkoCards
