import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../config/database';
import { User } from '../types/models';

export interface AuthRequest extends Request {
  user?: User;
}

export async function getCurrentUser(req: AuthRequest): Promise<User | null> {
  let sessionToken = req.cookies?.session_token;
  
  if (!sessionToken) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      sessionToken = authHeader.split(' ')[1];
    }
  }

  if (!sessionToken) {
    return null;
  }

  try {
    const db = getDatabase();
    const sessionDoc = await db.collection('user_sessions').findOne(
      { session_token: sessionToken },
      { projection: { _id: 0 } }
    );

    if (!sessionDoc) {
      return null;
    }

    const expiresAt = new Date(sessionDoc.expires_at);
    if (expiresAt < new Date()) {
      return null;
    }

    const userDoc = await db.collection('users').findOne(
      { user_id: sessionDoc.user_id },
      { projection: { _id: 0 } }
    );

    if (!userDoc) {
      return null;
    }

    return userDoc as unknown as User;
  } catch (error: any) {
    console.error('getCurrentUser error:', error);
    return null;
  }
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await getCurrentUser(req);
  
  if (!user) {
    res.status(401).json({ detail: 'Not authenticated' });
    return;
  }

  req.user = user;
  next();
}
