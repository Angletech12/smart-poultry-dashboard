// ----------------------------
// Dashboard URLs
// ----------------------------
const STATUS_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status.json";

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

// ----------------------------
// Logging function
// ----------------------------
function log(msg) {
    const t = new Date().toLocaleTimeString();
    if (logEl) logEl.textContent = t + '  ' + msg + '\n' + logEl.textContent;
    console.log(msg);
}

// ----------------------------
// Fetch and update dashboard
// ----------------------------
async function fetchAndUpdate() {
    try {
        const res = await fetch(STATUS_URL, { cache: "no-cache" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        if (!data) return;

        tempEl.textContent = data.temperature !== undefined ? parseFloat(data.temperature).toFixed(2) + " °C" : "--";
        humEl.textContent = data.humidity !== undefined ? parseFloat(data.humidity).toFixed(2) + " %" : "--";
        waterEl.textContent = data.water_level !== undefined ? (data.water_level ? "OK" : "Low") : "--";
        feederEl.textContent = data.feed_status !== undefined ? parseFloat(data.feed_status).toFixed(2) : "--";
        containerEl.textContent = data.feed_container_status !== undefined ? parseFloat(data.feed_container_status).toFixed(2) : "--";
        motionEl.textContent = data.motion_detected !== undefined ? (data.motion_detected ? "Yes" : "No") : "--";

    } catch (err) {
        log("Error fetching status: " + err);
    }
    
}

// Update every 2 seconds
setInterval(fetchAndUpdate, 2000);
fetchAndUpdate();

// ----------------------------
// MJPEG Camera Stream via Canvas
// ----------------------------
const cameraImg = document.getElementById('cameraFeed');

function refreshCamera() {
    cameraImg.src = 'http://172.20.10.2/stream?time=' + new Date().getTime();
}

// Optional: refresh every 1-2 seconds to prevent caching
setInterval(refreshCamera, 2000);
