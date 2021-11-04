const turnOnCameraBtn = document.querySelector("#turnOnCameraBtn");
const takePictureBtn = document.querySelector("#takePictureBtn");
const statusElem = document.querySelector("#status");
const imageElem = document.querySelector("#takenPicture");
const videoElem = document.querySelector("#cameraVideo");
const downloadPictureBtn = document.querySelector("#downloadImage");
const turnOffCameraBtn = document.querySelector("#turnOffCameraBtn");

let stream = "";
let videoIsActive = false;
let pictureTaken = false;
let url = "";

if ("mediaDevices" in navigator) {
	turnOnCameraBtn.addEventListener("click", turnCameraOn);
	takePictureBtn.addEventListener("click", takePicture);
	downloadPictureBtn.addEventListener("click", downloadPicture);
	turnOffCameraBtn.addEventListener("click", turnOffCamera);
}

function turnOffCamera() {
	videoElem.srcObject = null;
	let tracks = stream.getTracks().forEach((track) => {
		track.stop();
	});
	turnOffCameraBtn.disabled = true;
	takePictureBtn.disabled = true;
	turnOnCameraBtn.disabled = false;
	takePictureBtn.disabled = true;
}

async function turnCameraOn() {
	try {
		const constraints = {
			video: { width: 250, height: 200 },
		};

		stream = await navigator.mediaDevices.getUserMedia(constraints);
		console.log(stream);

		videoElem.srcObject = stream;
		videoElem.onloadedmetadata = function (e) {
			videoElem.play();
			videoIsActive = true;
			takePictureBtn.disabled = false;
			turnOnCameraBtn.disabled = true;
			turnOffCameraBtn.disabled = false;
		};
	} catch (err) {
		console.log("There was an error!");
		console.log(err.message);
		statusElem.innerHTML = "Did not get permission to use the camera.";
	}
}

async function takePicture() {
	try {
		if (videoIsActive === false) {
			statusElem.innerHTML = "Please activate video first...";
			return;
		}
		statusElem.innerHTML = "";
		const imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
		let blob = await imageCapture.takePhoto();
		url = URL.createObjectURL(blob);
		pictureTaken = true;
		takenPicture.src = url;
		downloadPictureBtn.disabled = false;
	} catch (err) {
		console.log("There was an error!");
		console.log(err.message);
	}
}

function downloadPicture() {
	console.log("Trying to download picture!");

	if (pictureTaken === false) {
		statusElem.innerHTML = "Please take a picture first! 😊";
		return;
	}

	const link = document.createElement("a");
	link.href = url;
	link.download = "selfie";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	downloadPictureBtn.disabled = true;
	imageElem.src = "placeholder.png";
}
