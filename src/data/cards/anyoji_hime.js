// Card data for 安養寺姫芽
const anyoji_himeCards = {
  etherAriaHimeme: {
    name: 'Ether Aria Himeme',
    displayName: '［Ether Aria］安養寺姫芽',
    character: '安養寺姫芽',
    shortCode: 'Hea',
    apCost: 10,
    stats: {
      smile: 5400,
      pure: 6240,
      cool: 9120,
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
        condition: 'mental <= 10',
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
  blastHime: {
    name: 'Blast Hime',
    displayName: '［BLAST!!］安養寺姫芽',
    character: '安養寺姫芽',
    shortCode: 'Hb',
    apCost: 20,
    stats: {
      smile: 3720,
      pure: 7080,
      cool: 6240,
      mental: 500,
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
        type: 'conditional',
        condition: 'mental >= 30',
        then: [
          {
            type: 'mentalReduction',
            value: 20,
            description: 'メンタル20減少',
          },
          {
            type: 'apGain',
            value: 8,
            description: 'AP獲得',
            levelValues: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
          },
          {
            type: 'scoreBoost',
            value: 0.99,
            description: 'スコア99%ブースト (Lv.10)',
          },
        ],
        else: [
          {
            type: 'scoreGain',
            value: 6.12,
            description: 'スコア612%獲得 (Lv.10)',
          },
        ],
      },
    ],
    centerSkill: {
      when: 'beforeFeverStart',
      effects: [
        {
          type: 'mentalReduction',
          value: 40,
          description: '最大メンタル40%減少',
        },
        {
          type: 'scoreGain',
          value: 2.175,
          description: 'スコア217.5%獲得 (Lv.10)',
        },
      ],
    },
  },
  oracleEtudeHimeme: {
    name: 'Oracle Etude Himeme',
    displayName: '［Oracle Étude］安養寺姫芽',
    character: '安養寺姫芽',
    shortCode: 'Hoe',
    apCost: 14,
    stats: {
      smile: 4600,
      pure: 8400,
      cool: 7600,
      mental: 600,
    },
    centerCharacteristic: {
      name: 'Radioactive',
      effects: [
        {
          type: 'appealBoost',
          value: 3.2,
          target: '安養寺姫芽',
          description: '安養寺姫芽のアピール値が320%上昇',
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
        condition: 'mental <= 1',
        then: [
          {
            type: 'scoreGain',
            value: 10.08,
            description: 'さらにスコア獲得 (Lv.10: 1008%)',
          },
        ],
      },
      {
        type: 'mentalRecover',
        value: 0.5,
        description: 'メンタル回復（最大値の50%）',
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
  cocoNatsuHimeme: {
    name: 'Very Very COCO Natsu Himeme',
    displayName: '［Very! Very! COCO夏っ］安養寺姫芽',
    character: '安養寺姫芽',
    shortCode: 'Hcn',
    apCost: 20,
    stats: {
      smile: 6600,
      pure: 5880,
      cool: 4560,
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
          type: 'voltageGain',
          value: 350,
          description: 'FEVER開始時に、ボルテージを350pt獲得',
        },
      ],
      when: 'beforeFeverStart',
    },
    effects: [
      {
        type: 'conditional',
        condition: 'mental <= 1',
        then: [
          {
            type: 'scoreGain',
            value: 11.7,
            description: 'アピール値の1170%のスコアを獲得 (Lv.10)',
          },
        ],
      },
      {
        type: 'voltagePenalty',
        value: 5000,
        description: 'ボルテージを5000pt失う',
      },
    ],
  },
}

export default anyoji_himeCards
