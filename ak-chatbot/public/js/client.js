const socket = io();

const msgContainer = document.getElementById("msgContainer");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");

const appendMsg = (message, user, position) => {
    const messageElementLi = document.createElement("li");
    const messageElementSpan = document.createElement("span");
    messageElementSpan.classList.add("chat-msg-timer");
    messageElementSpan.innerText = `${user} : ${new Date().toLocaleDateString()}`;
    messageElementLi.classList.add(position);
    messageElementLi.innerText = message;
    messageElementLi.append(messageElementSpan);
    msgContainer.append(messageElementLi);
};

const appendUser = (message, position) => {
    const messageElementLi = document.createElement("li");
    const messageElementSpan = document.createElement("span");
    messageElementSpan.innerText = message;
    messageElementLi.classList.add(position);
    messageElementLi.append(messageElementSpan);
    msgContainer.append(messageElementLi);
};

let name = prompt("Enter you name to join ak Chat");

socket.emit("new-user-joined", name);

socket.on("user-joined", (name) => {
    appendUser(`${name ? name : "unKnown"} joined the chat`, "join-chat");
});

socket.on("receive", (response) => {
    appendMsg(response.message, response.name, "msgLeft");
});

sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMsg(message, "You", "msgRight");
    messageInput.value = "";
    socket.emit("send", message);
});

messageInput.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.key === "Enter") {
        sendBtn.click();
    }
});
