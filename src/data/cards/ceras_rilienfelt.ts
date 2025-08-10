import { CardData } from '../../core/models/Card'

// Card data for セラス 柳田 リリエンフェルト
const ceras_rilienfeltCards: CardData = {
  bdCelestine: {
    name: 'BD Celestine',
    displayName: '［16th Birthday］セラス 柳田 リリエンフェルト',
    character: 'セラス 柳田 リリエンフェルト',
    shortCode: 'Cb',
    apCost: 0,
    stats: {
      smile: 5760,
      pure: 5760,
      cool: 5760,
      mental: 480,
    },
    centerCharacteristic: {
      name: 'アピールアップ（セラス）',
      effects: [
        {
          type: 'appealBoost',
          value: 4,
          target: 'セラス 柳田 リリエンフェルト',
          description: 'セラスのアピール値が400%上昇',
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
        type: 'apGain',
        value: 5,
        description: 'AP獲得',
        levelValues: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      },
      {
        type: 'voltageBoost',
        value: 0.363,
        description: 'ボルテージ36.3%ブースト (Lv.10)',
      },
      {
        type: 'resetCardTurn',
        description: '山札リセット',
      },
    ],
  },
  tenchiCelestine: {
    name: 'Tenchi Celestine',
    displayName: '［天地黎明］セラス 柳田 リリエンフェルト',
    character: 'セラス 柳田 リリエンフェルト',
    shortCode: 'Ct',
    apCost: 20,
    stats: {
      smile: 6960,
      pure: 6480,
      cool: 3840,
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
        type: 'conditional',
        condition: 'count <= 1',
        then: [
          {
            type: 'voltageBoost',
            value: 4.65,
            description: 'ボルテージ465%ブースト (Lv.10)',
          },
        ],
        else: [
          {
            type: 'scoreGain',
            value: 3.348,
            description: 'スコア334.8%獲得 (Lv.10)',
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'count >= 3',
        then: [
          {
            type: 'apGain',
            value: 2,
            description: 'AP獲得 (固定値)',
            levelValues: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          },
        ],
      },
    ],
    centerSkill: {
      when: 'afterLastTurn',
      effects: [
        {
          type: 'scoreGain',
          value: 2.79,
          description: 'スコア279%獲得 (Lv.10)',
        },
      ],
    },
  },
  izayoiCelestine: {
    name: 'Izayoi Celestine',
    displayName: '［十六夜セレーネ］セラス 柳田 リリエンフェルト',
    character: 'セラス 柳田 リリエンフェルト',
    shortCode: 'Ci',
    apCost: 12,
    stats: {
      smile: 4560,
      pure: 5280,
      cool: 7320,
      mental: 490,
    },
    centerCharacteristic: {
      name: 'アピールアップ（Edel Note）',
      effects: [
        {
          type: 'appealBoost',
          value: 2,
          target: 'Edel Note',
          description: 'Edel Noteに所属するメンバーのアピール値が200%上昇',
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
            value: 162,
            description: 'ボルテージ162獲得 (Lv.10)',
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
      {
        type: 'conditional',
        condition: 'count <= 2',
        then: [
          {
            type: 'resetCardTurn',
            description: '山札リセット',
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
}

export default ceras_rilienfeltCards
