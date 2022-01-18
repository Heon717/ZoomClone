// Front-End

const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`);
// app.js 의 socket은 서버로의 연결을 뜻함


    // json 사용이유는 닉네임과 메세지 구분하기위해서
    // string type 만 전송되기때문에 변환함
const makeMessage = (type,val) => {
    const msg = { type, val};
    return JSON.stringify(msg);
}

socket.addEventListener("open",()=> {
    console.log("서버와 연결되었습니다 !!")
});

    // message 안에 data에 서버의socket.send("hello!!!"); 내용이 담김
socket.addEventListener("message", (message)=> {
    // console.log("New message : ", message.data);
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close",()=> {
    console.log("서버 연결이 끊겼습니다")
});

const handleSubmit = (e) => {
    e.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value='';
    // console.log(input.value);
    // JSON.stringify(obj) --> JSON.parse(stringify한 값) --> js obj 로 변환 
}


const handleNickSubmit = (e) => {
    e.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname",input.value));
}

messageForm.addEventListener("submit",handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit)