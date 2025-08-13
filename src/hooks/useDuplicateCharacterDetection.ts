import { useMemo } from 'react'
import { Card } from '@core/models/Card'

export const useDuplicateCharacterDetection = (cards: (Card | null)[]) => {
  const result = useMemo(() => {
    const characterSlots = new Map<string, number[]>()
    const characterDuplicates = new Set<number>()
    const drCardIndices: number[] = []
    const drDuplicates = new Set<number>()

    // Build a map of character to slot indices
    cards.forEach((card, index) => {
      if (card?.character) {
        const slots = characterSlots.get(card.character) || []
        slots.push(index)
        characterSlots.set(card.character, slots)
      }

      // Check for DR cards (Prism Echo, Ether Aria, Oracle Étude)
      if (
        card?.displayName &&
        (card.displayName.includes('［Prism Echo］') ||
          card.displayName.includes('［Ether Aria］') ||
          card.displayName.includes('［Oracle Étude］'))
      ) {
        drCardIndices.push(index)
      }
    })

    // Find slots with duplicate characters (3枚目以降をエラーとする)
    characterSlots.forEach((slots) => {
      if (slots.length > 2) {
        // 3枚目以降（インデックス2以降）をエラーとする
        for (let i = 2; i < slots.length; i++) {
          characterDuplicates.add(slots[i])
        }
      }
    })

    // Check for multiple DR cards (2枚目以降をエラーとする)
    if (drCardIndices.length > 1) {
      for (let i = 1; i < drCardIndices.length; i++) {
        drDuplicates.add(drCardIndices[i])
      }
    }

    return {
      duplicateIndices: new Set([...characterDuplicates, ...drDuplicates]),
      hasDRDuplicates: drDuplicates.size > 0,
      hasCharacterDuplicates: characterDuplicates.size > 0,
    }
  }, [cards])

  return result
}
