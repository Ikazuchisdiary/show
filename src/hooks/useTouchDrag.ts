import { useRef, useCallback } from 'react'

interface TouchDragOptions {
  onDragStart: (index: number) => void
  onDragEnd: () => void
  onDrop: (fromIndex: number, toIndex: number, insertBefore: boolean) => void
  longPressDelay?: number
}

export const useTouchDrag = (options: TouchDragOptions) => {
  const { onDragStart, onDragEnd, onDrop, longPressDelay = 500 } = options

  const touchItem = useRef<HTMLElement | null>(null)
  const touchOffset = useRef({ x: 0, y: 0 })
  const touchStartPos = useRef({ x: 0, y: 0 })
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const isDragging = useRef(false)
  const dragClone = useRef<HTMLElement | null>(null)
  const itemIndex = useRef<number>(-1)

  const clearDragState = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    if (dragClone.current) {
      dragClone.current.remove()
      dragClone.current = null
    }

    document.querySelectorAll('.card-slot').forEach((slot) => {
      slot.classList.remove('dragging', 'drop-before', 'drop-after')
    })

    touchItem.current = null
    isDragging.current = false
    itemIndex.current = -1
  }, [])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, index: number) => {
      const touch = e.touches[0]
      const element = e.currentTarget as HTMLElement

      touchStartPos.current = { x: touch.clientX, y: touch.clientY }
      isDragging.current = false
      itemIndex.current = index

      const rect = element.getBoundingClientRect()
      touchOffset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }

      touchItem.current = element

      // Start long press timer
      longPressTimer.current = setTimeout(() => {
        if (!touchItem.current || isDragging.current) return

        isDragging.current = true
        touchItem.current.classList.add('dragging')
        onDragStart(index)

        // Create visual clone
        const clone = touchItem.current.cloneNode(true) as HTMLElement
        clone.id = 'drag-clone'
        clone.style.position = 'fixed'
        clone.style.zIndex = '9999'
        clone.style.opacity = '0.9'
        clone.style.pointerEvents = 'none'
        clone.style.width = rect.width + 'px'
        clone.style.left = touch.clientX - touchOffset.current.x + 'px'
        clone.style.top = touch.clientY - touchOffset.current.y + 'px'
        clone.style.backgroundColor = '#ffffff'
        clone.classList.remove('dragging')
        document.body.appendChild(clone)
        dragClone.current = clone

        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(50)
        }

        // Hide drag hint after first drag
        document.body.classList.add('has-dragged')
      }, longPressDelay)
    },
    [onDragStart, longPressDelay],
  )

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]

    // Cancel long press if moved too much before timer
    if (!isDragging.current && longPressTimer.current) {
      const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - touchStartPos.current.x, 2) +
          Math.pow(touch.clientY - touchStartPos.current.y, 2),
      )

      if (moveDistance > 10) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    }

    if (!isDragging.current) return

    // Prevent scrolling on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS) {
      e.preventDefault()
    }

    if (!touchItem.current || !dragClone.current) return

    // Update clone position
    dragClone.current.style.left = touch.clientX - touchOffset.current.x + 'px'
    dragClone.current.style.top = touch.clientY - touchOffset.current.y + 'px'

    // Find element under touch point
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
    const slotBelow = elementBelow?.closest('.card-slot') as HTMLElement

    // Clear previous indicators
    document.querySelectorAll('.card-slot').forEach((slot) => {
      slot.classList.remove('drop-before', 'drop-after')
    })

    if (slotBelow && slotBelow !== touchItem.current) {
      const rect = slotBelow.getBoundingClientRect()
      const midpoint = rect.top + rect.height / 2

      if (touch.clientY < midpoint) {
        slotBelow.classList.add('drop-before')
      } else {
        slotBelow.classList.add('drop-after')
      }
    }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }

      if (isDragging.current && touchItem.current && itemIndex.current !== -1) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        if (isIOS) {
          e.preventDefault()
        }

        const touch = e.changedTouches[0]
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
        const slotBelow = elementBelow?.closest('.card-slot') as HTMLElement

        if (slotBelow && slotBelow !== touchItem.current) {
          const toSlot = slotBelow.getAttribute('data-slot')
          if (toSlot) {
            const toIndex = parseInt(toSlot) - 1
            const rect = slotBelow.getBoundingClientRect()
            const midpoint = rect.top + rect.height / 2
            const insertBefore = touch.clientY < midpoint

            onDrop(itemIndex.current, toIndex, insertBefore)
          }
        }
      }

      clearDragState()
      onDragEnd()
    },
    [clearDragState, onDragEnd, onDrop],
  )

  const handleTouchCancel = useCallback(() => {
    clearDragState()
    onDragEnd()
  }, [clearDragState, onDragEnd])

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
  }
}
