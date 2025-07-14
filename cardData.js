// Card and music data
const gameData = {
  "cards": {
    "sachi": {
      "name": "Sachi",
      "displayName": "［蓮ノ空女学院スクールアイドルクラブ101期生］大賀美沙知",
      "effects": [
        {
          "type": "skipTurn",
          "condition": "count > 3",
          "description": "4回目以降の使用時にターンをスキップ"
        }
      ]
    },
    "bdMegu": {
      "name": "BD Megu",
      "displayName": "［18th Birthday］藤島慈",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.4125,
          "description": "スコア41.25%ブースト (Lv.1)"
        },
        {
          "type": "voltageBoost",
          "value": 0.4125,
          "description": "ボルテージ41.25%ブースト (Lv.1)"
        }
      ]
    },
    "gingaKozu": {
      "name": "Ginga Kozu",
      "displayName": "［輪廻の銀河へ］乙宗梢",
      "effects": [
        {
          "type": "conditional",
          "condition": "count <= 3",
          "then": [
            {
              "type": "voltageBoost",
              "value": 1.08,
              "description": "ボルテージ108%ブースト (Lv.1)"
            },
            {
              "type": "resetCardTurn",
              "description": "カード順リセット"
            }
          ],
          "else": [
            {
              "type": "scoreBoost",
              "value": 1.08,
              "description": "スコア108%ブースト (Lv.1)"
            }
          ]
        }
      ]
    },
    "iDoMeSayaka": {
      "name": "I Do Me Sayaka",
      "displayName": "［アイドゥーミー！］村野さやか",
      "effects": [
        {
          "type": "conditional",
          "condition": "count <= 1",
          "then": [
            {
              "type": "voltageBoost",
              "value": 0.2625,
              "description": "ボルテージ26.25%ブースト (Lv.1)"
            }
          ],
          "else": [
            {
              "type": "scoreBoost",
              "value": 0.81,
              "description": "スコア81%ブースト (Lv.1)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "mental >= 100",
          "then": [
            {
              "type": "voltageGain",
              "value": 315,
              "description": "ボルテージ315獲得 (Lv.1)"
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
      ]
    },
    "iDoMeKaho": {
      "name": "I Do Me Kaho",
      "displayName": "［アイドゥーミー！］日野下花帆",
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
              "value": 3.78,
              "description": "スコア3.78倍 (Lv.1)"
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
      ]
    },
    "butoRuri": {
      "name": "Buto Ruri",
      "displayName": "［悠久の舞踏会］大沢瑠璃乃",
      "effects": [
        {
          "type": "conditional",
          "condition": "voltageLevel <= 8",
          "then": [
            {
              "type": "voltageBoost",
              "value": 1.0875,
              "description": "ボルテージ108.75%ブースト (Lv.1)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "voltageLevel >= 7",
          "then": [
            {
              "type": "scoreBoost",
              "value": 1.45,
              "description": "スコア145%ブースト (Lv.1)"
            }
          ]
        }
      ]
    },
    "butoGin": {
      "name": "Buto Gin",
      "displayName": "［輝跡の舞踏会］百生吟子",
      "effects": [
        {
          "type": "conditional",
          "condition": "mental <= 10",
          "then": [
            {
              "type": "scoreBoost",
              "value": 0.8437,
              "description": "スコア84.37%ブースト (Lv.1)"
            },
            {
              "type": "voltageBoost",
              "value": 0.8437,
              "description": "ボルテージ84.37%ブースト (Lv.1)"
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
    "lrTsuzuri": {
      "name": "LR Tsuzuri",
      "displayName": "［幸せのリボン］夕霧綴理",
      "effects": [
        {
          "type": "voltageGain",
          "value": 243,
          "description": "ボルテージ243獲得 (Lv.1)"
        },
        {
          "type": "conditional",
          "condition": "turn >= 10",
          "then": [
            {
              "type": "voltageGain",
              "value": 390,
              "description": "ボルテージ390獲得 (Lv.1)"
            }
          ]
        }
      ]
    },
    "bdCelestine": {
      "name": "BD Celestine",
      "displayName": "［16th Birthday］セラス 柳田 リリエンフェルト",
      "effects": [
        {
          "type": "skipTurn",
          "condition": "count > 3",
          "description": "3回目の使用時にターンをスキップ"
        },
        {
          "type": "voltageBoost",
          "value": 0.1815,
          "description": "ボルテージ18.15%ブースト (Lv.1)"
        },
        {
          "type": "resetCardTurn",
          "description": "山札リセット"
        }
      ]
    },
    "bdGin": {
      "name": "BD Gin", 
      "displayName": "［16th Birthday］百生吟子",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.4125,
          "description": "スコア41.25%ブースト (Lv.1)"
        },
        {
          "type": "voltageBoost",
          "value": 0.4125,
          "description": "ボルテージ41.25%ブースト (Lv.1)"
        }
      ]
    },
    "bdRurino": {
      "name": "BD Rurino",
      "displayName": "［17th Birthday］大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.4125,
          "description": "スコア41.25%ブースト (Lv.1)"
        },
        {
          "type": "voltageBoost",
          "value": 0.4125,
          "description": "ボルテージ41.25%ブースト (Lv.1)"
        }
      ]
    },
    "bdKozu": {
      "name": "BD Kozu",
      "displayName": "［18th Birthday］乙宗梢",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.4125,
          "description": "スコア41.25%ブースト (Lv.1)"
        },
        {
          "type": "voltageBoost",
          "value": 0.4125,
          "description": "ボルテージ41.25%ブースト (Lv.1)"
        }
      ]
    },
    "angelMegu": {
      "name": "Angel Megu",
      "displayName": "［やっぱ天使！］藤島慈",
      "effects": [
        {
          "type": "scoreGain",
          "value": 1.0875,
          "description": "スコア108.75%獲得 (Lv.1)"
        },
        {
          "type": "conditional",
          "condition": "turn >= 15",
          "then": [
            {
              "type": "scoreBoost",
              "value": 1.215,
              "description": "スコア121.5%ブースト (Lv.1)"
            }
          ]
        }
      ]
    },
    "beProudKozu": {
      "name": "Be Proud Kozu",
      "displayName": "［be proud］乙宗梢",
      "effects": [
        {
          "type": "skipTurn",
          "condition": "count > 6",
          "description": "6回使用後は除外"
        },
        {
          "type": "voltageBoost",
          "value": 0.375,
          "description": "ボルテージ37.5%ブースト (Lv.1)"
        },
        {
          "type": "resetCardTurn",
          "description": "山札リセット"
        }
      ]
    },
    "edeliedIzumiCelestine": {
      "name": "Edelied Izumi & Celestine",
      "displayName": "［Edelied］桂城泉＆セラス 柳田 リリエンフェルト",
      "effects": [
        {
          "type": "scoreGain",
          "value": 2.106,
          "description": "スコア210.6%獲得 (Lv.1)"
        }
      ]
    },
    "shinjitsuSayaka": {
      "name": "Shinjitsu Sayaka",
      "displayName": "［真実の舞踏会］村野さやか",
      "effects": [
        {
          "type": "conditional",
          "condition": "voltageLevel <= 8",
          "then": [
            {
              "type": "voltageGain",
              "value": 108,
              "description": "ボルテージ108獲得 (Lv.1)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "voltageLevel >= 7",
          "then": [
            {
              "type": "scoreBoost",
              "value": 1.86,
              "description": "スコア186%ブースト (Lv.1)"
            },
            {
              "type": "voltagePenalty",
              "value": 50,
              "description": "ボルテージ-50"
            }
          ]
        }
      ]
    },
    "kuonMegu": {
      "name": "Kuon Megu",
      "displayName": "［久遠の銀河へ］藤島慈",
      "effects": [
        {
          "type": "conditional",
          "condition": "turn >= 10",
          "then": [
            {
              "type": "scoreGain",
              "value": 1.74,
              "description": "スコア174%獲得 (Lv.1)"
            }
          ]
        }
      ]
    },
    "kisekiKaho": {
      "name": "Kiseki Kaho",
      "displayName": "［軌跡の舞踏会］日野下花帆",
      "effects": [
        {
          "type": "conditional",
          "condition": "voltageLevel <= 8",
          "then": [
            {
              "type": "scoreBoost",
              "value": 0.81,
              "description": "スコア81%ブースト (Lv.1)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "voltageLevel >= 7",
          "then": [
            {
              "type": "scoreGain",
              "value": 1.74,
              "description": "スコア174%獲得 (Lv.1)"
            }
          ]
        }
      ]
    },
    "kisekiKozu": {
      "name": "Kiseki Kozu",
      "displayName": "［奇跡の舞踏会］乙宗梢",
      "effects": [
        {
          "type": "conditional",
          "condition": "voltageLevel <= 8",
          "then": [
            {
              "type": "voltageBoost",
              "value": 0.81,
              "description": "ボルテージ81%ブースト (Lv.1)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "voltageLevel >= 7",
          "then": [
            {
              "type": "scoreBoost",
              "value": 1.08,
              "description": "スコア108%ブースト (Lv.1)"
            }
          ]
        }
      ]
    },
    "tenchiCelestine": {
      "name": "Tenchi Celestine",
      "displayName": "［天地黎明］セラス 柳田 リリエンフェルト",
      "effects": [
        {
          "type": "conditional",
          "condition": "count <= 1",
          "then": [
            {
              "type": "voltageBoost",
              "value": 2.325,
              "description": "ボルテージ232.5%ブースト (Lv.1)"
            }
          ],
          "else": [
            {
              "type": "scoreGain",
              "value": 1.674,
              "description": "スコア167.4%獲得 (Lv.1)"
            }
          ]
        }
      ]
    },
    "izayoiCelestine": {
      "name": "Izayoi Celestine",
      "displayName": "［十六夜セレーネ］セラス 柳田 リリエンフェルト",
      "effects": [
        {
          "type": "conditional",
          "condition": "voltageLevel <= 8",
          "then": [
            {
              "type": "voltageGain",
              "value": 81,
              "description": "ボルテージ81獲得 (Lv.1)"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "voltageLevel >= 7",
          "then": [
            {
              "type": "scoreBoost",
              "value": 1.08,
              "description": "スコア108%ブースト (Lv.1)"
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
      ]
    },
    "fantasyGin": {
      "name": "Fantasy Gin",
      "displayName": "［37.5℃のファンタジー］百生吟子",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.5687,
          "description": "スコア56.87%ブースト (Lv.1)"
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
      ]
    },
    "linkFutureGin": {
      "name": "Link Future Gin",
      "displayName": "［Link to the FUTURE］百生吟子",
      "effects": [
        {
          "type": "skipTurn",
          "condition": "count > 3",
          "description": "3回使用後は除外"
        },
        {
          "type": "mentalReduction",
          "value": 10,
          "description": "メンタル10減少"
        }
      ]
    },
    "tenchiIzumi": {
      "name": "Tenchi Izumi",
      "displayName": "［天地黎明］桂城泉",
      "effects": [
        {
          "type": "conditional",
          "condition": "count <= 1",
          "then": [
            {
              "type": "scoreBoost",
              "value": 2.325,
              "description": "スコア232.5%ブースト (Lv.1)"
            }
          ],
          "else": [
            {
              "type": "voltageGain",
              "value": 139,
              "description": "ボルテージ139獲得 (Lv.1)"
            }
          ]
        }
      ]
    },
    "joshoRurino": {
      "name": "Josho Rurino",
      "displayName": "［ジョーショーキリュー］大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.7875,
          "description": "スコア78.75%ブースト (Lv.1)"
        },
        {
          "type": "conditional",
          "condition": "mental >= 70",
          "then": [
            {
              "type": "scoreBoost",
              "value": 1.26,
              "description": "スコア126%ブースト (Lv.1)"
            }
          ]
        }
      ]
    },
    "seiranGin": {
      "name": "Seiran Gin",
      "displayName": "［青嵐の鯉流し］百生吟子",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 1.5937,
          "description": "スコア159.37%ブースト (Lv.1)"
        }
      ]
    },
    "reflectionGin": {
      "name": "Reflection Gin",
      "displayName": "［Reflection in the mirror］百生吟子",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 1.1625,
          "description": "スコア116.25%ブースト (Lv.1)"
        }
      ]
    },
    "dreamGin": {
      "name": "Dream Gin",
      "displayName": "［Dream Believers］百生吟子",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.9062,
          "description": "スコア90.62%ブースト (Lv.1)"
        }
      ]
    },
    "aimaiKosuzu": {
      "name": "Aimai Kosuzu",
      "displayName": "［アイマイメーデー］徒町小鈴",
      "effects": [
        {
          "type": "voltageGain",
          "value": 67,
          "description": "ボルテージ67獲得 (Lv.1)"
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
              "value": 145,
              "description": "ボルテージ145獲得 (Lv.1)"
            }
          ]
        }
      ]
    },
    "blastHime": {
      "name": "Blast Hime",
      "displayName": "［BLAST!!］安養寺姫芽",
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
              "value": 0.2475,
              "description": "スコア24.75%ブースト (Lv.1)"
            }
          ],
          "else": [
            {
              "type": "scoreGain",
              "value": 3.06,
              "description": "スコア306%獲得 (Lv.1)"
            }
          ]
        }
      ]
    },
    "momijidaniRurino": {
      "name": "Momijidani Rurino",
      "displayName": "［紅葉乃舞姫］大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.5687,
          "description": "スコア56.87%ブースト (Lv.1)"
        },
        {
          "type": "conditional",
          "condition": "mental >= 70",
          "then": [
            {
              "type": "scoreBoost",
              "value": 0.91,
              "description": "スコア91%ブースト (Lv.1)"
            }
          ]
        }
      ]
    },
    "fanfareRurino": {
      "name": "Fanfare Rurino",
      "displayName": "［ファンファーレ！！！］大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.4687,
          "description": "スコア46.87%ブースト (Lv.1)"
        },
        {
          "type": "conditional",
          "condition": "mental >= 70",
          "then": [
            {
              "type": "scoreBoost",
              "value": 0.75,
              "description": "スコア75%ブースト (Lv.1)"
            }
          ]
        }
      ]
    },
    "linkFutureRurino": {
      "name": "Link Future Rurino",
      "displayName": "［Link to the FUTURE］大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.375,
          "description": "スコア37.5%ブースト (Lv.1)"
        },
        {
          "type": "conditional",
          "condition": "mental >= 50",
          "then": [
            {
              "type": "scoreBoost",
              "value": 0.4025,
              "description": "スコア40.25%ブースト (Lv.1)"
            }
          ]
        }
      ]
    },
    "identityRurino": {
      "name": "Identity Rurino",
      "displayName": "［アイデンティティ］大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 1.5937,
          "description": "スコアブースト効果159.37%上昇 (Lv.1)"
        }
      ]
    },
    "yoursEverRurino": {
      "name": "Yours Ever Rurino",
      "displayName": "［yours ever］大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 1.1625,
          "description": "スコア116.25%ブースト (Lv.1)"
        }
      ]
    },
    "natsumekiRurino": {
      "name": "Natsumeki Rurino",
      "displayName": "［夏めきペイン］大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.9062,
          "description": "スコア90.62%ブースト (Lv.1)"
        }
      ]
    },
    "dreamRurino": {
      "name": "Dream Rurino",
      "displayName": "［Dream Believers］大沢瑠璃乃",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 0.675,
          "description": "スコア67.5%ブースト (Lv.1)"
        }
      ]
    },
    "iDoMeRurino": {
      "name": "I Do Me Rurino",
      "displayName": "［アイドゥーミー！］大沢瑠璃乃",
      "effects": [
        {
          "type": "skipTurn",
          "condition": "count > 3",
          "description": "3回使用後は除外"
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
    }
  },
  "music": {
    "i_do_me": {
      "name": "アイドゥーミー",
      "phases": [12, 6, 5],
      "description": "フィーバー前: 12, フィーバー中: 6, フィーバー後: 5"
    },
    "hello_new_dream": {
      "name": "Hello, new dream!",
      "phases": [12, 8, 5],
      "description": "フィーバー前: 12, フィーバー中: 8, フィーバー後: 5"
    },
    "izayoi_serene": {
      "name": "十六夜セレーネ",
      "phases": [13, 6, 4],
      "description": "フィーバー前: 13, フィーバー中: 6, フィーバー後: 4"
    }
  }
};