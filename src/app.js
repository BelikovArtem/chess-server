const express = require('express');
const userRouter = require('./routes/user.router');
const gameRouter = require('./routes/game.router');

const HOST = '127.0.0.1';
const app = express();
const PORT = 3501;

app.use(express.json());
app.use('/', userRouter);
app.use('/', gameRouter);

app.listen(PORT, HOST);
