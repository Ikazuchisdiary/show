import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/show/',
  build: {
    outDir: 'docs-v2',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // node_modules内のパッケージをvendorチャンクに
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          // カード・楽曲データを別チャンクに
          if (id.includes('/src/data/cards/') || id.includes('/src/data/musicData')) {
            return 'game-data'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@core': path.resolve(__dirname, './src/core'),
      '@data': path.resolve(__dirname, './src/data'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
