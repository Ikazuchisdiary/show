import { useEffect } from 'react'

/**
 * Accessibility improvements hook
 */
export function useA11y() {
  useEffect(() => {
    // Skip navigation link
    const skipLink = document.createElement('a')
    skipLink.href = '#main'
    skipLink.className = 'skip-link'
    skipLink.textContent = 'メインコンテンツへスキップ'
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #2196f3;
      color: white;
      padding: 8px;
      text-decoration: none;
      z-index: 100;
    `
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0'
    })
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px'
    })
    document.body.insertBefore(skipLink, document.body.firstChild)

    // Set main content id
    const mainContent = document.querySelector('.container')
    if (mainContent) {
      mainContent.id = 'main'
      mainContent.setAttribute('role', 'main')
    }

    // Announce simulation results to screen readers
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `
    document.body.appendChild(announcer)

    // Cleanup
    return () => {
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink)
      }
      if (announcer.parentNode) {
        announcer.parentNode.removeChild(announcer)
      }
    }
  }, [])
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string) {
  const announcer = document.querySelector('[aria-live="polite"]')
  if (announcer) {
    announcer.textContent = message
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = ''
    }, 1000)
  }
}
