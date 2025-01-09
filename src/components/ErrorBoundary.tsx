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
    // Only return a generic message in production
    return { 
      hasError: true, 
      error: process.env.NODE_ENV === 'production' 
        ? new Error('An unexpected error occurred') 
        : error 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Sanitize error information before logging
    const sanitizedError = {
      name: error.name,
      message: this.sanitizeErrorMessage(error.message),
      componentStack: this.sanitizeStackTrace(errorInfo.componentStack)
    };

    console.error('Uncaught error:', sanitizedError);
    this.logErrorSecurely(error, errorInfo);
  }

  private sanitizeErrorMessage(message: string): string {
    // Remove potential sensitive information from error messages
    return message.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi, '[EMAIL]')
                 .replace(/\b\d{4}\b/g, '[ID]')
                 .replace(/Bearer [a-zA-Z0-9\-._~+/]+=*/g, '[TOKEN]');
  }

  private sanitizeStackTrace(stack: string): string {
    // Remove file paths and line numbers from stack trace
    return stack.split('\n')
                .map(line => line.replace(/\(.*\)/g, '(...)'))
                .join('\n');
  }

  private async logErrorSecurely(error: Error, errorInfo: ErrorInfo) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const sanitizedError = {
          userId: session.user.id,
          errorName: error.name,
          errorMessage: this.sanitizeErrorMessage(error.message),
          timestamp: new Date().toISOString()
        };

        // Log sanitized error
        console.error('Authenticated user error:', sanitizedError);
      }
    } catch (loggingError) {
      // Fail silently but log generic error
      console.error('Error logging failed');
    }
  }

  private handleRefresh = () => {
    // Clear any cached data that might be causing the error
    if (window.localStorage) {
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
              {process.env.NODE_ENV === 'production' 
                ? 'An unexpected error occurred' 
                : this.state.error?.message}
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