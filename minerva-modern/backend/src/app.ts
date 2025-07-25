import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes';
import { visitorRoutes } from './routes/visitor.routes';
import { entryRoutes } from './routes/entry.routes';
import { groupRoutes } from './routes/group.routes';
import { statsRoutes } from './routes/stats.routes';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { logger } from './utils/logger';

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// ルート
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// APIルート
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/stats', statsRoutes);

// エラーハンドリングミドルウェア
app.use(notFoundHandler);
app.use(errorHandler);

// サーバー起動
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;