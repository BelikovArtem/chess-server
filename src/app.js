const express = require('express');
const userRouter = require('./user/user.router');
const gameRouter = require('./game/game.router');

const HOST = 'localhost';
const app = express();
const PORT = 3501;

app.use(express.json());
app.use('/', userRouter);
app.use('/', gameRouter);

app.listen(PORT, HOST);
