import { useMemo } from 'react'
import { Card } from '@core/models/Card'

export const useDuplicateCharacterDetection = (cards: (Card | null)[]) => {
  const duplicateIndices = useMemo(() => {
    const characterSlots = new Map<string, number[]>()
    const duplicates = new Set<number>()

    // Build a map of character to slot indices
    cards.forEach((card, index) => {
      if (card?.character) {
        const slots = characterSlots.get(card.character) || []
        slots.push(index)
        characterSlots.set(card.character, slots)
      }
    })

    // Find slots with duplicate characters
    characterSlots.forEach((slots) => {
      if (slots.length > 1) {
        slots.forEach((slot) => duplicates.add(slot))
      }
    })

    return duplicates
  }, [cards])

  return duplicateIndices
}
