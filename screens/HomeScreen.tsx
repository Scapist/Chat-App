import { CometChat } from "@cometchat-pro/react-native-chat";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import ChatsScreen from "./ChatsScreen";
import PeopleScreen from "./PeopleScreen";
import SettingsScreen from "./SettingsScreen";

type HomeScreenProps = {
  navigation: any;
  user: CometChat.User;
};

const Tab = createBottomTabNavigator();

const HomeScreen = ({ user }: HomeScreenProps) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Chats") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "People") {
            iconName = focused ? "people" : "people-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#85089e",
        inactiveTintColor: "#3d3d3b",
        style: { backgroundColor: "black" },
        labelStyle: { fontFamily: "serif" },
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        // options={{ tabBarBadge: 3 }}
      />
      <Tab.Screen name="People">
        {(props) => <PeopleScreen {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {(props) => <SettingsScreen {...props} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default HomeScreen;
