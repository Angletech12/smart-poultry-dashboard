<script>
const logEl = document.getElementById('log');
function log(s) { 
    let t = new Date().toLocaleTimeString(); 
    logEl.textContent = t + '  ' + s + "\n" + logEl.textContent; 
}

// Firebase Realtime Database REST URL for temperature
const FIREBASE_DB_URL = "https://smart-poultry-system-df992-default-rtdb.firebaseio.com/status/temperature.json";

// Function to fetch temperature
async function fetchTemperature() {
    try {
        const response = await fetch(FIREBASE_DB_URL);
        if (!response.ok) throw new Error("Network response was not OK");

        const temp = await response.json();
        document.getElementById('temp').textContent = parseFloat(temp).toFixed(2) + " °C";
        document.getElementById('last').textContent = new Date().toLocaleTimeString();
        document.getElementById('sysmsg').textContent = "OK";
    } catch (error) {
        console.error("Firebase fetch error:", error);
        document.getElementById('sysmsg').textContent = "Error fetching temperature";
    }
}

// Refresh temperature every 5 seconds
fetchTemperature();
setInterval(fetchTemperature, 5000);
</script>
