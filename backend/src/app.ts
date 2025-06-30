import { errorHandler } from '@/middlewares/error.middleware';
import { stream } from '@/utils/logger.utils';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors.config';
const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(morgan('combined', { stream }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
//app.use('/api/v1', routes);
app.use(errorHandler);

export default app;
