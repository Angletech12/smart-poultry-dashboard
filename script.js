const logEl = document.getElementById('log');
function log(s) { 
    let t = new Date().toLocaleTimeString(); 
    logEl.textContent = t + '  ' + s + "\n" + logEl.textContent; 
}

// Firebase REST URLs
const TEMP_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status/temperature.json";
const HUM_URL  = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status/humidity.json";
const WATER_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status/water.json";
const FEED_URL  = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status/feed.json";
const MOTION_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status/motion.json";

// Elements
const tempEl = document.getElementById('temp');
const humEl = document.getElementById('humidity');
const waterEl = document.getElementById('waterStatus');
const feederEl = document.getElementById('feederWeight');
const containerEl = document.getElementById('containerWeight');
const motionEl = document.getElementById('motionStatus');

async function fetchAndUpdate(url, el, formatter = v => v) {
    if (!el) return; // skip if element is missing
    try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error("HTTP error " + res.status);
        const data = await res.json();
        el.textContent = (data !== null) ? formatter(data) : "--";
    } catch (err) {
        el.textContent = "Error";
        log(`Error fetching ${url}: ${err}`);
    }
}

function updateDashboard() {
    fetchAndUpdate(TEMP_URL, tempEl, v => parseFloat(v).toFixed(2) + " °C");
    fetchAndUpdate(HUM_URL, humEl, v => parseFloat(v).toFixed(2) + " %");
    fetchAndUpdate(WATER_URL, waterEl, v => v ? "OK" : "Low");
    fetchAndUpdate(FEED_URL, feederEl, v => parseFloat(v).toFixed(2));
    fetchAndUpdate(FEED_URL, containerEl, v => parseFloat(v).toFixed(2));
    fetchAndUpdate(MOTION_URL, motionEl, v => v ? "Yes" : "No");
}

// Camera buttons
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

updateDashboard();
setInterval(updateDashboard, 5000);
