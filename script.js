// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Your Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyD9XrqScA2ChFSJRny8BfoRnAH4oqIKne4",
  authDomain: "smart-poultry-system-df992.firebaseapp.com",
  databaseURL: "https://smart-poultry-system-df992-default-rtdb.firebaseio.com",
  projectId: "smart-poultry-system-df992",
  storageBucket: "smart-poultry-system-df992.firebasestorage.app",
  messagingSenderId: "808441444758",
  appId: "1:808441444758:web:a2a75bdf39ad11ccb805b7",
  measurementId: "G-ZLN4YBTSW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Reference to your temperature data in Firebase
const tempRef = ref(db, "status/temperature");

// Listen for changes in real-time
onValue(tempRef, (snapshot) => {
  const temp = snapshot.val();
  if (temp !== null) {
    document.getElementById("temp").textContent = temp.toFixed(1) + " °C";
  } else {
    document.getElementById("temp").textContent = "-- °C";
  }
});
