import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// リクエストに追加されるユーザー情報の型
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
        groupId?: string;
      };
    }
  }
}

// JWT認証ミドルウェア
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authorization ヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: '認証トークンが提供されていません',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      logger.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        success: false,
        error: '内部認証エラーが発生しました',
      });
    }

    // トークンを検証
    const decoded = jwt.verify(token, secret);
    req.user = decoded as any;
    next();
  } catch (error) {
    if ((error as Error).name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: '認証トークンの有効期限が切れています',
      });
    }
    
    return res.status(401).json({
      success: false,
      error: '無効な認証トークンです',
    });
  }
};

// 特定のロールを持つユーザーのみアクセスを許可
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: '認証が必要です',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'このリソースへのアクセス権がありません',
      });
    }

    next();
  };
};