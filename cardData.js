// Card and music data
// All skill values are stored as Lv.10 values
// Center skill timings:
// - "beforeFirstTurn": ライブ開始時
// - "beforeFeverStart": FEVER開始時
// - "afterLastTurn": ライブ終了時
const gameData = {
  "cards": {
    // 乙宗梢
    "gingaKozu": {
      "name": "Ginga Kozu",
      "displayName": "［輪廻の銀河へ］乙宗梢",
      "character": "乙宗梢",
      "effects": [
        {
          "type": "conditional",
          "condition": "count <= 3",
          "then": [
            {
              "type": "voltageBoost",
              "value": 2.16,
              "description": "ボルテージ216%ブースト (Lv.10)"
            },
            {
              "type": "resetCardTurn",
              "description": "カード順リセット"
            }
          ],
          "else": [
            {
              "type": "scoreBoost",
              "value": 2.16,
              "description": "スコア216%ブースト (Lv.10)"
            }
          ]
        }
      ]
    },
    "bdKozu": {
      "name": "BD Kozu",
      "displayName": "［18th Birthday］乙宗梢",
      "character": "乙宗梢",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.825,
          "description": "スコア82.5%ブースト (Lv.10)"
        },
        {
          "type": "voltageBoost",
          "value": 0.825,
          "description": "ボルテージ82.5%ブースト (Lv.10)"
        }
      ]
    },
    "beProudKozu": {
      "name": "Be Proud Kozu",
      "displayName": "［be proud］乙宗梢",
      "character": "乙宗梢",
      "effects": [
        {
          "type": "skipTurn",
          "condition": "count > 6",
          "description": "6回使用後はデッキから除外"
        },
        {
          "type": "voltageBoost",
          "value": 0.75,
          "description": "ボルテージ75%ブースト (Lv.10)"
        },
        {
          "type": "resetCardTurn",
          "description": "山札リセット"
        }
      ]
    },
    "kisekiKozu": {
      "name": "Kiseki Kozu",
      "displayName": "［奇跡の舞踏会］乙宗梢",
      "character": "乙宗梢",
      "effects": [
        {
          "type": "conditional",
          "condition": "voltageLevel <= 8",
          "then": [
            {
              "type": "voltageBoost",
              "value": 1.62,
              "description": "ボルテージ162%ブースト (Lv.10)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "voltageLevel >= 7",
          "then": [
            {
              "type": "scoreBoost",
              "value": 2.16,
              "description": "スコア216%ブースト (Lv.10)"
            }
          ]
        }
      ]
    },
    // 夕霧綴理
    "lrTsuzuri": {
      "name": "LR Tsuzuri",
      "displayName": "［幸せのリボン］夕霧綴理",
      "character": "夕霧綴理",
      "effects": [
        {
          "type": "skipTurn",
          "condition": "count > 1",
          "description": "1回使用後はデッキから除外"
        },
        {
          "type": "voltageGain",
          "value": 487,
          "description": "ボルテージ487獲得 (Lv.10)"
        },
        {
          "type": "conditional",
          "condition": "skillCount >= 10",
          "then": [
            {
              "type": "voltageGain",
              "value": 780,
              "description": "ボルテージ780獲得 (Lv.10)"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "beforeFeverStart",
        "effects": [
          {
            "type": "voltageGain",
            "value": 318,
            "description": "ボルテージ318獲得 (Lv.10)"
          }
        ]
      }
    },
    // 藤島慈
    "bdMegu": {
      "name": "BD Megu",
      "displayName": "［18th Birthday］藤島慈",
      "character": "藤島慈",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.825,
          "description": "スコア82.5%ブースト (Lv.10)"
        },
        {
          "type": "voltageBoost",
          "value": 0.825,
          "description": "ボルテージ82.5%ブースト (Lv.10)"
        }
      ],
      "centerSkill": {
        "timing": "beforeFeverStart",
        "effects": [
          {
            "type": "scoreGain",
            "value": 2.4552,
            "description": "スコア245.52%獲得 (Lv.10)"
          }
        ]
      }
    },
    "angelMegu": {
      "name": "Angel Megu",
      "displayName": "［やっぱ天使！］藤島慈",
      "character": "藤島慈",
      "effects": [
        {
          "type": "scoreGain",
          "value": 2.175,
          "description": "スコア217.5%獲得 (Lv.10)"
        },
        {
          "type": "conditional",
          "condition": "turn >= 15",
          "then": [
            {
              "type": "scoreBoost",
              "value": 4.86,
              "description": "スコア486%ブースト (Lv.10)"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "afterLastTurn",
        "effects": [
          {
            "type": "scoreGain",
            "value": 3.825,
            "description": "スコア382.5%獲得 (Lv.10)"
          }
        ]
      }
    },
    "kuonMegu": {
      "name": "Kuon Megu",
      "displayName": "［久遠の銀河へ］藤島慈",
      "character": "藤島慈",
      "effects": [
        {
          "type": "conditional",
          "condition": "turn >= 10",
          "then": [
            {
              "type": "scoreGain",
              "value": 3.48,
              "description": "スコア348%獲得 (Lv.10)"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "beforeFeverStart",
        "effects": [
          {
            "type": "scoreGain",
            "value": 1.365,
            "description": "スコア136.5%獲得 (Lv.10)"
          },
          {
            "type": "conditional",
            "condition": "turn >= 6",
            "then": [
              {
                "type": "scoreGain",
                "value": 1.911,
                "description": "スコア191.1%獲得 (Lv.10)"
              }
            ]
          }
        ]
      }
    },
    // 日野下花帆
    "iDoMeKaho": {
      "name": "I Do Me Kaho",
      "displayName": "［アイドゥーミー！］日野下花帆",
      "character": "日野下花帆",
      "effects": [
        {
          "type": "mentalRecover",
          "value": 10,
          "description": "メンタル+10"
        },
        {
          "type": "conditional",
          "condition": "mental >= 100",
          "then": [
            {
              "type": "scoreGain",
              "value": 7.56,
              "description": "スコア756%獲得 (Lv.10)"
            }
          ],
          "else": [
            {
              "type": "voltagePenalty",
              "value": 1000,
              "description": "ボルテージ-1000"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "afterLastTurn",
        "effects": [
          {
            "type": "scoreGain",
            "value": 2.79,
            "description": "スコア279%獲得 (Lv.10)"
          }
        ]
      }
    },
    "kisekiKaho": {
      "name": "Kiseki Kaho",
      "displayName": "［軌跡の舞踏会］日野下花帆",
      "character": "日野下花帆",
      "effects": [
        {
          "type": "conditional",
          "condition": "voltageLevel <= 8",
          "then": [
            {
              "type": "scoreBoost",
              "value": 1.62,
              "description": "スコア162%ブースト (Lv.10)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "voltageLevel >= 7",
          "then": [
            {
              "type": "scoreGain",
              "value": 3.48,
              "description": "スコア348%獲得 (Lv.10)"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "afterLastTurn",
        "effects": [
          {
            "type": "scoreGain",
            "value": 1.365,
            "description": "スコア136.5%獲得 (Lv.10)"
          },
          {
            "type": "conditional",
            "condition": "voltageLevel >= 4",
            "then": [
              {
                "type": "scoreGain",
                "value": 1.911,
                "description": "スコア191.1%獲得 (Lv.10)"
              }
            ]
          }
        ]
      }
    },
    // 村野さやか
    "iDoMeSayaka": {
      "name": "I Do Me Sayaka",
      "displayName": "［アイドゥーミー！］村野さやか",
      "character": "村野さやか",
      "effects": [
        {
          "type": "conditional",
          "condition": "count <= 1",
          "then": [
            {
              "type": "voltageBoost",
              "value": 0.525,
              "description": "ボルテージ52.5%ブースト (Lv.10)"
            }
          ],
          "else": [
            {
              "type": "scoreBoost",
              "value": 1.62,
              "description": "スコア162%ブースト (Lv.10)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "mental >= 100",
          "then": [
            {
              "type": "voltageGain",
              "value": 630,
              "description": "ボルテージ630獲得 (Lv.10)"
            }
          ],
          "else": [
            {
              "type": "voltagePenalty",
              "value": 1000,
              "description": "ボルテージ-1000"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "beforeFeverStart",
        "effects": [
          {
            "type": "scoreGain",
            "value": 5.85,
            "description": "スコア585%獲得 (Lv.10)"
          },
          {
            "type": "conditional",
            "condition": "mental < 99",
            "then": [
              {
                "type": "voltagePenalty",
                "value": 1000,
                "description": "ボルテージ-1000"
              }
            ]
          }
        ]
      }
    },
    "dolphinSayaka": {
      "name": "Dolphin Sayaka",
      "displayName": "［ドルフィン〰ビーチ］村野さやか",
      "character": "村野さやか",
      "effects": [
        {
          "type": "voltageGain",
          "value": 75,
          "description": "ボルテージ75獲得 (Lv.10)"
        },
        {
          "type": "conditional",
          "condition": "mental >= 50",
          "then": [
            {
              "type": "voltageGain",
              "value": 80,
              "description": "ボルテージ80獲得 (Lv.10)"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "beforeFirstTurn",
        "effects": [
          {
            "type": "voltageGain",
            "value": 232,
            "description": "ボルテージ232獲得 (Lv.10)"
          }
        ]
      }
    },
    "shinjitsuSayaka": {
      "name": "Shinjitsu Sayaka",
      "displayName": "［真実の舞踏会］村野さやか",
      "character": "村野さやか",
      "effects": [
        {
          "type": "conditional",
          "condition": "voltageLevel <= 8",
          "then": [
            {
              "type": "voltageGain",
              "value": 216,
              "description": "ボルテージ216獲得 (Lv.10)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "voltageLevel >= 7",
          "then": [
            {
              "type": "scoreBoost",
              "value": 3.72,
              "description": "スコア372%ブースト (Lv.10)"
            },
            {
              "type": "voltagePenalty",
              "value": 50,
              "description": "ボルテージ-50"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "beforeFeverStart",
        "effects": [
          {
            "type": "voltageGain",
            "value": 130,
            "description": "ボルテージ130獲得 (Lv.10)"
          },
          {
            "type": "conditional",
            "condition": "mental >= 50",
            "then": [
              {
                "type": "voltageGain",
                "value": 158,
                "description": "ボルテージ158獲得 (Lv.10)"
              }
            ]
          }
        ]
      }
    },
    // 大沢瑠璃乃
    "butoRuri": {
      "name": "Buto Ruri",
      "displayName": "［悠久の舞踏会］大沢瑠璃乃",
      "character": "大沢瑠璃乃",
      "effects": [
        {
          "type": "conditional",
          "condition": "voltageLevel <= 8",
          "then": [
            {
              "type": "voltageBoost",
              "value": 2.175,
              "description": "ボルテージ217.5%ブースト (Lv.10)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "voltageLevel >= 7",
          "then": [
            {
              "type": "scoreBoost",
              "value": 2.9,
              "description": "スコア290%ブースト (Lv.10)"
            }
          ]
        }
      ]
    },
    "bdRurino": {
      "name": "BD Rurino",
      "displayName": "［17th Birthday］大沢瑠璃乃",
      "character": "大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.825,
          "description": "スコア82.5%ブースト (Lv.10)"
        },
        {
          "type": "voltageBoost",
          "value": 0.825,
          "description": "ボルテージ82.5%ブースト (Lv.10)"
        }
      ]
    },
    "joshoRurino": {
      "name": "Josho Rurino",
      "displayName": "［ジョーショーキリュー］大沢瑠璃乃",
      "character": "大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 3.15,
          "description": "スコア315%ブースト (Lv.10)"
        },
        {
          "type": "conditional",
          "condition": "mental >= 70",
          "then": [
            {
              "type": "scoreBoost",
              "value": 2.52,
              "description": "スコア252%ブースト (Lv.10)"
            }
          ]
        }
      ]
    },
    "momijidaniRurino": {
      "name": "Momijidani Rurino",
      "displayName": "［紅葉乃舞姫］大沢瑠璃乃",
      "character": "大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 1.1375,
          "description": "スコア113.75%ブースト (Lv.10)"
        },
        {
          "type": "conditional",
          "condition": "mental >= 70",
          "then": [
            {
              "type": "scoreBoost",
              "value": 3.64,
              "description": "スコア364%ブースト (Lv.10)"
            }
          ]
        }
      ]
    },
    "fanfareRurino": {
      "name": "Fanfare Rurino",
      "displayName": "［ファンファーレ！！！］大沢瑠璃乃",
      "character": "大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.9375,
          "description": "スコア93.75%ブースト (Lv.10)"
        },
        {
          "type": "conditional",
          "condition": "mental >= 70",
          "then": [
            {
              "type": "scoreBoost",
              "value": 3.0,
              "description": "スコア300%ブースト (Lv.10)"
            }
          ]
        }
      ]
    },
    "linkFutureRurino": {
      "name": "Link Future Rurino",
      "displayName": "［Link to the FUTURE］大沢瑠璃乃",
      "character": "大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.75,
          "description": "スコア75%ブースト (Lv.10)"
        },
        {
          "type": "conditional",
          "condition": "mental >= 50",
          "then": [
            {
              "type": "scoreBoost",
              "value": 1.61,
              "description": "スコア161%ブースト (Lv.10)"
            }
          ]
        }
      ]
    },
    "identityRurino": {
      "name": "Identity Rurino",
      "displayName": "［アイデンティティ］大沢瑠璃乃",
      "character": "大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 3.1875,
          "description": "スコアブースト効果318.75%上昇 (Lv.10)"
        }
      ]
    },
    "yoursEverRurino": {
      "name": "Yours Ever Rurino",
      "displayName": "［yours ever］大沢瑠璃乃",
      "character": "大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 2.325,
          "description": "スコア232.5%ブースト (Lv.10)"
        }
      ]
    },
    "natsumekiRurino": {
      "name": "Natsumeki Rurino",
      "displayName": "［夏めきペイン］大沢瑠璃乃",
      "character": "大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 1.8125,
          "description": "スコア181.25%ブースト (Lv.10)"
        }
      ]
    },
    "dreamRurino": {
      "name": "Dream Rurino",
      "displayName": "［Dream Believers］大沢瑠璃乃",
      "character": "大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 1.35,
          "description": "スコア135%ブースト (Lv.10)"
        }
      ]
    },
    "iDoMeRurino": {
      "name": "I Do Me Rurino",
      "displayName": "［アイドゥーミー！］大沢瑠璃乃",
      "character": "大沢瑠璃乃",
      "effects": [
        {
          "type": "skipTurn",
          "condition": "count > 3",
          "description": "3回使用後はデッキから除外"
        },
        {
          "type": "mentalRecover",
          "value": 10,
          "description": "メンタル+10"
        },
        {
          "type": "conditional",
          "condition": "mental <= 99",
          "then": [
            {
              "type": "voltagePenalty",
              "value": 1000,
              "description": "ボルテージ-1000"
            }
          ]
        }
      ]
    },
    // 百生吟子
    "butoGin": {
      "name": "Buto Gin",
      "displayName": "［輝跡の舞踏会］百生吟子",
      "character": "百生吟子",
      "effects": [
        {
          "type": "conditional",
          "condition": "mental <= 10",
          "then": [
            {
              "type": "scoreBoost",
              "value": 1.6875,
              "description": "スコア168.75%ブースト (Lv.10)"
            },
            {
              "type": "voltageBoost",
              "value": 1.6875,
              "description": "ボルテージ168.75%ブースト (Lv.10)"
            }
          ]
        },
        {
          "type": "mentalReduction",
          "value": 50,
          "description": "メンタル50%減少"
        }
      ]
    },
    "bdGin": {
      "name": "BD Gin", 
      "displayName": "［16th Birthday］百生吟子",
      "character": "百生吟子",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.825,
          "description": "スコア82.5%ブースト (Lv.10)"
        },
        {
          "type": "voltageBoost",
          "value": 0.825,
          "description": "ボルテージ82.5%ブースト (Lv.10)"
        }
      ]
    },
    "fantasyGin": {
      "name": "Fantasy Gin",
      "displayName": "［37.5℃のファンタジー］百生吟子",
      "character": "百生吟子",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 1.1375,
          "description": "スコア113.75%ブースト (Lv.10)"
        },
        {
          "type": "conditional",
          "condition": "mental >= 30",
          "then": [
            {
              "type": "resetCardTurn",
              "description": "山札リセット"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "beforeFirstTurn",
        "effects": [
          {
            "type": "mentalReduction",
            "value": 5,
            "description": "最大メンタル5%減少 (Lv.10)"
          }
        ]
      }
    },
    "linkFutureGin": {
      "name": "Link Future Gin",
      "displayName": "［Link to the FUTURE］百生吟子",
      "character": "百生吟子",
      "effects": [
        {
          "type": "skipTurn",
          "condition": "count > 3",
          "description": "3回使用後はデッキから除外"
        },
        {
          "type": "mentalReduction",
          "value": 10,
          "description": "メンタル10減少"
        }
      ]
    },
    "seiranGin": {
      "name": "Seiran Gin",
      "displayName": "［青嵐の鯉流し］百生吟子",
      "character": "百生吟子",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 3.1875,
          "description": "スコア318.75%ブースト (Lv.10)"
        }
      ]
    },
    "reflectionGin": {
      "name": "Reflection Gin",
      "displayName": "［Reflection in the mirror］百生吟子",
      "character": "百生吟子",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 2.325,
          "description": "スコア232.5%ブースト (Lv.10)"
        }
      ]
    },
    "dreamGin": {
      "name": "Dream Gin",
      "displayName": "［Dream Believers］百生吟子",
      "character": "百生吟子",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 1.8125,
          "description": "スコア181.25%ブースト (Lv.10)"
        }
      ]
    },
    // 徒町小鈴
    "aimaiKosuzu": {
      "name": "Aimai Kosuzu",
      "displayName": "［アイマイメーデー］徒町小鈴",
      "character": "徒町小鈴",
      "effects": [
        {
          "type": "voltageGain",
          "value": 134,
          "description": "ボルテージ134獲得 (Lv.10)"
        },
        {
          "type": "conditional",
          "condition": "mental >= 30",
          "then": [
            {
              "type": "mentalReduction",
              "value": 25,
              "description": "メンタル25減少"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "mental <= 25",
          "then": [
            {
              "type": "voltageGain",
              "value": 290,
              "description": "ボルテージ290獲得 (Lv.10)"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "beforeFeverStart",
        "effects": [
          {
            "type": "voltageGain",
            "value": 232,
            "description": "ボルテージ232獲得 (Lv.10)"
          }
        ]
      }
    },
    // 安養寺姫芽
    "blastHime": {
      "name": "Blast Hime",
      "displayName": "［BLAST!!］安養寺姫芽",
      "character": "安養寺姫芽",
      "effects": [
        {
          "type": "conditional",
          "condition": "mental >= 30",
          "then": [
            {
              "type": "mentalReduction",
              "value": 20,
              "description": "メンタル20減少"
            },
            {
              "type": "scoreBoost",
              "value": 0.99,
              "description": "スコア99%ブースト (Lv.10)"
            }
          ],
          "else": [
            {
              "type": "scoreGain",
              "value": 6.12,
              "description": "スコア612%獲得 (Lv.10)"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "beforeFeverStart",
        "effects": [
          {
            "type": "mentalReduction",
            "value": 40,
            "description": "最大メンタル40%減少"
          },
          {
            "type": "scoreGain",
            "value": 2.175,
            "description": "スコア217.5%獲得 (Lv.10)"
          }
        ]
      }
    },
    // 桂城泉
    "tenchiIzumi": {
      "name": "Tenchi Izumi",
      "displayName": "［天地黎明］桂城泉",
      "character": "桂城泉",
      "effects": [
        {
          "type": "conditional",
          "condition": "count <= 1",
          "then": [
            {
              "type": "scoreBoost",
              "value": 4.65,
              "description": "スコア465%ブースト (Lv.10)"
            }
          ],
          "else": [
            {
              "type": "voltageGain",
              "value": 279,
              "description": "ボルテージ279獲得 (Lv.10)"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "beforeFirstTurn",
        "effects": [
          {
            "type": "voltageGain",
            "value": 232,
            "description": "ボルテージ232獲得 (Lv.10)"
          }
        ]
      }
    },
    // セラス 柳田 リリエンフェルト
    "bdCelestine": {
      "name": "BD Celestine",
      "displayName": "［16th Birthday］セラス 柳田 リリエンフェルト",
      "character": "セラス 柳田 リリエンフェルト",
      "effects": [
        {
          "type": "skipTurn",
          "condition": "count > 3",
          "description": "3回使用後はデッキから除外"
        },
        {
          "type": "voltageBoost",
          "value": 0.726,
          "description": "ボルテージ72.6%ブースト (Lv.10)"
        },
        {
          "type": "resetCardTurn",
          "description": "山札リセット"
        }
      ]
    },
    "tenchiCelestine": {
      "name": "Tenchi Celestine",
      "displayName": "［天地黎明］セラス 柳田 リリエンフェルト",
      "character": "セラス 柳田 リリエンフェルト",
      "effects": [
        {
          "type": "conditional",
          "condition": "count <= 1",
          "then": [
            {
              "type": "voltageBoost",
              "value": 4.65,
              "description": "ボルテージ465%ブースト (Lv.10)"
            }
          ],
          "else": [
            {
              "type": "scoreGain",
              "value": 3.348,
              "description": "スコア334.8%獲得 (Lv.10)"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "afterLastTurn",
        "effects": [
          {
            "type": "scoreGain",
            "value": 2.79,
            "description": "スコア279%獲得 (Lv.10)"
          }
        ]
      }
    },
    "izayoiCelestine": {
      "name": "Izayoi Celestine",
      "displayName": "［十六夜セレーネ］セラス 柳田 リリエンフェルト",
      "character": "セラス 柳田 リリエンフェルト",
      "effects": [
        {
          "type": "conditional",
          "condition": "voltageLevel <= 8",
          "then": [
            {
              "type": "voltageGain",
              "value": 162,
              "description": "ボルテージ162獲得 (Lv.10)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "voltageLevel >= 7",
          "then": [
            {
              "type": "scoreBoost",
              "value": 2.16,
              "description": "スコア216%ブースト (Lv.10)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "count <= 2",
          "then": [
            {
              "type": "resetCardTurn",
              "description": "山札リセット"
            }
          ]
        }
      ],
      "centerSkill": {
        "timing": "beforeFeverStart",
        "effects": [
          {
            "type": "voltageGain",
            "value": 232,
            "description": "ボルテージ232獲得 (Lv.10)"
          }
        ]
      }
    },
    // 桂城泉＆セラス 柳田 リリエンフェルト
    "edeliedIzumiCelestine": {
      "name": "Edelied Izumi & Celestine",
      "displayName": "［Edelied］桂城泉＆セラス 柳田 リリエンフェルト",
      "character": "桂城泉＆セラス 柳田 リリエンフェルト",
      "effects": [
        {
          "type": "scoreGain",
          "value": 4.212,
          "description": "スコア421.2%獲得 (Lv.10)"
        }
      ]
    },
    // 大賀美沙知
    "sachi": {
      "name": "Sachi",
      "displayName": "［蓮ノ空女学院スクールアイドルクラブ101期生］大賀美沙知",
      "character": "大賀美沙知",
      "effects": [
        {
          "type": "skipTurn",
          "condition": "count > 3",
          "description": "3回使用後はデッキから除外"
        }
      ]
    }
  },
  "music": {
    "i_do_me": {
      "name": "アイドゥーミー！",
      "phases": [12, 6, 5],
      "description": "フィーバー前: 12, フィーバー中: 6, フィーバー後: 5",
      "centerCharacter": "大沢瑠璃乃"
    },
    "hello_new_dream": {
      "name": "Hello, new dream!",
      "phases": [12, 8, 5],
      "description": "フィーバー前: 12, フィーバー中: 8, フィーバー後: 5",
      "centerCharacter": "村野さやか"
    },
    "izayoi_serene": {
      "name": "十六夜セレーネ",
      "phases": [13, 6, 4],
      "description": "フィーバー前: 13, フィーバー中: 6, フィーバー後: 4",
      "centerCharacter": "セラス 柳田 リリエンフェルト"
    }
  }
};