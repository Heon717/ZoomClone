// Back-End

import http from "http";
import WebSocker from "ws";
import express from "express";

const app = express();

app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log("hello http://localhost:3000");

const server = http.createServer(app); // http 서버
const wss = new WebSocker.Server({ server }); // WebSocker 서버

                        // server.js 의 socket 은 연결된 브라우저를 뜻함
              
const sockets = [];

// connection = 누군가가 우리와 연결함
// socket = 연결된 사람
wss.on("connection",(socket) => {
    // connection 될때마다 배열에 넣어서 그메세지를 다 볼수 있게된다.
    sockets.push(socket);
    console.log("브라우저와 연결되었습니다~");
    socket.on("close",()=> console.log("브라우저와 연결이 끊어졌습니다."));
    socket.on("message",message=>{
        // 양쪽에 메세지가 보여짐
        sockets.forEach(aSocket => aSocket.send(message.toString('utf-8')));

        // socket.send(message.toString('utf-8'));
        // // 프론트에서 메세지 받음 (브라우저 콘솔)
        // console.log(message.toString('utf-8'));
        // // vscode 터미널에서 뜸
    })
});

server.listen(3000,handleListen);