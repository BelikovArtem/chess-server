const express = require('express');
const userRouter = require('./user/user.router');
const gameRouter = require('./game/game.router');

const HOST = '127.0.0.1';
const app = express();
const PORT = 3501;

app.use(express.json());
app.use('/', userRouter);
app.use('/', gameRouter);

app.listen(PORT, HOST);
