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
          "value": 1.2375,
          "description": "スコア123.75%ブースト"
        },
        {
          "type": "voltageBoost",
          "value": 1.2375,
          "description": "ボルテージ123.75%ブースト"
        }
      ],
      "skillLevels": {
        "1": {
          "effect_0_value": 0.4125,
          "effect_1_value": 0.4125
        },
        "2": {
          "effect_0_value": 0.4537,
          "effect_1_value": 0.4537
        },
        "3": {
          "effect_0_value": 0.495,
          "effect_1_value": 0.495
        },
        "4": {
          "effect_0_value": 0.5362,
          "effect_1_value": 0.5362
        },
        "5": {
          "effect_0_value": 0.5775,
          "effect_1_value": 0.5775
        },
        "6": {
          "effect_0_value": 0.6187,
          "effect_1_value": 0.6187
        },
        "7": {
          "effect_0_value": 0.66,
          "effect_1_value": 0.66
        },
        "8": {
          "effect_0_value": 0.7012,
          "effect_1_value": 0.7012
        },
        "9": {
          "effect_0_value": 0.7425,
          "effect_1_value": 0.7425
        },
        "10": {
          "effect_0_value": 0.825,
          "effect_1_value": 0.825
        },
        "11": {
          "effect_0_value": 90.75,
          "effect_1_value": 90.75
        },
        "12": {
          "effect_0_value": 0.99,
          "effect_1_value": 0.99
        },
        "13": {
          "effect_0_value": 1.0725,
          "effect_1_value": 1.0725
        },
        "14": {
          "effect_0_value": 1.2375,
          "effect_1_value": 1.2375
        }
      }
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
              "value": 3.24,
              "description": "ボルテージ324%ブースト"
            },
            {
              "type": "resetCardTurn",
              "description": "カード順リセット"
            }
          ],
          "else": [
            {
              "type": "scoreBoost",
              "value": 3.24,
              "description": "スコア324%ブースト"
            }
          ]
        }
      ],
      "skillLevels": {
        "1": { "effect_0_then_0_value": 1.08, "effect_0_else_0_value": 1.08 },
        "2": { "effect_0_then_0_value": 1.188, "effect_0_else_0_value": 1.188 },
        "3": { "effect_0_then_0_value": 1.296, "effect_0_else_0_value": 1.296 },
        "4": { "effect_0_then_0_value": 1.404, "effect_0_else_0_value": 1.404 },
        "5": { "effect_0_then_0_value": 1.512, "effect_0_else_0_value": 1.512 },
        "6": { "effect_0_then_0_value": 1.62, "effect_0_else_0_value": 1.62 },
        "7": { "effect_0_then_0_value": 1.728, "effect_0_else_0_value": 1.728 },
        "8": { "effect_0_then_0_value": 1.836, "effect_0_else_0_value": 1.836 },
        "9": { "effect_0_then_0_value": 1.944, "effect_0_else_0_value": 1.944 },
        "10": { "effect_0_then_0_value": 2.16, "effect_0_else_0_value": 2.16 },
        "11": { "effect_0_then_0_value": 2.376, "effect_0_else_0_value": 2.376 },
        "12": { "effect_0_then_0_value": 2.592, "effect_0_else_0_value": 2.592 },
        "13": { "effect_0_then_0_value": 2.808, "effect_0_else_0_value": 2.808 },
        "14": { "effect_0_then_0_value": 3.24, "effect_0_else_0_value": 3.24 }
      }
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
              "value": 0.7875,
              "description": "ボルテージ78.75%ブースト"
            }
          ],
          "else": [
            {
              "type": "scoreBoost",
              "value": 2.43,
              "description": "スコア243%ブースト"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "mental >= 100",
          "then": [
            {
              "type": "voltageGain",
              "value": 945,
              "description": "ボルテージ945獲得"
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
      "skillLevels": {
        "1": { "effect_0_then_0_value": 0.2625, "effect_0_else_0_value": 0.81, "effect_1_then_0_value": 315 },
        "2": { "effect_0_then_0_value": 0.2887, "effect_0_else_0_value": 0.891, "effect_1_then_0_value": 346 },
        "3": { "effect_0_then_0_value": 0.315, "effect_0_else_0_value": 0.972, "effect_1_then_0_value": 378 },
        "4": { "effect_0_then_0_value": 0.3412, "effect_0_else_0_value": 1.053, "effect_1_then_0_value": 409 },
        "5": { "effect_0_then_0_value": 0.3675, "effect_0_else_0_value": 1.134, "effect_1_then_0_value": 441 },
        "6": { "effect_0_then_0_value": 0.3937, "effect_0_else_0_value": 1.215, "effect_1_then_0_value": 472 },
        "7": { "effect_0_then_0_value": 0.42, "effect_0_else_0_value": 1.296, "effect_1_then_0_value": 504 },
        "8": { "effect_0_then_0_value": 0.4462, "effect_0_else_0_value": 1.377, "effect_1_then_0_value": 535 },
        "9": { "effect_0_then_0_value": 0.4725, "effect_0_else_0_value": 1.458, "effect_1_then_0_value": 567 },
        "10": { "effect_0_then_0_value": 0.525, "effect_0_else_0_value": 1.62, "effect_1_then_0_value": 630 },
        "11": { "effect_0_then_0_value": null, "effect_0_else_0_value": null, "effect_1_then_0_value": null },
        "12": { "effect_0_then_0_value": null, "effect_0_else_0_value": null, "effect_1_then_0_value": null },
        "13": { "effect_0_then_0_value": null, "effect_0_else_0_value": null, "effect_1_then_0_value": null },
        "14": { "effect_0_then_0_value": 0.7875, "effect_0_else_0_value": 2.43, "effect_1_then_0_value": 945 }
      }
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
              "value": 11.34,
              "description": "スコア11.34倍"
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
      "skillLevels": {
        "1": { "effect_1_then_0_value": 3.78 },
        "2": { "effect_1_then_0_value": 4.158 },
        "3": { "effect_1_then_0_value": 4.536 },
        "4": { "effect_1_then_0_value": 4.914 },
        "5": { "effect_1_then_0_value": 5.292 },
        "6": { "effect_1_then_0_value": 5.67 },
        "7": { "effect_1_then_0_value": 6.048 },
        "8": { "effect_1_then_0_value": 6.426 },
        "9": { "effect_1_then_0_value": 6.804 },
        "10": { "effect_1_then_0_value": 7.56},
        "11": { "effect_1_then_0_value": null },
        "12": { "effect_1_then_0_value": null },
        "13": { "effect_1_then_0_value": 9.828 },
        "14": { "effect_1_then_0_value": 11.34 }
      }
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
              "value": 3.2625,
              "description": "ボルテージ326.25%ブースト"
            }
          ]
        },
        {
          "type": "conditional",
          "condition": "voltageLevel >= 7",
          "then": [
            {
              "type": "scoreBoost",
              "value": 4.35,
              "description": "スコア435%ブースト"
            }
          ]
        }
      ],
      "skillLevels": {
        "1": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "2": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "3": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "4": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "5": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "6": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "7": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "8": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "9": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "10": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "11": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "12": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "13": { "effect_0_then_0_value": null, "effect_1_then_0_value": null },
        "14": { "effect_0_then_0_value": 3.2625, "effect_1_then_0_value": 4.35 }
      }
    },
    "butoGin": {
      "name": "Buto Gin",
      "displayName": "［輝跡の舞踏会］百生吟子",
      "effects": [
        {
          "type": "scoreBoost",
          "value": 2.5312,
          "description": "スコア253.12%ブースト"
        },
        {
          "type": "voltageBoost",
          "value": 2.5312,
          "description": "ボルテージ253.12%ブースト"
        }
      ],
      "skillLevels": {
        "1": { "effect_0_value": null, "effect_1_value": null },
        "2": { "effect_0_value": null, "effect_1_value": null },
        "3": { "effect_0_value": null, "effect_1_value": null },
        "4": { "effect_0_value": null, "effect_1_value": null },
        "5": { "effect_0_value": null, "effect_1_value": null },
        "6": { "effect_0_value": null, "effect_1_value": null },
        "7": { "effect_0_value": null, "effect_1_value": null },
        "8": { "effect_0_value": null, "effect_1_value": null },
        "9": { "effect_0_value": null, "effect_1_value": null },
        "10": { "effect_0_value": null, "effect_1_value": null },
        "11": { "effect_0_value": null, "effect_1_value": null },
        "12": { "effect_0_value": null, "effect_1_value": null },
        "13": { "effect_0_value": null, "effect_1_value": null },
        "14": { "effect_0_value": 2.5312, "effect_1_value": 2.5312 }
      }
    },
    "lrTsuzuri": {
      "name": "LR Tsuzuri",
      "displayName": "［幸せのリボン］夕霧綴理",
      "effects": [
        {
          "type": "voltageGain",
          "value": 731,
          "description": "ボルテージ731獲得"
        },
        {
          "type": "conditional",
          "condition": "turn >= 10",
          "then": [
            {
              "type": "voltageGain",
              "value": 1170,
              "description": "ボルテージ1170獲得"
            }
          ]
        }
      ],
      "skillLevels": {
        "1": { "effect_0_value": null, "effect_1_then_0_value": null },
        "2": { "effect_0_value": null, "effect_1_then_0_value": null },
        "3": { "effect_0_value": null, "effect_1_then_0_value": null },
        "4": { "effect_0_value": null, "effect_1_then_0_value": null },
        "5": { "effect_0_value": null, "effect_1_then_0_value": null },
        "6": { "effect_0_value": null, "effect_1_then_0_value": null },
        "7": { "effect_0_value": null, "effect_1_then_0_value": null },
        "8": { "effect_0_value": null, "effect_1_then_0_value": null },
        "9": { "effect_0_value": null, "effect_1_then_0_value": null },
        "10": { "effect_0_value": null, "effect_1_then_0_value": null },
        "11": { "effect_0_value": null, "effect_1_then_0_value": null },
        "12": { "effect_0_value": null, "effect_1_then_0_value": null },
        "13": { "effect_0_value": null, "effect_1_then_0_value": null },
        "14": { "effect_0_value": 731, "effect_1_then_0_value": 1170 }
      }
    }
  },
  "music": {
    "i_do_me": {
      "name": "アイドゥーミー",
      "phases": [11, 7, 5],
      "description": "フィーバー前: 11, フィーバー中: 7, フィーバー後: 5"
    }
  }
};