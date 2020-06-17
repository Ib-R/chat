// let peers = [];
let audioCheck = true;
let videoCheck = false;
let onCall = false;

// document.getElementById("audioCheck").onchange = () => {
// 	audioCheck = !audioCheck;
// };
// document.getElementById("videoCheck").onchange = () => {
// 	videoCheck = !videoCheck;
// };

function showMsg(msg, type) {
	let newMsg = document.createElement("p");
	newMsg.innerText = `${type} connection: ${msg}`;
	document.getElementById("msgs").appendChild(newMsg);
}

function showAlert(msg) {
	console.log(msg);
	
	// let alertDiv = document.getElementById("alert");
	// alertDiv.innerHTML = msg;
	// alertDiv.classList.remove("hide");
}

function showVideoStream(remoteStream, localStream) {
	let remoteVideo = document.getElementById("videoChat");
	let localVideo = document.getElementById("localStream");
	let modal = document.getElementById("callModal");
	modal.classList.add("show");
	modal.setAttribute("aria-hidden", "false");
	modal.setAttribute("style", "display: block");

	remoteVideo.srcObject = remoteStream;
	remoteVideo.play();

	localVideo.muted = true;
	localVideo.srcObject = localStream;
	localVideo.play();
}

// function updatePeers(newPeer = null) {
// 	if (newPeer) peers.push(newPeer);
// 	peers = [...new Set(peers)];

// 	let peersList = document.getElementById("peersList");
// 	peersList.innerHTML = "";
// 	peers.forEach((peer) => {
// 		let peerItem = document.createElement("li");
// 		peerItem.innerText = peer;
// 		peersList.appendChild(peerItem);
// 	});
// }

function onConnectionOpen(conn, peerToAdd, connDirection) {
	// updatePeers(peerToAdd);

	conn.on("data", (data) => {
		showMsg(data, connDirection);
	});

	document.getElementById("send").onclick = () => {
		let msgToSend = document.getElementById("msg").value;
		console.log(`msgToSend: ${msgToSend}`);

		conn.send(msgToSend);
	};
}

function onStream(remoteStream, stream, peerToAdd) {
	onCall = true;
	// updatePeers(peerToAdd);
	showVideoStream(remoteStream, stream);
	document.getElementById("audioCheck").onchange = () => {
		audioCheck = !audioCheck;
		stream.getAudioTracks()[0].enabled = audioCheck;
	};
	document.getElementById("videoCheck").onchange = () => {
		videoCheck = !videoCheck;
		stream.getVideoTracks()[0].enabled = videoCheck;
	};
}

function onCallClose(stream) {
	onCall = false;
	stream.getTracks().forEach((track) => track.stop());

	let modal = document.getElementById("callModal");
	modal.classList.remove("show");
	modal.setAttribute("aria-hidden", "true");
	modal.setAttribute("style", "display: none");
	// document.getElementById("videoDiv").classList.add("hide");
	showAlert("Call disconnected");
}

function copyToClipboard(id) {
	/* Get the text field */
	var copyText = document.getElementById(id);

	/* Select the text field */
	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/

	/* Copy the text inside the text field */
	document.execCommand("copy");

	alert("Copied the text: " + copyText.value);
}

export {
	showAlert,
	onConnectionOpen,
	onCallClose,
	onStream,
	onCall,
	audioCheck,
    videoCheck,
    copyToClipboard
};
