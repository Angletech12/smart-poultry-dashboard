// ----------------------------
// Firebase Realtime DB Status URL
// ----------------------------
const STATUS_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status.json";

// ----------------------------
// Firebase Camera Proxy Stream
// ----------------------------
// Replace this with your deployed Firebase function URL:
const CAMERA_STREAM_URL = "https://us-central1-smart-poultry-system.cloudfunctions.net/cameraStream";

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
    logEl.textContent = ${t}  ${msg}\n + logEl.textContent;
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

        tempEl.textContent = data.temperature !== undefined ? ${parseFloat(data.temperature).toFixed(2)} °C : "--";
        humEl.textContent = data.humidity !== undefined ? ${parseFloat(data.humidity).toFixed(2)} % : "--";
        waterEl.textContent = data.water_level !== undefined ? (data.water_level ? "OK" : "Low") : "--";
        feederEl.textContent = data.feed_status !== undefined ? parseFloat(data.feed_status).toFixed(2) : "--";
        containerEl.textContent = data.feed_container_status !== undefined ? parseFloat(data.feed_container_status).toFixed(2) : "--";
        motionEl.textContent = data.motion_detected !== undefined ? (data.motion_detected ? "Yes" : "No") : "--";

    } catch (err) {
        log("Error fetching status: " + err);
    }
}

setInterval(fetchAndUpdate, 2000);
fetchAndUpdate();

// ----------------------------
// Camera Stream (via Firebase)
// ----------------------------
function startCameraStream() {
    cameraImg.src = CAMERA_STREAM_URL;
}

startCameraStream();
