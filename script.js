const logEl = document.getElementById('log');
function log(msg) {
    let t = new Date().toLocaleTimeString();
    logEl.textContent = `${t}  ${msg}\n` + logEl.textContent;
}

// Firebase Realtime Database REST URLs
const FIREBASE_DB_BASE = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/main";
const URLS = {
    temp: `${FIREBASE_DB_BASE}/temperature.json`,
    humidity: `${FIREBASE_DB_BASE}/humidity.json`,
    water: `${FIREBASE_DB_BASE}/water_level.json`,
    feed: `${FIREBASE_DB_BASE}/feed_status.json`,
    motion: `${FIREBASE_DB_BASE}/motion_detected.json`
};

// Fetch sensor data
async function fetchData() {
    for (const [key, url] of Object.entries(URLS)) {
        try {
            const res = await fetch(url, {cache: "no-cache"});
            const data = await res.json();
            document.getElementById(key).textContent = data !== null ? data : "--";
            log(`Updated ${key}: ${data}`);
        } catch (err) {
            console.error(`Error fetching ${key}:`, err);
            log(`Error fetching ${key}: ${err}`);
        }
    }
}

// Update every 5 seconds
fetchData();
setInterval(fetchData, 5000);

// Camera stream setup
const camStream = document.getElementById('camStream');
camStream.src = 'http://<ESP32_CAM_IP>/stream'; // replace with your ESP32-CAM IP stream

// Snap photo button
document.getElementById('snapPhoto').addEventListener('click', async () => {
    try {
        await fetch('http://<ESP32_CAM_IP>/capture'); // replace with your ESP32-CAM capture endpoint
        log("Photo taken and sent!");
    } catch (err) {
        console.error("Photo capture error:", err);
        log("Photo capture error: " + err);
    }
});
