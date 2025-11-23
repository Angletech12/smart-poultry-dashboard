// ----------------------------
// Firebase Realtime DB Status URL
// ----------------------------
const STATUS_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status.json";

// ----------------------------
// ESP32 CAM Railway Stream URL
// ----------------------------
// Your global streaming URL:
const CAMERA_STREAM_URL = "https://esp32cam-relay-production-c868.up.railway.app/stream";

// ----------------------------
// Dashboard elements
// ----------------------------
const tempEl = document.getElementById('temp');
const humEl = document.getElementById('humidity');
const waterEl = document.getElementById('waterStatus');
const feederEl = document.getElementById('feederWeight');
const containerEl = document.getElementById('containerWeight');
const motionEl = document.getElementById('motionStatus');
const logEl = document.getElementById('log');
const cameraImg = document.getElementById("cameraFeed");

// ----------------------------
// Logger
// ----------------------------
function log(msg) {
    const t = new Date().toLocaleTimeString();
    logEl.textContent = `[${t}] ${msg}\n` + logEl.textContent;
}

// ----------------------------
// Fetch & update dashboard
// ----------------------------
async function fetchAndUpdate() {
    try {
        const res = await fetch(STATUS_URL, { cache: "no-cache" });
        if (!res.ok) throw new Error("HTTP " + res.status);

        const data = await res.json();
        if (!data) return;

        tempEl.textContent = (data.temperature !== undefined) ? `${parseFloat(data.temperature).toFixed(2)} °C` : "--";
        humEl.textContent = (data.humidity !== undefined) ? `${parseFloat(data.humidity).toFixed(2)} %` : "--";
        waterEl.textContent = data.water_level !== undefined ? (data.water_level ? "OK" : "Low") : "--";
        feederEl.textContent = (data.feed_status !== undefined) ? `${parseFloat(data.feed_status).toFixed(2)}` : "--";
        containerEl.textContent = (data.feed_container_status !== undefined) ? `${parseFloat(data.feed_container_status).toFixed(2)}` : "--";
        motionEl.textContent = data.motion_detected !== undefined ? (data.motion_detected ? "Yes" : "No") : "--";

    } catch (err) {
        log("Error fetching status: " + err);
    }
}

setInterval(fetchAndUpdate, 2000);
fetchAndUpdate();

// ----------------------------
// Camera Stream (Railway MJPEG)
// ----------------------------
function startCameraStream() {
    log("Starting camera stream...");
    cameraImg.src = CAMERA_STREAM_URL;
}

// Auto-retry if stream fails
cameraImg.onerror = function () {
    log("Camera stream error — reconnecting...");
    setTimeout(() => {
        cameraImg.src = CAMERA_STREAM_URL + "?time=" + new Date().getTime();
    }, 1500);
};

startCameraStream();

// ----------------------------
// Snapshot Button
// ----------------------------
document.getElementById("snapshotBtn").onclick = function () {
    log("Taking snapshot...");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = cameraImg;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);

    const link = document.createElement("a");
    link.download = "snapshot.jpg";
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
};

// ----------------------------
// Record 30s Video
// ----------------------------
document.getElementById("recordBtn").onclick = async function () {
    log("Recording 30s clip...");

    const stream = cameraImg.captureStream();
    const recorder = new MediaRecorder(stream);
    let chunks = [];

    recorder.ondataavailable = e => chunks.push(e.data);

    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "esp32cam_recording.webm";
        link.click();
    };

    recorder.start();
    setTimeout(() => {
        recorder.stop();
        log("Recording saved!");
    }, 30000); // 30 seconds
};
