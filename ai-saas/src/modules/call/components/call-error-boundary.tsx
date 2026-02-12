'use client';

import { Component, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CallErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Call error boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#202124] p-4">
          <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl bg-[#303134] p-8 text-center shadow-lg">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ea4335]/10">
              <AlertCircle className="h-8 w-8 text-[#ea4335]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-[#e8eaed]">
                Something went wrong
              </h2>
              <p className="text-sm text-[#9aa0a6]">
                An unexpected error occurred during the call. You can try
                rejoining or return to the meetings page.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 rounded-full bg-[#1a73e8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1765cc] transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
              <a
                href="/meetings"
                className="flex items-center gap-2 rounded-full border border-[#5f6368] px-5 py-2.5 text-sm font-medium text-[#8ab4f8] hover:bg-[#3c4043] transition-colors"
              >
                Back to meetings
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
