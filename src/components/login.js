import React from "react";
import { Messages } from "../util/messages";

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showMessages:false,
            message: null,
            server: null,
        }
    }

    render() {
        var that = this // binding This keyword to variable for accessbilty reasons
        const {server, message, showMessages} = this.state;

        function setServer(e){
            that.setState({server: e.target.value})
        }    

        const login = (e) => {
            e.preventDefault()
            // const data = {username: e.target.username.value, password: e.target.password.value}
            fetch("//"+server+"/login/",
                {
                    method: "POST",
                    body: `username=${e.target.username.value}&password=${e.target.password.value}&room=${e.target.room.value}`,
                    headers:({
                        "Content-Type":"application/x-www-form-urlencoded"
                    })
                })
            .then((res)=>{
                res.json()
                .then((data)=>{                    
                    if(data.user){
                        document.cookie = "username="+data.user+"; expires="+Date(Date.now()+9000)+"";
                        document.cookie = "server="+server+"; expires="+Date(Date.now()+9000)+"";
                        document.cookie = "room="+data.room+"; expires="+Date(Date.now()+9000)+"";
                        this.props.authenticate();
                    }else{
                        this.setState({showMessages:true}); // show the message div
                        this.setState({message: data.message.message}); // assing the message to the state
                        console.log(data.message);
                    }
                });
            })
            .catch((err)=> console.log("login error:",err));
        }

        return(
            <div className="container">

                <div id="userFormArea">
                    <form onSubmit={login} className="form-signin" id="userForm">
                        <div className="text-center">
                            <img className="mb-4" src={`${process.env.PUBLIC_URL}/bg/thelogo.png`} alt="" width="72" height="72"/>
                            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                        </div>

                        { showMessages ? <Messages message={message} /> : null }

                        <div className="form-label-group">
                            <input type="text" placeholder="Enter Username" name="username" className="form-control" id="username"/>
                            <label htmlFor="username">Enter Username</label>
                        </div>  
                        <div className="form-label-group"> 
                            <input type="password" placeholder="Enter Password" name="password" className="form-control" id="password"/>
                            <label htmlFor="password">Enter Password</label>
                        </div>  
                        <div className="form-label-group"> 
                            <input type="text" placeholder="Enter Room" name="room" className="form-control" id="room"/>
                            <label htmlFor="room">Enter Room</label>
                        </div>  
                        <div className="form-label-group">
                            <input onChange={setServer} type="text" placeholder="Enter Server" name="server" className="form-control" id="server"/>
                            <label htmlFor="server">Enter Server</label>
                        </div> 
                        <br/>
                        <input type="submit" className="btn btn-lg btn-primary btn-block" value="Login" />
                        <p className="text-center mt-5 mb-3 text-muted">&copy;2018 - 2020</p>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;