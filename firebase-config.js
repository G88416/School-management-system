// Firebase Configuration and Database Export
// This file exports the Firestore database instance for use across the application

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase configuration (matches the config in index.html)
const firebaseConfig = {
  apiKey: "AIzaSyD9YxZP4ErbIoYcvJWn3OwtsjNvMBKq1-s",
  authDomain: "g-19systems.firebaseapp.com",
  databaseURL: "https://g-19systems-default-rtdb.firebaseio.com",
  projectId: "g-19systems",
  storageBucket: "g-19systems.firebasestorage.app",
  messagingSenderId: "561001502208",
  appId: "1:561001502208:web:4954f39536d428db762ae5",
  measurementId: "G-2GBP0QMP2N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
