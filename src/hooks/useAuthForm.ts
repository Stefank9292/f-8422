import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AuthError, AuthApiError } from '@supabase/supabase-js';

interface AuthFormConfig {
  mode: 'sign_in' | 'sign_up';
  onSuccess?: () => void;
  updateRateLimit?: () => void;
}

export const useAuthForm = ({ mode, onSuccess, updateRateLimit }: AuthFormConfig) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getAuthErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes('Invalid login credentials')) {
            return 'Invalid email or password. Please check your credentials and try again.';
          }
          if (error.message.includes('Email not confirmed')) {
            return 'Please verify your email address before signing in.';
          }
          return 'Invalid credentials. Please check your input and try again.';
        case 422:
          return 'Invalid email format. Please enter a valid email address.';
        case 429:
          return 'Too many attempts. Please try again later.';
        default:
          return 'An error occurred during authentication. Please try again.';
      }
    }
    return 'An unexpected error occurred. Please try again.';
  };

  const handleAuthError = (error: Error) => {
    console.error(`${mode} error:`, error);
    updateRateLimit?.();
    
    const errorMessage = error instanceof AuthError 
      ? getAuthErrorMessage(error)
      : 'An unexpected error occurred. Please try again.';

    toast({
      title: "Authentication Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const handleAuthSuccess = async (session: any) => {
    if (!session) {
      throw new Error("No session created after authentication");
    }

    // Verify the session is valid
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      session.access_token
    );

    if (userError || !user) {
      throw new Error("Failed to verify user session");
    }

    toast({
      title: "Success",
      description: `Successfully ${mode === 'sign_in' ? 'signed in' : 'signed up'}`,
    });

    onSuccess?.();
  };

  return {
    loading,
    setLoading,
    handleAuthError,
    handleAuthSuccess
  };
};