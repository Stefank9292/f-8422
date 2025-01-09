import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import * as Sentry from "@sentry/react";

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
    return { 
      hasError: true, 
      error: process.env.NODE_ENV === 'production' 
        ? new Error('An unexpected error occurred') 
        : error 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Log to Sentry
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
    
    this.logErrorSecurely(error, errorInfo);
  }

  private async logErrorSecurely(error: Error, errorInfo: ErrorInfo) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const sanitizedError = {
          userId: session.user.id,
          errorName: error.name,
          errorMessage: error.message,
          timestamp: new Date().toISOString()
        };
        console.error('Authenticated user error:', sanitizedError);
        
        // Log to Sentry with user context
        Sentry.setUser({
          id: session.user.id,
          email: session.user.email || undefined
        });
      }
    } catch (loggingError) {
      console.error('Error logging failed');
      Sentry.captureException(loggingError);
    }
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    if (window.localStorage) {
      const authData = window.localStorage.getItem('supabase.auth.token');
      window.localStorage.clear();
      if (authData) {
        window.localStorage.setItem('supabase.auth.token', authData);
      }
    }
    window.location.href = '/';
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
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
              >
                Refresh page
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/90 transition-colors"
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