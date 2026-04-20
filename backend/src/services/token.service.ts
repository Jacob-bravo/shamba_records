import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface TokenPayload {
  id: string;
  role: string;
  type: 'admin' | 'user';
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, 'changeme_secret', { expiresIn: '15m' } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, 'changeme_refresh_secret', { expiresIn: '7d' } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, 'changeme_secret') as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, 'changeme_refresh_secret') as TokenPayload;
};