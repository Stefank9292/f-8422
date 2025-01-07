import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error securely without exposing sensitive information
    console.error('Uncaught error:', {
      name: error.name,
      message: error.message,
      componentStack: errorInfo.componentStack
    });

    // If user is authenticated, we can log the error with user context
    this.logErrorSecurely(error, errorInfo);
  }

  private async logErrorSecurely(error: Error, errorInfo: ErrorInfo) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Log error with user context but without sensitive data
        console.error('Authenticated user error:', {
          userId: session.user.id,
          errorName: error.name,
          errorMessage: error.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (loggingError) {
      // Fail silently to avoid cascading errors
      console.error('Error logging failed:', loggingError);
    }
  }

  private handleRefresh = () => {
    // Clear any cached data that might be causing the error
    if (window.localStorage) {
      // Keep auth data but clear potentially corrupted state
      const authData = window.localStorage.getItem('supabase.auth.token');
      window.localStorage.clear();
      if (authData) {
        window.localStorage.setItem('supabase.auth.token', authData);
      }
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="space-x-4">
              <button
                onClick={this.handleRefresh}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
              >
                Refresh page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm"
              >
                Go to homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
