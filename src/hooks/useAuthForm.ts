import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthFormConfig {
  mode: 'sign_in' | 'sign_up';
  onSuccess?: () => void;
  updateRateLimit?: () => void;
}

export const useAuthForm = ({ mode, onSuccess, updateRateLimit }: AuthFormConfig) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuthError = (error: Error) => {
    console.error(`${mode} error:`, error);
    updateRateLimit?.();
    
    if (error.message.includes('Invalid login credentials')) {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred during authentication",
        variant: "destructive",
      });
    }
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