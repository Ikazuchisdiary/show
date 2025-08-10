// Card data for 大賀美沙知
const ogami_sachiCards = {
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
}

export default ogami_sachiCards
