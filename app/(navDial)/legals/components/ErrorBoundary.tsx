"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface State {
  readonly hasError: boolean;
  readonly error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <div className="p-4 bg-red-900/20 rounded-xl border border-red-400/30 mb-6">
                <h2 className="text-xl font-bold text-red-400 mb-2">
                  Something went wrong
                </h2>
                <p className="text-zinc-300 text-sm">
                  We apologize for the inconvenience. Please try refreshing the
                  page.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-lg text-cyan-400 hover:text-white transition-colors duration-200"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
