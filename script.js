const logEl = document.getElementById('log');
function log(s) { 
    let t = new Date().toLocaleTimeString(); 
    logEl.textContent = t + '  ' + s + "\n" + logEl.textContent; 
}

// Firebase Realtime Database REST URL for ESP32 data
const FIREBASE_DB_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/main.json";

// Elements
const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const waterEl = document.getElementById('waterStatus');
const feederEl = document.getElementById('feederWeight');
const containerEl = document.getElementById('containerWeight');
const motionEl = document.getElementById('motionStatus');

const snapshotBtn = document.getElementById('snapshotBtn');
const videoBtn = document.getElementById('videoBtn');

// Fetch data from Firebase
async function fetchData() {
    try {
        const res = await fetch(FIREBASE_DB_URL + '?cacheBuster=' + new Date().getTime());
        if (!res.ok) throw new Error("Network response not ok");
        const data = await res.json();

        tempEl.textContent = data.temperature?.toFixed(2) + " °C" || "-- °C";
        humidityEl.textContent = data.humidity?.toFixed(2) + " %" || "-- %";
        waterEl.textContent = data.water_level ? "OK" : "Low";
        feederEl.textContent = data.feed_status?.toFixed(2) || "--";
        containerEl.textContent = data.feed_container_status?.toFixed(2) || "--";
        motionEl.textContent = data.motion_detected ? "Yes" : "No";

    } catch (err) {
        log("Fetch error: " + err);
    }
}

// Refresh every 5 seconds
fetchData();
setInterval(fetchData, 5000);

// Button actions
snapshotBtn.addEventListener('click', async () => {
    await sendCommand({ snapshot: true });
    log("Snapshot command sent");
});

videoBtn.addEventListener('click', async () => {
    await sendCommand({ recordVideo: 30 }); // 30 seconds
    log("30s video command sent");
});

// Send command to Firebase
async function sendCommand(cmd) {
    try {
        const res = await fetch("https://smart-poultry-system-df992-default-rtdb.firebaseio.com/camCommands.json", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cmd)
        });
        if (!res.ok) throw new Error("Failed to send command");
    } catch (err) {
        log("Command error: " + err);
    }
}
