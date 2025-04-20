import { useEffect, useState } from 'react';
import { apiRequest } from './queryClient';
import { User } from './types';

// Client-side auth utilities for Clerk
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'demo_pk_key';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

// Manages auth token and user session
// This is a simplified version of how Clerk would work
export const useAuth = () => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // For demo, we'll use localStorage to simulate auth persistence
    // In a real implementation, this would use Clerk's SDK
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        if (!storedToken) {
          setStatus('unauthenticated');
          return;
        }

        // Set the token
        setToken(storedToken);
        
        // Fetch user data from API
        const response = await fetch('/api/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          },
          credentials: 'include'
        });

        if (!response.ok) {
          // Token is invalid
          localStorage.removeItem('auth_token');
          setStatus('unauthenticated');
          return;
        }

        const userData = await response.json();
        setUser(userData);
        setStatus('authenticated');
      } catch (error) {
        console.error('Auth check failed:', error);
        setStatus('unauthenticated');
      }
    };

    checkAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      // In a real implementation, this would use Clerk's signIn method
      // For demo purposes, we'll simulate a successful sign-in
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set demo token
      const demoToken = 'demo_token';
      localStorage.setItem('auth_token', demoToken);
      setToken(demoToken);
      
      // Fetch user data
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${demoToken}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      setUser(userData);
      setStatus('authenticated');
      
      return { success: true };
    } catch (error) {
      console.error('Sign in failed:', error);
      return { success: false, error: 'Authentication failed' };
    }
  };
  
  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      // In a real implementation, this would use Clerk's signUp method
      // For demo purposes, we'll simulate a successful sign-up
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set demo token
      const demoToken = 'demo_token';
      localStorage.setItem('auth_token', demoToken);
      setToken(demoToken);
      
      // Fetch/create user data
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${demoToken}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      const userData = await response.json();
      setUser(userData);
      setStatus('authenticated');
      
      return { success: true };
    } catch (error) {
      console.error('Sign up failed:', error);
      return { success: false, error: 'Registration failed' };
    }
  };
  
  // Sign out function
  const signOut = async () => {
    try {
      // In a real implementation, this would use Clerk's signOut method
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      setStatus('unauthenticated');
      
      return { success: true };
    } catch (error) {
      console.error('Sign out failed:', error);
      return { success: false, error: 'Sign out failed' };
    }
  };

  return {
    status,
    user,
    token,
    signIn,
    signUp,
    signOut,
    isLoaded: status !== 'loading',
    isSignedIn: status === 'authenticated'
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
