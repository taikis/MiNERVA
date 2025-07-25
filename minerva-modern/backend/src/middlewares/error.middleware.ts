import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack || '');

  // カスタムエラータイプに応じたレスポンス
  if ((err as any).statusCode) {
    return res.status((err as any).statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // デフォルトのエラーレスポンス
  return res.status(500).json({
    success: false,
    error: '内部サーバーエラーが発生しました',
  });
};