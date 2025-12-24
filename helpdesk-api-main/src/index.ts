import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { init } from './db';
import authRoutes from './routes/auth';
import ticketsRoutes from './routes/tickets';
import commentsRoutes from './routes/comments';
import usersRoutes from './routes/users';
import statusesRoutes from './routes/statuses';
import prioritiesRoutes from './routes/priorities';
import swaggerRoutes from './routes/swagger';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

async function main() {
    await init();

    app.use('/auth', authRoutes);
    app.use('/tickets', ticketsRoutes);
    app.use('/tickets/:ticketId/comments', commentsRoutes);
    app.use('/users', usersRoutes);
    app.use('/statuses', statusesRoutes);
    app.use('/priorities', prioritiesRoutes);
    app.use('/docs', swaggerRoutes);

    app.get('/', (req, res) => res.json({ status: 'Helpdesk API is running' }));

    // error handler (should be after routes)
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

main().catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
});
