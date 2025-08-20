import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const LOCATION_TASK_NAME = "background-location-task";

export default function TrackerScreen() {
  const [statusMsg, setStatusMsg] = useState("Initializing...");
  const [locationInfo, setLocationInfo] = useState<string>("--");
  const [foregroundSendStatus, setForegroundSendStatus] = useState<string>("Waiting...");

  useEffect(() => {
    (async () => {
      try {
        setStatusMsg("🔐 Requesting location permissions...");
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setStatusMsg("❌ Permission not granted");
          return;
        }

        setStatusMsg("✅ Permission granted. Starting background updates...");

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // every 10 seconds
          distanceInterval: 10, // every 10 meters
          showsBackgroundLocationIndicator: true,
          pausesUpdatesAutomatically: false,
        });

        setStatusMsg("📡 Background location tracking started");

        const isRunning = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
        console.log("📌 Background Task Registered:", isRunning);
      } catch (err: any) {
        console.error("TrackerScreen Error:", err);
        setStatusMsg("❌ Error: " + err.message);
      }
    })();
  }, []);

  useEffect(() => {
    const subscribeToLocation = async () => {
      const sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
        async (loc) => {
          console.log("📍 Foreground location:", loc.coords);
          setLocationInfo(
            `Lat: ${loc.coords.latitude.toFixed(5)}, Lng: ${loc.coords.longitude.toFixed(5)}, Speed: ${loc.coords.speed?.toFixed(2)}`
          );

          try {
            const stored = await AsyncStorage.getItem("driverData");
            if (stored) {
              const { driverName, phoneNumber, vehicleNumber } = JSON.parse(stored);
              const payload = {
                vehicle_id: vehicleNumber,
                driver: driverName,
                phone: phoneNumber,
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                speed: loc.coords.speed || 0,
                heading: loc.coords.heading || 0,
                timestamp: new Date().toISOString(),
              };

              console.log("🚀 Sending foreground payload:", payload);
              await axios.post("https://rsgc.onrender.com/api/map/updateLocation", payload);
              setForegroundSendStatus("✅ Foreground location sent successfully");
            } else {
              console.warn("⚠️ No driver data found during foreground update");
              setForegroundSendStatus("⚠️ No driver data");
            }
          } catch (err: any) {
            console.error("❌ Foreground location failed to send:", err.message);
            setForegroundSendStatus("❌ Failed to send: " + err.message);
          }
        }
      );
      return () => sub.remove();
    };
    subscribeToLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🚛 RSGC Driver Tracker</Text>
      <Text style={styles.label}>Status:</Text>
      <Text style={styles.info}>{statusMsg}</Text>
      <Text style={styles.label}>Last Known Coordinates:</Text>
      <Text style={styles.coords}>{locationInfo}</Text>
      <Text style={styles.label}>Foreground Update Status:</Text>
      <Text style={styles.info}>{foregroundSendStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  label: { fontWeight: "bold", marginTop: 20 },
  info: { fontSize: 16, color: "blue", textAlign: "center" },
  coords: { fontSize: 16, marginTop: 5 },
});
