import { env } from '@/config/env.config';
import { logger } from '@/utils/logger.utils';
import app from './app';

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});

process.on('unhandledRejection', reason => {
  logger.error('Unhandled Promise Rejection:', reason);
  // optionally: shutdown cleanly or alert monitoring
});

process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
  process.exit(1); // restart via PM2/Docker
});
