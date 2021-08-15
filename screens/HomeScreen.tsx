import { CometChat } from "@cometchat-pro/react-native-chat";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import uuid from "react-native-uuid";
import ConversationsScreen from "./ConversationsScreen";
import PeopleScreen from "./PeopleScreen";
import SettingsScreen from "./SettingsScreen";

type HomeScreenProps = {
  navigation: any;
  user: CometChat.User;
};

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation, user }: HomeScreenProps) => {
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useEffect(() => {
    getUnreadMessageCount();
    listenForMessages();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUnreadMessageCount();
    });
    return unsubscribe;
  }, [navigation]);

  const listenForMessages = () => {
    const listenerID = uuid.v4().toString();

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage: CometChat.BaseMessage) => {
          getUnreadMessageCount();
        },
        // onMediaMessageReceived: (mediaMessage: any) => {
        //   console.log("Media message received successfully", mediaMessage);
        //   // Handle media message
        // },
      })
    );
  };

  const getUnreadMessageCount = () => {
    CometChat.getUnreadMessageCountForAllUsers().then(
      (counts) => {
        console.log("Message count fetched");
        let count = 0;
        for (const [, value] of Object.entries(counts)) {
          count += value;
        }

        setUnreadMessageCount(count);
      },
      (error) => {
        console.log("Error in getting message count", error);
      }
    );
    return unreadMessageCount;
  };

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
      {unreadMessageCount ? (
        <Tab.Screen
          name="Chats"
          options={{
            tabBarBadge: unreadMessageCount,
            tabBarBadgeStyle: { backgroundColor: "#85089e" },
          }}
        >
          {(props) => <ConversationsScreen {...props} user={user} />}
        </Tab.Screen>
      ) : (
        <Tab.Screen name="Chats">
          {(props) => <ConversationsScreen {...props} user={user} />}
        </Tab.Screen>
      )}
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
