// Card and music data
const gameData = {
  "cards": {
    "sachi": {
      "name": "Sachi",
      "displayName": "［蓮ノ空女学院スクールアイドルクラブ101期生］大賀美沙知",
      "effects": [
        {
          "type": "skipTurn",
          "condition": "count === 3",
          "description": "3回目の使用時にターンをスキップ"
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
          "condition": "count <= 2",
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
          "condition": "count <= 0",
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
    }
  },
  "music": {
    "i_do_me": {
      "name": "アイドゥーミー",
      "phases": [12, 6, 5],
      "description": "フィーバー前: 12, フィーバー中: 6, フィーバー後: 5"
    }
  }
};