import React from 'react';
import { AlertTriangle } from "lucide-react";

interface UndefinedSessionStateProps {
  onRefresh: () => void;
}

export const UndefinedSessionState = ({ onRefresh }: UndefinedSessionStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
        <h1 className="text-xl font-semibold">Session Error</h1>
        <p className="text-sm text-muted-foreground">
          Unable to verify your session. Please try refreshing the page.
        </p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};