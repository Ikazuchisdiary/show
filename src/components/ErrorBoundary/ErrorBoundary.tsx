import React, { Component, ErrorInfo, ReactNode } from 'react'
import './ErrorBoundary.css'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1>エラーが発生しました</h1>
            <p>申し訳ございません。予期しないエラーが発生しました。</p>
            <details className="error-details">
              <summary>エラーの詳細</summary>
              <pre>{this.state.error?.toString()}</pre>
            </details>
            <button onClick={this.handleReset} className="error-reset-button">
              ページを再読み込み
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}