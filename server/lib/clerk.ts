import { Request, Response, NextFunction } from 'express';
import { Clerk } from 'clerk';

// Initialize Clerk with the secret key
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || '';

if (!CLERK_SECRET_KEY) {
  console.error('Missing Clerk Secret Key');
}

// Initialize the Clerk SDK
const clerk = new Clerk({ secretKey: CLERK_SECRET_KEY });

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

    // For backwards compatibility (mainly for testing)
    if (token === 'demo_token') {
      const user: ClerkUser = {
        id: 'user_demo123',
        email: 'user@example.com'
      };
      
      req.user = user;
      return next();
    }
    
    try {
      // Verify the JWT token with Clerk
      const session = await clerk.sessions.verifySession(token);
      
      if (!session) {
        return res.status(401).json({ message: 'Unauthorized - Invalid session' });
      }
      
      // Get user data from Clerk
      const clerkUser = await clerk.users.getUser(session.userId);
      
      if (!clerkUser) {
        return res.status(401).json({ message: 'Unauthorized - User not found' });
      }
      
      // Extract primary email
      const primaryEmail = clerkUser.emailAddresses.find(
        email => email.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;
      
      if (!primaryEmail) {
        return res.status(401).json({ message: 'Unauthorized - Email not found' });
      }
      
      // Create user object
      const user: ClerkUser = {
        id: clerkUser.id,
        email: primaryEmail,
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined
      };
      
      req.user = user;
      return next();
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
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
