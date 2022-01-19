const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("#login");
const room = document.getElementById("room");

room.hidden = true;
let roomName;

const addMessage = (msg) => {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
} 
const handleMessageSubmit = (e) => {
    e.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit('message', input.value,roomName, () =>{
        addMessage(`당신 : ${value}`);
    });
    input.value="";
}

const handleNicknameSubmit = (e) => {
    e.preventDefault();
    const input = welcome.querySelector("#nickname input");
    socket.emit("nickname", input.value);
}

const showRoom = () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    const h2 = room.querySelector("h2");

    h3.innerText = `Room - ${roomName}`;
    h2.innerText = `NickName : ${nickName}`;
    const msgform = room.querySelector("#msg");
    const nameform = welcome.querySelector("#nickname");
    msgform.addEventListener("submit", handleMessageSubmit);
    nameform.addEventListener("submit", handleNicknameSubmit);

}

// room 입장함수
const handleRoomSubmit = (e) => {
    e.preventDefault();
    const input = form.querySelector("#login input");
    // socket.emit 으로 송신하고 server에서 socket.on 으로 정보를 받는구조
    // 그렇기때문에 emit 과 on 의 소켓명이 동일 해야한다.
    socket.emit("enter_room", input.value,showRoom);
    // 첫번째는 event 이름 을 넣고 그 뒤는 상관없다.
    // 함수를 사용할 때는 꼭 마지막 argument에 넣어야한다.
    roomName = input.value;
    input.value='';
}

form.addEventListener("submit", handleRoomSubmit);

// New User 가 들어왔을 때 
socket.on("welcome",(user) => {
    addMessage(`${user}가 방에 들어왔습니다.`);
});

// session out 됐을때 message
socket.on("bye",(user) => {
    addMessage(`${user}가 방을 나갔습니다.`);
});

// message
socket.on("message", addMessage);