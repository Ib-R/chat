import { socket } from "./socket";
import Peer from "../lib/peerjs.min";

import {
	onConnectionOpen,
	onCall,
	showAlert,
	audioCheck,
	videoCheck,
	onCallClose,
    onStream,
} from "./webrtc-helpers";

let socketId = "";
export let peer = null;

socket.on("connected", (data) => {
	socketId = data.id;
	connectToPeerServer();
});

socket.on("roomUsers", (data) => {
	updateRoomDetails(data);
});

function connectToPeerServer() {
	// let peer = new Peer(socketId, {
	// 	host: "localhost",
	// 	port: 9000,
	// 	secure: true,
	// 	debug: 3,
	// });
	peer = new Peer(socketId, {
		host: "radiant-peak-92517.herokuapp.com",
		port: 443,
		secure: true,
		debug: 3,
	});

	peerEvents(peer);
}

function peerEvents(peer) {
	console.log(peer);
	socket.emit("peerConnected", { connected: true });

	if (peer) {
        let cancelled = false;
		// peer.on("open", (id) => (document.getElementById("id").value = id));

		// Incoming connection
		peer.on("connection", (conn) => {
			showAlert(`Now peered with - ${conn.peer}`);

			conn.on("open", () => onConnectionOpen(conn, conn.peer, "Incomming"));
        });
        
        socket.on("call-rejected", () => {
            cancelled = true;
            console.log(cancelled);
        });

		// Incoming Call
		peer.on("call", async function (call) {
			let answer = onCall || cancelled
				? false
                : window.confirm(`Answer call from ${call.peer}`);

			if (answer) {      
                try {
                    let stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
						audio: true,
                    });
                    
                    if (cancelled) {
                        console.log(cancelled);
                        
                        onCallClose(stream);
                        return;
                    }

					// Set call A/V configuration
					stream.getAudioTracks()[0].enabled = audioCheck;
					stream.getVideoTracks()[0].enabled = videoCheck;

					call.answer(stream); // Answer the call with an A/V stream.

					call.on("stream", (remoteStream) =>
						onStream(remoteStream, stream, call.peer)
					);

					call.on("close", () => onCallClose(stream));

					document.getElementById("closeStream").onclick = () => call.close();
				} catch (error) {
					console.log("Failed to get local stream", error);
				}
			} else {
				socket.emit("call-cancel", { otherPeer: call.peer });
			}
		});

		peer.on("disconnected", function () {
			alert(`Peer disconnected`);
		});

		peer.on("close", function () {
			alert(`Peer connection closed`);
		});

		setInterval(() => {
			console.log("Peer connections: ", peer.connections);
		}, 5000);
	} else {
		setTimeout(() => {
			peerEvents();
		}, 10000);
	}
}

// Outgoing Call
export async function callPeer(destId) {
	let modal = document.getElementById("callModal");
	modal.classList.add("show");
	modal.setAttribute("aria-hidden", "false");
	modal.setAttribute("style", "display: block");

	if (onCall) {
		console.log("Already on call");

		return false;
	}

	if (!destId) {
		showAlert(`Dest. ID is not available`);
		return;
	}

	showAlert(`Trying to call ${destId}...`);

	try {
		let stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});

		stream.getAudioTracks()[0].enabled = audioCheck;
		stream.getVideoTracks()[0].enabled = videoCheck;

		let call = peer.call(destId, stream); // Make an A/V stream call.

		socket.on("call-rejected", () => onCallClose(stream));

		showAlert(`Calling ${destId}...`);

		call.on("stream", (remoteStream) => onStream(remoteStream, stream, destId));

		call.on("close", () => onCallClose(stream));

		call.on("error", (err) => console.log("Call error: ", err));

		document.getElementById("closeStream").onclick = () => {
            console.log(call);
            if (call.open) {
                call.close();
            }else {
                onCallClose(stream);
                socket.emit("call-cancel", { otherPeer: destId });
            }
            
        }
	} catch (error) {
		console.log("Failed to get local stream", error);
	}
}

export function updateRoomDetails(data) {
	const roomName = document.getElementById("roomName"),
		membersCount = document.getElementById("membersCount"),
		members = document.getElementById("members");

	roomName.innerHTML = "";
	members.innerHTML = "";
	roomName.insertAdjacentHTML("beforeend", capitalize(data.room));
	membersCount.innerHTML = `${data.users.length} members`;
	data.users.forEach((user, i) => {
		members.insertAdjacentHTML(
			"beforeend",
			`<li>${user.username} <span style="cursor:pointer" id="${user.id}">&#128222;</span></li>`
		);
		document.getElementById(user.id).onclick = callPeer.bind(null, user.id);
	});
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
