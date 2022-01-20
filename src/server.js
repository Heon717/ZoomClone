// Back-End

import http from "http";
import {Server} from "socket.io";
import {instrument} from "@socket.io/admin-ui";
import express from "express";

const app = express();

app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const httpServer = http.createServer(app); // http 서버
// const wss = new WebSocker.Server({ server }); // WebSocker 서버
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials:true,
    },
}); // Socket.io 서버

instrument(io, {
    auth: false
});

// 생성된 방 알려주는 함수
const publicRooms = () => {
    const {
        sockets: {
            adapter: {sids,rooms},
        },
    } = io;
    const publicRooms = [];
    rooms.forEach((_,key)=> {
        if(sids.get(key) === undefined) {
            publicRooms.push(key)
        }
    })
    return publicRooms;
}
// 방에 인원수 체크하는 함수
const countRoom = (roomName) => {
    return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection",socket => {
    socket["nickname"] = "익명유저";
    // 여기서 매개변수(parameter) done 은  front emit 에서 함수 부분이다
    socket.onAny(e=>{
        console.log(io.sockets.adapter);
        console.log(`socket event:${e}`);
    })
    socket.on("enter_room", (roomName,done) => {
        // socket id 확인
        // console.log(socket.id);

        // 방에 들어가기
        socket.join(roomName); 
        
        // 어떤방에 들어갔는지 알수있는 명령
        console.log(socket.rooms);
        done();
        // New User 가 들어왔을 때 (하나의 socket에만 보냄)
        socket.to(roomName).emit("welcome",socket.nickname, countRoom(roomName));
        // message를 보든 socket 에게 보냄
        io.sockets.emit("room_change", publicRooms());
    });

    // session out 됐을때 message
    socket.on("disconnecting",()=> {
        socket.rooms.forEach(room=>
             socket.to(room).emit("bye",socket.nickname,countRoom(room)-1));
    })

    socket.on("disconnect",() => {
        io.sockets.emit("room_change", publicRooms());
    })

    socket.on("message",(msg,room,done) => {
        socket.to(room).emit("message", `${socket.nickname}: ${msg}`);
        done();
    })

    socket.on("nickname",nickname => {
        socket['nickname'] = nickname;
    })
})




// server.js 의 socket 은 연결된 브라우저를 뜻함

// Websocket Code

// const sockets = [];
// connection = 누군가가 우리와 연결함
// socket = 연결된 사람
// wss.on("connection",(socket) => {
//     // connection 될때마다 배열에 넣어서 그메세지를 다 볼수 있게된다.
//     sockets.push(socket);
//     socket["nickname"] = "익명유저";
//     console.log("브라우저와 연결되었습니다~");
//     socket.on("close",()=> console.log("브라우저와 연결이 끊어졌습니다."));
//     socket.on("message",msg=>{
//         // 양쪽에 메세지가 보여짐
//         const message = JSON.parse(msg.toString('utf-8'));

//         // if 문 방식
//         // if(parsed.type === "new_message") {
//         //     sockets.forEach(aSocket => aSocket.send(parsed.val));
//         // } else if (parsed.type === "nickname") {
//         //     socket["nickname"] = message.val;     
//         // }

//         // switch 문 방식
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket => 
//                     aSocket.send(`${socket.nickname}: ${message.val}`));
//             case "nickname":
//                 socket["nickname"] = message.val;     
//         }

//         // socket.send(message.toString('utf-8'));
//         // // 프론트에서 메세지 받음 (브라우저 콘솔)
//         // console.log(message.toString('utf-8'), parsed);
//         // // vscode 터미널에서 뜸
//     })
// });

const handleListen = () => console.log(`Listening on http://localhost:3000`)
httpServer.listen(3000,handleListen);