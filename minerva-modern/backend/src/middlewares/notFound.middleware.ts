import { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: `リクエストされたリソースは存在しません: ${req.originalUrl}`,
  });
};