// App.js (Expo GPS tracker with background location + unique ID)
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import * as Location from "expo-location";
import Constants from "expo-constants";
import * as TaskManager from "expo-task-manager";
import axios from "axios";

const LOCATION_TASK_NAME = "background-location-task";
const API_URL = "https://your-render-app.onrender.com/api/map/updateLocation"; // Replace this with your real URL

export default function App() {
  const [status, setStatus] = useState("Initializing...");
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setStatus("Permission to access location was denied");
        return;
      }

      const bgStatus = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus.status !== "granted") {
        setStatus("Permission to access background location was denied");
        return;
      }

      const id = Constants.installationId || Constants.deviceId || Math.random().toString(36);
      setDeviceId(id);

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // every 10 seconds
        distanceInterval: 10, // or every 10 meters
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "RSGC GPS Tracker",
          notificationBody: "Tracking location in background",
        },
      });

      setStatus("Tracking started.");
    };

    startTracking();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RSGC GPS Tracker</Text>
      <Text>Status: {status}</Text>
      <Text>Device ID: {deviceId}</Text>
      {status.includes("Tracking") ? null : <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
    </View>
  );
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("TaskManager Error:", error);
    return;
  }

  if (data) {
    const { locations } = data;
    const loc = locations[0];

    const payload = {
      vehicle_id: Constants.installationId || Constants.deviceId,
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      speed: loc.coords.speed || 0,
      heading: loc.coords.heading || 0,
      timestamp: new Date().toISOString(),
    };

    try {
      console.log("Sending location:", payload);
      await axios.post(API_URL, payload);
    } catch (err) {
      console.error("Failed to send location:", err.message);
    }
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
