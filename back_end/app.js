const express = require('express');
const http = require('http');
// const socketIo = require('socket.io');
var cors = require('cors'); // 引入 cors 模块

const app = express();
app.use(cors()); // 使用 cors 中间件
app.use('/api/1.0', routes);
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // 在此处理其他 Socket.IO 事件
});

server.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});