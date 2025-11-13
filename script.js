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
const canvas = document.getElementById('cameraCanvas');
const ctx = canvas.getContext('2d');
const CAMERA_URL = 'http://172.20.10.2/stream'; // ESP32-CAM MJPEG stream

let img = new Image();

fetch(CAMERA_URL)
    .then(response => {
        const reader = response.body.getReader();
        let buffer = new Uint8Array();
        let boundary = null;

        function readStream() {
            reader.read().then(({ done, value }) => {
                if (done) return;
                let tmp = new Uint8Array(buffer.length + value.length);
                tmp.set(buffer, 0);
                tmp.set(value, buffer.length);
                buffer = tmp;

                let str = new TextDecoder("utf-8").decode(buffer);

                if (!boundary) {
                    const match = str.match(/--([^\r\n]+)/);
                    if (match) boundary = match[1];
                }

                if (boundary) {
                    const parts = str.split('--' + boundary);
                    for (let i = 0; i < parts.length - 1; i++) {
                        const part = parts[i];
                        const start = part.indexOf('\r\n\r\n');
                        if (start !== -1) {
                            const jpgStr = part.slice(start + 4);
                            const bytes = new Uint8Array(jpgStr.length);
                            for (let j = 0; j < jpgStr.length; j++) bytes[j] = jpgStr.charCodeAt(j);
                            const blob = new Blob([bytes], { type: 'image/jpeg' });
                            const url = URL.createObjectURL(blob);
                            img.src = url;
                            img.onload = () => {
                                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                URL.revokeObjectURL(url);
                            }
                        }
                    }
                    // Keep remaining buffer for next read
                    const remaining = parts[parts.length - 1];
                    buffer = new Uint8Array(remaining.length);
                    for (let j = 0; j < buffer.length; j++) buffer[j] = remaining.charCodeAt(j);
                }

                readStream();
            });
        }

        readStream();
    })
    .catch(err => log("MJPEG fetch error: " + err));
