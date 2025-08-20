import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegistrationScreen({ navigation }) {
  const [driverName, setDriverName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [debugMsg, setDebugMsg] = useState("");

  const handleRegister = async () => {
    console.log("📥 Input received:", { driverName, phoneNumber, vehicleNumber });

    if (!driverName || !phoneNumber || !vehicleNumber) {
      const msg = "❌ All fields are required!";
      console.warn(msg);
      setDebugMsg(msg);
      Alert.alert("Validation Error", msg);
      return;
    }

    try {
      const data = { driverName, phoneNumber, vehicleNumber };
      await AsyncStorage.setItem("driverData", JSON.stringify(data));
      console.log("✅ Driver data stored:", data);
      setDebugMsg("✅ Registered and data stored successfully!");
      navigation.replace("Tracker");
    } catch (error) {
      console.error("❌ Failed to store driver data:", error);
      setDebugMsg("❌ Error storing data. See logs.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Driver Name</Text>
      <TextInput style={styles.input} value={driverName} onChangeText={setDriverName} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />

      <Text style={styles.label}>Vehicle Number</Text>
      <TextInput style={styles.input} value={vehicleNumber} onChangeText={setVehicleNumber} />

      <Button title="Start Tracking" onPress={handleRegister} />

      {debugMsg !== "" && (
        <Text style={styles.debugText}>{debugMsg}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  label: { fontWeight: "bold", marginTop: 10 },
  input: {
    borderColor: "#ccc", borderWidth: 1, borderRadius: 5, padding: 10, marginTop: 5,
  },
  debugText: {
    marginTop: 20,
    fontSize: 14,
    color: "blue",
    textAlign: "center",
  },
});
