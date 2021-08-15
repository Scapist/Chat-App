import { CometChat } from "@cometchat-pro/react-native-chat";
import messaging from "@react-native-firebase/messaging";
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
import { auth, firestore } from "./firebase";
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

  const saveTokenToDatabase = async (token: string) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;

      // Add the token to the users datastore
      await firestore()
        .collection("users")
        .doc(userId)
        .update({
          tokens: firestore.FieldValue.arrayUnion(token),
        });
    }
  };

  useEffect(() => {
    const initializeCometChat = async () => {
      try {
        // First initialize the app
        await CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting);

        // Login the user
        if (auth.currentUser) {
          // console.log("app login", auth.currentUser?.uid);
          // await CometChat.login(
          //   auth.currentUser?.uid,
          //   COMETCHAT_CONSTANTS.AUTH_KEY
          // );

          // Get the FCM device token
          const FCM_TOKEN = "";
          await messaging()
            .getToken()
            .then((token) => {
              console.log("save token");
              return saveTokenToDatabase(token);
            })
            .catch((err) => {
              console.log("error", err);
            });

          saveTokenToDatabase(FCM_TOKEN);

          // Register the token with Enhanced Push Notifications extension
          await CometChat.registerTokenForPushNotification(FCM_TOKEN);

          return messaging().onTokenRefresh((token) => {
            saveTokenToDatabase(token);
          });
        }
      } catch (error) {
        // Handle errors gracefully
        console.log("error", error);
      }
    };

    initializeCometChat();
  }, []);

  useEffect(() => {
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
