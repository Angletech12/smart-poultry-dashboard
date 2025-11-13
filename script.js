const STATUS_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status.json";

// Dashboard elements
const tempEl = document.getElementById('temp');
const humEl = document.getElementById('humidity');
const waterEl = document.getElementById('waterStatus');
const feederEl = document.getElementById('feederWeight');
const containerEl = document.getElementById('containerWeight');
const motionEl = document.getElementById('motionStatus');
const logEl = document.getElementById('log');

// Logging function
function log(s) {
    let t = new Date().toLocaleTimeString();
    logEl.textContent = t + '  ' + s + "\n" + logEl.textContent;
}

// Fetch and update a single element
async function fetchAndUpdate(url, el, formatter = v => v) {
    if (!el) return;
    try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error("HTTP error " + res.status);
        const data = await res.json();
        el.textContent = (data !== null && data !== undefined) ? formatter(data) : "--";
    } catch (err) {
        el.textContent = "Error";
        log(`Error fetching ${url}: ${err}`);
    }
}

// Update the entire dashboard
async function updateDashboard() {
    try {
        const res = await fetch(STATUS_URL, { cache: "no-cache" });
        if (!res.ok) throw new Error("HTTP error " + res.status);
        const data = await res.json();

        tempEl.textContent = data.temperature !== undefined ? data.temperature.toFixed(2) + " °C" : "--";
        humEl.textContent = data.humidity !== undefined ? data.humidity.toFixed(2) + " %" : "--";
        waterEl.textContent = data.water_level !== undefined ? (data.water_level ? "OK" : "Low") : "--";
        feederEl.textContent = data.feeder_weight !== undefined ? data.feeder_weight.toFixed(2) : "--";
        containerEl.textContent = data.container_weight !== undefined ? data.container_weight.toFixed(2) : "--";
        motionEl.textContent = data.motion_detected !== undefined ? (data.motion_detected ? "Yes" : "No") : "--";

    } catch (err) {
        log(`Error updating dashboard: ${err}`);
    }
}

// Initial update
updateDashboard();

// Update every 2 seconds
setInterval(updateDashboard, 2000);
