import { errorHandler } from '@/middlewares/error.middleware';
import { stream } from '@/utils/logger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from 'process';
import { corsOptions } from './config/cors';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('combined', { stream }));

if (env.NODE_ENV !== 'development') {
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    })
  );
}

app.use('/api', routes);
app.use(errorHandler);

export default app;
