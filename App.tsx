import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ModalProvider } from "react-native-use-modal";
import ForgotPasswordOverlay from "./screens/useAlertModal";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import SplashScreen from "./screens/SplashScreen";

const Stack = createStackNavigator();

const globalScreenOptions = {
  // headerStyle: { backgroundColor: "#2C6BED" },
  // headerTitleStyle: { color: "white" },
  // headerTintColor: "white",
  headerShown: false,
};

export default function App() {
  return (
    <ModalProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={
              Platform.OS === "android" ? "SplashScreen" : "Login"
            }
            screenOptions={globalScreenOptions}
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
