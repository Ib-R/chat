import React, { Component } from "react";
import { GetCookie } from "../util/util";
import { socket, messageSubmit, Typing, imgUpload } from "../util/socket";
import "../util/webrtc";

class Room extends Component {
	componentDidMount() {
		const { room } = this.props;

		socket.connect();

		socket.emit("joinRoom", {
			username: GetCookie("username"),
			room,
		});
	}

	componentDidUpdate(prevProps) {
		const { room } = this.props;
		if (prevProps.room !== room) {
			socket.disconnect();
			socket.connect();

			socket.emit("joinRoom", {
				username: GetCookie("username"),
				room,
			});
		}
	}

	componentWillUnmount() {
		socket.disconnect();
	}

	render() {
		const { logout, room } = this.props;

		return (
			<div>
				<div id="chat-h" className="fixed-top">
					<span onClick={logout} className="btn btn-danger float-right">
						Logout
					</span>
					<div id="roomHead">
						<p id="roomName">{room}</p>
						<small
							id="membersCount"
							data-toggle="modal"
							data-target="#membersModal"
						></small>
						<small id="typing"></small>
					</div>
				</div>
				{/* Members Modal */}
				<div
					className="modal fade"
					id="membersModal"
					tabIndex="-1"
					role="dialog"
					aria-labelledby="exampleModalLabel"
					aria-hidden="true"
				>
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel">
									Room Members
								</h5>
								<button
									type="button"
									className="close"
									data-dismiss="modal"
									aria-label="Close"
								>
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<ul id="members"></ul>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-primary"
									data-dismiss="modal"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
				{/* Members Modal:END */}

				{/* Call Modal */}
				<div
					className="modal fade"
					id="callModal"
					tabIndex="-1"
					role="dialog"
					aria-labelledby="callModal"
					aria-hidden="true"
				>
					<div className="modal-dialog m-0 mw-100" role="document">
						<div className="modal-content bg-dark text-light">
							<div className="modal-header">
								<h5 className="modal-title" id="callModalLabel">
									Call
								</h5>
								{/* <button
									type="button"
									className="close"
									data-dismiss="modal"
									aria-label="Close"
								>
									<span aria-hidden="true">&times;</span>
								</button> */}
							</div>

							<div className="modal-body">
								<div style={{ marginBottom: "1em" }}>
									<input type="checkbox" className="mr-2" id="audioCheck" style={{ transform: "scale(2)" }} defaultChecked />
									<label htmlFor="audioCheck" className="pr-3">Enable Audio</label>
									<input type="checkbox" className="mr-2" id="videoCheck" style={{ transform: "scale(2)" }} />
									<label htmlFor="videoCheck">Enable Video</label>
								</div>

								<div id="videoDiv" className="hide">
									<video id="videoChat"></video>
									<video id="localStream"></video>
								</div>
							</div>

							<div className="modal-footer">
								<button
									id="closeStream"
									type="button"
									className="btn btn-primary"
									data-dismiss="modal"
								>
									End Call
								</button>
							</div>
						</div>
					</div>
				</div>
				{/* Call Modal:END */}

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
					src={`${process.env.PUBLIC_URL}/bg/index.html`}
				></iframe>
			</div>
		);
	}
}

export default Room;
