declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export const initGoogleAnalytics = () => {
  const gaId = import.meta.env.VITE_GA_ID

  if (!gaId || import.meta.env.DEV) {
    // Skip analytics in development or if ID is not set
    return
  }

  // Initialize dataLayer and gtag before loading the script
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }

  // Set up initial configuration
  window.gtag('js', new Date())
  window.gtag('config', gaId, {
    send_page_view: true,
  })

  // Load gtag script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  script.onerror = () => {
    console.error('[GA4] Failed to load Google Analytics script')
  }
  document.head.appendChild(script)
}

// Custom event tracking
export const trackEvent = (
  eventName: string,
  parameters?: {
    category?: string
    label?: string
    value?: number
    [key: string]: unknown
  },
) => {
  if (import.meta.env.DEV) {
    return
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, parameters)
  }
}

// Predefined events for the sukushou app
export const trackCalculation = (params: {
  musicName: string
  totalScore: number
  totalVoltage: number
  apConsumed: number
  referenceScore?: number
  shareUrl?: string
}) => {
  trackEvent('score_calculation', {
    category: 'gameplay',
    music_name: params.musicName,
    total_score: params.totalScore,
    total_voltage: params.totalVoltage,
    ap_consumed: params.apConsumed,
    reference_score: params.referenceScore,
    share_url: params.shareUrl,
  })
}

export const trackCardSelection = (params: {
  cardName: string
  character: string
  position: number
}) => {
  trackEvent('card_selected', {
    category: 'gameplay',
    card_name: params.cardName,
    character: params.character,
    position: params.position,
  })
}

export const trackFeatureUsage = (
  featureName: string,
  additionalParams?: Record<string, unknown>,
) => {
  trackEvent('feature_used', {
    category: 'engagement',
    feature_name: featureName,
    ...additionalParams,
  })
}

export const trackError = (errorMessage: string, errorLocation?: string) => {
  trackEvent('error_occurred', {
    category: 'technical',
    error_message: errorMessage,
    error_location: errorLocation,
  })
}
