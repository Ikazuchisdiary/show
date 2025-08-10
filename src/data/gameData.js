// Re-exports card and music data for backward compatibility
import cardData from './cardData.js'
import musicData from './musicData.js'

const gameData = {
  cards: cardData,
  music: musicData,
}

export default gameData
