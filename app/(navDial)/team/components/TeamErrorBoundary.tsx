import React from "react";

interface TeamErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface TeamErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>;
}

class TeamErrorBoundary extends React.Component<TeamErrorBoundaryProps, TeamErrorBoundaryState> {
  constructor(props: TeamErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<TeamErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Team page error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback) {
        return <Fallback error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <DefaultErrorFallback 
          error={this.state.error} 
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-red-400">Something went wrong</h1>
          <p className="text-gray-300">
            We encountered an error while loading the team page.
          </p>
        </div>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left bg-gray-800 rounded-lg p-4 text-sm">
            <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-red-300 whitespace-pre-wrap break-words">
              {error.message}
            </pre>
          </details>
        )}
        
        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            type="button"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            type="button"
          >
            Reload Page
          </button>
        </div>
        
        <p className="text-sm text-gray-400">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

// HOC for easier usage
export const withTeamErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
) => {
  const WrappedComponent = (props: P) => (
    <TeamErrorBoundary fallback={fallback}>
      <Component {...props} />
    </TeamErrorBoundary>
  );
  
  WrappedComponent.displayName = `withTeamErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default TeamErrorBoundary;