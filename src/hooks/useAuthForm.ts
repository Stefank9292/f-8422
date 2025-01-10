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
            return 'The email or password you entered is incorrect. Please try again.';
          }
          if (error.message.includes('Email not confirmed')) {
            return 'Please verify your email address before signing in.';
          }
          if (error.message.includes('User not found')) {
            return 'No account found with this email address. Please check your email or sign up for a new account.';
          }
          return 'The credentials you entered are invalid. Please check and try again.';
        case 422:
          return 'Please enter a valid email address.';
        case 429:
          return 'Too many login attempts. Please wait a moment before trying again.';
        default:
          return 'Something went wrong. Please try again later.';
      }
    }
    return 'Something went wrong. Please try again later.';
  };

  const handleAuthError = (error: Error) => {
    console.error(`${mode} error:`, error);
    updateRateLimit?.();
    
    const errorMessage = error instanceof AuthError 
      ? getAuthErrorMessage(error)
      : 'Something went wrong. Please try again later.';

    toast({
      title: mode === 'sign_in' ? 'Sign In Failed' : 'Sign Up Failed',
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