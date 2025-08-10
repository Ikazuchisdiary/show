import { CardData } from '../../core/models/Card'

// Card data for 大沢瑠璃乃
const osawa_rurinoCards: CardData = {
  prismEchoRurino: {
    name: 'Prism Echo Rurino',
    displayName: '［Prism Echo］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Rpe',
    apCost: 12,
    stats: {
      smile: 6840,
      pure: 7200,
      cool: 6240,
      mental: 640,
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
          type: 'apGain',
          value: 8,
          description: 'フィーバー開始時AP回復',
          levelValues: [4, 4, 4, 5, 5, 6, 6, 6, 7, 8, 8, 9, 10, 12],
        },
        {
          type: 'mentalRecover',
          value: 65,
          description: 'フィーバー開始時メンタル回復',
          levelValues: [30, 35, 40, 40, 45, 50, 50, 55, 60, 65, 70, 80, 90, 100],
        },
      ],
      when: 'beforeFeverStart',
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
  etherAriaRurino: {
    name: 'Ether Aria Rurino',
    displayName: '［Ether Aria］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Rea',
    apCost: 14,
    stats: {
      smile: 8640,
      pure: 5520,
      cool: 6600,
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
          type: 'apGain',
          value: 12,
          description: 'FEVER開始時AP回復（12）',
        },
        {
          type: 'mentalRecover',
          value: 100,
          description: 'メンタル回復（最大値の100%）',
        },
      ],
      when: 'beforeFeverStart',
    },
    effects: [
      {
        type: 'scoreBoost',
        value: 1.365,
        turns: 1,
        description: 'スコア獲得スキルによるスコア獲得量が1回の間136.5%上昇 (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'mental >= 100',
        then: [
          {
            type: 'scoreBoost',
            value: 2.457,
            turns: 1,
            description: 'さらにスコア獲得スキルによるスコア獲得量が1回の間245.7%上昇 (Lv.10)',
          },
        ],
      },
      {
        type: 'mentalRecover',
        value: 100,
        description: 'メンタル回復（最大値の100%）',
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
  butoRuri: {
    name: 'Buto Ruri',
    displayName: '［悠久の舞踏会］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Rb',
    apCost: 10,
    stats: {
      smile: 4320,
      pure: 7800,
      cool: 5160,
      mental: 480,
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
            type: 'voltageBoost',
            value: 2.175,
            description: 'ボルテージ217.5%ブースト (Lv.10)',
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'voltageLevel >= 7',
        then: [
          {
            type: 'scoreBoost',
            value: 2.9,
            description: 'スコア290%ブースト (Lv.10)',
          },
        ],
      },
    ],
    centerSkill: {
      effects: [
        {
          type: 'apGain',
          value: 2,
          description: 'AP獲得',
          levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
        },
        {
          type: 'conditional',
          condition: 'voltageLevel >= 4',
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
  bdRurino: {
    name: 'BD Rurino',
    displayName: '［17th Birthday］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Rbd',
    apCost: 10,
    stats: {
      smile: 5760,
      pure: 5760,
      cool: 5760,
      mental: 480,
    },
    centerCharacteristic: {
      name: 'アピールアップ（大沢瑠璃乃）',
      effects: [
        {
          type: 'appealBoost',
          value: 4,
          target: '大沢瑠璃乃',
          description: '大沢瑠璃乃のアピール値が400%上昇',
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
        condition: 'mental >= 50',
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
        condition: 'mental >= 100',
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
          type: 'apGain',
          value: 6,
          description: 'AP獲得',
          levelValues: [4, 4, 4, 5, 5, 6, 6, 6, 7, 8, 8, 9, 10, 11],
        },
        {
          type: 'conditional',
          condition: 'mental >= 50',
          then: [
            {
              type: 'apGain',
              value: 4,
              description: '追加AP獲得',
              levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
            },
          ],
        },
      ],
    },
  },
  joshoRurino: {
    name: 'Josho Rurino',
    displayName: '［ジョーショーキリュー］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Rj',
    apCost: 15,
    stats: {
      smile: 4680,
      pure: 4800,
      cool: 7200,
      mental: 530,
    },
    centerCharacteristic: {
      name: 'アピールアップ（みらくらぱーく！）',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: 'みらくらぱーく！',
          description: 'みらくらぱーく！に所属するメンバーのアピール値が200%上昇',
        },
      ],
    },
    effects: [
      {
        type: 'scoreBoost',
        value: 1.575,
        description: 'スコア157.5%ブースト (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'mental >= 70',
        then: [
          {
            type: 'scoreBoost',
            value: 2.52,
            description: 'スコア252%ブースト (Lv.10)',
          },
        ],
      },
    ],
    centerSkill: {
      effects: [
        {
          type: 'apGain',
          value: 2,
          description: 'AP獲得',
          levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
        },
        {
          type: 'conditional',
          condition: 'mental >= 50',
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
  momijidaniRurino: {
    name: 'Momijidani Rurino',
    displayName: '［紅葉乃舞姫］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Rm',
    apCost: 12,
    stats: {
      smile: 6000,
      pure: 6480,
      cool: 4680,
      mental: 490,
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
        value: 1.1375,
        description: 'スコア113.75%ブースト (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'mental >= 70',
        then: [
          {
            type: 'scoreBoost',
            value: 1.82,
            description: 'スコア182%ブースト (Lv.10)',
          },
        ],
      },
    ],
    centerSkill: {
      effects: [
        {
          type: 'apGain',
          value: 2,
          description: 'AP獲得',
          levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
        },
        {
          type: 'conditional',
          condition: 'voltageLevel >= 2',
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
  fanfareRurino: {
    name: 'Fanfare Rurino',
    displayName: '［ファンファーレ！！！］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Rf',
    apCost: 8,
    stats: {
      smile: 6540,
      pure: 6060,
      cool: 4560,
      mental: 490,
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
        type: 'scoreBoost',
        value: 0.9375,
        description: 'スコア93.75%ブースト (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'mental >= 70',
        then: [
          {
            type: 'scoreBoost',
            value: 1.5,
            description: 'スコア300%ブースト (Lv.10)',
          },
        ],
      },
    ],
    centerSkill: {
      effects: [
        {
          type: 'apGain',
          value: 2,
          description: 'AP獲得',
          levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
        },
      ],
      when: 'beforeFirstTurn',
    },
  },
  linkFutureRurino: {
    name: 'Link Future Rurino',
    displayName: '［Link to the FUTURE］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Rl',
    apCost: 8,
    stats: {
      smile: 7200,
      pure: 6600,
      cool: 5040,
      mental: 550,
    },
    centerCharacteristic: {
      name: 'アピールアップ（みらくらぱーく！）',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: 'みらくらぱーく！',
          description: 'みらくらぱーく！に所属するメンバーのアピール値が200%上昇',
        },
      ],
    },
    effects: [
      {
        type: 'scoreBoost',
        value: 0.75,
        description: 'スコア75%ブースト (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'mental >= 50',
        then: [
          {
            type: 'scoreBoost',
            value: 0.805,
            description: 'スコア161%ブースト (Lv.10)',
          },
        ],
      },
    ],
    centerSkill: {
      effects: [
        {
          type: 'apGain',
          value: 2,
          description: 'AP獲得',
          levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
        },
        {
          type: 'conditional',
          condition: 'mental >= 50',
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
  identityRurino: {
    name: 'Identity Rurino',
    displayName: '［アイデンティティ］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Ri',
    apCost: 18,
    stats: {
      smile: 5760,
      pure: 6120,
      cool: 5280,
      mental: 490,
    },
    centerCharacteristic: {
      name: 'アピールアップ（みらくらぱーく！）',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: 'みらくらぱーく！',
          description: 'みらくらぱーく！に所属するメンバーのアピール値が200%上昇',
        },
      ],
    },
    effects: [
      {
        type: 'scoreBoost',
        value: 3.1875,
        description: 'スコアブースト効果318.75%上昇 (Lv.10)',
      },
    ],
    centerSkill: {
      effects: [
        {
          type: 'apGain',
          value: 2,
          description: 'AP獲得',
          levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
        },
        {
          type: 'conditional',
          condition: 'mental >= 50',
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
  yoursEverRurino: {
    name: 'Yours Ever Rurino',
    displayName: '［yours ever］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Ry',
    apCost: 12,
    stats: {
      smile: 6000,
      pure: 5460,
      cool: 5340,
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
        type: 'scoreBoost',
        value: 2.325,
        description: 'スコア232.5%ブースト (Lv.10)',
      },
    ],
    centerSkill: {
      effects: [
        {
          type: 'apGain',
          value: 2,
          description: 'AP獲得',
          levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
        },
      ],
      when: 'beforeFirstTurn',
    },
  },
  natsumekiRurino: {
    name: 'Natsumeki Rurino',
    displayName: '［夏めきペイン］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Rn',
    apCost: 10,
    stats: {
      smile: 6600,
      pure: 5160,
      cool: 4800,
      mental: 540,
    },
    centerCharacteristic: {
      name: 'アピールアップ（みらくらぱーく！）',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: 'みらくらぱーく！',
          description: 'みらくらぱーく！に所属するメンバーのアピール値が200%上昇',
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
    centerSkill: {
      effects: [
        {
          type: 'apGain',
          value: 2,
          description: 'AP獲得',
          levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
        },
        {
          type: 'conditional',
          condition: 'mental >= 50',
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
  dreamRurino: {
    name: 'Dream Rurino',
    displayName: '［Dream Believers］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Rd',
    apCost: 8,
    stats: {
      smile: 6600,
      pure: 5400,
      cool: 4800,
      mental: 520,
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
        value: 1.35,
        description: 'スコア135%ブースト (Lv.10)',
      },
    ],
    centerSkill: {
      effects: [
        {
          type: 'apGain',
          value: 2,
          description: 'AP獲得',
          levelValues: [2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 8],
        },
        {
          type: 'conditional',
          condition: 'voltageLevel >= 2',
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
  iDoMeRurino: {
    name: 'I Do Me Rurino',
    displayName: '［アイドゥーミー！］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Rid',
    apCost: 5,
    stats: {
      smile: 6960,
      pure: 6360,
      cool: 5880,
      mental: 520,
    },
    centerCharacteristic: {
      name: 'アピールアップ（みらくらぱーく！）',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: 'みらくらぱーく！',
          description: 'みらくらぱーく！に所属するメンバーのアピール値が200%上昇',
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
        type: 'mentalRecover',
        value: 10,
        description: 'メンタル+10',
      },
      {
        type: 'conditional',
        condition: 'mental >= 100',
        then: [
          {
            type: 'apGain',
            value: 8,
            description: 'AP獲得 (固定値)',
            levelValues: [5, 5, 6, 6, 7, 7, 8, 8, 9, 10, 11, 12, 13, 15],
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'mental <= 99',
        then: [
          {
            type: 'voltagePenalty',
            value: 1000,
            description: 'ボルテージ-1000',
          },
        ],
      },
    ],
    centerSkill: {
      effects: [
        {
          type: 'apGain',
          value: 6,
          description: 'AP獲得',
          levelValues: [6, 7, 8, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17],
        },
        {
          type: 'conditional',
          condition: 'mental <= 99',
          then: [
            {
              type: 'voltagePenalty',
              value: 1000,
              description: 'ボルテージ-1000',
            },
          ],
        },
      ],
      when: 'beforeFeverStart',
    },
  },
  cocoNatsuRurino: {
    name: 'Very Very COCO Natsu Rurino',
    displayName: '［Very! Very! COCO夏っ］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Rcn',
    apCost: 15,
    stats: {
      smile: 6480,
      pure: 6060,
      cool: 4500,
      mental: 500,
    },
    centerCharacteristic: {
      name: 'みらくらぱーく！アピールアップ',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: 'みらくらぱーく！',
          description: 'みらくらぱーく！のアピール値が200%上昇',
        },
      ],
    },
    centerSkill: {
      effects: [
        {
          type: 'apGain',
          value: 4,
          levelValues: [4, 4, 4, 5, 5, 6, 6, 6, 7, 8, 8, 9, 10, 11],
          description: 'ライブ開始時にAP獲得 (Lv.10: 8)',
        },
      ],
      when: 'beforeFirstTurn',
    },
    effects: [
      {
        type: 'conditional',
        condition: 'count <= 2',
        then: [
          {
            type: 'voltageBoost',
            value: 4.185,
            description: 'ボルテージブースト418.5% (Lv.10)',
          },
          {
            type: 'resetCardTurn',
            description: 'デッキリセット',
          },
        ],
        else: [
          {
            type: 'apGain',
            value: 5,
            levelValues: [5, 5, 6, 6, 7, 7, 8, 8, 9, 10, 11, 12, 13, 15],
            description: 'AP回復 (Lv.10: 10)',
          },
        ],
      },
    ],
  },
  oracleEtudeRurino: {
    name: 'Oracle Etude Rurino',
    displayName: '［Oracle Étude］大沢瑠璃乃',
    character: '大沢瑠璃乃',
    shortCode: 'Roe',
    apCost: 14,
    stats: {
      smile: 6060,
      pure: 4700,
      cool: 7320,
      mental: 590,
    },
    centerCharacteristic: {
      name: 'ELIXIR',
      effects: [
        {
          type: 'appealBoost',
          value: 3.2,
          target: '大沢瑠璃乃',
          description: '大沢瑠璃乃のアピール値が320%上昇',
        },
        {
          type: 'apReduce',
          value: 2,
          target: 'all',
          description: '全てのスキルの消費APが2減少',
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
          description: 'FEVER開始時AP回復（12）',
        },
        {
          type: 'mentalRecover',
          value: 100,
          description: 'メンタル回復（最大値の100%）',
        },
      ],
      when: 'beforeFeverStart',
    },
    effects: [
      {
        type: 'voltageBoost',
        value: 1.365,
        description: 'ボルテージ獲得量を136.5%上昇 (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'mental >= 100',
        then: [
          {
            type: 'voltageBoost',
            value: 2.457,
            description: 'さらにボルテージ獲得量を245.7%上昇 (Lv.10)',
          },
        ],
      },
      {
        type: 'mentalRecover',
        value: 50,
        description: 'メンタル回復（最大値の50%）',
      },
      {
        type: 'resetCardTurn',
        description: 'デッキリセット',
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

export default osawa_rurinoCards
