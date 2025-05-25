import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundaryState } from '../../types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error?.message}
            </details>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="button button--secondary"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
