import {GetCookie} from "./util"
export const socket = window.io.connect('//'+GetCookie('server'));

var timer;

function updateRoomDetails(data) {
    const roomName = document.getElementById("roomName"),
    membersCount = document.getElementById("membersCount"),
    members = document.getElementById("members");

    roomName.innerHTML = "";
    members.innerHTML = "";
    roomName.insertAdjacentHTML('beforeend', capitalize(data.room));
    membersCount.innerHTML = `${data.users.length} members`;
    data.users.forEach((user, i) => {
        // if(nameList){ // Check if username already exists
        members.insertAdjacentHTML('beforeend',`<li>${user.username}</li>`);
        // }
    });
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
    
// Init Notfication
function spawnNotification(theBody,theIcon,theTitle) {
    if(!document.hasFocus()){
        window.Push.create(theTitle, {
        body: theBody,
        icon: 'https://image.flaticon.com/teams/slug/freepik.jpg',
        timeout: 4000,
        onClick: function () {
            window.focus();
            this.close();
                }
            });
        }
    }   

function updateScroll(){
    const $chat = document.querySelector('#chat');
    $chat.scrollTop = $chat.scrollHeight;
}


// Show typing status
export const Typing = ()=>{
    socket.emit('typing', GetCookie("username"));
};

socket.on('typing', (data)=>{
    const $typing = document.querySelector('#typing'),
        membersCount = document.getElementById("membersCount");

    membersCount.classList.add("d-none");
    $typing.innerHTML = data+' is typing...';
    clearTimeout(timer);
    timer = setTimeout(()=>{
            $typing.innerHTML ='';
            membersCount.classList.remove("d-none");
        }, 700);
});

socket.on("roomUsers", data => {
    updateRoomDetails(data);
});

// File upload
export const imgUpload =  (e)=>{
    const $imgUpload = document.querySelector('#imgUploadInput');
    var data = new FormData();
    if($imgUpload.files[0] != null){
        data.append('img', $imgUpload.files[0]);
        data.append('username', GetCookie('username'));

        fetch('//'+GetCookie('server')+'/upload', {
            body: data,
            method: 'POST',
        })
        .then(res => res.json())
        .then(function(data){
            // alert(data.message);
        })
        .catch(() => {
            alert('error');
        });
    }
    console.log($imgUpload.files[0]);
   
};

export function messageSubmit(e){
    const $message = document.querySelector('#message');
    var data = {}
    e.preventDefault();
    data = {msg: $message.value, user:GetCookie("username")};
    socket.emit('send message', data);
    $message.value = "";
}

socket.on('new message', (data)=>{
    const $chat = document.querySelector('#chat');
    if(data.user === GetCookie("username")){
        $chat.insertAdjacentHTML('beforeend',
            `<div class="float-right own-msg bg-secondary">
                <strong class="username">${data.user}</strong>
                <p class="text-light">${data.msg} <small>${data.time}</small></p>
            </div>
            <div class="clearfix"></div>`);
    }else{
        $chat.insertAdjacentHTML('beforeend','<div class="bg-primary float-left msg"><p class="text-light"><strong>'+data.user+'</strong>: '+data.msg+'</p></div><div class="clearfix"></div>');
        // updateUserHead(data.user);
        spawnNotification('You Got new Message','https://image.flaticon.com/teams/slug/freepik.jpg','New Message');
    }
    updateScroll()
});
socket.on('show image', (data)=>{
    const $chat = document.querySelector('#chat');
    if(data.user === GetCookie("username")){
        $chat.insertAdjacentHTML('beforeend',
            `<div class="float-right own-msg bg-secondary">
                <a data-fancybox="ownGallery" href="//${GetCookie('server')}/uploads/${data.msg}">
                    <figure class="figure">
                        <img id="img" src="//${GetCookie('server')}/uploads/${data.msg}">
                        <figcaption class="figure-caption d-flex justify-content-between">
                            <strong>${data.user}</strong> 
                            <small>${data.time}</small>
                        </figcaption>
                    </figure>
                </a>
            </div>
            <div class="clearfix"></div>`);
    }else{
        $chat.insertAdjacentHTML('beforeend',
            `<div class="bg-primary float-left msg">
                <a data-fancybox="gallery" href="//${GetCookie('server')}/uploads/${data.msg}">
                    <figure class="figure">
                        <img id="img" src="//${GetCookie('server')}/uploads/${data.msg}">
                        <figcaption class="figure-caption d-flex justify-content-between">
                            <strong>${data.user}</strong>
                            <small>${data.time}</small>
                        </figcaption>
                    </figure>
                </a>
            </div>
            <div class="clearfix"></div>`);
    }
    updateScroll()
});
