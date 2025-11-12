const logEl = document.getElementById('log');
function log(s) { 
    let t = new Date().toLocaleTimeString(); 
    logEl.textContent = t + '  ' + s + "\n" + logEl.textContent; 
}

// Firebase Realtime Database REST URL
const FIREBASE_DB_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status.json";

// Fetch temperature and motion
async function fetchStatus() {
    console.log("Fetching status...");  
    log("Fetching status from Firebase...");  

    try {
        const response = await fetch(FIREBASE_DB_URL, { cache: "no-cache" });
        console.log("HTTP response status:", response.status);  

        if (!response.ok) throw new Error("Network response was not OK");

        const data = await response.json();
        console.log("Fetched value from Firebase:", data);  

        // Update temperature
        if (data.temperature != null) {
            document.getElementById('temp').textContent = parseFloat(data.temperature).toFixed(2) + " °C";
        } else {
            document.getElementById('temp').textContent = "-- °C";
        }

        // Update motion
        if (data.motion != null) {
            document.getElementById('motion').textContent = data.motion ? "Detected" : "No Motion";
        } else {
            document.getElementById('motion').textContent = "--";
        }

        document.getElementById('last').textContent = new Date().toLocaleTimeString();
        document.getElementById('sysmsg').textContent = "OK";

    } catch (error) {
        console.error("Firebase fetch error:", error);
        log("Firebase fetch error: " + error);
        document.getElementById('sysmsg').textContent = "Error fetching data";
    }
}

// Refresh every 5 seconds
fetchStatus();
setInterval(fetchStatus, 5000);
