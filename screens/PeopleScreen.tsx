import { CometChat } from "@cometchat-pro/react-native-chat";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect } from "react";
import AddFriendsScreen from "./AddFriendsScreen";
import FriendsScreen from "./FriendsScreen";

const Tab = createMaterialTopTabNavigator();

type PeopleScreenProps = {
  user: CometChat.User;
};

const PeopleScreen = ({ user }: PeopleScreenProps) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Friends") {
            iconName = focused ? "people-circle" : "people-circle-outline";
          } else if (route.name === "AddFriends") {
            iconName = focused ? "person-add" : "person-add-outline";
          }

          return <Ionicons name={iconName} color={color} size={20} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#85089e",
        inactiveTintColor: "#3d3d3b",
        style: { backgroundColor: "black" },
        showIcon: true,
        labelStyle: {
          fontSize: 12,
          fontFamily: "serif",
          textTransform: "capitalize",
        },
        indicatorStyle: { backgroundColor: "#85089e" },
        tabStyle: {
          flexDirection: "row",
        },
      }}
    >
      <Tab.Screen
        name="Friends"
        options={{ tabBarLabel: "Friends" }}
        component={FriendsScreen}
      />
      <Tab.Screen name="AddFriends" options={{ tabBarLabel: "Add Friends" }}>
        {(props) => <AddFriendsScreen {...props} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default PeopleScreen;
