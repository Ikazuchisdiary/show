import { lazy, Suspense } from 'react'

// Lazy load heavy components
export const UpdateHistoryModal = lazy(() =>
  import('./components/UpdateHistoryModal').then((module) => ({
    default: module.UpdateHistoryModal,
  })),
)

export const ShareModeBanner = lazy(() =>
  import('./components/ShareModeBanner').then((module) => ({
    default: module.ShareModeBanner,
  })),
)

// Loading fallback component
export const LoadingFallback = () => (
  <div style={{ textAlign: 'center', padding: '20px' }}>読み込み中...</div>
)

// Wrapper for lazy components
export const LazyComponent = ({ Component, ...props }: { Component: any; [key: string]: any }) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
)