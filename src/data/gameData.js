// Card and music data
// All skill values are stored as Lv.10 values
// Center skill timings:
// - "beforeFirstTurn": ライブ開始時
// - "beforeFeverStart": FEVER開始時
// - "afterLastTurn": ライブ終了時
const gameData = {
  cards: {
    // 乙宗梢
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
            value: 2.0,
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
            value: 4.0,
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
            value: 2.0,
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
            type: 'ctReduce',
            value: 2,
            target: 'all',
            description: 'クールタイムが2秒減少',
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
            value: 2.0,
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
    // 夕霧綴理
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
            value: 2.0,
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
            type: 'ctReduce',
            value: 2,
            target: 'all',
            description: 'クールタイムが2秒減少',
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
          condition: 'count <= 12',
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
            value: 4.0,
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
            value: 2.0,
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
    // 藤島慈
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
            value: 4.0,
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
            value: 2.0,
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
            type: 'ctReduce',
            value: 2,
            target: 'all',
            description: 'クールタイムが2秒減少',
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
            value: 2.0,
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
    // 日野下花帆
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
            value: 2.0,
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
    // Prism Echo カード
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
    prismEchoSayaka: {
      name: 'Prism Echo Sayaka',
      displayName: '［Prism Echo］村野さやか',
      character: '村野さやか',
      shortCode: 'Spe',
      apCost: 20,
      stats: {
        smile: 6240,
        pure: 7680,
        cool: 6720,
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
    // Ether Aria カード
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
              description: 'スコア435%ブースト (Lv.10)',
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
          levelValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8, 12],
          description: 'AP回復 (Lv.12: 4, Lv.13: 8, Lv.14: 12)',
        },
      ],
    },
    // 村野さやか
    iDoMeSayaka: {
      name: 'I Do Me Sayaka',
      displayName: '［アイドゥーミー！］村野さやか',
      character: '村野さやか',
      shortCode: 'Si',
      apCost: 14,
      stats: {
        smile: 6120,
        pure: 6960,
        cool: 6120,
        mental: 520,
      },
      centerCharacteristic: {
        name: 'アピールアップ（DOLLCHESTRA）',
        effects: [
          {
            type: 'appealBoost',
            value: 2.0,
            target: 'DOLLCHESTRA',
            description: 'DOLLCHESTRAに所属するメンバーのアピール値が200%上昇',
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
              value: 0.525,
              description: 'ボルテージ52.5%ブースト (Lv.10)',
            },
          ],
          else: [
            {
              type: 'scoreBoost',
              value: 1.62,
              description: 'スコア162%ブースト (Lv.10)',
            },
          ],
        },
        {
          type: 'conditional',
          condition: 'mental >= 100',
          then: [
            {
              type: 'voltageGain',
              value: 630,
              description: 'ボルテージ630獲得 (Lv.10)',
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
        when: 'beforeFeverStart',
        effects: [
          {
            type: 'scoreGain',
            value: 5.85,
            description: 'スコア585%獲得 (Lv.10)',
          },
          {
            type: 'conditional',
            condition: 'mental < 99',
            then: [
              {
                type: 'voltagePenalty',
                value: 1000,
                description: 'ボルテージ-1000',
              },
            ],
          },
        ],
      },
    },
    dolphinSayaka: {
      name: 'Dolphin Sayaka',
      displayName: '［ドルフィン〰ビーチ］村野さやか',
      character: '村野さやか',
      shortCode: 'Sd',
      apCost: 8,
      stats: {
        smile: 6480,
        pure: 5280,
        cool: 6000,
        mental: 440,
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
          type: 'voltageGain',
          value: 75,
          description: 'ボルテージ75獲得 (Lv.10)',
        },
        {
          type: 'conditional',
          condition: 'mental >= 50',
          then: [
            {
              type: 'voltageGain',
              value: 80,
              description: 'ボルテージ80獲得 (Lv.10)',
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
    shinjitsuSayaka: {
      name: 'Shinjitsu Sayaka',
      displayName: '［真実の舞踏会］村野さやか',
      character: '村野さやか',
      shortCode: 'Ss',
      apCost: 10,
      stats: {
        smile: 5160,
        pure: 4080,
        cool: 7920,
        mental: 490,
      },
      centerCharacteristic: {
        name: 'アピールアップ（103期）＆APレデュース',
        effects: [
          {
            type: 'appealBoost',
            value: 2.0,
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
              type: 'voltageGain',
              value: 216,
              description: 'ボルテージ216獲得 (Lv.10)',
            },
          ],
        },
        {
          type: 'conditional',
          condition: 'voltageLevel >= 7',
          then: [
            {
              type: 'scoreBoost',
              value: 3.72,
              description: 'スコア372%ブースト (Lv.10)',
            },
            {
              type: 'voltagePenalty',
              value: 50,
              description: 'ボルテージ-50',
            },
          ],
        },
      ],
      centerSkill: {
        when: 'beforeFeverStart',
        effects: [
          {
            type: 'voltageGain',
            value: 130,
            description: 'ボルテージ130獲得 (Lv.10)',
          },
          {
            type: 'conditional',
            condition: 'mental >= 50',
            then: [
              {
                type: 'voltageGain',
                value: 158,
                description: 'ボルテージ158獲得 (Lv.10)',
              },
            ],
          },
        ],
      },
    },
    // 大沢瑠璃乃
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
            value: 2.0,
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
            value: 4.0,
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
            value: 2.0,
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
            value: 2.0,
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
            value: 2.0,
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
            value: 2.0,
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
            value: 2.0,
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
    // 百生吟子
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
            value: 2.0,
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
            value: 4.0,
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
        type: 'appealBoost',
        value: 0.8,
        target: 'all',
        description: '全メンバーのアピール値+80%',
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
            value: 2.0,
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
    // 徒町小鈴
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
    // 安養寺姫芽
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
            value: 2.0,
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
    // 桂城泉
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
    // セラス 柳田 リリエンフェルト
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
            value: 4.0,
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
            value: 2.0,
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
    // 桂城泉＆セラス 柳田 リリエンフェルト
    edeliedIzumiCelestine: {
      name: 'Edelied Izumi & Celestine',
      displayName: '［Edelied］桂城泉＆セラス 柳田 リリエンフェルト',
      character: '桂城泉＆セラス 柳田 リリエンフェルト',
      shortCode: 'EIC',
      apCost: 20,
      stats: {
        smile: 5040,
        pure: 5040,
        cool: 5040,
        mental: 420,
      },
      effects: [
        {
          type: 'scoreGain',
          value: 4.212,
          description: 'スコア421.2%獲得 (Lv.10)',
        },
      ],
    },
    // 大賀美沙知
    sachi: {
      name: 'Sachi',
      displayName: '［蓮ノ空女学院スクールアイドルクラブ101期生］大賀美沙知',
      character: '大賀美沙知',
      shortCode: 'Sa',
      apCost: 0,
      stats: {
        smile: 5880,
        pure: 5700,
        cool: 5700,
        mental: 480,
      },
      effects: [
        {
          type: 'removeAfterUse',
          condition: 'count == 3',
          description: '3回使用後はデッキから除外',
        },
        {
          type: 'apGain',
          value: 6,
          description: 'AP獲得 (Lv.10: 6)',
          levelValues: [3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 8, 8, 10],
        },
      ],
    },
  },
  music: {
    ai_scream: {
      name: '愛♡スクリ〜ム！',
      phases: [18, 7, 6],
      description: 'フィーバー前: 18, フィーバー中: 7, フィーバー後: 6',
      centerCharacter: '大沢瑠璃乃',
      attribute: 'cool',
      combos: {
        normal: 287,
        hard: 536,
        expert: 1278,
        master: 1857,
      },
    },
    fruit_punch: {
      name: 'フルーツパンチ',
      phases: [11, 6, 4],
      description: 'フィーバー前: 11, フィーバー中: 6, フィーバー後: 4',
      centerCharacter: '日野下花帆',
      attribute: 'pure',
      combos: {
        normal: 252,
        hard: 423,
        expert: 556,
        master: 862,
      },
    },
    tenchi_reimei: {
      name: '天地黎明',
      phases: [15, 8, 0],
      description: 'フィーバー前: 15, フィーバー中: 8, フィーバー後: 0',
      centerCharacter: '桂城泉',
      attribute: 'smile',
      combos: {
        normal: 390,
        hard: 555,
        expert: 792,
        master: 1127,
      },
    },
    i_do_me: {
      name: 'アイドゥーミー！',
      phases: [12, 6, 5],
      description: 'フィーバー前: 12, フィーバー中: 6, フィーバー後: 5',
      centerCharacter: '大沢瑠璃乃',
      attribute: 'cool',
      combos: {
        normal: 373,
        hard: 774,
        expert: 1111,
        master: 1678,
      },
    },
    hello_new_dream: {
      name: 'Hello, new dream!',
      phases: [12, 8, 5],
      description: 'フィーバー前: 12, フィーバー中: 8, フィーバー後: 5',
      centerCharacter: '村野さやか',
      attribute: 'smile',
      combos: {
        normal: 420,
        hard: 640,
        expert: 889,
        master: 1396,
      },
    },
    izayoi_serene: {
      name: '十六夜セレーネ',
      phases: [13, 6, 4],
      description: 'フィーバー前: 13, フィーバー中: 6, フィーバー後: 4',
      centerCharacter: 'セラス 柳田 リリエンフェルト',
      attribute: 'cool',
      combos: {
        normal: 362,
        hard: 585,
        expert: 874,
        master: 1131,
      },
    },
    retrofuture: {
      name: 'Retrofuture',
      phases: [19, 9, 0],
      description: 'フィーバー前: 19, フィーバー中: 9, フィーバー後: 0',
      centerCharacter: 'セラス 柳田 リリエンフェルト',
      attribute: 'cool',
      combos: {
        normal: 344,
        hard: 706,
        expert: 1057,
        master: 1467,
      },
    },
    edelied: {
      name: 'Edelied',
      phases: [11, 3, 4],
      description: 'フィーバー前: 11, フィーバー中: 3, フィーバー後: 4',
      centerCharacter: '桂城泉',
      attribute: 'cool',
      combos: {
        normal: 291,
        hard: 464,
        expert: 1010,
        master: 1124,
      },
    },
    chirikonkan: {
      name: 'チリコンカン',
      phases: [10, 5, 4],
      description: 'フィーバー前: 10, フィーバー中: 5, フィーバー後: 4',
      centerCharacter: '桂城泉',
      attribute: 'smile',
      combos: {
        normal: 290,
        hard: 552,
        expert: 898,
        master: 1122,
      },
    },
    rinbu_revolution: {
      name: '輪舞-revolution',
      phases: [15, 5, 0],
      description: 'フィーバー前: 15, フィーバー中: 5, フィーバー後: 0',
      centerCharacter: 'セラス 柳田 リリエンフェルト',
      attribute: 'pure',
      combos: {
        normal: 234,
        hard: 418,
        expert: 742,
        master: 1049,
      },
    },
    aozora_jumping_heart: {
      name: '青空Jumping Heart',
      phases: [10, 4, 4],
      description: 'フィーバー前: 10, フィーバー中: 4, フィーバー後: 4',
      centerCharacter: '安養寺姫芽',
      attribute: 'pure',
      combos: {
        normal: 259,
        hard: 540,
        expert: 809,
        master: 1005,
      },
    },
    dream_believers_105: {
      name: 'Dream Believers（105期Ver.）',
      phases: [15, 5, 7],
      description: 'フィーバー前: 15, フィーバー中: 5, フィーバー後: 7',
      centerCharacter: '日野下花帆',
      attribute: 'smile',
      combos: {
        normal: 432,
        hard: 901,
        expert: 1257,
        master: 1389,
      },
    },
    be_proud: {
      name: 'Be Proud',
      phases: [11, 5, 5],
      description: 'フィーバー前: 11, フィーバー中: 5, フィーバー後: 5',
      centerCharacter: '乙宗梢',
      attribute: 'cool',
      combos: {
        normal: 402,
        hard: 422,
        expert: 695,
        master: 1019,
      },
    },
    shiawase_no_ribbon: {
      name: '幸せのリボン',
      phases: [10, 8, 5],
      description: 'フィーバー前: 10, フィーバー中: 8, フィーバー後: 5',
      centerCharacter: '夕霧綴理',
      attribute: 'smile',
      combos: {
        normal: 267,
        hard: 508,
        expert: 777,
        master: 985,
      },
    },
    yappa_tenshi: {
      name: 'やっぱ天使！',
      phases: [9, 6, 4],
      description: 'フィーバー前: 9, フィーバー中: 6, フィーバー後: 4',
      centerCharacter: '藤島慈',
      attribute: 'pure',
      combos: {
        normal: 237,
        hard: 435,
        expert: 653,
        master: 1004,
      },
    },
    fortune_movie: {
      name: 'フォーチュンムービー',
      phases: [8, 5, 2],
      description: 'フィーバー前: 8, フィーバー中: 5, フィーバー後: 2',
      centerCharacter: '日野下花帆',
      attribute: 'smile',
      combos: {
        normal: 131,
        hard: 279,
        expert: 602,
        master: 690,
      },
    },
    sparkly_spot: {
      name: 'Sparkly Spot',
      phases: [10, 5, 3],
      description: 'フィーバー前: 10, フィーバー中: 5, フィーバー後: 3',
      centerCharacter: '村野さやか',
      attribute: 'cool',
      combos: {
        normal: 274,
        hard: 509,
        expert: 741,
        master: 893,
      },
    },
    scapegoat: {
      name: 'スケイプゴート',
      phases: [14, 4, 5],
      description: 'フィーバー前: 14, フィーバー中: 4, フィーバー後: 5',
      centerCharacter: '夕霧綴理',
      attribute: 'cool',
      combos: {
        normal: 298,
        hard: 488,
        expert: 677,
        master: 785,
      },
    },
    reflection_in_the_mirror: {
      name: 'Reflection in the mirror',
      phases: [11, 4, 4],
      description: 'フィーバー前: 11, フィーバー中: 4, フィーバー後: 4',
      centerCharacter: '乙宗梢',
      attribute: 'smile',
      combos: {
        normal: 261,
        hard: 500,
        expert: 758,
        master: 1026,
      },
    },
    eien_no_euphoria_104: {
      name: '永遠のEuphoria（104期Ver.）',
      phases: [13, 5, 3],
      description: 'フィーバー前: 13, フィーバー中: 5, フィーバー後: 3',
      centerCharacter: '藤島慈',
      attribute: 'smile',
      combos: {
        normal: 225,
        hard: 585,
        expert: 867,
        master: 916,
      },
    },
    tsukimakase: {
      name: 'ツキマカセ',
      phases: [13, 3, 4],
      description: 'フィーバー前: 13, フィーバー中: 3, フィーバー後: 4',
      centerCharacter: '夕霧綴理',
      attribute: 'pure',
      combos: {
        normal: 293,
        hard: 559,
        expert: 786,
        master: 958,
      },
    },
    ouka_ranman: {
      name: '謳歌爛漫',
      phases: [14, 4, 4],
      description: 'フィーバー前: 14, フィーバー中: 4, フィーバー後: 4',
      centerCharacter: '乙宗梢',
      attribute: 'smile',
      combos: {
        normal: 275,
        hard: 435,
        expert: 607,
        master: 758,
      },
    },
    on_your_mark_104: {
      name: 'On your mark（104期Ver.）',
      phases: [10, 5, 4],
      description: 'フィーバー前: 10, フィーバー中: 5, フィーバー後: 4',
      centerCharacter: '夕霧綴理',
      attribute: 'cool',
      combos: {
        normal: 311,
        hard: 563,
        expert: 783,
        master: 818,
      },
    },
    preserved_roses: {
      name: 'Preserved Roses',
      phases: [12, 6, 0],
      description: 'フィーバー前: 12, フィーバー中: 6, フィーバー後: 0',
      centerCharacter: '日野下花帆',
      attribute: 'smile',
      combos: {
        normal: 337,
        hard: 596,
        expert: 721,
        master: 929,
      },
    },
    tokimeki_runners: {
      name: 'TOKIMEKI Runners',
      phases: [12, 4, 2],
      description: 'フィーバー前: 12, フィーバー中: 4, フィーバー後: 2',
      centerCharacter: '大沢瑠璃乃',
      attribute: 'smile',
      combos: {
        normal: 267,
        hard: 484,
        expert: 617,
        master: 921,
      },
    },
    kimi_no_kokoro: {
      name: '君のこころは輝いてるかい？',
      phases: [11, 8, 4],
      description: 'フィーバー前: 11, フィーバー中: 8, フィーバー後: 4',
      centerCharacter: '日野下花帆',
      attribute: 'smile',
      combos: {
        normal: 404,
        hard: 679,
        expert: 908,
        master: 1152,
      },
    },
    hakuchu_a_la_mode_104: {
      name: 'ハクチューアラモード（104期Ver.）',
      phases: [9, 6, 2],
      description: 'フィーバー前: 9, フィーバー中: 6, フィーバー後: 2',
      centerCharacter: '大沢瑠璃乃',
      attribute: 'smile',
      combos: {
        normal: 190,
        hard: 448,
        expert: 639,
        master: 689,
      },
    },
    do_do_do_104: {
      name: 'ド！ド！ド！（104期Ver.）',
      phases: [11, 4, 3],
      description: 'フィーバー前: 11, フィーバー中: 4, フィーバー後: 3',
      centerCharacter: '安養寺姫芽',
      attribute: 'pure',
      combos: {
        normal: 274,
        hard: 517,
        expert: 708,
        master: 1000,
      },
    },
    kokon_touzai_104: {
      name: 'ココン東西（104期Ver.）',
      phases: [10, 5, 3],
      description: 'フィーバー前: 10, フィーバー中: 5, フィーバー後: 3',
      centerCharacter: '安養寺姫芽',
      attribute: 'cool',
      combos: {
        normal: 328,
        hard: 459,
        expert: 720,
        master: 1077,
      },
    },
    ishin_denshin_104: {
      name: '以心☆電心（104期Ver.）',
      phases: [12, 5, 3],
      description: 'フィーバー前: 12, フィーバー中: 5, フィーバー後: 3',
      centerCharacter: '大沢瑠璃乃',
      attribute: 'cool',
      combos: {
        normal: 315,
        hard: 517,
        expert: 793,
        master: 1012,
      },
    },
    kibouteki_prism_104: {
      name: '希望的プリズム（104期Ver.）',
      phases: [11, 6, 5],
      description: 'フィーバー前: 11, フィーバー中: 6, フィーバー後: 5',
      centerCharacter: '夕霧綴理',
      attribute: 'cool',
      combos: {
        normal: 263,
        hard: 521,
        expert: 683,
        master: 890,
      },
    },
    awoke_104: {
      name: 'AWOKE（104期Ver.）',
      phases: [13, 5, 7],
      description: 'フィーバー前: 13, フィーバー中: 5, フィーバー後: 7',
      centerCharacter: '徒町小鈴',
      attribute: 'cool',
      combos: {
        normal: 322,
        hard: 511,
        expert: 787,
        master: 1075,
      },
    },
    suisai_sekai_104: {
      name: '水彩世界（104期Ver.）',
      phases: [11, 4, 4],
      description: 'フィーバー前: 11, フィーバー中: 4, フィーバー後: 4',
      centerCharacter: '百生吟子',
      attribute: 'cool',
      combos: {
        normal: 243,
        hard: 420,
        expert: 761,
        master: 916,
      },
    },
    mix_shake_104: {
      name: 'Mix shake!!（104期Ver.）',
      phases: [13, 5, 5],
      description: 'フィーバー前: 13, フィーバー中: 5, フィーバー後: 5',
      centerCharacter: '百生吟子',
      attribute: 'pure',
      combos: {
        normal: 285,
        hard: 591,
        expert: 950,
        master: 1206,
      },
    },
    natsumeki_pain_104: {
      name: '夏めきペイン（104期Ver.）',
      phases: [12, 4, 2],
      description: 'フィーバー前: 12, フィーバー中: 4, フィーバー後: 2',
      centerCharacter: '乙宗梢',
      attribute: 'pure',
      combos: {
        normal: 251,
        hard: 463,
        expert: 650,
        master: 872,
      },
    },
    taiyou_de_are: {
      name: '太陽であれ！',
      phases: [10, 6, 2],
      description: 'フィーバー前: 10, フィーバー中: 6, フィーバー後: 2',
      centerCharacter: '村野さやか',
      attribute: 'cool',
      combos: {
        normal: 293,
        hard: 464,
        expert: 742,
        master: 1092,
      },
    },
    taiyou_de_are_minus2: {
      name: '太陽であれ！（-2秒）',
      phases: [17, 9, 5],
      description: 'フィーバー前: 17, フィーバー中: 9, フィーバー後: 5',
      centerCharacter: '村野さやか',
      attribute: 'cool',
      combos: {
        normal: 293,
        hard: 464,
        expert: 742,
        master: 1092,
      },
    },
  },
}
export default gameData
