import { useMemo } from 'react'
import { Card } from '@core/models/Card'

export const useDuplicateCharacterDetection = (cards: (Card | null)[]) => {
  const duplicateIndices = useMemo(() => {
    const characterSlots = new Map<string, number[]>()
    const duplicates = new Set<number>()
    const specialCardIndices: number[] = []

    // Build a map of character to slot indices
    cards.forEach((card, index) => {
      if (card?.character) {
        const slots = characterSlots.get(card.character) || []
        slots.push(index)
        characterSlots.set(card.character, slots)
      }
      
      // Check for special cards (Prism Echo, Ether Aria, Oracle Étude)
      if (card?.displayName && 
          (card.displayName.includes('Prism Echo') || 
           card.displayName.includes('Ether Aria') || 
           card.displayName.includes('Oracle Étude'))) {
        specialCardIndices.push(index)
      }
    })

    // Find slots with duplicate characters (3枚目以降をエラーとする)
    characterSlots.forEach((slots) => {
      if (slots.length > 2) {
        // 3枚目以降（インデックス2以降）をエラーとする
        for (let i = 2; i < slots.length; i++) {
          duplicates.add(slots[i])
        }
      }
    })
    
    // Check for multiple special cards (2枚目以降をエラーとする)
    if (specialCardIndices.length > 1) {
      for (let i = 1; i < specialCardIndices.length; i++) {
        duplicates.add(specialCardIndices[i])
      }
    }

    return duplicates
  }, [cards])

  return duplicateIndices
}
