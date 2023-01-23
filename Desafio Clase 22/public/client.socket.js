const socket = io();
const chatForm = document.querySelector("#chatForm");
const mailIn = document.querySelector("#mailIn");
const msgIn = document.querySelector("#msgIn");
const chatPool = document.querySelector("#chatPool");
const productlist = document.querySelector("#productList");
const rndBtn = document.querySelector("#randomize");


const sendMessage = (messageInfo) => {
    
    socket.emit("client:message", messageInfo);
};

const renderMessage = (messagesData) => {

    const html = messagesData.map((messageInfo) => {
    return `<div> <strong style="color:blue">${messageInfo.mail}</strong> <span style="color:brown">[${messageInfo.date}] : </span><span style="color:green; font-style: italic">${messageInfo.message}</span> </div>`;
    });

    chatPool.innerHTML = html.join(" ");
};


const msgHandler = (event) => {

    event.preventDefault();

    let date = new Date();

    const messageInfo = {
        mail: mailIn.value,
        date: date,
        message: msgIn.value,
    };


    sendMessage(messageInfo);


    msgIn.value = "";
    mailIn.readOnly = true;
};

const prodHandler = (event) => {

    event.preventDefault();
    socket.emit("client:product");
};

const renderProducts = (products) => {

    const html = products.map((p) => {
        return `<div><span>${p.title}</span> <span>$${p.price}</span> <img src="${p.thumbnail}" height="20"></img></div>`
    });

    productlist.innerHTML = html.join(" ");
};

chatForm.addEventListener("submit", msgHandler);
rndBtn.addEventListener("click", prodHandler);

socket.on("server:message", renderMessage);
socket.on("server:product", renderProducts)