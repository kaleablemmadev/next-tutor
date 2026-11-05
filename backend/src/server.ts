// src/server.ts
import 'dotenv/config';
import cors from 'cors';
import express, {type Express, type Request, type Response} from "express";
import { prisma } from './prisma.js';
import { authenticateToken } from './middleware/auth.middleware.js';
import { authorizeRoles } from './middleware/authorize.middleware.js';
import authRoutes from './routes/auth.routes.js';
import parentRoutes from './routes/parent.routes.js';
import tutorApplicationRoutes from './routes/tutor-application.routes.js';

const app: Express = express();
const PORT = Number(process.env.PORT) || 3000;
const allowedOrigins = ['http://localhost:8081', 'https://a-plus-tutor.vercel.app', 'https://a-plus-tutor-ivjwdyr1r-kaleablemmadev-7070s-projects.vercel.app'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
);

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tutor', tutorApplicationRoutes);
app.use('/api/parents', parentRoutes);
app.get("/api/health", async (_req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.status(200).json({
            status: "ok",
            database: "connected",
        });
    } catch(error) {
        console.error("Health check failed: ", error);

        res.status(503).json({
            status: "error",
            database: "disconnected",
        });
    }
});

app.get(
    '/api/test/admin',
    authenticateToken,
    authorizeRoles('ADMIN'),
    (_req, res) => {
    return res.status(200).json({
        message: 'Welcome, admin.'
    })
});

app.get(
    '/api/test/protected',
    authenticateToken,
    (_req, res) => {
        return res.status(200).json({
            message: 'You accessed a protected route.',
            auth: res.locals.auth,
        });
    }
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});