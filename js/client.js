
const socket = io('http://localhost:8001');

//Get the DOM elements
const form= document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
//aodio play when messages arrive.
var audio = new Audio('ting.mp3');

//Append the messages in the container.
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

// if form get submitted , send the message to the server.
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value = '';
})
//let the user name and let the server know .
const name = prompt("Enter your name");
socket.emit('new-user-joined', name );

//let others know that new user joined the chat.
socket.on('user-joined', name =>{
    append(`${name} joined the chat`,'right'); 
})

//It server sends a message, receive it.
socket.on('receive',data =>{
    append(`${data.name}: ${data.message}`,'left')
})

//if user leaves the chat, append the info to the container.
socket.on('left', name =>{
    append(`${name} left the chat`,'left');
})