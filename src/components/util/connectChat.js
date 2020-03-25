import {GetCookie} from "./util"
const socket = window.io.connect('//'+GetCookie('server'));
    // $messageForm = document.querySelector('#messageForm'),
    // $message = document.querySelector('#message'),
    // $chat = document.querySelector('#chat'),
    // $messageArea = document.querySelector('#messageArea'),
    // $userFormArea = document.querySelector('#userFormArea'),
    // $userForm = document.querySelector('#userForm'),
    // $users = document.querySelector('#users'),
    // $userHead = document.querySelector('#username'),
    // $typing = document.querySelector('#typing'),
    // $imgUpload = document.querySelector('#imgUploadInput'),
    // $imgForm = document.querySelector('#imgForm');
    var timer;
    
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
    const $typing = document.querySelector('#typing');
    $typing.innerHTML = data+' is typing...';
    clearTimeout(timer);
    timer = setTimeout(()=>{$typing.innerHTML ='';},700);
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

// Display usernames on header
function updateUserHead(user){
    const $userHead = document.querySelector('#headerUsername');
    const nameCheck = $userHead.innerHTML;
    if( nameCheck === ''){
        $userHead.innerHTML = user;
    }else if(nameCheck.indexOf(user) < 0){ // Check if username already exists
        $userHead.append(', '+user);
    }
}

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
        $chat.insertAdjacentHTML('beforeend','<div class="float-right own-msg bg-secondary"><p class="text-light"><strong>'+data.user+'</strong>: '+data.msg+'</p></div><div class="clearfix"></div>');
    }else{
        $chat.insertAdjacentHTML('beforeend','<div class="bg-primary float-left msg"><p class="text-light"><strong>'+data.user+'</strong>: '+data.msg+'</p></div><div class="clearfix"></div>');
        updateUserHead(data.user);
        spawnNotification('You Got new Message','https://image.flaticon.com/teams/slug/freepik.jpg','New Message');
    }
    updateScroll()
});
socket.on('show image', (data)=>{
    const $chat = document.querySelector('#chat');
    if(data.user === GetCookie("username")){
        $chat.insertAdjacentHTML('beforeend','<div class="float-right own-msg bg-secondary"><a data-fancybox="ownGallery" href="//'+GetCookie('server')+'/uploads/'+data.img+'"><img id="img" src="//'+GetCookie('server')+'/uploads/'+data.img+'"></a></div><div class="clearfix"></div>');
    }else{
        $chat.insertAdjacentHTML('beforeend','<div class="bg-primary float-left msg"><a data-fancybox="gallery" href="//'+GetCookie('server')+'/uploads/'+data.img+'"><img id="img" src="//'+GetCookie('server')+'/uploads/'+data.img+'"></a></div><div class="clearfix"></div>');
        updateUserHead(data.user);
    }
    updateScroll()
});
