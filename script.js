const logEl = document.getElementById('log');
function log(s) { 
    let t = new Date().toLocaleTimeString(); 
    logEl.textContent = t + '  ' + s + "\n" + logEl.textContent; 
}

const STATUS_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status.json";

// Dashboard elements
const tempEl = document.getElementById('temp');
const humEl = document.getElementById('humidity');
const waterEl = document.getElementById('waterStatus');
const feederEl = document.getElementById('feederWeight');
const containerEl = document.getElementById('containerWeight');
const motionEl = document.getElementById('motionStatus');

// Fetch all status in one go
async function updateDashboard() {
    try {
        const res = await fetch(STATUS_URL, { cache: "no-cache" });
        if (!res.ok) throw new Error("HTTP error " + res.status);
        const data = await res.json();

        tempEl.textContent = data.temperature !== undefined ? parseFloat(data.temperature).toFixed(2) + " °C" : "--";
        humEl.textContent = data.humidity !== undefined ? parseFloat(data.humidity).toFixed(2) + " %" : "--";
        waterEl.textContent = data.water_level !== undefined ? (data.water_level ? "OK" : "Low") : "--";
        feederEl.textContent = data.feed_status !== undefined ? parseFloat(data.feed_status).toFixed(2) : "--";
        containerEl.textContent = data.feed_container_status !== undefined ? parseFloat(data.feed_container_status).toFixed(2) : "--";
        motionEl.textContent = data.motion_detected !== undefined ? (data.motion_detected ? "Yes" : "No") : "No";
    } catch (err) {
        log("Error fetching dashboard data: " + err);
    }
}

// Camera buttons (for future)
const snapshotBtn = document.getElementById('snapshotBtn');
const recordBtn = document.getElementById('recordBtn');

if (snapshotBtn) snapshotBtn.addEventListener('click', () => {
    log("Snapshot button clicked");
    // TODO: trigger ESP32-CAM snapshot endpoint
});

if (recordBtn) recordBtn.addEventListener('click', () => {
    log("Record 30s clip button clicked");
    // TODO: trigger ESP32-CAM recording endpoint
});

// Update every 2 seconds
updateDashboard();
setInterval(updateDashboard, 2000);
