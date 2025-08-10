import { CardData } from '../../core/models/Card'

// Card data for 桂城泉
const katsuragi_izumiCards: CardData = {
  tenchiIzumi: {
    name: 'Tenchi Izumi',
    displayName: '［天地黎明］桂城泉',
    character: '桂城泉',
    shortCode: 'It',
    apCost: 17,
    stats: {
      smile: 7080,
      pure: 6240,
      cool: 3960,
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
            type: 'scoreBoost',
            value: 4.65,
            description: 'スコア465%ブースト (Lv.10)',
          },
        ],
        else: [
          {
            type: 'voltageGain',
            value: 279,
            description: 'ボルテージ279獲得 (Lv.10)',
          },
        ],
      },
      {
        type: 'conditional',
        condition: 'count >= 3',
        then: [
          {
            type: 'apGain',
            value: 4,
            description: 'AP獲得',
            levelValues: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
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
}

export default katsuragi_izumiCards
