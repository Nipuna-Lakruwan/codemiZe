import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for verifying authentication status
 * This hook provides additional verification beyond the basic isAuthenticated state
 */
export function useAuthVerification() {
  const { isAuthenticated, user, verifyAuth } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Verify authentication on mount
  useEffect(() => {
    const verify = async () => {
      setIsVerifying(true);
      try {
        const result = verifyAuth();
        setVerificationResult(result);
      } catch (error) {
        setVerificationResult({ isValid: false, user: null, error: error.message });
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [verifyAuth]);

  // Manual verification function
  const manualVerify = () => {
    setIsVerifying(true);
    try {
      const result = verifyAuth();
      setVerificationResult(result);
      return result;
    } catch (error) {
      const errorResult = { isValid: false, user: null, error: error.message };
      setVerificationResult(errorResult);
      return errorResult;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    isAuthenticated,
    user,
    isVerifying,
    verificationResult,
    manualVerify,
    // Helper functions
    isTokenValid: verificationResult?.isValid && user?.token,
    hasValidSession: isAuthenticated && verificationResult?.isValid,
  };
}
