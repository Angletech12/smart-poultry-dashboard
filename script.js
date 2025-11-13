const logEl = document.getElementById('log');
function log(s) { 
  const t = new Date().toLocaleTimeString(); 
  logEl.textContent = `${t}  ${s}\n` + logEl.textContent; 
}

// Firebase REST URL (unified)
const STATUS_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status.json";

// Dashboard elements
const tempEl = document.getElementById('temp');
const humEl = document.getElementById('humidity');
const waterEl = document.getElementById('waterStatus');
const feederEl = document.getElementById('feederWeight');
const containerEl = document.getElementById('containerWeight');
const motionEl = document.getElementById('motionStatus');

// Fetch everything from Firebase
async function updateDashboard() {
  try {
    const res = await fetch(STATUS_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    if (!data) return;

    if ('temperature' in data) 
      tempEl.textContent = `${parseFloat(data.temperature).toFixed(2)} °C`;
    if ('humidity' in data) 
      humEl.textContent = `${parseFloat(data.humidity).toFixed(2)} %`;
    if ('water' in data) 
      waterEl.textContent = data.water ? "OK" : "Low";
    if ('feederWeight' in data) 
      feederEl.textContent = `${parseFloat(data.feederWeight).toFixed(2)} g`;
    if ('containerWeight' in data) 
      containerEl.textContent = `${parseFloat(data.containerWeight).toFixed(2)} g`;
    if ('motion' in data) 
      motionEl.textContent = data.motion ? "Yes" : "No";

  } catch (err) {
    log(`Error updating dashboard: ${err.message}`);
  }
}

// Camera buttons (placeholders)
const snapshotBtn = document.getElementById('snapshotBtn');
const recordBtn = document.getElementById('recordBtn');

if (snapshotBtn)
  snapshotBtn.addEventListener('click', () => {
    log("Snapshot button clicked");
    // TODO: trigger ESP32-CAM snapshot endpoint
  });

if (recordBtn)
  recordBtn.addEventListener('click', () => {
    log("Record 30s clip button clicked");
    // TODO: trigger ESP32-CAM recording endpoint
  });

// Start updating every 5 seconds
updateDashboard();
setInterval(updateDashboard, 5000);
