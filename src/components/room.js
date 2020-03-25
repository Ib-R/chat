import React from "react";
import { Redirect } from "react-router-dom";
import {messageSubmit, Typing, imgUpload} from "./util/connectChat";
import {GetCookie} from "./util/util"

export class Room extends React.Component{

    render(){
        function checkLoginStatus(){
            if(GetCookie("username") == ""){
                return true
            }
        }
        return(
            <div>

                {/* Redirect if user is not logged in */}
            {checkLoginStatus() ? <Redirect to="/"/> : null}

                <div id="chat-h" className="fixed-top">
                    <p id="headerUsername"></p><br/>
                    <p id="typing" className="text-white"></p>
                </div>
                <div id="messageArea" className="container row">
                    <ul className="chat" id="chat"></ul>
                    <div className="fixed-bottom row justify-content-md-center">
                        <form onSubmit={messageSubmit} id="messageForm" className="col col-md-8 row" autoComplete="off">
                            <label className="sr-only">Enter Message</label>
                            <input onInput={Typing} name="message" type="text" className="form-control" id="message" placeholder="Enter Message"/>
                            <input type="submit" className="btn btn-primary" id="msg-submit" value="Send"/>
                        {/* Image sharing */}
                            <label id="imgBtn" className="btn btn-primary" htmlFor="imgUploadInput">&#9974;</label>
                            <input onChange={imgUpload} type="file" style={{display:'none'}} name="img" id="imgUploadInput"/>
                        </form>
                    </div>
                </div>
                <iframe title="background" style={{position:'absolute',width: '100%',height: '100%',top:'0',border: 'none'}} src="bg/index.html"></iframe>
            </div>
        )
    }
}