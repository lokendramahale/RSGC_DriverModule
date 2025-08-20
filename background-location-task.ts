import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LocationObject } from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: { data?: { locations: LocationObject[] }; error?: TaskManager.TaskManagerError | null }) => {
  console.log("📍 Background location task triggered");

  if (error) {
    console.error("❌ Location error:", error);
    return;
  }

  if (!data || !data.locations || data.locations.length === 0) {
    console.warn("⚠️ No location data received");
    return;
  }

  const location = data.locations[0];
  console.log("✅ Got location:", location.coords);

  try {
    const stored = await AsyncStorage.getItem("driverData");
    if (!stored) {
      console.warn("⚠️ No driver data found in AsyncStorage");
      return;
    }

    const { driverName, phoneNumber, vehicleNumber } = JSON.parse(stored);
    console.log("🧾 Retrieved driver data:", { driverName, phoneNumber, vehicleNumber });

    const payload = {
      vehicle_id: vehicleNumber,
      driver: driverName,
      phone: phoneNumber,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      speed: location.coords.speed || 0,
      heading: location.coords.heading || 0,
      timestamp: new Date().toISOString(),
    };

    console.log("🚀 Sending payload to server:", payload);

    await axios.post("https://rsgc.onrender.com/api/map/updateLocation", payload);

    console.log("✅ Location sent successfully to backend");

  } catch (err: any) {
    console.error("❌ Failed to send location:", err.message);
  }
});
