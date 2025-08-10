// Card data for 夕霧綴理
const yugiri_tsuzuriCards = {
  lrTsuzuri: {
    name: 'LR Tsuzuri',
    displayName: '［幸せのリボン］夕霧綴理',
    character: '夕霧綴理',
    shortCode: 'Tr',
    apCost: 20,
    stats: {
      smile: 5760,
      pure: 5160,
      cool: 8520,
      mental: 500,
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
        condition: 'count == 1',
        description: '1回使用後はデッキから除外',
      },
      {
        type: 'voltageGain',
        value: 487,
        description: 'ボルテージ487獲得 (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'turn >= 10',
        then: [
          {
            type: 'voltageGain',
            value: 780,
            description: 'ボルテージ780獲得 (Lv.10)',
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'turn <= 12',
        then: [
          {
            type: 'apGain',
            value: 0,
            description: 'AP獲得',
            levelValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 20],
          },
        ],
      },
    ],
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'voltageGain',
          value: 318,
          description: 'ボルテージ318獲得 (Lv.10)',
        },
      ],
    },
  },
  bd18Tsuzuri: {
    name: 'BD18 Tsuzuri',
    displayName: '［18th Birthday］夕霧綴理',
    character: '夕霧綴理',
    shortCode: 'Tb',
    apCost: 3,
    stats: {
      smile: 5760,
      pure: 5760,
      cool: 5760,
      mental: 480,
    },
    centerCharacteristic: {
      name: 'アピールアップ（夕霧綴理）',
      effects: [
        {
          type: 'appealBoost',
          value: 4,
          target: '夕霧綴理',
          description: '夕霧綴理のアピール値が400%上昇',
        },
      ],
    },
    effects: [
      {
        type: 'voltageGain',
        value: 159,
        description: 'ボルテージ159獲得 (Lv.10)',
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
          type: 'voltageGain',
          value: 204,
          description: 'ボルテージ204獲得 (Lv.10)',
        },
        {
          type: 'conditional',
          condition: 'turn >= 6',
          then: [
            {
              type: 'apGain',
              value: 2,
              description: 'AP獲得',
              levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
            },
          ],
        },
      ],
    },
  },
  fukuinTsuzuri: {
    name: 'Fukuin Tsuzuri',
    displayName: '［福音の銀河へ］夕霧綴理',
    character: '夕霧綴理',
    shortCode: 'Tf',
    apCost: 10,
    stats: {
      smile: 4800,
      pure: 7320,
      cool: 5040,
      mental: 490,
    },
    centerCharacteristic: {
      name: 'アピールアップ（102期）&APレデュース',
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
        type: 'removeAfterUse',
        condition: 'count == 3',
        description: '3回使用後はデッキから除外',
      },
      {
        type: 'voltageGain',
        value: 181,
        description: 'ボルテージ271獲得 (Lv.10)',
      },
    ],
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'voltageGain',
          value: 113,
          description: 'ボルテージ113獲得 (Lv.10)',
        },
        {
          type: 'conditional',
          condition: 'voltageLevel >= 4',
          then: [
            {
              type: 'voltageGain',
              value: 159,
              description: 'ボルテージ159獲得 (Lv.10)',
            },
          ],
        },
      ],
    },
  },
  tsukimakaseTsuzuri: {
    name: 'Tsukimakase Tsuzuri',
    displayName: '［ツキマカセ］夕霧綴理',
    character: '夕霧綴理',
    shortCode: 'Tt',
    apCost: 15,
    stats: {
      smile: 4680,
      pure: 6600,
      cool: 6360,
      mental: 450,
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
        type: 'voltageGain',
        value: 318,
        description: 'ボルテージ318獲得 (Lv.10)',
      },
    ],
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'voltageGain',
          value: 113,
          description: 'ボルテージ113獲得 (Lv.10)',
        },
        {
          type: 'conditional',
          condition: 'turn >= 3',
          then: [
            {
              type: 'voltageGain',
              value: 136,
              description: 'ボルテージ136獲得 (Lv.10)',
            },
          ],
        },
      ],
    },
  },
  prismEchoTsuzuri: {
    name: 'Prism Echo Tsuzuri',
    displayName: '［Prism Echo］夕霧綴理',
    character: '夕霧綴理',
    shortCode: 'Tpe',
    apCost: 20,
    stats: {
      smile: 6240,
      pure: 6720,
      cool: 7680,
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
  etherAriaTsuzuri: {
    name: 'Ether Aria Tsuzuri',
    displayName: '［Ether Aria］夕霧綴理',
    character: '夕霧綴理',
    shortCode: 'Tea',
    apCost: 10,
    stats: {
      smile: 6240,
      pure: 9120,
      cool: 5400,
      mental: 580,
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
          value: 278,
          description: 'ライブ開始時にボルテージ獲得（278pt）',
        },
      ],
      when: 'beforeFirstTurn',
    },
    effects: [
      {
        type: 'voltageGain',
        value: 278,
        description: 'ボルテージ獲得 (Lv.10: 278pt)',
      },
      {
        type: 'conditional',
        condition: 'turn <= 3',
        then: [
          {
            type: 'voltageGain',
            value: 624,
            description: 'さらにボルテージ獲得 (Lv.10: 624pt)',
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

export default yugiri_tsuzuriCards
