import { Request, Response, NextFunction } from 'express';

// In a real implementation, this would use the Clerk SDK
// This is a mock implementation for demonstration purposes

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || '';

export interface ClerkUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

// Middleware to verify the JWT from Clerk
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized - Missing or invalid token' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }
    
    // In a real implementation, we would verify the JWT with Clerk
    // and extract the user information
    // For now, we'll hardcode the verification for demo purposes
    
    if (token === 'demo_token') {
      // For demo purposes, simulate a successful auth
      const user: ClerkUser = {
        id: 'user_demo123',
        email: 'user@example.com'
      };
      
      req.user = user;
      return next();
    }
    
    // Verify the JWT token here using Clerk SDK in a real implementation
    // const { sub, email } = await clerk.verifyToken(token);
    
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Unauthorized - Token verification failed' });
  }
};

// Utility function to get the authenticated user from the request
export const getAuthUser = (req: Request): ClerkUser | null => {
  return req.user as ClerkUser || null;
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: ClerkUser;
    }
  }
}
