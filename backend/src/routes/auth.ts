import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { getDatabase } from '../config/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { AuthSessionRequest, AuthSessionResponse, AuthMeResponse, LogoutResponse } from '../types/models';

const router = Router();

router.post('/session', async (req: Request, res: Response) => {
  try {
    const body = req.body as AuthSessionRequest;
    const sessionId = body.session_id;

    if (!sessionId) {
      res.status(400).json({ detail: 'session_id required' });
      return;
    }

    let authData;
    try {
      const authResponse = await axios.get(
        'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data',
        {
          headers: { 'X-Session-ID': sessionId },
        }
      );

      if (authResponse.status !== 200) {
        res.status(401).json({ detail: 'Invalid session_id' });
        return;
      }

      authData = authResponse.data;
    } catch (error: any) {
      console.error('Auth exchange error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Authentication service error';
      const statusCode = error.response?.status || 500;
      res.status(statusCode).json({ detail: errorMessage });
      return;
    }

    const db = getDatabase();
    let userId = `user_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
    const email = authData.email;

    const existingUser = await db.collection('users').findOne(
      { email },
      { projection: { _id: 0 } }
    );

    if (existingUser) {
      userId = existingUser.user_id;
    } else {
      const newUser = {
        user_id: userId,
        email,
        name: authData.name || '',
        picture: authData.picture || '',
        created_at: new Date().toISOString(),
      };
      await db.collection('users').insertOne(newUser);
    }

    const sessionToken = authData.session_token || `sess_${uuidv4().replace(/-/g, '')}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const sessionDoc = {
      user_id: userId,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
    };

    await db.collection('user_sessions').deleteMany({ user_id: userId });
    await db.collection('user_sessions').insertOne(sessionDoc);

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userDoc = await db.collection('users').findOne(
      { user_id: userId },
      { projection: { _id: 0 } }
    );

    const response: AuthSessionResponse = {
      success: true,
      user: userDoc as any,
    };

    res.json(response);
  } catch (error: any) {
    console.error('Session exchange error:', error);
    const errorMessage = error.message || 'Internal server error';
    res.status(500).json({ detail: errorMessage });
  }
});

router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const response: AuthMeResponse = {
    user_id: user.user_id,
    email: user.email,
    name: user.name,
    picture: user.picture,
  };
  res.json(response);
});

router.post('/logout', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.cookies?.session_token;

    if (sessionToken) {
      const db = getDatabase();
      await db.collection('user_sessions').deleteOne({ session_token: sessionToken });
    }

    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('session_token', {
      path: '/',
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });

    const response: LogoutResponse = {
      success: true,
      message: 'Logged out',
    };

    res.json(response);
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

export default router;
