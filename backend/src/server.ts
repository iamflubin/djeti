import { env } from '@/config/env';
import { deleteExpiredAndRevokedRefreshTokens } from '@/services/auth.service';
import { logger } from '@/utils/logger';
import cron from 'node-cron';
import app from './app';

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});

cron.schedule('0 2 * * *', async () => {
  try {
    const result = await deleteExpiredAndRevokedRefreshTokens();
    logger.info(
      `[CRON] ${new Date().toISOString()} - Purged ${result.count} refresh tokens`
    );
  } catch (error) {
    logger.error('[CRON] Error purging tokens:', error);
    throw error;
  }
});

process.on('unhandledRejection', reason => {
  logger.error('Unhandled Promise Rejection:', reason);
  // optionally: shutdown cleanly or alert monitoring
});

process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
  process.exit(1); // restart via PM2/Docker
});
