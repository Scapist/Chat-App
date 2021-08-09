import { CometChat } from "@cometchat-pro/react-native-chat";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ModalProvider } from "react-native-use-modal";
import { COMETCHAT_CONSTANTS } from "./constants";
import { auth } from "./firebase";
import ChatScreen from "./screens/ChatScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import SplashScreen from "./screens/SplashScreen";

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "black" },
  // headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  headerShown: false,
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState("");
  const [user, setUser] = useState<CometChat.User>();

  const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(COMETCHAT_CONSTANTS.APP_REGION)
    .build();

  useEffect(() => {
    CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting).then(
      () => {
        console.log("Initialization completed successfully");
        // You can now call login function.
      },
      (error) => {
        console.log("Initialization failed with error:", error);
        // Check the reason for error and take appropriate action.
      }
    );

    const getPermissions = async () => {
      if (Platform.OS === "android") {
        let granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          // PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            // PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ]);
        }
      }
    };

    getPermissions();
  }, []);

  useEffect(() => {
    setInitialRoute(auth.currentUser ? "Home" : "Login");
  }, [auth.currentUser]);

  useEffect(() => {
    CometChat.getLoggedinUser().then(
      (loggedInUser) => {
        if (loggedInUser && user !== loggedInUser) {
          setUser(loggedInUser);
        }
      },
      (error) => {
        console.log("error getting details:", { error });
      }
    );
  }, []);

  const setLoggedUser = (loggedUser: CometChat.User) => {
    setUser(loggedUser);
  };

  return (
    <ModalProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={
              Platform.OS === "web" ? initialRoute : "SplashScreen"
            }
            screenOptions={globalScreenOptions}
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen {...props} setLoggedUser={setLoggedUser} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {(props) => (
                <RegisterScreen {...props} setUserCallback={setLoggedUser} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
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
