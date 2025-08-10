import { CardData } from '../../core/models/Card'

// Card data for 徒町小鈴
const kachimachi_kosuzuCards: CardData = {
  taiyouKosuzu: {
    name: 'Taiyou de Are Kosuzu',
    displayName: '［太陽であれ！］徒町小鈴',
    character: '徒町小鈴',
    shortCode: 'Kzt',
    apCost: 15,
    stats: {
      smile: 4080,
      pure: 6600,
      cool: 6720,
      mental: 470,
    },
    centerCharacteristic: {
      name: 'アピールアップ（DOLLCHESTRA）',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: 'DOLLCHESTRA',
          description: 'DOLLCHESTRAメンバーのアピール値が200%上昇',
        },
      ],
    },
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'voltageGain',
          value: 232,
          description: 'ボルテージ232獲得 (Lv.10)',
        },
      ],
    },
    effects: [
      {
        type: 'conditional',
        condition: 'mental > 1',
        then: [
          {
            type: 'voltageBoost',
            value: 3.825,
            description: 'ボルテージ382.5%ブースト (Lv.10)',
          },
        ],
        else: [
          {
            type: 'voltageGain',
            value: 637,
            description: 'ボルテージ637獲得 (Lv.10)',
          },
          {
            type: 'removeAfterUse',
            description: 'このカードを除外',
          },
        ],
      },
    ],
  },
  etherAriaKosuzu: {
    name: 'Ether Aria Kosuzu',
    displayName: '［Ether Aria］徒町小鈴',
    character: '徒町小鈴',
    shortCode: 'Kzea',
    apCost: 16,
    stats: {
      smile: 5640,
      pure: 9000,
      cool: 5880,
      mental: 590,
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
        condition: 'mental <= 10',
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
  ladybugKosuzu: {
    name: 'Ladybug Kosuzu',
    displayName: '［レディバグ］徒町小鈴',
    character: '徒町小鈴',
    shortCode: 'Ksl',
    apCost: 15,
    stats: {
      smile: 4440,
      pure: 5520,
      cool: 6840,
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
          condition: 'mental <= 75',
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
  aimaiKosuzu: {
    name: 'Aimai Kosuzu',
    displayName: '［アイマイメーデー］徒町小鈴',
    character: '徒町小鈴',
    shortCode: 'Ksa',
    apCost: 8,
    stats: {
      smile: 4200,
      pure: 6120,
      cool: 6960,
      mental: 480,
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
        type: 'removeAfterUse',
        condition: 'mental <= 25',
        description: 'メンタル25%以下でデッキから除外',
      },
      {
        type: 'voltageGain',
        value: 134,
        description: 'ボルテージ134獲得 (Lv.10)',
      },
      {
        type: 'conditional',
        condition: 'mental >= 30',
        then: [
          {
            type: 'mentalReduction',
            value: 25,
            description: 'メンタル25減少',
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'mental <= 25',
        then: [
          {
            type: 'voltageGain',
            value: 290,
            description: 'ボルテージ290獲得 (Lv.10)',
          },
        ],
      },
    ],
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'voltageGain',
          value: 232,
          description: 'ボルテージ232獲得 (Lv.10)',
        },
      ],
    },
  },
  oracleEtudeKosuzu: {
    name: 'Oracle Etude Kosuzu',
    displayName: '［Oracle Étude］徒町小鈴',
    character: '徒町小鈴',
    shortCode: 'Koe',
    apCost: 14,
    stats: {
      smile: 6170,
      pure: 7520,
      cool: 4390,
      mental: 590,
    },
    centerCharacteristic: {
      name: 'DEVICE',
      effects: [
        {
          type: 'appealBoost',
          value: 3.2,
          target: '徒町小鈴',
          description: '徒町小鈴のアピール値が320%上昇',
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
        condition: 'mental <= 1',
        then: [
          {
            type: 'voltageGain',
            value: 840,
            description: 'さらにボルテージ獲得 (Lv.10: 840pt)',
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'mental >= 50',
        then: [
          {
            type: 'voltagePenalty',
            value: 300,
            description: 'ボルテージ-300pt',
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

export default kachimachi_kosuzuCards
