// Front-End

const socket = io();

const welcome = document.getElementById("welcome");
const loginform = welcome.querySelector("#login");
const room = document.getElementById("room");
const title = document.getElementById("title");

room.hidden = true;

let roomName;
let nickName;

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

const showRoom = () => {
    welcome.hidden = true;
    room.hidden = false;
    title.hidden = true;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room - ${roomName}`;
    const msgform = room.querySelector("#msg");

    msgform.addEventListener("submit", handleMessageSubmit);
}

// room 입장함수
const handleRoomSubmit = (e) => {
    e.preventDefault();
    const input = loginform.querySelector("#roomName");
    const nameInput = loginform.querySelector("#nickName");
    // socket.emit 으로 송신하고 server에서 socket.on 으로 정보를 받는구조
    // 그렇기때문에 emit 과 on 의 소켓명이 동일 해야한다.
    socket.emit("nickname", nameInput.value);
    socket.emit("enter_room", input.value,showRoom);
    // 첫번째는 event 이름 을 넣고 그 뒤는 상관없다.
    // 함수를 사용할 때는 꼭 마지막 argument에 넣어야한다.
    roomName = input.value;
    input.value='';
}

loginform.addEventListener("submit", handleRoomSubmit);

// New User 가 들어왔을 때 
socket.on("welcome",(user,newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room - ${roomName} (${newCount})`;
    addMessage(`${user}님이 방에 들어왔습니다.`);
});

// session out 됐을때 message
socket.on("bye",(user,newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room - ${roomName} (${newCount})`;
    addMessage(`${user}님이 방을 나갔습니다.`);
});

// message
socket.on("message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0) {
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
});
