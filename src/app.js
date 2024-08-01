import express, { json } from 'express';
import authRouter from './auth/auth.router.js';

const HOST = 'localhost';
const app = express();
const PORT = 3501;

app.use(json());
app.use('/auth', authRouter);

app.listen(PORT, HOST);
