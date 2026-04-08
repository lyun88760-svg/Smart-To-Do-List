import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import tasksRouter from './routes/tasks.js';
import statsRouter from './routes/stats.js';
import notificationsRouter from './routes/notifications.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startReminderService } from './services/reminderService.js';
import { initDb } from './db/init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use('/api', statsRouter);
app.use('/api/notifications', notificationsRouter);

app.use(errorHandler);

async function start() {
  await initDb();
  startReminderService();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();