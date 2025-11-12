const logEl = document.getElementById('log');
function log(s) { 
    let t = new Date().toLocaleTimeString(); 
    logEl.textContent = t + '  ' + s + "\n" + logEl.textContent; 
}

// Firebase Realtime Database REST URL for temperature
const FIREBASE_DB_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status/temperature.json";

async function fetchTemperature() {
    console.log("Fetching temperature...");
    log("Fetching temperature from Firebase...");

    try {
        const response = await fetch(FIREBASE_DB_URL, { cache: "no-cache" });
        console.log("HTTP response status:", response.status);
        log("HTTP response status: " + response.status);

        if (!response.ok) throw new Error("Network response was not OK");

        const tempObj = await response.json();
        console.log("Fetched value from Firebase:", tempObj);
        log("Fetched value: " + JSON.stringify(tempObj));

        if (!tempObj || tempObj.temperature === undefined) {
            document.getElementById('temp').textContent = "-- °C";
            document.getElementById('sysmsg').textContent = "No temperature data";
            return;
        }

        document.getElementById('temp').textContent = parseFloat(tempObj.temperature).toFixed(2) + " °C";
        document.getElementById('last').textContent = new Date().toLocaleTimeString();
        document.getElementById('sysmsg').textContent = "OK";

    } catch (error) {
        console.error("Firebase fetch error:", error);
        log("Firebase fetch error: " + error);
        document.getElementById('sysmsg').textContent = "Error fetching temperature";
    }
}

// Fetch immediately, then every 5 seconds
fetchTemperature();
setInterval(fetchTemperature, 5000);
