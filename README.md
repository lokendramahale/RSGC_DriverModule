# RSGC_DriverModule
🚛 RSGC Driver Tracker – Expo React Native app for real-time garbage collection tracking. Drivers register and share live GPS (foreground &amp; background). Sends data securely to backend with Axios + Socket.IO for monitoring routes &amp; last known positions. 📍

---

## ✨ Features
- 📍 **Real-time GPS Tracking** – Foreground & background location updates.  
- 👤 **Driver Registration** – Stores driver name, phone, and vehicle number locally.  
- 🔄 **Backend Integration** – Sends data securely to Express/PostgreSQL backend via Axios.  
- ⚡ **Live Updates** – Integrated with **Socket.IO** for instant vehicle path tracking.  
- 🗺 **Map Monitoring** – Vehicles displayed with routes, last known location, and movement history.  

---

## 📱 App Flow
1. Driver registers with **Name, Phone Number, Vehicle Number**.  
2. Location tracking starts automatically (with permissions).  
3. GPS coordinates are sent to the backend at defined intervals.  
4. Data is displayed on the **RSGC LiveMap dashboard** with vehicle paths.  

---

## 🛠️ Tech Stack
- **Frontend (Mobile App):** React Native (Expo), AsyncStorage, Axios, Expo Location, Expo Task Manager  
- **Backend (API & Realtime):** Node.js, Express, PostgreSQL, Socket.IO  
- **Map Display:** Leaflet (React-Leaflet)  

---

## 📥 Download APK
👉 [Download the Latest Build](<Link>)

---

## 📂 App Structure
- `RegistrationScreen.tsx` → Driver registration form  
- `TrackerScreen.tsx` → Handles live GPS tracking & debugging UI  
- `background-location-task.ts` → Defines background tracking task  
- `App.tsx` → Navigation setup
