import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders headline', () => {
    render(<App />)
    expect(screen.getByText('スクショウ計算ツール')).toBeInTheDocument()
  })
  
  it('renders music selector', () => {
    render(<App />)
    expect(screen.getByText('楽曲情報')).toBeInTheDocument()
  })
  
  it('renders card selector', () => {
    render(<App />)
    expect(screen.getByText('カード選択')).toBeInTheDocument()
  })
  
  it('renders simulation controls', () => {
    render(<App />)
    expect(screen.getByText('結果を計算する')).toBeInTheDocument()
  })
})
