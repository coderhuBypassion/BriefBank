import { useEffect, useState } from 'react';
import { apiRequest } from './queryClient';
import { User } from './types';
import {
  useUser,
  useAuth as useClerkAuth,
  useClerk,
  SignInResource,
  SignUpResource
} from '@clerk/clerk-react';

// Export our own auth hook that wraps Clerk's hooks
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export const useAuth = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useClerkAuth();
  const { signOut: clerkSignOut } = useClerk();
  const [token, setToken] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Get the user's session token when signed in
  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        try {
          const sessionToken = await getToken();
          setToken(sessionToken);

          // Also fetch user data from our API
          const response = await fetch('/api/me', {
            headers: {
              'Authorization': `Bearer ${sessionToken}`
            },
            credentials: 'include'
          });

          if (response.ok) {
            const userData = await response.json();
            setAuthUser(userData);
            setStatus('authenticated');
          } else {
            console.error('Failed to fetch user data');
            setStatus('unauthenticated');
          }
        } catch (error) {
          console.error('Failed to get token:', error);
          setStatus('unauthenticated');
        }
      } else if (isLoaded) {
        setToken(null);
        setAuthUser(null);
        setStatus('unauthenticated');
      }
    };

    if (isLoaded) {
      fetchToken();
    }
  }, [isSignedIn, isLoaded, getToken]);

  // For backward compatibility
  const signIn = async (email: string, password: string) => {
    try {
      // This would be handled by Clerk's SignIn component now
      return { success: true };
    } catch (error) {
      console.error('Sign in failed:', error);
      return { success: false, error: 'Authentication failed' };
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      // This would be handled by Clerk's SignUp component now
      return { success: true };
    } catch (error) {
      console.error('Sign up failed:', error);
      return { success: false, error: 'Registration failed' };
    }
  };
  
  const signOut = async () => {
    try {
      await clerkSignOut();
      setToken(null);
      setAuthUser(null);
      setStatus('unauthenticated');
      return { success: true };
    } catch (error) {
      console.error('Sign out failed:', error);
      return { success: false, error: 'Sign out failed' };
    }
  };

  return {
    status,
    user: authUser || (user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      isPro: false,
      usedSummaries: 0,
      createdAt: new Date()
    } : null),
    token,
    signIn,
    signUp,
    signOut,
    isLoaded,
    isSignedIn
  };
};

// Custom hook to trigger a payment
export const usePayment = () => {
  const initiatePayment = async () => {
    try {
      // Create order
      const orderRes = await apiRequest('POST', '/api/payment/checkout');
      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
      
      const orderData = await orderRes.json();
      
      // In a real implementation, we would initialize Razorpay checkout here
      // For demo purposes, we'll simulate a successful payment
      
      // Simulate opening Razorpay checkout modal
      console.log('Opening Razorpay checkout with order:', orderData);
      
      // Simulate payment completion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate payment verification
      const verifyRes = await apiRequest('POST', '/api/payment/verify', {
        razorpay_order_id: orderData.orderId,
        razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 12)}`,
        razorpay_signature: 'valid_signature'
      });
      
      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.message || 'Payment verification failed');
      }
      
      const verifyData = await verifyRes.json();
      return verifyData;
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  };
  
  return { initiatePayment };
};
