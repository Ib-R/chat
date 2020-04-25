import React, { Component } from "react";
import {GetCookie} from "../util/util"
import { socket, messageSubmit, Typing, imgUpload } from "../util/socket";

class Room extends Component {
	componentDidMount() {
		const {room} = this.props;

		socket.connect();

		socket.emit("joinRoom", {
			username: GetCookie("username"),
			room
		});
	}

	componentDidUpdate(prevProps) {
		const {room} = this.props;
		if(prevProps.room !== room){
			socket.disconnect();
			socket.connect();

			socket.emit("joinRoom", {
				username: GetCookie("username"),
				room
			});
		}
	}

	componentWillUnmount(){
		socket.disconnect();
	}

	render() {
        const { logout, room } = this.props;

		return (
			<div>
				<div id="chat-h" className="fixed-top">
                    <span onClick={logout} className="btn btn-danger float-right">Logout</span>
					<div id="roomHead">
						<p id="roomName">{room}</p>
						<small id="membersCount" data-toggle="modal" data-target="#membersModal"></small>
						<small id="typing"></small>
					</div>
				</div>
				{/* Members Modal */}
				<div className="modal fade" id="membersModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
					aria-hidden="true">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel">
									Room Members
								</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<ul id="members"></ul>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-primary" data-dismiss="modal">
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
				{/* Members Modal:END */}

				<div id="messageArea" className="container row">
					<ul className="chat" id="chat"></ul>
					<div className="fixed-bottom row justify-content-md-center">
						<form
							onSubmit={messageSubmit}
							id="messageForm"
							className="col col-md-8 row"
							autoComplete="off"
						>
							<label className="sr-only">Enter Message</label>
							<input
								onInput={Typing}
								name="message"
								type="text"
								className="form-control"
								id="message"
								placeholder="Enter Message"
							/>
							<input
								type="submit"
								className="btn btn-primary"
								id="msg-submit"
								value="Send"
							/>
							{/* Image sharing */}
							<label
								id="imgBtn"
								className="btn btn-primary"
								htmlFor="imgUploadInput"
							>
								&#9974;
							</label>
							<input
								onChange={imgUpload}
								type="file"
								style={{ display: "none" }}
								name="img"
								id="imgUploadInput"
							/>
						</form>
					</div>
				</div>
				<iframe
					title="background"
					style={{
						position: "absolute",
						width: "100%",
						height: "100%",
						top: "0",
						border: "none",
					}}
					src="bg/index.html"
				></iframe>
			</div>
		);
	}
}

export default Room;
