import { CardData } from '../../core/models/Card'

// Card data for 日野下花帆
const hinoshita_kahoCards: CardData = {
  iDoMeKaho: {
    name: 'I Do Me Kaho',
    displayName: '［アイドゥーミー！］日野下花帆',
    character: '日野下花帆',
    shortCode: 'Ki',
    apCost: 12,
    stats: {
      smile: 6000,
      pure: 6240,
      cool: 6960,
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
        type: 'mentalRecover',
        value: 10,
        description: 'メンタル+10',
      },
      {
        type: 'conditional',
        condition: 'mental >= 100',
        then: [
          {
            type: 'scoreGain',
            value: 7.56,
            description: 'スコア756%獲得 (Lv.10)',
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
  kisekiKaho: {
    name: 'Kiseki Kaho',
    displayName: '［軌跡の舞踏会］日野下花帆',
    character: '日野下花帆',
    shortCode: 'Kks',
    apCost: 10,
    stats: {
      smile: 7680,
      pure: 5760,
      cool: 3960,
      mental: 470,
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
            type: 'scoreBoost',
            value: 1.62,
            description: 'スコア162%ブースト (Lv.10)',
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'voltageLevel >= 7',
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
      when: 'afterLastTurn',
      effects: [
        {
          type: 'scoreGain',
          value: 1.365,
          description: 'スコア136.5%獲得 (Lv.10)',
        },
        {
          type: 'conditional',
          condition: 'voltageLevel >= 4',
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
  prismEchoKaho: {
    name: 'Prism Echo Kaho',
    displayName: '［Prism Echo］日野下花帆',
    character: '日野下花帆',
    shortCode: 'Kpe',
    apCost: 20,
    stats: {
      smile: 7680,
      pure: 7200,
      cool: 6240,
      mental: 460,
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
  etherAriaKaho: {
    name: 'Ether Aria Kaho',
    displayName: '［Ether Aria］日野下花帆',
    character: '日野下花帆',
    shortCode: 'Kea',
    apCost: 20,
    stats: {
      smile: 8640,
      pure: 6720,
      cool: 5640,
      mental: 570,
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
        value: 3.348,
        description: 'スコア獲得 (Lv.10: 334.8%)',
      },
      {
        type: 'conditional',
        condition: 'mental >= max_mental',
        then: [
          {
            type: 'scoreGain',
            value: 6.7392,
            description: 'さらにスコア獲得 (Lv.10: 673.92%)',
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

export default hinoshita_kahoCards
