import { Server } from 'socket.io'

const io = new Server(3000)
io.on("connection", (socket) => {
    socket.on("ChatCreateIntent", (arg, callback) => {
        console.log(arg); // "world"
        callback("got it");
    });

    // socket.on('hello', (msg, callback) => {
    //     console.log(msg)
    //     callback('hello')
    // })

    socket.on("hello", (arg) => {
        console.log(arg); // world
    });
});