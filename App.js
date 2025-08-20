// App.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, View, Text } from "react-native";
import RegistrationScreen from "./screens/RegistrationScreen";
import TrackerScreen from "./screens/TrackerScreen";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import "./background-location-task";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    console.log("🚀 App loaded");
    console.log("📦 Background task imported:", TaskManager.isAvailableAsync());

    // Ignore irrelevant warnings
    LogBox.ignoreLogs([
      "Warning: ...",
      "Non-serializable values were found in the navigation state",
    ]);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="Tracker" component={TrackerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
