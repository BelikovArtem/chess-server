const express = require('express');
const authRouter = require('./auth/auth.router');

const HOST = 'localhost';
const app = express();
const PORT = 3501;

app.use(express.json());
app.use('/auth', authRouter);

app.listen(PORT, HOST);
